export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  ingredients?: string[];
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  modifications?: string[];
}

export const CATEGORIES = ["FOOD", "DRINK", "SNACK", "MISC", "DESSERT", "ALCOHOL", "SIDES", "SPECIALS", "PROMO", "KIDS"];

export interface Staff {
  id: string;
  number: string; // 3-digit number like 101
  name: string;
  pin: string; // 4-digit PIN
  role?: string;
}

export type ShiftStatus = 'not-working' | 'working' | 'on-break';
export type StaffRole = 'Bediening' | 'Keuken' | 'Bar' | 'Runner';

export interface Shift {
  staffId: string;
  status: ShiftStatus;
  role?: StaffRole;
  startTime?: number; // timestamp
  breakStartTime?: number; // timestamp
  totalBreakTime: number; // in milliseconds
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
  // FOOD
  { id: "f1", name: "Club Sandwich", price: 8.50, category: "FOOD", image: "", stock: 50 },
  { id: "f2", name: "Croissant", price: 3.75, category: "FOOD", image: "", stock: 50 },
  { id: "f3", name: "Beef Burger", price: 12.50, category: "FOOD", image: "", stock: 50 },
  { id: "f4", name: "Chicken Wrap", price: 9.50, category: "FOOD", image: "", stock: 50 },
  { id: "f5", name: "Caesar Salad", price: 10.50, category: "FOOD", image: "", stock: 50 },
  { id: "f6", name: "Pasta Carbonara", price: 14.00, category: "FOOD", image: "", stock: 50 },
  { id: "f7", name: "Margherita Pizza", price: 11.00, category: "FOOD", image: "", stock: 50 },
  { id: "f8", name: "Fish & Chips", price: 15.50, category: "FOOD", image: "", stock: 50 },
  { id: "f9", name: "Steak Frites", price: 22.00, category: "FOOD", image: "", stock: 50 },
  { id: "f10", name: "Veggie Burger", price: 11.50, category: "FOOD", image: "", stock: 50 },
  { id: "f11", name: "Tuna Melt", price: 8.00, category: "FOOD", image: "", stock: 50 },
  { id: "f12", name: "Quiche Lorraine", price: 7.50, category: "FOOD", image: "", stock: 50 },
  { id: "f13", name: "Lasagna", price: 13.50, category: "FOOD", image: "", stock: 50 },
  { id: "f14", name: "Chicken Curry", price: 14.50, category: "FOOD", image: "", stock: 50 },
  { id: "f15", name: "Omelette", price: 6.50, category: "FOOD", image: "", stock: 50 },
  { id: "f16", name: "Soup of the Day", price: 5.50, category: "FOOD", image: "", stock: 50 },
  { id: "f17", name: "Baguette Ham", price: 6.00, category: "FOOD", image: "", stock: 50 },
  { id: "f18", name: "Baguette Cheese", price: 5.50, category: "FOOD", image: "", stock: 50 },
  { id: "f19", name: "Hot Dog", price: 4.50, category: "FOOD", image: "", stock: 50, ingredients: ["Sausage", "Bun", "Mustard", "Ketchup", "Onions"] },
  { id: "f20", name: "Tacos Beef", price: 9.00, category: "FOOD", image: "", stock: 50 },
  { id: "f21", name: "Tacos Chicken", price: 8.50, category: "FOOD", image: "", stock: 50 },
  { id: "f22", name: "Burrito", price: 10.00, category: "FOOD", image: "", stock: 50 },
  { id: "f23", name: "Quesadilla", price: 8.00, category: "FOOD", image: "", stock: 50 },
  { id: "f24", name: "Greek Salad", price: 9.50, category: "FOOD", image: "", stock: 50, ingredients: ["Tomatoes", "Cucumber", "Olives", "Feta Cheese", "Onions", "Dressing"] },

  // DRINK
  { id: "d1", name: "Espresso", price: 3.50, category: "DRINK", image: "", stock: 100 },
  { id: "d2", name: "Cappuccino", price: 4.50, category: "DRINK", image: "", stock: 100 },
  { id: "d3", name: "Green Tea", price: 3.00, category: "DRINK", image: "", stock: 100 },
  { id: "d4", name: "Iced Latte", price: 4.75, category: "DRINK", image: "", stock: 100 },
  { id: "d5", name: "Americano", price: 3.25, category: "DRINK", image: "", stock: 100 },
  { id: "d6", name: "Flat White", price: 4.25, category: "DRINK", image: "", stock: 100 },
  { id: "d7", name: "Hot Chocolate", price: 4.00, category: "DRINK", image: "", stock: 100 },
  { id: "d8", name: "Fresh Orange Juice", price: 4.50, category: "DRINK", image: "", stock: 100 },
  { id: "d9", name: "Apple Juice", price: 3.50, category: "DRINK", image: "", stock: 100 },
  { id: "d10", name: "Coca Cola", price: 2.50, category: "DRINK", image: "", stock: 100 },
  { id: "d11", name: "Sprite", price: 2.50, category: "DRINK", image: "", stock: 100 },
  { id: "d12", name: "Fanta", price: 2.50, category: "DRINK", image: "", stock: 100 },
  { id: "d13", name: "Still Water", price: 2.00, category: "DRINK", image: "", stock: 100 },
  { id: "d14", name: "Sparkling Water", price: 2.00, category: "DRINK", image: "", stock: 100 },
  { id: "d15", name: "Lemonade", price: 3.00, category: "DRINK", image: "", stock: 100 },
  { id: "d16", name: "Iced Tea Peach", price: 3.00, category: "DRINK", image: "", stock: 100 },
  { id: "d17", name: "Iced Tea Lemon", price: 3.00, category: "DRINK", image: "", stock: 100 },
  { id: "d18", name: "Smoothie Berry", price: 5.50, category: "DRINK", image: "", stock: 100 },
  { id: "d19", name: "Smoothie Mango", price: 5.50, category: "DRINK", image: "", stock: 100 },
  { id: "d20", name: "Milkshake Vanilla", price: 5.00, category: "DRINK", image: "", stock: 100 },
  { id: "d21", name: "Milkshake Choco", price: 5.00, category: "DRINK", image: "", stock: 100 },
  { id: "d22", name: "Earl Grey", price: 3.00, category: "DRINK", image: "", stock: 100 },
  { id: "d23", name: "Mint Tea", price: 3.50, category: "DRINK", image: "", stock: 100 },
  { id: "d24", name: "Ginger Tea", price: 3.50, category: "DRINK", image: "", stock: 100 },

  // SNACK
  { id: "s1", name: "Blueberry Muffin", price: 3.25, category: "SNACK", image: "", stock: 50 },
  { id: "s2", name: "Cheesecake", price: 5.50, category: "SNACK", image: "", stock: 50 },
  { id: "s3", name: "Chocolate Cookie", price: 2.00, category: "SNACK", image: "", stock: 50 },
  { id: "s4", name: "Brownie", price: 3.50, category: "SNACK", image: "", stock: 50 },
  { id: "s5", name: "Potato Chips", price: 1.50, category: "SNACK", image: "", stock: 50 },
  { id: "s6", name: "Mixed Nuts", price: 4.00, category: "SNACK", image: "", stock: 50 },
  { id: "s7", name: "Popcorn", price: 3.00, category: "SNACK", image: "", stock: 50 },
  { id: "s8", name: "Pretzels", price: 2.50, category: "SNACK", image: "", stock: 50 },
  { id: "s9", name: "Nachos", price: 6.50, category: "SNACK", image: "", stock: 50 },
  { id: "s10", name: "Hummus & Pita", price: 5.00, category: "SNACK", image: "", stock: 50 },
  { id: "s11", name: "Fruit Salad", price: 4.50, category: "SNACK", image: "", stock: 50 },
  { id: "s12", name: "Yogurt Parfait", price: 4.00, category: "SNACK", image: "", stock: 50 },
  { id: "s13", name: "Energy Bar", price: 2.50, category: "SNACK", image: "", stock: 50 },
  { id: "s14", name: "Beef Jerky", price: 5.00, category: "SNACK", image: "", stock: 50 },
  { id: "s15", name: "Olives", price: 3.50, category: "SNACK", image: "", stock: 50 },
  { id: "s16", name: "Cheese Cubes", price: 4.50, category: "SNACK", image: "", stock: 50 },

  // ALCOHOL
  { id: "a1", name: "Heineken", price: 4.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a2", name: "Corona", price: 5.00, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a3", name: "Guinness", price: 6.00, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a4", name: "Red Wine Glass", price: 6.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a5", name: "White Wine Glass", price: 6.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a6", name: "Rosé Wine Glass", price: 6.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a7", name: "Prosecco Glass", price: 7.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a8", name: "Gin & Tonic", price: 9.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a9", name: "Whiskey Sour", price: 10.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a10", name: "Margarita", price: 10.00, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a11", name: "Mojito", price: 9.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a12", name: "Martini", price: 11.00, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a13", name: "Old Fashioned", price: 12.00, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a14", name: "Negroni", price: 11.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a15", name: "Aperol Spritz", price: 8.50, category: "ALCOHOL", image: "", stock: 200 },
  { id: "a16", name: "IPA Beer", price: 5.50, category: "ALCOHOL", image: "", stock: 200 },

  // SIDES
  { id: "si1", name: "French Fries", price: 3.50, category: "SIDES", image: "", stock: 100 },
  { id: "si2", name: "Sweet Potato Fries", price: 4.50, category: "SIDES", image: "", stock: 100 },
  { id: "si3", name: "Onion Rings", price: 4.00, category: "SIDES", image: "", stock: 100 },
  { id: "si4", name: "Garlic Bread", price: 3.00, category: "SIDES", image: "", stock: 100 },
  { id: "si5", name: "Side Salad", price: 4.00, category: "SIDES", image: "", stock: 100 },
  { id: "si6", name: "Coleslaw", price: 2.50, category: "SIDES", image: "", stock: 100 },
  { id: "si7", name: "Mashed Potatoes", price: 3.50, category: "SIDES", image: "", stock: 100 },
  { id: "si8", name: "Grilled Veggies", price: 4.50, category: "SIDES", image: "", stock: 100 },
  { id: "si9", name: "Rice", price: 2.50, category: "SIDES", image: "", stock: 100 },
  { id: "si10", name: "Baked Beans", price: 2.00, category: "SIDES", image: "", stock: 100 },

  // DESSERT
  { id: "de1", name: "Apple Pie", price: 5.00, category: "DESSERT", image: "", stock: 40 },
  { id: "de2", name: "Chocolate Cake", price: 6.00, category: "DESSERT", image: "", stock: 40 },
  { id: "de3", name: "Ice Cream Scoop", price: 2.50, category: "DESSERT", image: "", stock: 40 },
  { id: "de4", name: "Tiramisu", price: 7.00, category: "DESSERT", image: "", stock: 40 },
  { id: "de5", name: "Panna Cotta", price: 6.50, category: "DESSERT", image: "", stock: 40 },
  { id: "de6", name: "Crème Brûlée", price: 7.50, category: "DESSERT", image: "", stock: 40 },
  { id: "de7", name: "Fruit Tart", price: 5.50, category: "DESSERT", image: "", stock: 40 },
  { id: "de8", name: "Sorbet", price: 4.50, category: "DESSERT", image: "", stock: 40 },

  // SPECIALS
  { id: "sp1", name: "Chef's Special", price: 25.00, category: "SPECIALS", image: "", stock: 10 },
  { id: "sp2", name: "Catch of the Day", price: 19.00, category: "SPECIALS", image: "", stock: 10 },
  { id: "sp3", name: "Seasonal Risotto", price: 16.00, category: "SPECIALS", image: "", stock: 10 },
  { id: "sp4", name: "Truffle Pasta", price: 18.00, category: "SPECIALS", image: "", stock: 10 },

  // PROMO
  { id: "pr1", name: "Lunch Deal", price: 12.00, category: "PROMO", image: "", stock: 100 },
  { id: "pr2", name: "Happy Hour Beer", price: 3.00, category: "PROMO", image: "", stock: 100 },
  { id: "pr3", name: "Coffee & Cake", price: 7.50, category: "PROMO", image: "", stock: 100 },

  // KIDS
  { id: "k1", name: "Kids Burger", price: 7.00, category: "KIDS", image: "", stock: 30 },
  { id: "k2", name: "Kids Pasta", price: 6.00, category: "KIDS", image: "", stock: 30 },
  { id: "k3", name: "Chicken Nuggets", price: 6.50, category: "KIDS", image: "", stock: 30 },
  { id: "k4", name: "Kids Pizza", price: 7.50, category: "KIDS", image: "", stock: 30 },

  // MISC
  { id: "m1", name: "Paper Bag", price: 0.10, category: "MISC", image: "", stock: 1000 },
  { id: "m2", name: "Extra Sauce", price: 0.50, category: "MISC", image: "", stock: 1000 },
  { id: "m3", name: "Takeaway Box", price: 0.25, category: "MISC", image: "", stock: 1000 },
  { id: "m4", name: "Gift Card $25", price: 25.00, category: "MISC", image: "", stock: 1000 },
  { id: "m5", name: "Gift Card $50", price: 50.00, category: "MISC", image: "", stock: 1000 }
];
