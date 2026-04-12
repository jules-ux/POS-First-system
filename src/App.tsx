/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TopBar } from "./components/TopBar";
import { ProductGrid } from "./components/ProductGrid";
import { OrderPanel } from "./components/OrderPanel";
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

  const [pendingQty, setPendingQty] = useState("");
  const [isNegative, setIsNegative] = useState(false);

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
            className="absolute top-0 left-0 overflow-hidden"
            style={{ 
              width: '200%', 
              height: '200%', 
              minWidth: '200%',
              minHeight: '200%',
              transform: 'scale(0.50)',
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


