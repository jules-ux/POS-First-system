import { Bell, LayoutDashboard, Utensils, Table2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Staff } from "@/src/types";

interface TopBarProps {
  staff: Staff | null;
}

export function TopBar({ staff }: TopBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <header className="h-32 border-b border-zinc-200 bg-white flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center h-full">
        {/* Navigation Modes */}
        <div className="flex h-full border-r border-zinc-200">
          <ModeButton icon={LayoutDashboard} active />
          <ModeButton icon={Utensils} />
          <ModeButton icon={Table2} />
          <ModeButton icon={Users} />
        </div>

        {/* Date & Time */}
        <div className="flex flex-col justify-center px-10 h-full">
          <span className="text-4xl font-bold text-zinc-800 leading-none mb-1 tabular-nums tracking-tight">{formatTime(time)}</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.3em] leading-none">{formatDate(time)}</span>
        </div>
      </div>

      <div className="flex items-center gap-8 pr-10">
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-zinc-600 w-12 h-12">
          <Bell className="w-8 h-8" />
          <span className="absolute top-1 right-1 w-3 h-3 bg-zinc-400 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="flex items-center gap-4 pl-10 border-l border-zinc-200">
          <div className="text-right hidden sm:block">
            <p className="text-base font-bold text-zinc-800">{staff?.name || "Alex Rivera"}</p>
            <p className="text-xs text-zinc-400 font-medium">{staff ? `Staff #${staff.number}` : "Store Manager"}</p>
          </div>
          <Avatar className="w-14 h-14 border-2 border-zinc-100">
            {staff ? (
              <AvatarFallback className="text-lg font-bold bg-zinc-50 text-zinc-600">{staff.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            ) : (
              <>
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback>AR</AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
}

function ModeButton({ icon: Icon, active = false }: { icon: any, active?: boolean }) {
  return (
    <button 
      className={`w-32 h-full flex items-center justify-center transition-none border-r border-zinc-100 last:border-r-0 ${
        active 
          ? "bg-zinc-100 text-zinc-900" 
          : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
      }`}
    >
      <Icon className="w-10 h-10" />
    </button>
  );
}
