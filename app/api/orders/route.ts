import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

interface OrderItemInput {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
}

interface CreateOrderRequest {
  items: OrderItemInput[];
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district?: string;
  shipping_postal_code?: string;
  shipping_phone: string;
  customer_note?: string;
}

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_COST = 499;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 5 order attempts per minute per IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { limited, retryAfterMs } = rateLimit(`orders:${clientIp}`, 5, 60_000);

    if (limited) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
        }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
    }

    let body: CreateOrderRequest;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
    }

    const {
      items,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_district,
      shipping_postal_code,
      shipping_phone,
      customer_note,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Sepet boş.' }, { status: 400 });
    }

    if (!shipping_name?.trim() || !shipping_address?.trim() || !shipping_city?.trim() || !shipping_phone?.trim()) {
      return NextResponse.json({ error: 'Teslimat bilgileri eksik.' }, { status: 400 });
    }

    for (const item of items) {
      if (!item.product_id || typeof item.quantity !== 'number' || item.quantity < 1 || !Number.isInteger(item.quantity)) {
        return NextResponse.json({ error: 'Geçersiz sepet verisi.' }, { status: 400 });
      }
    }

    // Fetch authoritative prices from the database — client-supplied prices are ignored
    const productIds = Array.from(new Set(items.map(i => i.product_id)));
    const variantIds = items.map(i => i.variant_id).filter((id): id is string => !!id);

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, base_price, discount_price, is_active, images')
      .in('id', productIds);

    if (prodError || !products) {
      return NextResponse.json({ error: 'Ürünler yüklenemedi.' }, { status: 500 });
    }

    const productMap = new Map(products.map(p => [p.id, p]));

    const variantMap = new Map<string, { price_modifier: number; name: string; is_active: boolean }>();
    if (variantIds.length > 0) {
      const { data: variants, error: varError } = await supabase
        .from('product_variants')
        .select('id, price_modifier, name, is_active')
        .in('id', variantIds);

      if (varError || !variants) {
        return NextResponse.json({ error: 'Varyantlar yüklenemedi.' }, { status: 500 });
      }
      variants.forEach(v => variantMap.set(v.id, v));
    }

    // Compute authoritative line-item prices
    const orderItems: {
      product_id: string;
      variant_id: string | null;
      product_name: string;
      variant_name: string | null;
      quantity: number;
      unit_price: number;
      total_price: number;
      image_url: string | null;
    }[] = [];

    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return NextResponse.json({ error: 'Bir veya daha fazla ürün bulunamadı.' }, { status: 400 });
      }
      if (!product.is_active) {
        return NextResponse.json({ error: `"${product.name}" artık satışta değil.` }, { status: 400 });
      }

      const basePrice = Number(product.discount_price ?? product.base_price);
      let priceModifier = 0;
      let variantName: string | null = null;

      if (item.variant_id) {
        const variant = variantMap.get(item.variant_id);
        if (!variant) {
          return NextResponse.json({ error: 'Seçilen varyant bulunamadı.' }, { status: 400 });
        }
        if (!variant.is_active) {
          return NextResponse.json({ error: 'Seçilen varyant artık mevcut değil.' }, { status: 400 });
        }
        priceModifier = Number(variant.price_modifier);
        variantName = variant.name;
      }

      const unitPrice = basePrice + priceModifier;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: product.name,
        variant_name: variantName,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: itemTotal,
        image_url: Array.isArray(product.images) ? (product.images[0] ?? null) : null,
      });
    }

    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalPrice = subtotal + shippingCost;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        total_price: totalPrice,
        discount_amount: 0,
        shipping_name: shipping_name.trim(),
        shipping_address: shipping_address.trim(),
        shipping_city: shipping_city.trim(),
        shipping_district: shipping_district?.trim() || null,
        shipping_postal_code: shipping_postal_code?.trim() || null,
        shipping_phone: shipping_phone.trim(),
        customer_note: customer_note?.trim() || null,
        payment_status: 'awaiting',
      })
      .select('id')
      .single();

    if (orderError || !order) {
      console.error('[POST /api/orders] Order insert failed:', orderError);
      return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
    }

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems.map(oi => ({ ...oi, order_id: order.id })));

    if (itemsError) {
      console.error('[POST /api/orders] Order items insert failed:', itemsError);
      return NextResponse.json({ error: 'Sipariş kalemleri kaydedilemedi.' }, { status: 500 });
    }

    return NextResponse.json({ order_id: order.id }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders] Unexpected error:', err);
    return NextResponse.json({ error: 'Beklenmeyen bir hata oluştu.' }, { status: 500 });
  }
}
