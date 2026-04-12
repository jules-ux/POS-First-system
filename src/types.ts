export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
}

export const CATEGORIES = ["FOOD", "DRINK", "SNACK", "MISC", "DESSERT", "ALCOHOL", "SIDES", "SPECIALS", "PROMO", "KIDS"];

export interface Staff {
  id: string;
  number: string; // 3-digit number like 101
  name: string;
  pin: string; // 4-digit PIN
  role?: string;
}

export const STAFF_MEMBERS: Staff[] = [
  { id: "1", number: "101", name: "Alex", pin: "1234", role: "Manager" },
  { id: "2", number: "202", name: "Sarah", pin: "1111", role: "Cashier" },
  { id: "3", number: "303", name: "James", pin: "2222", role: "Cashier" },
  { id: "4", number: "404", name: "Emma", pin: "3333" },
  { id: "5", number: "505", name: "Michael", pin: "4444" },
  { id: "6", number: "606", name: "Olivia", pin: "5555" },
  { id: "7", number: "707", name: "Daniel", pin: "6666" },
  { id: "8", number: "808", name: "Sophia", pin: "7777" },
  { id: "9", number: "909", name: "Lucas", pin: "8888" },
  { id: "10", number: "110", name: "Mia", pin: "9999" },
  { id: "11", number: "211", name: "Ethan", pin: "0000" },
  { id: "12", number: "312", name: "Isabella", pin: "1212" },
  { id: "13", number: "413", name: "Noah", pin: "3434" },
  { id: "14", number: "514", name: "Ava", pin: "5656" },
  { id: "15", number: "615", name: "Liam", pin: "7878" },
  { id: "16", number: "716", name: "Charlotte", pin: "9090" },
  { id: "17", number: "817", name: "Benjamin", pin: "1313" },
  { id: "18", number: "918", name: "Amelia", pin: "2424" },
  { id: "19", number: "119", name: "Elijah", pin: "3535" },
  { id: "20", number: "220", name: "Harper", pin: "4646" },
  { id: "21", number: "321", name: "Jameson", pin: "5757" },
  { id: "22", number: "422", name: "Evelyn", pin: "6868" },
  { id: "23", number: "523", name: "William", pin: "7979" },
  { id: "24", number: "624", name: "Abigail", pin: "8080" },
  { id: "25", number: "725", name: "Henry", pin: "9191" },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Espresso",
    price: 3.50,
    category: "DRINK",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop",
    stock: 50
  },
  {
    id: "2",
    name: "Cappuccino",
    price: 4.50,
    category: "DRINK",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop",
    stock: 40
  },
  {
    id: "3",
    name: "Green Tea",
    price: 3.00,
    category: "DRINK",
    image: "https://images.unsplash.com/photo-1523906630133-f1c83ff3f4b0?w=400&h=400&fit=crop",
    stock: 30
  },
  {
    id: "4",
    name: "Croissant",
    price: 3.75,
    category: "FOOD",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop",
    stock: 15
  },
  {
    id: "5",
    name: "Club Sandwich",
    price: 8.50,
    category: "FOOD",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop",
    stock: 10
  },
  {
    id: "6",
    name: "Blueberry Muffin",
    price: 3.25,
    category: "SNACK",
    image: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?w=400&h=400&fit=crop",
    stock: 20
  },
  {
    id: "7",
    name: "Iced Latte",
    price: 4.75,
    category: "DRINK",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&h=400&fit=crop",
    stock: 25
  },
  {
    id: "8",
    name: "Cheesecake",
    price: 5.50,
    category: "SNACK",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop",
    stock: 8
  },
  {
    id: "9",
    name: "Paper Bag",
    price: 0.10,
    category: "MISC",
    image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop",
    stock: 1000
  }
];
