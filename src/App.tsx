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

export default function App() {
  const [step, setStep] = useState<AppStep>("store-login");
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("FOOD");
  const [isSplitMode, setIsSplitMode] = useState(false);
  const [isCouponMode, setIsCouponMode] = useState(false);
  const [splitCart, setSplitCart] = useState<CartItem[]>([]);
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
      { ...product, cartItemId: crypto.randomUUID(), quantity: finalQty }
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
    // For now, just a placeholder as requested to remove the previous view
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
            className="w-full h-full relative"
          >
            <div className="absolute top-0 left-0 w-[166.66%] h-[166.66%] origin-top-left scale-[0.6] flex">
              <main className="flex-1 flex flex-col min-w-0">
                <TopBar staff={currentStaff} />
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Section: Column 1 (Fixed) */}
                  <div className="w-32 flex flex-col bg-zinc-50 border-r border-zinc-200 overflow-hidden">
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

                  {/* Middle Section: Product Grid, Second Category Column, and Bottom Panel */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 flex overflow-hidden">
                      {isSplitMode ? (
                        <SplitView 
                          mainCart={cart}
                          splitCart={splitCart}
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
                            setIsSplitMode(false);
                          }}
                          onCancel={() => {
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
                            setIsSplitMode(false);
                          }}
                        />
                      ) : isCouponMode ? (
                        <CouponView 
                          pendingValue={pendingQty}
                          onApplyDiscount={(type, value, label) => {
                            setDiscounts(prev => [...prev, { type, value, label }]);
                            setPendingQty("");
                            setIsCouponMode(false);
                          }}
                          onCancel={() => {
                            setPendingQty("");
                            setIsCouponMode(false);
                          }}
                        />
                      ) : (
                        <>
                          {/* Column 2: Categories 6-10 (Only at the top) */}
                          {CATEGORIES.length > 5 && (
                            <div className="w-32 flex flex-col bg-zinc-50 border-r border-zinc-200 overflow-y-auto scrollbar-hide">
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
                          <ProductGrid 
                            onAddToCart={handleAddToCart} 
                            selectedCategory={selectedCategory}
                          />
                        </>
                      )}
                    </div>
                    <div className="h-[512px] border-t border-zinc-200 bg-white flex">
                      <div className="flex-1 p-6 grid grid-cols-4 grid-rows-4 gap-3">
                        <QuickShortcut 
                          label="QUICK SALE" 
                          icon={CreditCard} 
                          active 
                          onClick={handleQuickSale}
                        />
                        <QuickShortcut label="TABLES" icon={Utensils} />
                        <QuickShortcut 
                          label="SPLIT" 
                          icon={Copy} 
                          onClick={() => setIsSplitMode(true)}
                        />
                        <QuickShortcut 
                          label="COUPON" 
                          icon={Badge} 
                          onClick={() => setIsCouponMode(true)}
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
              </main>
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
                        ${(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 1.08).toFixed(2)}
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
      className={`w-full h-32 flex items-center justify-center text-xs font-bold tracking-[0.2em] transition-none border-b border-zinc-100 ${
        active 
          ? "bg-zinc-100 text-zinc-900" 
          : "bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
      }`}
    >
      {label}
    </button>
  );
}

function ActionBlock({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full h-32 flex flex-col items-center justify-center gap-2 text-[10px] font-bold tracking-widest transition-none border-b border-zinc-100 bg-white text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
    >
      <Icon className="w-6 h-6" />
      {label}
    </button>
  );
}

function QuickShortcut({ label, icon: Icon, active = false, accent = false, onClick }: { label: string, icon?: any, active?: boolean, accent?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`h-full w-full border rounded-2xl flex flex-col items-center justify-center gap-2 transition-none group ${
      active 
        ? "bg-zinc-900 border-zinc-950 text-white shadow-lg shadow-zinc-200" 
        : accent
          ? "bg-zinc-50 border-zinc-100 text-zinc-600 hover:border-zinc-300"
          : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-900"
    }`}>
      {Icon && <Icon className={`w-8 h-8 ${active ? "text-white" : accent ? "text-zinc-500" : "text-zinc-300 group-hover:text-zinc-500"}`} />}
      <span className={`text-[10px] font-black tracking-widest ${active ? "text-white" : accent ? "text-zinc-600" : "text-zinc-400 group-hover:text-zinc-900"}`}>{label}</span>
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
    <div className="w-[450px] border-l border-zinc-200 p-6 grid grid-cols-3 gap-3 bg-zinc-50/30">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
        <Button 
          key={n} 
          variant="outline" 
          className="h-full text-3xl font-black bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 rounded-2xl shadow-sm transition-none"
          onClick={() => handlePress(n.toString())}
        >
          {n}
        </Button>
      ))}
      <Button 
        variant="outline" 
        className="h-full text-3xl font-black bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 rounded-2xl shadow-sm transition-none"
        onClick={() => handlePress("9")}
      >
        9
      </Button>
      <Button 
        variant="outline" 
        className="h-full text-zinc-400 hover:text-red-500 rounded-2xl transition-none"
        onClick={onClear}
      >
        <Delete className="w-10 h-10" />
      </Button>
      <Button 
        variant="outline" 
        className="h-full text-3xl font-black bg-white border-zinc-200 hover:border-zinc-900 hover:text-zinc-900 rounded-2xl shadow-sm transition-none"
        onClick={() => handlePress("0")}
      >
        0
      </Button>
      <Button 
        variant="outline" 
        className={`h-full text-4xl font-black rounded-2xl transition-none ${isNegative ? "bg-red-500 text-white border-red-600" : "bg-white border-zinc-200 text-zinc-400 hover:text-zinc-900"}`}
        onClick={onToggleNegative}
      >
        -
      </Button>
    </div>
  );
}


