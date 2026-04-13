import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Delete, UserCircle2, Users, Table, Clock, TrendingUp, ChevronLeft, Settings, X, Power, Play, Coffee, LogOut, CheckCircle2 } from "lucide-react";
import { STAFF_MEMBERS, Staff, Shift, ShiftStatus, StaffRole } from "@/src/types";

interface StaffLoginProps {
  onLogin: (staff: Staff) => void;
  onBack: () => void;
  shifts: Record<string, Shift>;
  onUpdateShift: (staffId: string, shift: Shift | null) => void;
}

export function StaffLogin({ onLogin, onBack, shifts, onUpdateShift }: StaffLoginProps) {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShiftManagerActive, setIsShiftManagerActive] = useState(false);
  const [selectingRole, setSelectingRole] = useState(false);

  // Calculate dynamic grid size
  const totalStaff = STAFF_MEMBERS.length;
  const gridSize = Math.max(4, Math.ceil(Math.sqrt(totalStaff)));
  const totalSlots = gridSize * gridSize;

  const handleNumberClick = (num: string) => {
    if (code.length < 6) {
      setCode(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (selectedStaff && code === selectedStaff.pin) {
      setIsShiftManagerActive(true);
      setError(false);
    } else {
      setIsShiftManagerActive(false);
      if (selectedStaff && code.length >= selectedStaff.pin.length && code !== selectedStaff.pin.slice(0, code.length)) {
        setError(true);
        const timer = setTimeout(() => {
          setCode("");
          setError(false);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [code, selectedStaff]);

  const handleOkClick = () => {
    if (selectedStaff) {
      onLogin(selectedStaff);
    }
  };

  const currentShift = selectedStaff ? shifts[selectedStaff.id] : null;

  const startShift = (role: StaffRole) => {
    if (!selectedStaff) return;
    onUpdateShift(selectedStaff.id, {
      staffId: selectedStaff.id,
      status: 'working',
      role,
      startTime: Date.now(),
      totalBreakTime: 0
    });
    setSelectingRole(false);
  };

  const startBreak = () => {
    if (!selectedStaff || !currentShift) return;
    onUpdateShift(selectedStaff.id, {
      ...currentShift,
      status: 'on-break',
      breakStartTime: Date.now()
    });
  };

  const endBreak = () => {
    if (!selectedStaff || !currentShift || !currentShift.breakStartTime) return;
    const breakDuration = Date.now() - currentShift.breakStartTime;
    onUpdateShift(selectedStaff.id, {
      ...currentShift,
      status: 'working',
      breakStartTime: undefined,
      totalBreakTime: currentShift.totalBreakTime + breakDuration
    });
  };

  const endShift = () => {
    if (!selectedStaff) return;
    onUpdateShift(selectedStaff.id, null);
  };

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
                      onClick={() => window.location.reload()}
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
              <div className="h-1/3 flex flex-col justify-center items-center px-8 border-b border-zinc-100 relative">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <span className="text-4xl font-black text-zinc-950 tracking-tighter">{selectedStaff.number}</span>
                    <div className="w-1.5 h-8 bg-orange-500 rounded-full" />
                    <span className="text-2xl font-black text-zinc-400 uppercase tracking-widest">{selectedStaff.name}</span>
                  </div>
                  <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Security Verification Required</p>
                </div>

                <div className="flex justify-center gap-6">
                  {Array.from({ length: selectedStaff.pin.length }).map((_, i) => (
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
                <div className="relative border-r border-zinc-100">
                  <AnimatePresence mode="wait">
                    {code.length === 0 ? (
                      <motion.button
                        key="change-staff"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0 }}
                        onClick={() => {
                          setSelectedStaff(null);
                          setIsShiftManagerActive(false);
                          setSelectingRole(false);
                        }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-950 group"
                      >
                        <ChevronLeft className="w-5 h-5 text-zinc-400 group-hover:text-orange-500 mb-1" />
                        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-zinc-300">
                          Change Staff
                        </span>
                      </motion.button>
                    ) : (
                      <motion.button
                        key="backspace"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0 }}
                        onClick={handleDelete}
                        className="absolute inset-0 flex items-center justify-center bg-zinc-50 hover:bg-red-500 hover:text-white group"
                      >
                        <Delete className="w-8 h-8 text-zinc-400 group-hover:text-white" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                
                <button
                  onClick={() => handleNumberClick("0")}
                  className="flex items-center justify-center border-r border-zinc-100 text-3xl font-black text-zinc-950 hover:bg-zinc-950 hover:text-white active:bg-zinc-900"
                >
                  0
                </button>
                
                <button
                  onClick={handleOkClick}
                  className="flex flex-col items-center justify-center bg-zinc-50 hover:bg-orange-500 group transition-all"
                >
                  <CheckCircle2 className="w-6 h-6 text-zinc-400 group-hover:text-white mb-1" />
                  <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">OK</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side: Live Stats or Shift Manager */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col p-8 justify-center overflow-y-auto relative">
        {/* Quick Access Circle Button */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 active:scale-95 group z-50"
        >
          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <AnimatePresence mode="wait">
          {!isShiftManagerActive ? (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md w-full mx-auto space-y-8"
            >
              <div>
                <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Live Terminal Status</h3>
                <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                  Store is currently <span className="text-orange-500">Active</span>
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Users} label="Active Servers" value="12" trend="+2 on floor" />
                <StatCard icon={Table} label="Tables Occupied" value="24/30" trend="80% Capacity" />
                <StatCard icon={Clock} label="Avg. Wait Time" value="14m" trend="Stable" />
                <StatCard icon={TrendingUp} label="Pending Orders" value="8" trend="4 Express" />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="shift-manager"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md w-full mx-auto space-y-5"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <UserCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5">Shift Manager</h3>
                  <h2 className="text-xl font-black text-white tracking-tight">{selectedStaff?.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
                  <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5">Shift Duration</span>
                  <span className="text-xl font-black text-white tabular-nums">
                    {currentShift?.startTime ? "02:14:05" : "--:--:--"}
                  </span>
                </div>
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
                  <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] block mb-1.5">Previous Shift</span>
                  <span className="text-xl font-black text-zinc-400 tabular-nums">06:45:00</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-orange-500" />
                    <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">Daily Sales Goal</span>
                  </div>
                  <span className="text-white text-[10px] font-black tabular-nums">$325 / $500</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    className="h-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">65% Achieved</span>
                  <span className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest">$175 Left</span>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
                <div className="mb-4">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1.5">Current Status</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      !currentShift ? "bg-zinc-700" : 
                      currentShift.status === 'working' ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : 
                      "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                    }`} />
                    <span className="text-lg font-black text-white uppercase tracking-tight">
                      {!currentShift ? "Not at work" : 
                       currentShift.status === 'working' ? "At work" : "On Break"}
                    </span>
                  </div>
                  {currentShift?.role && (
                    <span className="text-zinc-500 text-[10px] font-bold mt-1 block">Role: {currentShift.role}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {selectingRole ? (
                    <div className="space-y-2.5">
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1">Select Role</span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Bediening', 'Keuken', 'Bar', 'Runner'] as StaffRole[]).map(role => (
                          <Button 
                            key={role}
                            onClick={() => startShift(role)}
                            className="h-11 bg-zinc-800 hover:bg-orange-500 text-white font-black text-[10px] rounded-xl transition-all"
                          >
                            {role.toUpperCase()}
                          </Button>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectingRole(false)}
                        className="w-full text-zinc-500 hover:text-white text-[9px] font-bold uppercase tracking-widest h-8"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      {!currentShift && (
                        <Button 
                          onClick={() => setSelectingRole(true)}
                          className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          START SHIFT
                        </Button>
                      )}
                      
                      {currentShift?.status === 'working' && (
                        <>
                          <Button 
                            onClick={startBreak}
                            className="h-14 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-orange-500/10 flex items-center justify-center gap-3"
                          >
                            <Coffee className="w-4 h-4" />
                            START BREAK
                          </Button>
                          <Button 
                            onClick={endShift}
                            variant="outline"
                            className="h-14 border-2 border-zinc-800 hover:bg-red-500 hover:border-red-500 text-zinc-400 hover:text-white font-black text-xs rounded-2xl flex items-center justify-center gap-3 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            END SHIFT
                          </Button>
                        </>
                      )}

                      {currentShift?.status === 'on-break' && (
                        <Button 
                          onClick={endBreak}
                          className="h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          END BREAK
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

