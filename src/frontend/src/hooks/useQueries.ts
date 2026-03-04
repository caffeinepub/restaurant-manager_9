import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

// ── Types ─────────────────────────────────────────────────────

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

// ── Menu Items ────────────────────────────────────────────────

export function useMenuItems() {
  const { actor, isFetching } = useActor();
  return useQuery<MenuItem[]>({
    queryKey: ["menuItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenuItems();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      price: number;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addMenuItem(
        data.name,
        data.category,
        data.price,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: string;
      price: number;
      available: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMenuItem(
        data.id,
        data.name,
        data.category,
        data.price,
        data.available,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
}

export function useDeleteMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteMenuItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ── Orders ────────────────────────────────────────────────────

export function useOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      tableNumber: bigint;
      items: OrderItem[];
      totalPrice: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createOrder(data.tableNumber, data.items, data.totalPrice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: bigint; status: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrderStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteOrder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ── Reservations ──────────────────────────────────────────────

export function useReservations() {
  const { actor, isFetching } = useActor();
  return useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReservations();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useCreateReservation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      customerName: string;
      phone: string;
      date: string;
      time: string;
      numberOfGuests: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createReservation(
        data.customerName,
        data.phone,
        data.date,
        data.time,
        data.numberOfGuests,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useDeleteReservation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteReservation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

// ── Admin Stats ───────────────────────────────────────────────

export function useAdminStats() {
  const { actor, isFetching } = useActor();
  return useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}
