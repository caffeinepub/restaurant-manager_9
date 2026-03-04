import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddMenuItem,
  useAdminStats,
  useDeleteMenuItem,
  useDeleteOrder,
  useDeleteReservation,
  useMenuItems,
  useOrders,
  useReservations,
  useUpdateMenuItem,
  useUpdateOrderStatus,
} from "@/hooks/useQueries";
import type { MenuItem } from "@/hooks/useQueries";
import {
  CalendarCheck,
  ChefHat,
  Clock3,
  DollarSign,
  Edit2,
  Loader2,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const ORDER_STATUSES = ["Pending", "Preparing", "Served", "Completed"] as const;

function statusClass(status: string) {
  switch (status) {
    case "Pending":
      return "status-pending border";
    case "Preparing":
      return "status-preparing border";
    case "Served":
      return "status-served border";
    case "Completed":
      return "status-completed border";
    default:
      return "bg-muted/20 text-muted-foreground border border-border/40";
  }
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  isLoading: boolean;
}) {
  return (
    <Card className="border-border/60 shadow-xs hover:shadow-warm transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {label}
            </p>
            {isLoading ? (
              <Skeleton
                className="h-7 w-20 mt-1"
                data-ocid="admin.loading_state"
              />
            ) : (
              <p className="font-display text-2xl font-bold text-foreground">
                {value}
              </p>
            )}
          </div>
          <div className="bg-primary/10 rounded-lg p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Menu Item Form ────────────────────────────────────────────
type MenuItemForm = {
  name: string;
  category: string;
  price: string;
  available: boolean;
};

const emptyForm: MenuItemForm = {
  name: "",
  category: "Main",
  price: "",
  available: true,
};
const CATEGORIES = ["Appetizer", "Main", "Dessert", "Drink"];

function MenuItemDialog({
  open,
  onOpenChange,
  editItem,
  onClose,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editItem: MenuItem | null;
  onClose: () => void;
}) {
  const addMenuItem = useAddMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const isEdit = !!editItem;

  const [form, setForm] = useState<MenuItemForm>(() =>
    editItem
      ? {
          name: editItem.name,
          category: editItem.category,
          price: editItem.price.toFixed(2),
          available: editItem.available,
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState<Partial<MenuItemForm>>({});

  // Reset form when editItem changes
  const handleOpen = (v: boolean) => {
    if (v) {
      setForm(
        editItem
          ? {
              name: editItem.name,
              category: editItem.category,
              price: editItem.price.toFixed(2),
              available: editItem.available,
            }
          : emptyForm,
      );
      setErrors({});
    }
    onOpenChange(v);
  };

  const validate = (): boolean => {
    const newErr: Partial<MenuItemForm> = {};
    if (!form.name.trim()) newErr.name = "Name is required";
    if (
      !form.price ||
      Number.isNaN(Number.parseFloat(form.price)) ||
      Number.parseFloat(form.price) < 0
    )
      newErr.price = "Valid price required";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      name: form.name.trim(),
      category: form.category,
      price: Number.parseFloat(form.price),
      available: form.available,
    };

    try {
      if (isEdit && editItem) {
        await updateMenuItem.mutateAsync({ id: editItem.id, ...data });
        toast.success(`"${data.name}" updated successfully.`);
      } else {
        await addMenuItem.mutateAsync(data);
        toast.success(`"${data.name}" added to the menu.`);
      }
      onClose();
    } catch {
      toast.error(`Failed to ${isEdit ? "update" : "add"} menu item.`);
    }
  };

  const isPending = addMenuItem.isPending || updateMenuItem.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md" data-ocid="admin.menu.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit Menu Item" : "Add Menu Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Dish Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Soupe à l'oignon"
              className={`font-body text-sm ${errors.name ? "border-destructive" : ""}`}
              data-ocid="admin.menu.name_input"
            />
            {errors.name && (
              <p
                className="font-body text-xs text-destructive"
                data-ocid="admin.menu.name_error"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger
                  className="font-body text-sm"
                  data-ocid="admin.menu.category_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="font-body text-sm">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body text-sm">Price ($) *</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="0.00"
                className={`font-body text-sm ${errors.price ? "border-destructive" : ""}`}
                data-ocid="admin.menu.price_input"
              />
              {errors.price && (
                <p className="font-body text-xs text-destructive">
                  {errors.price}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-secondary/30 rounded-lg px-3 py-2.5">
            <Switch
              id="available"
              checked={form.available}
              onCheckedChange={(v) => setForm((p) => ({ ...p, available: v }))}
              data-ocid="admin.menu.available_switch"
            />
            <Label
              htmlFor="available"
              className="font-body text-sm cursor-pointer"
            >
              {form.available ? "Available on menu" : "Not available"}
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="font-body text-sm"
              data-ocid="admin.menu.dialog.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="font-body text-sm bg-primary hover:bg-primary/90"
              data-ocid="admin.menu.dialog.save_button"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : null}
              {isEdit ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: reservations, isLoading: reservationsLoading } =
    useReservations();
  const { data: menuItems, isLoading: menuLoading } = useMenuItems();

  const updateStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();
  const deleteReservation = useDeleteReservation();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const handleStatusChange = async (id: bigint, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Order #${Number(id)} status updated to ${status}.`);
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  const handleDeleteOrder = async (id: bigint) => {
    try {
      await deleteOrder.mutateAsync(id);
      toast.success(`Order #${Number(id)} deleted.`);
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  const handleDeleteReservation = async (id: bigint) => {
    try {
      await deleteReservation.mutateAsync(id);
      toast.success("Reservation deleted.");
    } catch {
      toast.error("Failed to delete reservation.");
    }
  };

  const handleDeleteMenuItem = async (id: bigint, name: string) => {
    try {
      await deleteMenuItemMutation.mutateAsync(id);
      toast.success(`"${name}" removed from the menu.`);
    } catch {
      toast.error("Failed to delete menu item.");
    }
  };

  const openAddDialog = () => {
    setEditItem(null);
    setMenuDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditItem(item);
    setMenuDialogOpen(true);
  };

  const closeDialog = () => {
    setMenuDialogOpen(false);
    setEditItem(null);
  };

  return (
    <main className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1"
        >
          Management Console
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl font-bold text-foreground"
        >
          Admin Dashboard
        </motion.h1>
      </div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
      >
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats ? Number(stats.totalOrders) : "–"}
          isLoading={statsLoading}
        />
        <StatCard
          icon={Clock3}
          label="Pending"
          value={stats ? Number(stats.pendingOrders) : "–"}
          isLoading={statsLoading}
        />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={stats ? `$${stats.totalRevenue.toFixed(2)}` : "–"}
          isLoading={statsLoading}
        />
        <StatCard
          icon={CalendarCheck}
          label="Reservations"
          value={stats ? Number(stats.totalReservations) : "–"}
          isLoading={statsLoading}
        />
        <StatCard
          icon={ChefHat}
          label="Menu Items"
          value={stats ? Number(stats.totalMenuItems) : "–"}
          isLoading={statsLoading}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18 }}
      >
        <Tabs defaultValue="orders">
          <TabsList className="mb-6 bg-secondary/50 border border-border/40">
            <TabsTrigger
              value="orders"
              className="font-body text-sm"
              data-ocid="admin.orders_tab"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="font-body text-sm"
              data-ocid="admin.reservations_tab"
            >
              Reservations
            </TabsTrigger>
            <TabsTrigger
              value="menu"
              className="font-body text-sm"
              data-ocid="admin.menu_tab"
            >
              Menu
            </TabsTrigger>
          </TabsList>

          {/* ── Orders Tab ──────────────────────────────────── */}
          <TabsContent value="orders">
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  All Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {ordersLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="admin.orders.loading_state"
                  >
                    {(["a", "b", "c", "d"] as const).map((k) => (
                      <Skeleton key={k} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !orders || orders.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="admin.orders.empty_state"
                  >
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/25 mb-3" />
                    <p className="font-body text-sm text-muted-foreground">
                      No orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.orders.table">
                      <TableHeader>
                        <TableRow className="border-border/40">
                          <TableHead className="font-body text-xs">
                            Order #
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Table
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Items
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Total
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Status
                          </TableHead>
                          <TableHead className="font-body text-xs text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, index) => (
                          <TableRow
                            key={Number(order.id)}
                            className="border-border/30"
                            data-ocid={`admin.orders.row.${index + 1}`}
                          >
                            <TableCell className="font-body text-sm font-medium">
                              #{Number(order.id)}
                            </TableCell>
                            <TableCell className="font-body text-sm">
                              Table {Number(order.tableNumber)}
                            </TableCell>
                            <TableCell className="font-body text-sm text-muted-foreground">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </TableCell>
                            <TableCell className="font-display text-sm font-semibold text-primary">
                              ${order.totalPrice.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`font-body text-xs px-2 py-0.5 rounded-full ${statusClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Select
                                  value={order.status}
                                  onValueChange={(v) =>
                                    handleStatusChange(order.id, v)
                                  }
                                >
                                  <SelectTrigger
                                    className="font-body text-xs h-7 w-28 border-border/50"
                                    data-ocid={`admin.order.status_select.${index + 1}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ORDER_STATUSES.map((s) => (
                                      <SelectItem
                                        key={s}
                                        value={s}
                                        className="font-body text-xs"
                                      >
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  disabled={deleteOrder.isPending}
                                  data-ocid={`admin.order.delete_button.${index + 1}`}
                                  aria-label={`Delete order #${Number(order.id)}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Reservations Tab ────────────────────────────── */}
          <TabsContent value="reservations">
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  All Reservations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {reservationsLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="admin.reservations.loading_state"
                  >
                    {(["a", "b", "c", "d"] as const).map((k) => (
                      <Skeleton key={k} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !reservations || reservations.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="admin.reservations.empty_state"
                  >
                    <CalendarCheck className="h-10 w-10 text-muted-foreground/25 mb-3" />
                    <p className="font-body text-sm text-muted-foreground">
                      No reservations yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.reservations.table">
                      <TableHeader>
                        <TableRow className="border-border/40">
                          <TableHead className="font-body text-xs">
                            Name
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Phone
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Date
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Time
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Guests
                          </TableHead>
                          <TableHead className="font-body text-xs text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservations.map((res, index) => (
                          <TableRow
                            key={Number(res.id)}
                            className="border-border/30"
                            data-ocid={`admin.reservations.row.${index + 1}`}
                          >
                            <TableCell className="font-body text-sm font-medium">
                              {res.customerName}
                            </TableCell>
                            <TableCell className="font-body text-sm text-muted-foreground">
                              {res.phone}
                            </TableCell>
                            <TableCell className="font-body text-sm">
                              {res.date}
                            </TableCell>
                            <TableCell className="font-body text-sm">
                              {res.time}
                            </TableCell>
                            <TableCell className="font-body text-sm">
                              <Badge
                                variant="outline"
                                className="font-body text-xs border-border/50"
                              >
                                {Number(res.numberOfGuests)} pax
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteReservation(res.id)}
                                disabled={deleteReservation.isPending}
                                data-ocid={`admin.reservation.delete_button.${index + 1}`}
                                aria-label={`Delete reservation for ${res.customerName}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Menu Tab ────────────────────────────────────── */}
          <TabsContent value="menu">
            <Card className="border-border/60">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <CardTitle className="font-display text-xl flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Menu Management
                </CardTitle>
                <Button
                  size="sm"
                  onClick={openAddDialog}
                  className="font-body text-xs bg-primary hover:bg-primary/90 h-8"
                  data-ocid="admin.menu.add_button"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {menuLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="admin.menu.loading_state"
                  >
                    {(["a", "b", "c", "d"] as const).map((k) => (
                      <Skeleton key={k} className="h-12 w-full" />
                    ))}
                  </div>
                ) : !menuItems || menuItems.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="admin.menu.empty_state"
                  >
                    <ChefHat className="h-10 w-10 text-muted-foreground/25 mb-3" />
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      No menu items yet.
                    </p>
                    <Button
                      onClick={openAddDialog}
                      className="font-body text-sm bg-primary hover:bg-primary/90"
                      data-ocid="admin.menu.add_button"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="admin.menu.table">
                      <TableHeader>
                        <TableRow className="border-border/40">
                          <TableHead className="font-body text-xs">
                            Name
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Category
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Price
                          </TableHead>
                          <TableHead className="font-body text-xs">
                            Status
                          </TableHead>
                          <TableHead className="font-body text-xs text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.map((item, index) => (
                          <TableRow
                            key={Number(item.id)}
                            className="border-border/30"
                            data-ocid={`admin.menu.item.${index + 1}`}
                          >
                            <TableCell className="font-body text-sm font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="font-body text-xs border-border/50 text-muted-foreground"
                              >
                                {item.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-display text-sm font-semibold text-primary">
                              ${item.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`font-body text-xs px-2 py-0.5 rounded-full border ${
                                  item.available
                                    ? "status-served"
                                    : "bg-muted/20 text-muted-foreground border-border/40"
                                }`}
                              >
                                {item.available ? "Available" : "Unavailable"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                  onClick={() => openEditDialog(item)}
                                  data-ocid={`admin.menu.edit_button.${index + 1}`}
                                  aria-label={`Edit ${item.name}`}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    handleDeleteMenuItem(item.id, item.name)
                                  }
                                  disabled={deleteMenuItemMutation.isPending}
                                  data-ocid={`admin.menu.delete_button.${index + 1}`}
                                  aria-label={`Delete ${item.name}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Menu Item Dialog */}
      <MenuItemDialog
        open={menuDialogOpen}
        onOpenChange={setMenuDialogOpen}
        editItem={editItem}
        onClose={closeDialog}
      />

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16 pt-8 text-center">
        <p className="font-body text-sm text-muted-foreground">
          © {new Date().getFullYear()} La Maison. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}
