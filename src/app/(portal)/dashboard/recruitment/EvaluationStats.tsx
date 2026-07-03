"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertOctagon,
  Layers,
  ArrowUpRight
} from "lucide-react";

export default function EvaluationStats({ evaluationsStats }: any) {
  const [selectedStatus, setSelectedStatus] = useState<string>("Submitted");

  const calculateTotal = (status: string) => {
    if (!evaluationsStats[status]) return 0;
    return Object.values(evaluationsStats[status]).reduce((acc: number, curr: any) => acc + (curr || 0), 0);
  };

  const calculateGrandTotal = () => {
    return ["Submitted", "Accepted", "Pending", "Rejected"].reduce(
      (acc, status) => acc + calculateTotal(status), 
      0
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return {
          bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
          border: "border-emerald-500/20 hover:border-emerald-500/40",
          text: "text-emerald-600 dark:text-emerald-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.05)]",
          bar: "bg-emerald-500",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        };
      case "Pending":
        return {
          bg: "bg-amber-500/5 dark:bg-amber-500/10",
          border: "border-amber-500/20 hover:border-amber-500/40",
          text: "text-amber-600 dark:text-amber-400",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.05)]",
          bar: "bg-amber-500",
          icon: <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
        };
      case "Rejected":
        return {
          bg: "bg-rose-500/5 dark:bg-rose-500/10",
          border: "border-rose-500/20 hover:border-rose-500/40",
          text: "text-rose-600 dark:text-rose-400",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.05)]",
          bar: "bg-rose-500",
          icon: <AlertOctagon className="w-5 h-5 text-rose-500" />
        };
      default: // Submitted
        return {
          bg: "bg-indigo-500/5 dark:bg-indigo-500/10",
          border: "border-indigo-500/20 hover:border-indigo-500/40",
          text: "text-indigo-600 dark:text-indigo-400",
          glow: "shadow-[0_0_15px_rgba(99,102,241,0.05)]",
          bar: "bg-indigo-500",
          icon: <Users className="w-5 h-5 text-indigo-500" />
        };
    }
  };

  const statuses = ["Submitted", "Accepted", "Pending", "Rejected"];
  const currentTotal = calculateTotal(selectedStatus);
  const grandTotal = calculateGrandTotal();

  // Extract department details for the selected status
  const deptData = evaluationsStats[selectedStatus] 
    ? Object.entries(evaluationsStats[selectedStatus]).map(([dept, count]: [string, any]) => ({
        name: dept,
        count: count ?? 0,
        percentage: currentTotal > 0 ? Math.round(((count ?? 0) / currentTotal) * 100) : 0
      })).sort((a, b) => b.count - a.count)
    : [];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {statuses.map((status) => {
          const total = calculateTotal(status);
          const style = getStatusColor(status);
          const isSelected = selectedStatus === status;

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ${style.bg} ${style.border} ${style.glow} ${
                isSelected 
                  ? "ring-2 ring-primary border-transparent scale-[1.01]" 
                  : "hover:scale-[1.005] opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {status}
                  </span>
                  <div className="text-3xl font-serif font-semibold tracking-tight text-foreground">
                    {total}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                  {style.icon}
                </div>
              </div>

              {/* Progress bar representing share of grand total */}
              <div className="mt-3 space-y-1">
                <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${grandTotal > 0 ? (total / grandTotal) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>Share of Total</span>
                  <span>{grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Breakdown Panel */}
      <Card className="border-border shadow-none bg-card/50 backdrop-blur-sm overflow-hidden rounded-xl">
        <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" /> Breakdown
              </CardTitle>
              <CardDescription className="text-[10px] uppercase font-mono tracking-tight">
                {selectedStatus} Applicants
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-muted border border-border text-foreground">
              Total: {currentTotal}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {currentTotal === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-6">
              No candidates in this status group.
            </p>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {deptData.map((dept) => (
                <div key={dept.name} className="space-y-1.5 group">
                  <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                      {dept.name}
                    </span>
                    <span className="font-mono text-foreground font-semibold flex items-center gap-1">
                      {dept.count} 
                      <span className="text-[9px] font-normal text-muted-foreground font-sans">
                        ({dept.percentage}%)
                      </span>
                    </span>
                  </div>
                  
                  {/* Sleek Gradient progress bar */}
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                        selectedStatus === "Accepted" ? "from-emerald-600 to-emerald-400" :
                        selectedStatus === "Pending" ? "from-amber-600 to-amber-400" :
                        selectedStatus === "Rejected" ? "from-rose-600 to-rose-400" :
                        "from-indigo-600 to-indigo-400"
                      }`}
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
