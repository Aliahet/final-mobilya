import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { limited, retryAfterMs } = rateLimit(`bayilik:${ip}`, 3, 60_000);

  if (limited) {
    return NextResponse.json(
      { error: 'Çok fazla istek. Lütfen bir dakika bekleyin.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  let body: {
    full_name?: string;
    company_name?: string;
    city?: string;
    phone?: string;
    email?: string;
    message?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const { full_name, company_name, city, phone, email, message } = body;

  if (!full_name?.trim() || !company_name?.trim() || !city?.trim() || !phone?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Tüm zorunlu alanları doldurun.' }, { status: 400 });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.trim())) {
    return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from('dealer_applications').insert({
    full_name: full_name.trim(),
    company_name: company_name.trim(),
    city: city.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    message: message?.trim() || null,
  });

  if (error) {
    console.error('[POST /api/bayilik]', error);
    return NextResponse.json({ error: 'Başvuru kaydedilemedi. Lütfen tekrar deneyin.' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
