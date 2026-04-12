/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { ProductGrid } from "./components/ProductGrid";
import { OrderPanel } from "./components/OrderPanel";
import { ShoppingCart, X, Menu, SplitSquareHorizontal, Tag, Minus, XCircle, LayoutDashboard, Store } from "lucide-react";
import { StoreLogin } from "./components/StoreLogin";
import { StaffLogin } from "./components/StaffLogin";
import { SplitView } from "./components/SplitView";
import { CouponView } from "./components/CouponView";
import { Product, CartItem, Staff, PRODUCTS, CATEGORIES } from "@/src/types";
import { AnimatePresence, motion } from "motion/react";
import { Printer, DoorOpen, LogOut, Delete, CreditCard, Utensils, Copy, Badge, Edit3, MessageSquare, BookOpen, UserCheck, Plus, Trash2, Wallet, Users, Bell, Send, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppStep = "store-login" | "staff-login" | "pos";
type POSMode = "NONE" | "SPLIT" | "COUPON" | "TABLES";

const randomId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// --- DESKTOP SPECIFIC COMPONENTS ---

function DesktopNavBlock({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void; key?: string | number }) {
  return (
    <button 
      onClick={onClick}
      className={`w-[10vh] h-[10vh] flex flex-col items-center justify-center gap-[1vh] border-b border-zinc-200 transition-colors shrink-0
        ${active ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'}
      `}
    >
      <span className="text-[1.2vh] font-black uppercase tracking-widest text-center px-[1vh]">{label}</span>
    </button>
  );
}

function DesktopActionBlock({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-[10vh] h-[10vh] flex flex-col items-center justify-center gap-[1vh] bg-zinc-50 text-zinc-500 border-b border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 transition-colors shrink-0"
    >
      <Icon className="w-[3vh] h-[3vh]" />
      <span className="text-[1vh] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function DesktopQuickShortcut({ label, icon: Icon, accent, orange, active, onClick }: { label: string; icon: any; accent?: boolean; orange?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-[10vh] h-[10vh] flex flex-col items-center justify-center gap-[1vh] border-r border-b border-zinc-200 transition-all shrink-0
        ${active ? 'border-zinc-900 bg-zinc-900 text-white' : 
          orange ? 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600' :
          accent ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200' : 
          'bg-white text-zinc-600 hover:bg-zinc-50'}
      `}
    >
      <Icon className={`w-[3vh] h-[3vh] ${active || orange ? 'text-white' : accent ? 'text-zinc-900' : 'text-zinc-400'}`} />
      <span className="text-[1vh] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function DesktopProductGrid({ onAddToCart, selectedCategory }: { onAddToCart: (p: Product) => void, selectedCategory: string }) {
  const filteredProducts = PRODUCTS.filter(p => p.category === selectedCategory);
  
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-50 custom-scrollbar p-[2vh]">
      <div className="flex flex-wrap gap-[2vh] pb-[10vh]">
        {filteredProducts.map((product) => (
          <button 
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="w-[10vh] h-[10vh] bg-white rounded-[2vh] border border-zinc-200 flex flex-col items-center justify-center text-center gap-[1vh] transition-all active:scale-95 group shrink-0"
          >
            <div className="flex flex-col gap-[0.5vh]">
              <span className="font-black text-zinc-900 text-[1.4vh] leading-tight px-[1vh]">{product.name}</span>
              <span className="text-zinc-500 font-black text-[1.6vh]">Qty: {product.stock}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DesktopNumberPad({ value, isNegative, onValueChange, onToggleNegative, onClear }: any) {
  const handleNumber = (num: string) => {
    if (value.length < 4) {
      onValueChange(value + num);
    }
  };

  return (
    <div className="w-[30vh] h-full bg-white text-zinc-900 flex flex-col shrink-0 border-l border-zinc-200">
      <div className="flex-1 grid grid-cols-3 grid-rows-4">
        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="border-r border-b border-zinc-200 text-[4vh] font-black hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
          >
            {num}
          </button>
        ))}
        <button
          onClick={onToggleNegative}
          className="border-r border-zinc-200 text-[3.5vh] font-black hover:bg-zinc-100 active:bg-zinc-200 transition-colors text-zinc-400"
        >
          +/-
        </button>
        <button
          onClick={() => handleNumber("0")}
          className="border-r border-zinc-200 text-[4vh] font-black hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
        >
          0
        </button>
        <button
          onClick={onClear}
          className="text-[3.5vh] font-black hover:bg-zinc-100 active:bg-zinc-200 transition-colors text-red-500"
        >
          C
        </button>
      </div>
    </div>
  );
}

function DesktopOrderPanel({ cart, discounts, onRemoveSelected, selectedItemId, onSelect, onClear, onCheckout }: any) {
  const subtotal = cart.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const discountAmount = discounts.reduce((acc: number, d: any) => {
    if (d.type === 'percentage') return acc + (subtotal * (d.value / 100));
    return acc + d.value;
  }, 0);
  const total = Math.max(0, subtotal - discountAmount);

  return (
    <aside className="w-[40vh] bg-white border-l border-zinc-200 flex flex-col shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.02)]">
      <div className="h-[10vh] px-[2vh] flex items-center justify-between border-b border-zinc-200 bg-zinc-50/50 shrink-0">
        <div className="flex items-center gap-[1vh]">
          <ShoppingCart className="w-[2.5vh] h-[2.5vh] text-zinc-900" />
          <h2 className="font-black text-[2vh] text-zinc-900 tracking-tight">Current Order</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemoveSelected} className="text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-[1.5vh] h-[4vh] w-[4vh]">
          <Trash2 className="w-[2vh] h-[2vh]" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-[2vh] flex flex-col gap-[1vh] custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 gap-[2vh]">
            <ShoppingCart className="w-[6vh] h-[6vh] opacity-20" />
            <p className="font-black uppercase tracking-widest text-[1.2vh]">Cart is empty</p>
          </div>
        ) : (
          cart.map((item: any) => (
            <button 
              key={item.cartItemId} 
              onClick={() => onSelect(item.cartItemId)}
              className={`bg-white border rounded-[2vh] p-[1.5vh] flex flex-col gap-[1.5vh] shadow-sm transition-all ${selectedItemId === item.cartItemId ? 'border-orange-500 ring-2 ring-orange-200' : 'border-zinc-200'}`}
            >
              <div className="flex justify-between items-start gap-[1vh]">
                <span className="font-black text-zinc-900 text-[1.6vh] leading-tight">{item.name}</span>
                <span className="font-black text-zinc-500 text-[1.6vh]">Qty: {item.quantity}</span>
              </div>
            </button>
          ))
        )}
      </div>

      {discounts.length > 0 && (
        <div className="max-h-[20vh] overflow-y-auto border-t border-zinc-200 bg-orange-50/30 p-[2vh] flex flex-col gap-[1vh] custom-scrollbar shrink-0">
          <h3 className="text-[1vh] font-black text-orange-600 uppercase tracking-widest">Applied Discounts</h3>
          {discounts.map((discount: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center bg-white border border-orange-100 rounded-[1vh] p-[1vh] shadow-sm">
              <span className="text-[1.2vh] font-bold text-orange-900">{discount.label}</span>
              <span className="text-[1.2vh] font-black text-orange-600">
                -{discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value.toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border-t border-zinc-200 p-[2vh] flex flex-col gap-[2vh] shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col gap-[1vh]">
          <div className="flex justify-between items-center text-zinc-500">
            <span className="text-[1.4vh] font-bold">Subtotal</span>
            <span className="text-[1.4vh] font-black">${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-orange-500">
              <span className="text-[1.4vh] font-bold">Discount</span>
              <span className="text-[1.4vh] font-black">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-[1vh] border-t border-zinc-100">
            <span className="text-[2vh] font-black text-zinc-900">Total</span>
            <span className="text-[3vh] font-black text-orange-500 tracking-tighter">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full h-[8vh] text-[2vh] font-black rounded-[2vh] bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-200 transition-all active:scale-95"
          onClick={onCheckout}
          disabled={cart.length === 0}
        >
          CHECKOUT
        </Button>
      </div>
    </aside>
  );
}

function DesktopTopBar({ staff }: { staff: Staff | null }) {
  return (
    <header className="h-[10vh] bg-white border-b border-zinc-200 flex items-center justify-between px-[3vh] shrink-0 z-10">
      <div className="flex items-center gap-[2vh]">
        <div className="w-[5vh] h-[5vh] bg-zinc-900 rounded-[1.5vh] flex items-center justify-center shadow-lg shadow-zinc-200">
          <Store className="w-[2.5vh] h-[2.5vh] text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[2vh] font-black text-zinc-900 tracking-tight leading-none">Lumina POS</h1>
          <span className="text-[1.2vh] font-bold text-zinc-400 uppercase tracking-widest mt-[0.5vh]">Terminal 01</span>
        </div>
      </div>

      <div className="flex items-center gap-[2vh]">
        <div className="flex items-center gap-[1.5vh] bg-zinc-50 px-[2vh] py-[1vh] rounded-[1.5vh] border border-zinc-200">
          <div className="w-[1vh] h-[1vh] rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
          <span className="text-[1.2vh] font-black text-zinc-600 uppercase tracking-widest">System Online</span>
        </div>
        
        {staff && (
          <div className="flex items-center gap-[1.5vh] pl-[2vh] border-l border-zinc-200">
            <div className="flex flex-col items-end">
              <span className="text-[1.4vh] font-black text-zinc-900 leading-none">{staff.name}</span>
              <span className="text-[1vh] font-bold text-zinc-400 uppercase tracking-widest mt-[0.5vh]">{staff.role}</span>
            </div>
            <div className="w-[5vh] h-[5vh] rounded-[1.5vh] bg-orange-100 border-2 border-orange-200 flex items-center justify-center">
              <span className="text-[1.6vh] font-black text-orange-700">
                {staff.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default function App() {
  const [step, setStep] = useState<AppStep>("store-login");
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("FOOD");
  
  const [activeMode, setActiveMode] = useState<POSMode>("NONE");
  const [pendingMode, setPendingMode] = useState<POSMode>("NONE");
  const [exitWarningMode, setExitWarningMode] = useState<POSMode>("NONE");

  const [splitCart, setSplitCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [discounts, setDiscounts] = useState<{ type: 'percentage' | 'fixed', value: number, label: string }[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [pendingQty, setPendingQty] = useState("");
  const [isNegative, setIsNegative] = useState(false);

  const [showMobileCart, setShowMobileCart] = useState(false);
  const [mobileDiscountType, setMobileDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [mobileDiscountValue, setMobileDiscountValue] = useState("");

  const handleStaffLogin = (staff: Staff) => {
    setCurrentStaff(staff);
    setStep("pos");
  };

  const handleAddToCart = (product: Product) => {
    const qty = parseInt(pendingQty) || 1;
    const finalQty = isNegative ? -qty : qty;

    setCart((prev) => [
      ...prev,
      { ...product, cartItemId: randomId(), quantity: finalQty }
    ]);

    // Reset quantity selection
    setPendingQty("");
    setIsNegative(false);
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity !== 0)
    );
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscounts([]);
  };

  const handleAddDiscount = (type: 'percentage' | 'fixed', value: number, label: string) => {
    setDiscounts(prev => [...prev, { type, value, label }]);
  };

  const hasChanges = (mode: POSMode) => {
    if (mode === "SPLIT") return splitCart.length > 0;
    if (mode === "COUPON") return pendingQty !== "" || couponCode !== "";
    return false;
  };

  const requestMode = (mode: POSMode) => {
    if (activeMode === mode) {
      if (hasChanges(mode)) {
        setPendingMode("NONE");
        setExitWarningMode(mode);
      } else {
        setActiveMode("NONE");
      }
      return;
    }

    if (activeMode !== "NONE" && hasChanges(activeMode)) {
      setPendingMode(mode);
      setExitWarningMode(activeMode);
    } else {
      setActiveMode(mode);
      setPendingMode("NONE");
      setExitWarningMode("NONE");
    }
  };

  const handleQuickSale = () => {
    if (cart.length === 0) return;
    // In a real app, this would send to printer/backend
    handleClearCart();
    setPendingQty("");
    setIsNegative(false);
    setStep("pos");
  };

  const handleCompleteCheckout = () => {
    if (cart.length === 0) return;
    setStep("checkout");
  };

  const handleRemoveDiscount = (index: number) => {
    setDiscounts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-white overflow-hidden font-sans selection:bg-orange-100 selection:text-orange-900">
      <AnimatePresence mode="wait">
        {step === "store-login" && (
          <motion.div
            key="store-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="w-full h-full"
          >
            <StoreLogin onLogin={() => setStep("staff-login")} />
          </motion.div>
        )}

        {step === "staff-login" && (
          <motion.div
            key="staff-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="w-full h-full"
          >
            <StaffLogin 
              onLogin={handleStaffLogin} 
              onBack={() => setStep("store-login")}
            />
          </motion.div>
        )}

        {step === "pos" && (
          <motion.div
            key="pos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
            className="w-full h-full relative bg-zinc-50"
          >
            {/* --- MOBILE VIEW (< 768px) --- */}
            <div className="flex md:hidden w-full h-full flex-col relative z-10 bg-zinc-50">
              {/* Mobile Header */}
              <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                    <span className="text-xs font-bold text-zinc-600">
                      {currentStaff?.name.slice(0,2).toUpperCase() || 'AR'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-zinc-900 text-sm leading-tight">{currentStaff?.name || 'Alex Rivera'}</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">POS Active</span>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowMobileCart(true)} className="relative rounded-xl border-zinc-200">
                  <ShoppingCart className="w-5 h-5 text-zinc-700" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 text-white text-[10px] font-black flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </Button>
              </header>

              {/* Mobile Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {activeMode === "POS" || activeMode === "NONE" ? (
                  <>
                    {/* Horizontal Categories */}
                    <div className="bg-white border-b border-zinc-200 py-3 px-4 overflow-x-auto scrollbar-hide shrink-0 shadow-sm z-10">
                      <div className="flex gap-2">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-black whitespace-nowrap transition-all ${
                              selectedCategory === cat 
                                ? 'bg-zinc-900 text-white shadow-md' 
                                : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                      <div className="grid grid-cols-2 gap-3 pb-20">
                        {PRODUCTS.filter(p => p.category === selectedCategory).map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleAddToCart(product)}
                            className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col gap-3 text-left active:scale-95 transition-transform shadow-sm"
                          >
                            <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center mb-1">
                              <Plus className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-zinc-900 leading-tight mb-1">{product.name}</span>
                              <span className="text-orange-500 font-black">${product.price.toFixed(2)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : activeMode === "SPLIT" ? (
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-200 mb-6">
                      <h3 className="font-black text-xl text-zinc-900 mb-1">Partial Bill</h3>
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Items to pay separately</p>
                      <div className="space-y-2">
                        {splitCart.length === 0 ? (
                          <div className="py-10 text-center border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 font-black text-sm uppercase tracking-widest">
                            No items selected
                          </div>
                        ) : (
                          splitCart.map(item => (
                            <div key={item.cartItemId} className="flex justify-between items-center p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                              <span className="font-black text-orange-900">{item.quantity}x {item.name}</span>
                              <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-100 rounded-xl" onClick={() => {
                                setSplitCart(prev => {
                                  const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                  if (!existing) return prev;
                                  if (existing.quantity === 1) return prev.filter(i => i.cartItemId !== item.cartItemId);
                                  return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity - 1 } : i);
                                });
                                setCart(prev => {
                                  const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                  if (existing) return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
                                  return [...prev, { ...item, quantity: 1 }];
                                });
                              }}>Remove</Button>
                            </div>
                          ))
                        )}
                      </div>
                      {splitCart.length > 0 && (
                        <Button className="w-full mt-4 h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-lg shadow-orange-200" onClick={() => {
                          setSplitCart([]);
                          setActiveMode("POS");
                        }}>
                          PAY PARTIAL (${splitCart.reduce((a,b) => a + b.price * b.quantity, 0).toFixed(2)})
                        </Button>
                      )}
                    </div>

                    <h3 className="font-black text-sm text-zinc-400 uppercase tracking-widest mb-3 px-2">Main Order</h3>
                    <div className="space-y-2 pb-20">
                      {cart.map(item => (
                        <div key={item.cartItemId} className="flex justify-between items-center p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                          <span className="font-black text-zinc-900">{item.quantity}x {item.name}</span>
                          <Button size="sm" variant="outline" className="rounded-xl font-bold" onClick={() => {
                            setCart(prev => {
                              const existing = prev.find(i => i.cartItemId === item.cartItemId);
                              if (!existing) return prev;
                              if (existing.quantity === 1) return prev.filter(i => i.cartItemId !== item.cartItemId);
                              return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity - 1 } : i);
                            });
                            setSplitCart(prev => {
                              const existing = prev.find(i => i.cartItemId === item.cartItemId);
                              if (existing) return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
                              return [...prev, { ...item, quantity: 1 }];
                            });
                          }}>Move 1</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-zinc-200 mb-6 space-y-4">
                      <h3 className="font-black text-sm text-zinc-400 uppercase tracking-widest">Custom Discount</h3>
                      <div className="flex gap-2 p-1 bg-zinc-50 rounded-xl border border-zinc-200">
                        <button onClick={() => setMobileDiscountType('percentage')} className={`flex-1 h-10 rounded-lg font-black text-sm transition-all ${mobileDiscountType === 'percentage' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500'}`}>%</button>
                        <button onClick={() => setMobileDiscountType('fixed')} className={`flex-1 h-10 rounded-lg font-black text-sm transition-all ${mobileDiscountType === 'fixed' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500'}`}>$</button>
                      </div>
                      <div className="flex gap-2">
                        <input type="number" value={mobileDiscountValue} onChange={e => setMobileDiscountValue(e.target.value)} placeholder="0.00" className="flex-1 border-2 border-zinc-200 rounded-xl px-4 font-black text-lg focus:outline-none focus:border-zinc-900" />
                        <Button className="h-14 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black" onClick={() => {
                          if (mobileDiscountValue) {
                            handleAddDiscount(mobileDiscountType, parseFloat(mobileDiscountValue), `CUSTOM ${mobileDiscountType === 'percentage' ? mobileDiscountValue + '%' : '$' + mobileDiscountValue}`);
                            setMobileDiscountValue("");
                          }
                        }}>APPLY</Button>
                      </div>
                    </div>

                    <h3 className="font-black text-sm text-zinc-400 uppercase tracking-widest mb-3 px-2">Active Promos</h3>
                    <div className="space-y-2 pb-20">
                      {[
                        { id: 'happy-hour', label: 'HAPPY HOUR - 20%', type: 'percentage', value: 20 },
                        { id: 'lunch-deal', label: 'LUNCH DEAL - $5', type: 'fixed', value: 5 },
                        { id: 'staff-disc', label: 'STAFF DISCOUNT - 50%', type: 'percentage', value: 50 },
                      ].map(promo => (
                        <button key={promo.id} onClick={() => handleAddDiscount(promo.type as any, promo.value, promo.label)} className="w-full p-5 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left font-black text-zinc-900 flex justify-between items-center active:scale-95 transition-transform">
                          {promo.label}
                          <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center">
                            <Plus className="w-4 h-4 text-zinc-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Bottom Nav */}
              <div className="absolute bottom-0 left-0 w-full h-20 bg-white border-t border-zinc-200 flex items-center justify-around shrink-0 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <button onClick={() => setActiveMode('POS')} className={`flex flex-col items-center gap-1.5 w-20 ${activeMode === 'POS' || activeMode === 'NONE' ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  <LayoutDashboard className={`w-6 h-6 ${activeMode === 'POS' || activeMode === 'NONE' ? 'stroke-[3]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">POS</span>
                </button>
                <button onClick={() => setActiveMode('SPLIT')} className={`flex flex-col items-center gap-1.5 w-20 ${activeMode === 'SPLIT' ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  <SplitSquareHorizontal className={`w-6 h-6 ${activeMode === 'SPLIT' ? 'stroke-[3]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">SPLIT</span>
                </button>
                <button onClick={() => setActiveMode('COUPON')} className={`flex flex-col items-center gap-1.5 w-20 ${activeMode === 'COUPON' ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  <Tag className={`w-6 h-6 ${activeMode === 'COUPON' ? 'stroke-[3]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">COUPON</span>
                </button>
              </div>

              {/* Mobile Cart Overlay */}
              <AnimatePresence>
                {showMobileCart && (
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute inset-0 z-50 bg-zinc-50 flex flex-col"
                  >
                    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0 shadow-sm">
                      <h2 className="font-black text-xl text-zinc-900">Current Order</h2>
                      <Button variant="ghost" size="icon" onClick={() => setShowMobileCart(false)} className="rounded-full bg-zinc-100">
                        <X className="w-5 h-5 text-zinc-600 stroke-[3]" />
                      </Button>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-10 h-10 text-zinc-300" />
                          </div>
                          <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">Cart is empty</p>
                        </div>
                      ) : (
                        cart.map(item => (
                          <div key={item.cartItemId} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                            <div className="flex flex-col">
                              <span className="font-black text-zinc-900 text-lg leading-tight">{item.name}</span>
                              <span className="text-orange-500 font-black">${item.price.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-4 bg-zinc-50 p-1 rounded-xl border border-zinc-200">
                              <button className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-600 active:scale-95" onClick={() => handleUpdateQuantity(item.cartItemId, -1)}>
                                <Minus className="w-4 h-4 stroke-[3]" />
                              </button>
                              <span className="font-black text-lg w-6 text-center tabular-nums">{item.quantity}</span>
                              <button className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-zinc-600 active:scale-95" onClick={() => handleUpdateQuantity(item.cartItemId, 1)}>
                                <Plus className="w-4 h-4 stroke-[3]" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 bg-white border-t border-zinc-200 shrink-0 pb-safe space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                      <div className="flex justify-between items-center font-black text-xl">
                        <span>Total</span>
                        <span className="text-orange-500">${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                      </div>
                      <Button className="w-full h-14 text-lg font-black rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-200" onClick={() => { handleCompleteCheckout(); setShowMobileCart(false); }}>
                        COMPLETE CHECKOUT
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- TABLET VIEW (768px - 1023px) --- */}
            <div 
              className="hidden md:block lg:hidden absolute top-0 left-0 overflow-hidden"
              style={{ 
                width: '212.77%', 
                height: '212.77%', 
                minWidth: '212.77%',
                minHeight: '212.77%',
                transform: 'scale(0.47)',
                transformOrigin: 'top left'
              }}
            >
              <div className="w-full h-full flex">
              <main className="flex-1 flex flex-col min-w-0">
                <TopBar staff={currentStaff} />
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Section: Column 1 (Fixed) - ALWAYS VISIBLE */}
                  <div className="w-40 flex flex-col bg-zinc-50 border-r border-zinc-200 overflow-hidden shrink-0">
                    <div className="flex flex-col">
                      {CATEGORIES.slice(0, 5).map((cat) => (
                        <div key={cat}>
                          <NavBlock 
                            label={cat} 
                            active={selectedCategory === cat} 
                            onClick={() => setSelectedCategory(cat)}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto border-t border-zinc-200 flex flex-col">
                      <ActionBlock icon={Send} label="SEND" />
                      <ActionBlock icon={Printer} label="PRINT" />
                      <ActionBlock icon={DoorOpen} label="DRAWER" />
                      <ActionBlock 
                        icon={LogOut} 
                        label="OUT" 
                        onClick={() => {
                          setCurrentStaff(null);
                          setStep("staff-login");
                        }} 
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Area: Categories 6-10 + Product Grid OR Mode Views */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Column 2: Categories 6-10 (Always Visible) */}
                      {CATEGORIES.length > 5 && (
                        <div className="w-40 flex flex-col bg-zinc-50 border-r border-zinc-200 overflow-y-auto scrollbar-hide">
                          <div className="flex flex-col">
                            {CATEGORIES.slice(5, 10).map((cat) => (
                              <div key={cat}>
                                <NavBlock 
                                  label={cat} 
                                  active={selectedCategory === cat} 
                                  onClick={() => setSelectedCategory(cat)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex-1 relative overflow-hidden flex flex-col">
                        {activeMode === "SPLIT" ? (
                          <SplitView 
                            mainCart={cart}
                            splitCart={splitCart}
                            exitRequested={exitWarningMode === "SPLIT"}
                            onMoveToSplit={(item, qty) => {
                              setCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (!existing) return prev;
                                if (existing.quantity === qty) return prev.filter(i => i.cartItemId !== item.cartItemId);
                                return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity - qty } : i);
                              });
                              setSplitCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (existing) return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + qty } : i);
                                return [...prev, { ...item, quantity: qty }];
                              });
                            }}
                            onMoveToMain={(item, qty) => {
                              setSplitCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (!existing) return prev;
                                if (existing.quantity === qty) return prev.filter(i => i.cartItemId !== item.cartItemId);
                                return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity - qty } : i);
                              });
                              setCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (existing) return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + qty } : i);
                                return [...prev, { ...item, quantity: qty }];
                              });
                            }}
                            onPaySplit={() => {
                              setSplitCart([]);
                              setActiveMode("NONE");
                              setExitWarningMode("NONE");
                            }}
                            onCancel={() => requestMode("NONE")}
                            onConfirmExit={() => {
                              // Return all items from splitCart to cart
                              setCart(prev => {
                                let newCart = [...prev];
                                splitCart.forEach(item => {
                                  const existing = newCart.find(i => i.cartItemId === item.cartItemId);
                                  if (existing) {
                                    newCart = newCart.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i);
                                  } else {
                                    newCart.push(item);
                                  }
                                });
                                return newCart;
                              });
                              setSplitCart([]);
                              setActiveMode(pendingMode);
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                            onCancelExit={() => {
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                          />
                        ) : activeMode === "COUPON" ? (
                          <CouponView 
                            pendingValue={pendingQty}
                            discounts={discounts}
                            onRemoveDiscount={handleRemoveDiscount}
                            exitRequested={exitWarningMode === "COUPON"}
                            onApplyDiscount={(type, value, label) => {
                              setDiscounts(prev => [...prev, { type, value, label }]);
                              setPendingQty("");
                              setCouponCode("");
                            }}
                            onCancel={() => requestMode("NONE")}
                            onConfirmExit={() => {
                              setPendingQty("");
                              setCouponCode("");
                              setActiveMode(pendingMode);
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                            onCancelExit={() => {
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                          />
                        ) : activeMode === "TABLES" ? (
                          <div className="flex-1 flex items-center justify-center bg-zinc-50">
                            <div className="text-center space-y-4">
                              <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                                <Utensils className="w-12 h-12 text-zinc-300" />
                              </div>
                              <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-widest">Table Management</h3>
                              <p className="text-zinc-400 font-medium">Select a table to start an order</p>
                              <Button 
                                variant="outline" 
                                onClick={() => setActiveMode("NONE")}
                                className="mt-6 h-16 px-10 rounded-2xl border-2 border-zinc-200 font-black uppercase tracking-widest"
                              >
                                Back to POS
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <ProductGrid 
                            onAddToCart={handleAddToCart} 
                            selectedCategory={selectedCategory}
                          />
                        )}
                      </div>
                    </div>

                  {/* Bottom Area: Shortcuts and Number Pad (Always Visible) */}
                  <div className="h-[640px] border-t border-zinc-200 bg-white flex shrink-0">
                    <div className="flex-1 p-6 grid grid-cols-4 grid-rows-4 gap-3">
                      <QuickShortcut 
                        label="QUICK SALE" 
                        icon={CreditCard} 
                        orange
                        onClick={handleQuickSale}
                      />
                      <QuickShortcut 
                        label="TABLES" 
                        icon={Utensils} 
                        active={activeMode === "TABLES"}
                        onClick={() => requestMode("TABLES")}
                      />
                      <QuickShortcut 
                        label="SPLIT" 
                        icon={Copy} 
                        active={activeMode === "SPLIT"}
                        onClick={() => requestMode("SPLIT")}
                      />
                      <QuickShortcut 
                        label="COUPON" 
                        icon={Badge} 
                        active={activeMode === "COUPON"}
                        onClick={() => requestMode("COUPON")}
                      />
                      
                      <QuickShortcut label="EDIT" icon={Edit3} accent />
                      <QuickShortcut label="REPEAT" icon={Copy} accent />
                      <QuickShortcut label="NOTES" icon={MessageSquare} accent />
                      <QuickShortcut label="RECIPES" icon={BookOpen} accent />
                      
                      <QuickShortcut label="SEAT REV" icon={UserCheck} />
                      <QuickShortcut label="CUSTOM" icon={Plus} />
                      <QuickShortcut label="REFUND" icon={Trash2} />
                      <QuickShortcut label="GIFT" icon={Wallet} />

                      <QuickShortcut label="REPRINT" icon={Printer} />
                      <QuickShortcut label="MANAGER" icon={Users} />
                      <QuickShortcut label="SETTINGS" icon={LogOut} />
                      <QuickShortcut label="HELP" icon={Bell} />
                    </div>
                    <NumberPad 
                      value={pendingQty} 
                      isNegative={isNegative}
                      onValueChange={setPendingQty}
                      onToggleNegative={() => setIsNegative(!isNegative)}
                      onClear={() => {
                        setPendingQty("");
                        setIsNegative(false);
                      }}
                    />
                  </div>
                </div>
              </div>
            </main>

              {/* Right Section: Order Panel */}
              <OrderPanel 
                cart={cart} 
                discounts={discounts}
                onUpdateQuantity={handleUpdateQuantity} 
                onRemove={handleRemoveFromCart}
                onClear={handleClearCart}
                onCheckout={handleCompleteCheckout}
              />
            </div>
            </div>
            {/* --- DESKTOP VIEW (>= 1024px) --- */}
            <div 
              className="hidden lg:flex absolute top-0 left-0 w-full h-full bg-zinc-50 overflow-hidden"
            >
              <main className="flex-1 flex flex-col min-w-0">
                <DesktopTopBar staff={currentStaff} />
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Section: Column 1 (Fixed) - ALWAYS VISIBLE */}
                  <div className="w-[10vh] flex flex-col bg-zinc-50 border-r border-zinc-200 overflow-hidden shrink-0">
                    <div className="flex flex-col">
                      {CATEGORIES.slice(0, 5).map((cat) => (
                        <DesktopNavBlock 
                          key={cat}
                          label={cat} 
                          active={selectedCategory === cat} 
                          onClick={() => setSelectedCategory(cat)}
                        />
                      ))}
                    </div>
                    <div className="mt-auto border-t border-zinc-200 flex flex-col">
                      <DesktopActionBlock icon={Send} label="SEND" />
                      <DesktopActionBlock icon={Printer} label="PRINT" />
                      <DesktopActionBlock icon={DoorOpen} label="DRAWER" />
                      <DesktopActionBlock 
                        icon={LogOut} 
                        label="OUT" 
                        onClick={() => {
                          setCurrentStaff(null);
                          setStep("staff-login");
                        }} 
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Area: Categories 6-10 + Product Grid OR Mode Views */}
                    <div className="flex-1 flex overflow-hidden">
                      {/* Column 2: Categories 6-10 (Always Visible) */}
                      {CATEGORIES.length > 5 && (
                        <div className="w-[10vh] flex flex-col bg-zinc-50 border-r border-zinc-200 overflow-y-auto scrollbar-hide">
                          <div className="flex flex-col">
                            {CATEGORIES.slice(5, 10).map((cat) => (
                              <DesktopNavBlock 
                                key={cat}
                                label={cat} 
                                active={selectedCategory === cat} 
                                onClick={() => setSelectedCategory(cat)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex-1 relative overflow-hidden flex flex-col">
                        {activeMode === "SPLIT" ? (
                          <SplitView 
                            mainCart={cart}
                            splitCart={splitCart}
                            exitRequested={exitWarningMode === "SPLIT"}
                            onMoveToSplit={(item, qty) => {
                              setCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (!existing) return prev;
                                if (existing.quantity === qty) return prev.filter(i => i.cartItemId !== item.cartItemId);
                                return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity - qty } : i);
                              });
                              setSplitCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (existing) return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + qty } : i);
                                return [...prev, { ...item, quantity: qty }];
                              });
                            }}
                            onMoveToMain={(item, qty) => {
                              setSplitCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (!existing) return prev;
                                if (existing.quantity === qty) return prev.filter(i => i.cartItemId !== item.cartItemId);
                                return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity - qty } : i);
                              });
                              setCart(prev => {
                                const existing = prev.find(i => i.cartItemId === item.cartItemId);
                                if (existing) return prev.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + qty } : i);
                                return [...prev, { ...item, quantity: qty }];
                              });
                            }}
                            onPaySplit={() => {
                              setSplitCart([]);
                              setActiveMode("NONE");
                              setExitWarningMode("NONE");
                            }}
                            onCancel={() => requestMode("NONE")}
                            onConfirmExit={() => {
                              setCart(prev => {
                                let newCart = [...prev];
                                splitCart.forEach(item => {
                                  const existing = newCart.find(i => i.cartItemId === item.cartItemId);
                                  if (existing) {
                                    newCart = newCart.map(i => i.cartItemId === item.cartItemId ? { ...i, quantity: i.quantity + item.quantity } : i);
                                  } else {
                                    newCart.push(item);
                                  }
                                });
                                return newCart;
                              });
                              setSplitCart([]);
                              setActiveMode(pendingMode);
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                            onCancelExit={() => {
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                          />
                        ) : activeMode === "COUPON" ? (
                          <CouponView 
                            pendingValue={pendingQty}
                            discounts={discounts}
                            onRemoveDiscount={handleRemoveDiscount}
                            exitRequested={exitWarningMode === "COUPON"}
                            onApplyDiscount={(type, value, label) => {
                              setDiscounts(prev => [...prev, { type, value, label }]);
                              setPendingQty("");
                              setCouponCode("");
                            }}
                            onCancel={() => requestMode("NONE")}
                            onConfirmExit={() => {
                              setPendingQty("");
                              setCouponCode("");
                              setActiveMode(pendingMode);
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                            onCancelExit={() => {
                              setExitWarningMode("NONE");
                              setPendingMode("NONE");
                            }}
                          />
                        ) : activeMode === "TABLES" ? (
                          <div className="flex-1 flex items-center justify-center bg-zinc-50">
                            <div className="text-center space-y-4">
                              <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                                <Utensils className="w-12 h-12 text-zinc-300" />
                              </div>
                              <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-widest">Table Management</h3>
                              <p className="text-zinc-400 font-medium">Select a table to start an order</p>
                              <Button 
                                variant="outline" 
                                onClick={() => setActiveMode("NONE")}
                                className="mt-6 h-16 px-10 rounded-2xl border-2 border-zinc-200 font-black uppercase tracking-widest"
                              >
                                Back to POS
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <DesktopProductGrid 
                            onAddToCart={handleAddToCart} 
                            selectedCategory={selectedCategory}
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Area: Shortcuts and Number Pad (Always Visible) */}
                    <div className="h-[40vh] border-t border-zinc-200 bg-white flex shrink-0">
                      <div className="flex-1 grid grid-cols-[repeat(auto-fill,10vh)] grid-rows-4 content-start">
                        <DesktopQuickShortcut label="QUICK SALE" icon={CreditCard} orange onClick={handleQuickSale} />
                        <DesktopQuickShortcut label="TABLES" icon={Utensils} active={activeMode === "TABLES"} onClick={() => requestMode("TABLES")} />
                        <DesktopQuickShortcut label="SPLIT" icon={Copy} active={activeMode === "SPLIT"} onClick={() => requestMode("SPLIT")} />
                        <DesktopQuickShortcut label="COUPON" icon={Badge} active={activeMode === "COUPON"} onClick={() => requestMode("COUPON")} />
                        
                        <DesktopQuickShortcut label="EDIT" icon={Edit3} accent />
                        <DesktopQuickShortcut label="REPEAT" icon={Copy} accent />
                        <DesktopQuickShortcut label="NOTES" icon={MessageSquare} accent />
                        <DesktopQuickShortcut label="RECIPES" icon={BookOpen} accent />
                        
                        <DesktopQuickShortcut label="SEAT REV" icon={UserCheck} />
                        <DesktopQuickShortcut label="CUSTOM" icon={Plus} />
                        <DesktopQuickShortcut label="REFUND" icon={Trash2} />
                        <DesktopQuickShortcut label="GIFT" icon={Wallet} />

                        <DesktopQuickShortcut label="REPRINT" icon={Printer} />
                        <DesktopQuickShortcut label="MANAGER" icon={Users} />
                        <DesktopQuickShortcut label="SETTINGS" icon={LogOut} />
                        <DesktopQuickShortcut label="HELP" icon={Bell} />
                      </div>
                      <DesktopNumberPad 
                        value={pendingQty} 
                        isNegative={isNegative}
                        onValueChange={setPendingQty}
                        onToggleNegative={() => setIsNegative(!isNegative)}
                        onClear={() => {
                          setPendingQty("");
                          setIsNegative(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </main>

              {/* Right Section: Order Panel */}
              <DesktopOrderPanel 
                cart={cart} 
                discounts={discounts}
                onRemoveSelected={() => {
                  if (selectedItemId) {
                    handleRemoveFromCart(selectedItemId);
                    setSelectedItemId(null);
                  }
                }}
                selectedItemId={selectedItemId}
                onSelect={setSelectedItemId}
                onClear={handleClearCart}
                onCheckout={handleCompleteCheckout}
              />
            </div>
          </motion.div>
        )}

        {step === "checkout" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
            className="w-full h-full bg-zinc-50 flex flex-col items-center justify-center p-20"
          >
            <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl p-16 flex flex-col gap-12">
              <div className="flex justify-between items-center">
                <h2 className="text-5xl font-black text-zinc-900 tracking-tight">Payment Selection</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setStep("pos")}
                  className="text-zinc-400 hover:text-zinc-900 font-bold uppercase tracking-widest"
                >
                  Back to Order
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Order Summary</h3>
                  <div className="flex-1 border border-zinc-100 rounded-3xl p-8 flex flex-col gap-4">
                    {cart.map(item => (
                      <div key={item.cartItemId} className="flex justify-between items-center">
                        <span className="text-xl font-bold text-zinc-600">{item.quantity}x {item.name}</span>
                        <span className="text-xl font-black text-zinc-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="mt-auto pt-8 border-t border-zinc-100 flex justify-between items-end">
                      <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">Total Amount</span>
                      <span className="text-6xl font-black text-orange-500 tabular-nums tracking-tighter">
                        ${(() => {
                          const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
                          const discountAmount = discounts.reduce((acc, d) => {
                            if (d.type === 'percentage') return acc + (subtotal * (d.value / 100));
                            return acc + d.value;
                          }, 0);
                          const discountedSubtotal = Math.max(0, subtotal - discountAmount);
                          return (discountedSubtotal * 1.08).toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Select Payment Method</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Button 
                      onClick={handleQuickSale}
                      className="h-32 bg-zinc-900 hover:bg-zinc-800 text-white rounded-3xl flex items-center justify-between px-10 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                          <Banknote className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-black">CASH</p>
                          <p className="text-sm text-white/50 font-bold">Quick payment</p>
                        </div>
                      </div>
                      <Plus className="w-8 h-8 text-white/20 group-hover:text-white transition-colors" />
                    </Button>

                    <Button 
                      onClick={handleQuickSale}
                      className="h-32 bg-white border-2 border-zinc-100 hover:border-zinc-900 text-zinc-900 rounded-3xl flex items-center justify-between px-10 group transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center">
                          <CreditCard className="w-8 h-8 text-zinc-400 group-hover:text-zinc-900" />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-black">CARD</p>
                          <p className="text-sm text-zinc-400 font-bold">Terminal payment</p>
                        </div>
                      </div>
                      <Plus className="w-8 h-8 text-zinc-100 group-hover:text-zinc-900 transition-colors" />
                    </Button>

                    <Button 
                      onClick={() => {}}
                      className="h-32 bg-white border-2 border-zinc-100 hover:border-zinc-900 text-zinc-900 rounded-3xl flex items-center justify-between px-10 group transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center">
                          <Copy className="w-8 h-8 text-zinc-400 group-hover:text-zinc-900" />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-black">SPLIT</p>
                          <p className="text-sm text-zinc-400 font-bold">Divide bill</p>
                        </div>
                      </div>
                      <Plus className="w-8 h-8 text-zinc-100 group-hover:text-zinc-900 transition-colors" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
      `}} />
    </div>
  );
}

function NavBlock({ label, active = false, onClick }: { label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full h-40 flex items-center justify-center text-base font-black tracking-[0.2em] transition-none border-b border-zinc-100 ${
        active 
          ? "bg-zinc-900 text-white" 
          : "bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
      }`}
    >
      {label.toUpperCase()}
    </button>
  );
}

function ActionBlock({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full h-40 flex flex-col items-center justify-center gap-4 text-sm font-black tracking-widest transition-none border-b border-zinc-100 bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
    >
      <Icon className="w-10 h-10 stroke-[2.5]" />
      {label}
    </button>
  );
}

function QuickShortcut({ label, icon: Icon, active = false, accent = false, orange = false, onClick }: { label: string, icon?: any, active?: boolean, accent?: boolean, orange?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`h-full w-full border rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-none group ${
      active && !orange
        ? "bg-zinc-900 border-zinc-950 text-white shadow-xl shadow-zinc-200" 
        : orange
          ? "bg-white border-zinc-200 text-orange-500 hover:border-orange-500"
          : accent
            ? "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-zinc-300"
            : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900"
    }`}>
      {Icon && <Icon className={`w-12 h-12 stroke-[2.5] ${active && !orange ? "text-white" : orange ? "text-orange-500" : accent ? "text-zinc-500" : "text-zinc-300 group-hover:text-zinc-500"}`} />}
      <span className={`text-sm font-black tracking-widest uppercase ${active && !orange ? "text-white" : orange ? "text-orange-600" : accent ? "text-zinc-600" : "text-zinc-400 group-hover:text-zinc-900"}`}>{label}</span>
    </button>
  );
}

function NumberPad({ 
  value, 
  isNegative, 
  onValueChange, 
  onToggleNegative, 
  onClear 
}: { 
  value: string, 
  isNegative: boolean,
  onValueChange: (v: string) => void,
  onToggleNegative: () => void,
  onClear: () => void
}) {
  const handlePress = (num: string) => {
    onValueChange(value + num);
  };

  return (
    <div className="w-[500px] border-l border-zinc-200 p-8 grid grid-cols-3 gap-4 bg-zinc-50/30">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
        <Button 
          key={n} 
          variant="outline" 
          className="h-full text-4xl font-black bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 rounded-[2rem] shadow-sm transition-none"
          onClick={() => handlePress(n.toString())}
        >
          {n}
        </Button>
      ))}
      <Button 
        variant="outline" 
        className="h-full text-4xl font-black bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 rounded-[2rem] shadow-sm transition-none"
        onClick={() => handlePress("9")}
      >
        9
      </Button>
      <Button 
        variant="outline" 
        className="h-full text-zinc-400 hover:text-red-500 rounded-[2rem] transition-none"
        onClick={onClear}
      >
        <Delete className="w-12 h-12" />
      </Button>
      <Button 
        variant="outline" 
        className="h-full text-4xl font-black bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 rounded-[2rem] shadow-sm transition-none"
        onClick={() => handlePress("0")}
      >
        0
      </Button>
      <Button 
        variant="outline" 
        className={`h-full text-5xl font-black rounded-[2rem] transition-none ${isNegative ? "bg-red-500 text-white border-red-600" : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900"}`}
        onClick={onToggleNegative}
      >
        -
      </Button>
    </div>
  );
}


