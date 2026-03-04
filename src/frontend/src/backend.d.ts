// Auto-generated type declarations for the Restaurant Manager backend canister.
// Derived from src/backend/backend.did

export type MenuItem = {
  id: bigint;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

export type OrderItem = {
  menuItemId: bigint;
  quantity: bigint;
};

export type Order = {
  id: bigint;
  tableNumber: bigint;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: bigint;
};

export type Reservation = {
  id: bigint;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  numberOfGuests: bigint;
  createdAt: bigint;
};

export type AdminStats = {
  totalOrders: bigint;
  totalRevenue: number;
  pendingOrders: bigint;
  totalReservations: bigint;
  totalMenuItems: bigint;
};

export interface backendInterface {
  getMenuItems: () => Promise<MenuItem[]>;
  getMenuItemById: (id: bigint) => Promise<[] | [MenuItem]>;
  addMenuItem: (
    name: string,
    category: string,
    price: number,
    available: boolean
  ) => Promise<MenuItem>;
  updateMenuItem: (
    id: bigint,
    name: string,
    category: string,
    price: number,
    available: boolean
  ) => Promise<[] | [MenuItem]>;
  deleteMenuItem: (id: bigint) => Promise<boolean>;

  getOrders: () => Promise<Order[]>;
  createOrder: (
    tableNumber: bigint,
    items: OrderItem[],
    totalPrice: number
  ) => Promise<Order>;
  updateOrderStatus: (id: bigint, status: string) => Promise<[] | [Order]>;
  deleteOrder: (id: bigint) => Promise<boolean>;

  getReservations: () => Promise<Reservation[]>;
  createReservation: (
    customerName: string,
    phone: string,
    date: string,
    time: string,
    numberOfGuests: bigint
  ) => Promise<Reservation>;
  deleteReservation: (id: bigint) => Promise<boolean>;

  getAdminStats: () => Promise<AdminStats>;
}
