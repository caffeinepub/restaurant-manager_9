import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateOrder, useMenuItems } from "@/hooks/useQueries";
import type { MenuItem } from "@/hooks/useQueries";
import {
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type QuantityMap = Record<string, number>;

function MenuItemCard({
  item,
  quantity,
  onAdd,
  onRemove,
  index,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
}) {
  const isSelected = quantity > 0;

  return (
    <Card
      data-ocid={`order.item.${index + 1}`}
      className={`border transition-all duration-200 ${
        isSelected
          ? "border-primary/40 bg-primary/5 shadow-warm"
          : item.available
            ? "border-border/60 hover:border-primary/20"
            : "border-border/40 opacity-50"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-sm font-semibold text-foreground truncate">
              {item.name}
            </h4>
            <Badge
              variant="outline"
              className="mt-1 text-[10px] font-body text-muted-foreground border-border/50"
            >
              {item.category}
            </Badge>
          </div>
          <span className="font-display text-base font-bold text-primary shrink-0">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {item.available ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border-border/60"
              onClick={onRemove}
              disabled={quantity === 0}
              aria-label={`Remove one ${item.name}`}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-body text-sm font-semibold w-6 text-center text-foreground">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-full border-border/60 hover:bg-primary/10 hover:border-primary/40"
              onClick={onAdd}
              aria-label={`Add one ${item.name}`}
            >
              <Plus className="h-3 w-3" />
            </Button>
            {quantity > 0 && (
              <span className="ml-auto font-body text-xs text-muted-foreground">
                = ${(item.price * quantity).toFixed(2)}
              </span>
            )}
          </div>
        ) : (
          <p className="font-body text-xs text-muted-foreground">
            Currently unavailable
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function CreateOrderPage() {
  const { data: menuItems, isLoading } = useMenuItems();
  const createOrder = useCreateOrder();

  const [tableNumber, setTableNumber] = useState("");
  const [quantities, setQuantities] = useState<QuantityMap>({});
  const [orderSuccess, setOrderSuccess] = useState<{
    tableNum: number;
    total: number;
  } | null>(null);

  const availableItems = useMemo(
    () => (menuItems ?? []).filter((item) => item.available),
    [menuItems],
  );

  const total = useMemo(() => {
    if (!menuItems) return 0;
    return menuItems.reduce((sum, item) => {
      const qty = quantities[item.id.toString()] ?? 0;
      return sum + item.price * qty;
    }, 0);
  }, [menuItems, quantities]);

  const selectedItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems
      .filter((item) => (quantities[item.id.toString()] ?? 0) > 0)
      .map((item) => ({
        item,
        qty: quantities[item.id.toString()],
      }));
  }, [menuItems, quantities]);

  const handleAdd = (item: MenuItem) => {
    const key = item.id.toString();
    setQuantities((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  };

  const handleRemove = (item: MenuItem) => {
    const key = item.id.toString();
    setQuantities((prev) => {
      const current = prev[key] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: current - 1 };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tableNum = Number.parseInt(tableNumber, 10);
    if (
      !tableNumber ||
      Number.isNaN(tableNum) ||
      tableNum < 1 ||
      tableNum > 20
    ) {
      toast.error("Please enter a valid table number (1–20).");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please add at least one item to your order.");
      return;
    }

    try {
      await createOrder.mutateAsync({
        tableNumber: BigInt(tableNum),
        items: selectedItems.map(({ item, qty }) => ({
          menuItemId: item.id,
          quantity: BigInt(qty),
        })),
        totalPrice: total,
      });

      setOrderSuccess({ tableNum, total });
      toast.success(
        `Order placed for Table ${tableNum}! Total: $${total.toFixed(2)}`,
      );
      setTableNumber("");
      setQuantities({});
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <main className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Page header */}
      <div className="mb-10 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
        >
          Table Service
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3"
        >
          Place an Order
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="ornamental-divider max-w-xs mx-auto"
        >
          <span className="font-accent text-sm italic text-muted-foreground">
            Fresh. Refined. Prompt.
          </span>
        </motion.div>
      </div>

      {/* Success message */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="mb-8 rounded-xl border border-chart-3/30 bg-chart-3/10 px-5 py-4 flex items-center gap-3"
            data-ocid="order.success_state"
          >
            <CheckCircle2 className="h-5 w-5 text-chart-3 shrink-0" />
            <div>
              <p className="font-body text-sm font-semibold text-foreground">
                Order placed successfully!
              </p>
              <p className="font-body text-xs text-muted-foreground">
                Table {orderSuccess.tableNum} — Total: $
                {orderSuccess.total.toFixed(2)}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto font-body text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setOrderSuccess(null)}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Menu items ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground">
                Available Dishes
              </h2>
              <span className="font-body text-xs text-muted-foreground">
                {availableItems.length} items
              </span>
            </div>

            {isLoading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-ocid="order.loading_state"
              >
                {(["a", "b", "c", "d", "e", "f"] as const).map((k) => (
                  <Skeleton key={k} className="h-28 w-full rounded-xl" />
                ))}
              </div>
            ) : availableItems.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="order.empty_state"
              >
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="font-body text-sm text-muted-foreground">
                  No menu items available.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {availableItems.map((item, index) => (
                  <MenuItemCard
                    key={Number(item.id)}
                    item={item}
                    quantity={quantities[item.id.toString()] ?? 0}
                    onAdd={() => handleAdd(item)}
                    onRemove={() => handleRemove(item)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Right: Order summary ──────────────────────────── */}
          <div className="space-y-4">
            {/* Table number */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg">
                  Table Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="table" className="font-body text-sm">
                    Table Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="table"
                    type="number"
                    min={1}
                    max={20}
                    placeholder="1 – 20"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="font-body text-sm"
                    data-ocid="order.table_input"
                  />
                  <p className="font-body text-xs text-muted-foreground">
                    Enter your table number (1–20)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order summary */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedItems.length === 0 ? (
                  <p className="font-body text-sm text-muted-foreground text-center py-4">
                    No items selected yet
                  </p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {selectedItems.map(({ item, qty }) => (
                        <div
                          key={Number(item.id)}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="font-body text-foreground truncate flex-1">
                            {item.name}
                          </span>
                          <span className="font-body text-muted-foreground ml-2 shrink-0">
                            ×{qty}
                          </span>
                          <span className="font-body font-semibold text-foreground ml-3 shrink-0 w-16 text-right">
                            ${(item.price * qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                  </>
                )}

                <div className="flex justify-between items-center pt-1">
                  <span className="font-display text-base font-semibold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-xl font-bold text-primary">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 font-body font-semibold bg-primary hover:bg-primary/90"
                  disabled={createOrder.isPending}
                  data-ocid="order.submit_button"
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

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
