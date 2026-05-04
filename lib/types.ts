// Database types for FINAL MOBİLYA

export type UserRole = 'admin' | 'customer';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'awaiting' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  base_price: number;
  discount_price: number | null;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  stock_quantity: number;
  sku: string | null;
  images: string[];
  tags: string[];
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  variants?: ProductVariant[];
  reviews?: Review[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price_modifier: number;
  stock_quantity: number;
  color: string | null;
  size: string | null;
  material: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_price: number;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  currency: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string | null;
  shipping_postal_code: string | null;
  shipping_phone: string;
  payment_method: string | null;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  payment_data: Record<string, any>;
  customer_note: string | null;
  admin_note: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  profile?: Profile;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
  created_at: string;
  // Relations
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  profile?: Profile;
}

// Cart types (client-side)
export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

// Checkout form
export interface CheckoutFormData {
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string;
  shipping_postal_code: string;
  shipping_phone: string;
  customer_note: string;
}

// Admin stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  recentOrders: Order[];
}
