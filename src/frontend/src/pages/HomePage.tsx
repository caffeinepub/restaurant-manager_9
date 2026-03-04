import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  ClipboardList,
  Clock,
  MapPin,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

const featureCards = [
  {
    icon: CalendarCheck,
    title: "Reserve a Table",
    description:
      "Book your perfect evening at La Maison. We'll ensure every detail is just right for your occasion.",
    cta: "Book Now",
    href: "/reservation" as const,
    color: "text-accent-foreground",
    bg: "bg-accent/10",
  },
  {
    icon: UtensilsCrossed,
    title: "Explore Our Menu",
    description:
      "Discover our carefully curated seasonal menu featuring the finest French ingredients and techniques.",
    cta: "View Menu",
    href: "/menu" as const,
    color: "text-primary",
    bg: "bg-primary/8",
  },
  {
    icon: ClipboardList,
    title: "Place an Order",
    description:
      "Order directly from your table for seamless, attentive service. Fresh dishes crafted just for you.",
    cta: "Order Now",
    href: "/order" as const,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
];

const highlights = [
  { icon: Star, text: "Michelin-Starred Cuisine" },
  { icon: Clock, text: "Open Daily 12pm – 11pm" },
  { icon: MapPin, text: "12 Rue de la Paix, Paris" },
];

const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-restaurant.dim_1200x600.jpg"
            alt="La Maison restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-75" />
          <div className="absolute inset-0 bg-foreground/20" />
        </div>

        {/* Hero content */}
        <div className="relative container mx-auto px-4 md:px-6 py-24 md:py-36 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-4"
          >
            <span className="font-body text-xs tracking-[0.3em] uppercase text-accent/90 border border-accent/30 px-4 py-1.5 rounded-full">
              Est. 1987 · Paris, France
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
            className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-4 tracking-tight"
          >
            La Maison
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
            className="font-accent text-xl md:text-2xl text-white/80 italic mb-3 font-light"
          >
            A symphony of flavors. An evening to remember.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="font-body text-sm md:text-base text-white/60 max-w-lg mb-8 leading-relaxed"
          >
            Nestled in the heart of Paris, La Maison elevates French culinary
            tradition with contemporary artistry. Every dish tells a story of
            passion, provenance, and perfection.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 font-body font-semibold tracking-wide shadow-warm-lg"
            >
              <Link to="/reservation">Reserve a Table</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-body"
            >
              <Link to="/menu">Explore Menu</Link>
            </Button>
          </motion.div>

          {/* Highlights row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex flex-wrap gap-6 justify-center"
          >
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/70">
                <Icon className="h-4 w-4 text-accent/80" />
                <span className="font-body text-sm">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Ornamental divider ─────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="ornamental-divider">
          <span className="font-accent text-sm italic text-muted-foreground tracking-wide">
            Bienvenue
          </span>
        </div>
      </div>

      {/* ── Feature Cards ──────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} variants={fadeUp}>
                <Card className="group h-full border-border/60 hover:border-primary/25 transition-all duration-300 hover:shadow-warm-lg overflow-hidden">
                  <CardContent className="p-6 flex flex-col h-full gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} transition-transform group-hover:scale-105 duration-300`}
                    >
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        {card.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full mt-auto border-border/60 font-body hover:bg-primary/5 hover:border-primary/30 transition-all"
                    >
                      <Link to={card.href}>{card.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── About strip ────────────────────────────────────────── */}
      <section className="border-t border-border/40 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">
                Our Philosophy
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Where Every Detail
                <br />
                <span className="font-accent italic font-normal text-primary/80">
                  Tells a Story
                </span>
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                At La Maison, we believe that exceptional dining transcends the
                plate. From our carefully sourced seasonal ingredients to our
                sommelier-curated wine list, every element is orchestrated to
                create an unforgettable experience.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Our chefs train under the finest culinary masters in France,
                bringing both classical technique and innovative vision to each
                dish. We invite you to sit back, relax, and let us tell you our
                story—one course at a time.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { number: "37", label: "Years of Excellence" },
                { number: "120+", label: "Seasonal Dishes" },
                { number: "400+", label: "Wine Selections" },
                { number: "5K+", label: "Happy Guests / Month" },
              ].map(({ number, label }) => (
                <div
                  key={label}
                  className="bg-card border border-border/60 rounded-xl p-5 text-center shadow-xs"
                >
                  <div className="font-display text-3xl font-bold text-primary mb-1">
                    {number}
                  </div>
                  <div className="font-body text-xs text-muted-foreground uppercase tracking-wide">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-card/60">
        <div className="container mx-auto px-4 md:px-6 py-8 text-center">
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
        </div>
      </footer>
    </main>
  );
}
