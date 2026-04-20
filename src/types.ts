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

export const CATEGORIES = ["Fries", "Snacks", "Burgers", "Spicy", "Vegan", "Drinks", "Sauces", "Homemade"];

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
  // FRIES
  { id: "fr1", name: "Small Fries", price: 3.00, category: "Fries", image: "", stock: 100 },
  { id: "fr2", name: "Medium Fries", price: 3.50, category: "Fries", image: "", stock: 100 },
  { id: "fr3", name: "Large Fries", price: 4.00, category: "Fries", image: "", stock: 100 },
  { id: "fr4", name: "Family Pack", price: 10.00, category: "Fries", image: "", stock: 100 },
  { id: "fr5", name: "Fries w/ Stew", price: 6.50, category: "Fries", image: "", stock: 50, ingredients: ["Stew Sauce", "Mayonnaise"] },
  { id: "fr6", name: "Fries w/ Goulash", price: 6.50, category: "Fries", image: "", stock: 50, ingredients: ["Goulash Sauce"] },

  // SNACKS
  { id: "sn1", name: "Frikandel", price: 2.20, category: "Snacks", image: "", stock: 200 },
  { id: "sn2", name: "Frikandel Special", price: 3.00, category: "Snacks", image: "", stock: 200, ingredients: ["Mayonnaise", "Curry Ketchup", "Onions"] },
  { id: "sn3", name: "Beef Kroket", price: 2.50, category: "Snacks", image: "", stock: 150 },
  { id: "sn4", name: "Cheese Kroket", price: 2.80, category: "Snacks", image: "", stock: 150 },
  { id: "sn5", name: "Shrimp Kroket", price: 3.50, category: "Snacks", image: "", stock: 100 },
  { id: "sn6", name: "Viandel", price: 2.50, category: "Snacks", image: "", stock: 150 },
  { id: "sn7", name: "Kipkorn", price: 2.50, category: "Snacks", image: "", stock: 150 },
  { id: "sn8", name: "Cervela", price: 3.00, category: "Snacks", image: "", stock: 100 },
  { id: "sn9", name: "Bitterballen (6)", price: 4.50, category: "Snacks", image: "", stock: 100 },
  { id: "sn10", name: "Sitostick", price: 3.20, category: "Snacks", image: "", stock: 100 },

  // BURGERS
  { id: "bg1", name: "Bicky Burger", price: 4.50, category: "Burgers", image: "", stock: 100, ingredients: ["Bicky Yellow", "Bicky Brown", "Bicky Red", "Onions", "Cucumber"] },
  { id: "bg2", name: "Bicky Cheese", price: 5.00, category: "Burgers", image: "", stock: 100, ingredients: ["Cheese", "Bicky Sauce", "Onions", "Cucumber"] },
  { id: "bg3", name: "Bicky Bacon", price: 5.50, category: "Burgers", image: "", stock: 100, ingredients: ["Bacon", "Bicky Sauce", "Onions", "Cucumber"] },
  { id: "bg4", name: "Cheese Burger", price: 5.00, category: "Burgers", image: "", stock: 100, ingredients: ["Cheese", "Lettuce", "Tomato", "Onion", "Pickles"] },
  { id: "bg5", name: "Chicken Burger", price: 4.80, category: "Burgers", image: "", stock: 100, ingredients: ["Lettuce", "Mayonnaise"] },

  // SPICY
  { id: "sp1", name: "Mexicano", price: 2.80, category: "Spicy", image: "", stock: 150 },
  { id: "sp2", name: "Lucifer", price: 3.00, category: "Spicy", image: "", stock: 100 },
  { id: "sp3", name: "Vlammetjes (6)", price: 5.00, category: "Spicy", image: "", stock: 100 },
  { id: "sp4", name: "Spicy Nuggets (6)", price: 4.50, category: "Spicy", image: "", stock: 100 },

  // VEGAN
  { id: "vg1", name: "Vegan Frikandel", price: 2.50, category: "Vegan", image: "", stock: 100 },
  { id: "vg2", name: "Vegan Kroket", price: 3.00, category: "Vegan", image: "", stock: 100 },
  { id: "vg3", name: "Vegan Burger", price: 5.50, category: "Vegan", image: "", stock: 100, ingredients: ["Lettuce", "Tomato", "Vegan Mayo"] },
  { id: "vg4", name: "Vegan Nuggets (6)", price: 5.00, category: "Vegan", image: "", stock: 100 },

  // DRINKS
  { id: "dr1", name: "Coca-Cola", price: 2.50, category: "Drinks", image: "", stock: 500 },
  { id: "dr2", name: "Coca-Cola Zero", price: 2.50, category: "Drinks", image: "", stock: 500 },
  { id: "dr3", name: "Fanta Orange", price: 2.50, category: "Drinks", image: "", stock: 500 },
  { id: "dr4", name: "Sprite", price: 2.50, category: "Drinks", image: "", stock: 500 },
  { id: "dr5", name: "Jupiler", price: 3.00, category: "Drinks", image: "", stock: 500 },
  { id: "dr6", name: "Spa Blue", price: 2.20, category: "Drinks", image: "", stock: 500 },
  { id: "dr7", name: "Spa Red", price: 2.20, category: "Drinks", image: "", stock: 500 },
  { id: "dr8", name: "Ice Tea", price: 2.80, category: "Drinks", image: "", stock: 500 },

  // SAUCES
  { id: "ot1", name: "Mayonnaise", price: 0.80, category: "Sauces", image: "", stock: 1000 },
  { id: "ot2", name: "Ketchup", price: 0.80, category: "Sauces", image: "", stock: 1000 },
  { id: "ot3", name: "Curry Ketchup", price: 0.80, category: "Sauces", image: "", stock: 1000 },
  { id: "ot4", name: "Andalouse", price: 1.00, category: "Sauces", image: "", stock: 1000 },
  { id: "ot5", name: "Samurai", price: 1.00, category: "Sauces", image: "", stock: 1000 },
  { id: "ot6", name: "Joppie Sauce", price: 1.00, category: "Sauces", image: "", stock: 1000 },
  { id: "ot7", name: "Tartare", price: 1.00, category: "Sauces", image: "", stock: 1000 },
  { id: "ot8", name: "Pickles", price: 1.00, category: "Sauces", image: "", stock: 1000 },
  { id: "ot9", name: "Stoofvlees Sauce", price: 1.50, category: "Sauces", image: "", stock: 500 },

  // HOMEMADE
  { id: "hm1", name: "Homemade Tartare", price: 1.20, category: "Homemade", image: "", stock: 100 },
  { id: "hm2", name: "Homemade Stew", price: 7.50, category: "Homemade", image: "", stock: 50, ingredients: ["Beef", "Beer Sauce", "Onions"] },
  { id: "hm3", name: "Homemade Meatballs (2)", price: 6.00, category: "Homemade", image: "", stock: 50, ingredients: ["Tomato Sauce"] },
  { id: "hm4", name: "Homemade Vol-au-Vent", price: 8.00, category: "Homemade", image: "", stock: 50, ingredients: ["Chicken", "Mushrooms", "Cream Sauce"] },
  { id: "hm5", name: "Homemade Goulash", price: 7.50, category: "Homemade", image: "", stock: 50 },
];
