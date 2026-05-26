import type { PersonSelection } from "@/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Bekliyor",
  confirmed: "Onaylandı",
  preparing: "Hazırlanıyor",
  ready: "Hazır",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

// Durum rozetleri için Tailwind sınıfları (pembe/altın temayla uyumlu)
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-altin/15 text-altin-koyu",
  confirmed: "bg-pembe/15 text-pembe-koyu",
  preparing: "bg-blue-100 text-blue-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

// pending → confirmed → preparing → ready → delivered akışında bir sonraki durum
export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "delivered",
};

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string | null;
  image_path: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total: number;
  notes: string | null;
  whatsapp_sent: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  customizations: PersonSelection[];
}
