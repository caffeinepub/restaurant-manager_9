import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/sonner";
import AdminDashboard from "@/pages/AdminDashboard";
import CreateOrderPage from "@/pages/CreateOrderPage";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import ReservationPage from "@/pages/ReservationPage";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";

// ── Root layout route ───────────────────────────────────────
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Outlet />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

// ── Page routes ─────────────────────────────────────────────
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const menuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/menu",
  component: MenuPage,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order",
  component: CreateOrderPage,
});

const reservationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reservations",
  component: ReservationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

// ── Router ──────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  homeRoute,
  menuRoute,
  orderRoute,
  reservationRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Export re-used routing utilities so child components can import from here
export { Link, useNavigate };

export default function App() {
  return <RouterProvider router={router} />;
}
