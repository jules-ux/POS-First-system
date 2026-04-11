import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Delete, UserCircle2, Users, Table, Clock, TrendingUp, ChevronLeft, Settings, X, Power } from "lucide-react";
import { STAFF_MEMBERS, Staff } from "@/src/types";
import { exit } from "@tauri-apps/plugin-process";

interface StaffLoginProps {
  onLogin: (staff: Staff) => void;
  onBack: () => void;
}

export function StaffLogin({ onLogin, onBack }: StaffLoginProps) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate dynamic grid size (e.g., 4x4, 5x5, etc.)
  const totalStaff = STAFF_MEMBERS.length;
  const gridSize = Math.max(4, Math.ceil(Math.sqrt(totalStaff)));
  const totalSlots = gridSize * gridSize;

  const handleNumberClick = (num: string) => {
    if (code.length < 4) {
      setCode(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleExit = async () => {
    await exit(0);
  };

  useEffect(() => {
    if (code.length === 4 && selectedStaff) {
      if (code === selectedStaff.pin) {
        onLogin(selectedStaff);
      } else {
        setError(true);
        setCode("");
      }
    }
  }, [code, selectedStaff, onLogin]);

  return (
    <div className="h-screen w-full flex bg-zinc-50 overflow-hidden relative">
      {/* Quick Access Unfolding Bar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0 }}
            className="absolute top-0 left-0 w-full bg-zinc-900 border-b border-white/10 z-[100] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">System Control</span>
                  <div className="flex gap-4">
                    <button 
                      onClick={onBack}
                      className="flex items-center gap-2 text-white hover:text-orange-500 group"
                    >
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-bold">Back to Store Login</span>
                    </button>
                    <div className="w-px h-4 bg-white/10 self-center" />
                    <button 
                      className="flex items-center gap-2 text-white hover:text-red-500 group"
                      onClick={handleExit}
                    >
                      <Power className="w-4 h-4" />
                      <span className="text-sm font-bold">Shut Off System</span>
                    </button>
                  </div>
                </div>

                <div className="w-px h-10 bg-white/10" />

                <div className="flex flex-col">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Quick Settings</span>
                  <div className="flex gap-6">
                    <button className="text-zinc-400 hover:text-white text-sm font-medium">Terminal Config</button>
                    <button className="text-zinc-400 hover:text-white text-sm font-medium">Display Options</button>
                    <button className="text-zinc-400 hover:text-white text-sm font-medium">Network Status</button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side: Staff Selection or PIN Pad */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white border-r border-zinc-200 relative">
        <AnimatePresence mode="wait">
          {!selectedStaff ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="flex-1 flex flex-col overflow-hidden h-full"
            >
              {/* Dynamic Grid that fills the entire space */}
              <div className="flex-1 overflow-hidden">
                <div 
                  className="grid w-full h-full"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`
                  }}
                >
                  {STAFF_MEMBERS.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedStaff(staff)}
                      className="flex flex-col items-center justify-center border-r border-b border-zinc-100 hover:bg-zinc-950 hover:border-zinc-950 group active:bg-zinc-900 overflow-hidden"
                    >
                      <span className={`font-black text-zinc-950 group-hover:text-orange-500 mb-0.5 ${
                        gridSize > 4 ? "text-lg lg:text-xl" : "text-xl lg:text-2xl"
                      }`}>
                        {staff.number}
                      </span>
                      <span className={`font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-300 truncate px-2 w-full text-center ${
                        gridSize > 4 ? "text-[7px]" : "text-[9px]"
                      }`}>
                        {staff.name}
                      </span>
                    </button>
                  ))}
                  {/* Fill empty cells to maintain grid borders */}
                  {totalStaff < totalSlots && 
                    Array.from({ length: totalSlots - totalStaff }).map((_, i) => (
                      <div key={`empty-${i}`} className="border-r border-b border-zinc-100 bg-zinc-50/30" />
                    ))
                  }
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pinpad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="flex-1 flex flex-col h-full bg-white"
            >
              {/* Top Section: Staff Info & PIN Status (1/3 height) */}
              <div className="h-1/3 flex flex-col justify-center items-center px-8 border-b border-zinc-100">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-3xl font-black text-zinc-950 tracking-tighter">{selectedStaff.number}</span>
                    <div className="w-1 h-6 bg-orange-500/20 rounded-full" />
                    <span className="text-xl font-bold text-zinc-400 uppercase tracking-widest">{selectedStaff.name}</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em]">Security Verification Required</p>
                </div>

                <div className="flex justify-center gap-6">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: error ? 0.2 : 0 }}
                      className={`w-5 h-5 rounded-full border-2 transition-none ${
                        code.length > i 
                          ? "bg-zinc-950 border-zinc-950 scale-125 shadow-lg shadow-zinc-950/20" 
                          : "border-zinc-200"
                      } ${error ? "border-red-500 bg-red-500" : ""}`}
                    />
                  ))}
                </div>
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0 }}
                    className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-6"
                  >
                    Invalid Access Code
                  </motion.p>
                )}
              </div>
              
              {/* Bottom Section: Large Square Grid (2/3 height) */}
              <div className="h-2/3 grid grid-cols-3 w-full">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    className="flex items-center justify-center border-r border-b border-zinc-100 text-3xl font-black text-zinc-950 hover:bg-zinc-950 hover:text-white active:bg-zinc-900"
                  >
                    {num}
                  </button>
                ))}
                
                {/* Bottom Row */}
                <button
                  onClick={() => {
                    setSelectedStaff(null);
                    setCode("");
                    setError(false);
                  }}
                  className="flex flex-col items-center justify-center border-r border-zinc-100 bg-zinc-50 hover:bg-zinc-950 group"
                >
                  <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-1" />
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-300">Change Staff</span>
                </button>
                
                <button
                  onClick={() => handleNumberClick("0")}
                  className="flex items-center justify-center border-r border-zinc-100 text-3xl font-black text-zinc-950 hover:bg-zinc-950 hover:text-white active:bg-zinc-900"
                >
                  0
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center bg-zinc-50 hover:bg-red-500 hover:text-white group"
                >
                  <Delete className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side: Live Stats */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col p-12 justify-center overflow-y-auto relative">
        {/* Quick Access Circle Button */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-95 group z-50"
        >
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <div className="max-w-md w-full mx-auto space-y-10">
          <div>
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Live Terminal Status</h3>
            <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
              Store is currently <span className="text-orange-500">Active</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard 
              icon={Users} 
              label="Active Servers" 
              value="12" 
              trend="+2 on floor"
            />
            <StatCard 
              icon={Table} 
              label="Tables Occupied" 
              value="24/30" 
              trend="80% Capacity"
            />
            <StatCard 
              icon={Clock} 
              label="Avg. Wait Time" 
              value="14m" 
              trend="Stable"
            />
            <StatCard 
              icon={TrendingUp} 
              label="Pending Orders" 
              value="8" 
              trend="4 Express"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


function StatCard({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend: string }) {
  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-orange-500" />
        </div>
        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-black text-white mb-0.5">{value}</p>
      <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">{trend}</p>
    </div>
  );
}

function KeyButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button
      variant="outline"
      className="h-14 w-full text-lg font-bold border-zinc-100 bg-zinc-50 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all active:scale-95 rounded-xl shadow-sm"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

