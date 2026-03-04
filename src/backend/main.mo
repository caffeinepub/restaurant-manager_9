import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";

actor RestaurantManager {

  // --- Types ---

  type MenuItem = {
    id : Nat;
    name : Text;
    category : Text;
    price : Float;
    available : Bool;
  };

  type OrderItem = {
    menuItemId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    tableNumber : Nat;
    items : [OrderItem];
    totalPrice : Float;
    status : Text;
    createdAt : Int;
  };

  type Reservation = {
    id : Nat;
    customerName : Text;
    phone : Text;
    date : Text;
    time : Text;
    numberOfGuests : Nat;
    createdAt : Int;
  };

  type AdminStats = {
    totalOrders : Nat;
    totalRevenue : Float;
    pendingOrders : Nat;
    totalReservations : Nat;
    totalMenuItems : Nat;
  };

  // --- State ---

  let menuMap : Map.Map<Nat, MenuItem> = Map.empty<Nat, MenuItem>();
  let orderMap : Map.Map<Nat, Order> = Map.empty<Nat, Order>();
  let reservationMap : Map.Map<Nat, Reservation> = Map.empty<Nat, Reservation>();

  var nextMenuId : Nat = 1;
  var nextOrderId : Nat = 1;
  var nextReservationId : Nat = 1;
  var seeded : Bool = false;

  // --- Seed sample data ---

  func seedData() {
    if (seeded) return;
    seeded := true;
    let items : [MenuItem] = [
      { id = 1; name = "Bruschetta"; category = "Appetizer"; price = 8.99; available = true },
      { id = 2; name = "Calamari"; category = "Appetizer"; price = 11.99; available = true },
      { id = 3; name = "Caesar Salad"; category = "Appetizer"; price = 9.50; available = true },
      { id = 4; name = "Grilled Salmon"; category = "Main"; price = 24.99; available = true },
      { id = 5; name = "Ribeye Steak"; category = "Main"; price = 34.99; available = true },
      { id = 6; name = "Pasta Carbonara"; category = "Main"; price = 18.50; available = true },
      { id = 7; name = "Margherita Pizza"; category = "Main"; price = 16.99; available = true },
      { id = 8; name = "Tiramisu"; category = "Dessert"; price = 7.99; available = true },
      { id = 9; name = "Chocolate Lava Cake"; category = "Dessert"; price = 8.50; available = true },
      { id = 10; name = "Panna Cotta"; category = "Dessert"; price = 6.99; available = true },
      { id = 11; name = "Sparkling Water"; category = "Drink"; price = 2.99; available = true },
      { id = 12; name = "House Red Wine"; category = "Drink"; price = 9.99; available = true },
      { id = 13; name = "Craft Lemonade"; category = "Drink"; price = 4.50; available = true },
    ];
    for (item in items.values()) {
      menuMap.add(item.id, item);
    };
    nextMenuId := 14;
  };

  func ensureSeeded() {
    if (not seeded) { seedData() };
  };

  // --- Menu Items ---

  public query func getMenuItems() : async [MenuItem] {
    ensureSeeded();
    Array.fromIter(menuMap.values())
  };

  public query func getMenuItemById(id : Nat) : async ?MenuItem {
    ensureSeeded();
    menuMap.get(id)
  };

  public func addMenuItem(name : Text, category : Text, price : Float, available : Bool) : async MenuItem {
    ensureSeeded();
    let item : MenuItem = { id = nextMenuId; name; category; price; available };
    menuMap.add(item.id, item);
    nextMenuId += 1;
    item
  };

  public func updateMenuItem(id : Nat, name : Text, category : Text, price : Float, available : Bool) : async ?MenuItem {
    ensureSeeded();
    switch (menuMap.get(id)) {
      case null { null };
      case (?_) {
        let updated : MenuItem = { id; name; category; price; available };
        menuMap.add(id, updated);
        ?updated
      };
    }
  };

  public func deleteMenuItem(id : Nat) : async Bool {
    ensureSeeded();
    switch (menuMap.get(id)) {
      case null { false };
      case (?_) { menuMap.remove(id); true };
    }
  };

  // --- Orders ---

  public query func getOrders() : async [Order] {
    Array.fromIter(orderMap.values())
  };

  public func createOrder(tableNumber : Nat, items : [OrderItem], totalPrice : Float) : async Order {
    ensureSeeded();
    let order : Order = {
      id = nextOrderId;
      tableNumber;
      items;
      totalPrice;
      status = "Pending";
      createdAt = Time.now();
    };
    orderMap.add(order.id, order);
    nextOrderId += 1;
    order
  };

  public func updateOrderStatus(id : Nat, status : Text) : async ?Order {
    switch (orderMap.get(id)) {
      case null { null };
      case (?o) {
        let updated : Order = {
          id = o.id;
          tableNumber = o.tableNumber;
          items = o.items;
          totalPrice = o.totalPrice;
          status;
          createdAt = o.createdAt;
        };
        orderMap.add(id, updated);
        ?updated
      };
    }
  };

  public func deleteOrder(id : Nat) : async Bool {
    switch (orderMap.get(id)) {
      case null { false };
      case (?_) { orderMap.remove(id); true };
    }
  };

  // --- Reservations ---

  public query func getReservations() : async [Reservation] {
    Array.fromIter(reservationMap.values())
  };

  public func createReservation(customerName : Text, phone : Text, date : Text, time : Text, numberOfGuests : Nat) : async Reservation {
    let r : Reservation = {
      id = nextReservationId;
      customerName;
      phone;
      date;
      time;
      numberOfGuests;
      createdAt = Time.now();
    };
    reservationMap.add(r.id, r);
    nextReservationId += 1;
    r
  };

  public func deleteReservation(id : Nat) : async Bool {
    switch (reservationMap.get(id)) {
      case null { false };
      case (?_) { reservationMap.remove(id); true };
    }
  };

  // --- Admin Stats ---

  public query func getAdminStats() : async AdminStats {
    let allOrders = Array.fromIter(orderMap.values());
    let totalRevenue = allOrders.foldLeft(0.0, func(acc : Float, o : Order) : Float { acc + o.totalPrice });
    let pendingOrders = allOrders.filter(func(o : Order) : Bool { o.status == "Pending" or o.status == "Preparing" }).size();
    {
      totalOrders = orderMap.size();
      totalRevenue;
      pendingOrders;
      totalReservations = reservationMap.size();
      totalMenuItems = menuMap.size();
    }
  };
}
