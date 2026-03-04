# Restaurant Manager

## Current State
Full-stack restaurant management app with a Motoko backend and React frontend. Backend has complete CRUD for Menu Items, Orders, Reservations, and Admin Stats. The previous draft expired and needs to be redeployed with a fresh frontend build.

## Requested Changes (Diff)

### Add
- Nothing new; user confirmed to rebuild/redeploy the existing app.

### Modify
- Rebuild the frontend to ensure it compiles and deploys correctly against the existing backend APIs.

### Remove
- Nothing.

## Implementation Plan
1. Rebuild the React frontend using existing backend.did bindings:
   - Home page with hero section and feature highlights
   - Menu page with category filter tabs and live search, item cards with availability badges
   - Create Order page with selectable items, quantity controls, running total, table number input
   - Reservations page with validated booking form
   - Admin Dashboard with stats overview and tabbed management (Orders, Reservations, Menu CRUD)
   - Navbar across all pages
2. Wire all pages to the Motoko backend APIs (getMenuItems, createOrder, createReservation, getOrders, getReservations, getAdminStats, addMenuItem, updateMenuItem, deleteMenuItem, updateOrderStatus, deleteOrder, deleteReservation)
3. Apply deterministic data-ocid markers on all interactive surfaces
4. Validate and deploy
