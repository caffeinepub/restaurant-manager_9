import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuItems } from "@/hooks/useQueries";
import { ChefHat, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Appetizer", "Main", "Dessert", "Drink"] as const;
type Category = (typeof CATEGORIES)[number];

function MenuCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardContent className="p-0">
        <Skeleton className="h-36 w-full rounded-none" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-1/4 mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

const categoryColors: Record<string, string> = {
  Appetizer: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Main: "bg-primary/10 text-primary border-primary/25",
  Dessert: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  Drink: "bg-chart-3/10 text-chart-3 border-chart-3/25",
};

const categoryGradients: Record<string, string> = {
  Appetizer: "from-chart-4/10 to-chart-4/5",
  Main: "from-primary/10 to-primary/5",
  Dessert: "from-chart-5/10 to-chart-5/5",
  Drink: "from-chart-3/10 to-chart-3/5",
};

export default function MenuPage() {
  const { data: menuItems, isLoading } = useMenuItems();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  return (
    <main className="container mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Page header */}
      <div className="text-center mb-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-2"
        >
          Curated Seasonal Selection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3"
        >
          Our Menu
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="ornamental-divider max-w-xs mx-auto"
        >
          <span className="font-accent text-sm italic text-muted-foreground">
            à la carte
          </span>
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8"
      >
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-sm px-4 py-1.5 rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-warm"
                  : "bg-card border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 font-body text-sm"
          />
        </div>
      </motion.div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {(["a", "b", "c", "d", "e", "f", "g", "h"] as const).map((k) => (
            <MenuCardSkeleton key={k} />
          ))}
        </div>
      )}

      {/* Items grid */}
      {!isLoading && filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <ChefHat className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-xl text-foreground mb-2">
            No dishes found
          </h3>
          <p className="font-body text-sm text-muted-foreground">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : "No items in this category yet."}
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={Number(item.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
              >
                <Card
                  className={`menu-card h-full border-border/60 overflow-hidden ${
                    !item.available ? "opacity-60" : ""
                  }`}
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Category color band */}
                    <div
                      className={`h-2 w-full bg-gradient-to-r ${
                        categoryGradients[item.category] ??
                        "from-muted/20 to-muted/10"
                      }`}
                    />
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-semibold text-foreground leading-tight flex-1">
                          {item.name}
                        </h3>
                        {!item.available && (
                          <Badge
                            variant="outline"
                            className="text-[10px] shrink-0 bg-muted/50 text-muted-foreground border-border/60"
                          >
                            Unavailable
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                        <Badge
                          variant="outline"
                          className={`text-xs font-body ${
                            categoryColors[item.category] ??
                            "bg-muted/20 text-muted-foreground"
                          }`}
                        >
                          {item.category}
                        </Badge>
                        <span className="font-display text-lg font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

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
