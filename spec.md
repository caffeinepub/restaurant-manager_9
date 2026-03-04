# Restaurant Manager

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Menu Items management: id, name, category, price, availability (CRUD)
- Orders management: id, table_number, items (list of menu item ids + qty), total_price, status (Pending/Preparing/Served/Completed)
- Reservations management: id, customer_name, phone, date, time, number_of_guests
- Sample seed data for menu items (appetizers, mains, desserts, drinks)
- Admin dashboard showing summary stats (total orders, reservations, revenue) and ability to manage all records
- Home page with restaurant overview
- Menu page with category filter/search
- Create Order page with auto-calculated total
- Reservation booking form page
- Flash/toast notifications for success and errors
- Responsive navigation bar across all pages

### Modify
Nothing -- new project.

### Remove
Nothing -- new project.

## Implementation Plan
1. Backend (Motoko):
   - MenuItem type: id, name, category, price, availability
   - Order type: id, tableNumber, items (array of {menuItemId, quantity}), totalPrice, status
   - Reservation type: id, customerName, phone, date, time, numberOfGuests
   - CRUD for MenuItems (addMenuItem, updateMenuItem, deleteMenuItem, getMenuItems)
   - Order functions: createOrder, updateOrderStatus, getOrders
   - Reservation functions: createReservation, getReservations, deleteReservation
   - Seed sample menu data on init
   - Admin stats query: totalOrders, totalRevenue, pendingOrders, totalReservations

2. Frontend (React + TypeScript):
   - Multi-page SPA with React Router
   - NavBar component on all pages
   - HomePage: hero + featured items
   - MenuPage: list items with category filter tabs + search input
   - CreateOrderPage: select items, set table number, auto-calculate total, submit
   - ReservationPage: booking form with validation
   - AdminDashboard: stats cards + tabbed tables for orders/reservations/menu management
   - Toast notification system for success/error feedback
   - Responsive CSS (Tailwind utility classes)
