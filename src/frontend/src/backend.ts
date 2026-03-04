// Generated backend bindings for the Restaurant Manager canister.
// Based on src/backend/backend.did

import { Actor, type ActorConfig, type ActorSubclass } from "@dfinity/agent";
import { IDL } from "@icp-sdk/core/candid";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── IDL Factory ───────────────────────────────────────────────────────────────

export const idlFactory: IDL.InterfaceFactory = ({ IDL: I }) => {
  const MenuItemType = I.Record({
    id: I.Nat,
    name: I.Text,
    category: I.Text,
    price: I.Float64,
    available: I.Bool,
  });

  const OrderItemType = I.Record({
    menuItemId: I.Nat,
    quantity: I.Nat,
  });

  const OrderType = I.Record({
    id: I.Nat,
    tableNumber: I.Nat,
    items: I.Vec(OrderItemType),
    totalPrice: I.Float64,
    status: I.Text,
    createdAt: I.Int,
  });

  const ReservationType = I.Record({
    id: I.Nat,
    customerName: I.Text,
    phone: I.Text,
    date: I.Text,
    time: I.Text,
    numberOfGuests: I.Nat,
    createdAt: I.Int,
  });

  const AdminStatsType = I.Record({
    totalOrders: I.Nat,
    totalRevenue: I.Float64,
    pendingOrders: I.Nat,
    totalReservations: I.Nat,
    totalMenuItems: I.Nat,
  });

  return I.Service({
    getMenuItems: I.Func([], [I.Vec(MenuItemType)], ["query"]),
    getMenuItemById: I.Func([I.Nat], [I.Opt(MenuItemType)], ["query"]),
    addMenuItem: I.Func([I.Text, I.Text, I.Float64, I.Bool], [MenuItemType], []),
    updateMenuItem: I.Func(
      [I.Nat, I.Text, I.Text, I.Float64, I.Bool],
      [I.Opt(MenuItemType)],
      []
    ),
    deleteMenuItem: I.Func([I.Nat], [I.Bool], []),

    getOrders: I.Func([], [I.Vec(OrderType)], ["query"]),
    createOrder: I.Func(
      [I.Nat, I.Vec(OrderItemType), I.Float64],
      [OrderType],
      []
    ),
    updateOrderStatus: I.Func([I.Nat, I.Text], [I.Opt(OrderType)], []),
    deleteOrder: I.Func([I.Nat], [I.Bool], []),

    getReservations: I.Func([], [I.Vec(ReservationType)], ["query"]),
    createReservation: I.Func(
      [I.Text, I.Text, I.Text, I.Text, I.Nat],
      [ReservationType],
      []
    ),
    deleteReservation: I.Func([I.Nat], [I.Bool], []),

    getAdminStats: I.Func([], [AdminStatsType], ["query"]),
  });
};

// ── ExternalBlob ──────────────────────────────────────────────────────────────

/** Placeholder for blob/file upload support. Not used in this app. */
export class ExternalBlob {
  private _bytes: Uint8Array;
  public onProgress?: (percentage: number) => void;

  constructor(bytes: Uint8Array) {
    this._bytes = bytes;
  }

  static fromURL(url: string): ExternalBlob {
    const blob = new ExternalBlob(new Uint8Array());
    (blob as unknown as { _url: string })._url = url;
    return blob;
  }

  async getBytes(): Promise<Uint8Array> {
    return this._bytes;
  }
}

// ── CreateActorOptions ────────────────────────────────────────────────────────

export interface CreateActorOptions {
  agentOptions?: Omit<ConstructorParameters<typeof import("@dfinity/agent").HttpAgent>[0], never>;
  actorOptions?: Omit<ActorConfig, "canisterId">;
  processError?: (e: unknown) => never;
}

// ── createActor ───────────────────────────────────────────────────────────────

export function createActor(
  canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: { agent?: import("@dfinity/agent").HttpAgent; processError?: (e: unknown) => never } & Omit<ActorConfig, "canisterId">
): ActorSubclass<backendInterface> {
  const actorConfig: ActorConfig = {
    canisterId,
    ...(options?.agent ? { agent: options.agent } : {}),
  };
  return Actor.createActor<backendInterface>(idlFactory, actorConfig);
}
