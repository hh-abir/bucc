"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function EvaluationStats({ evaluationsStats }: any) {
  const calculateTotal = (status: string) => {
    if (!evaluationsStats[status]) return 0;
    return Object.values(evaluationsStats[status]).reduce((acc: number, curr: any) => acc + (curr || 0), 0);
  };

  const statuses = ["Submitted", "Accepted", "Pending", "Rejected"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {statuses.map((status) => (
          <Card key={status} className="bg-card border-border shadow-none rounded-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-medium text-foreground tracking-tight">{status}</h3>
                <span className="text-2xl font-serif font-semibold text-foreground">
                  {calculateTotal(status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-xs space-y-1.5 font-sans text-muted-foreground">
                {evaluationsStats[status] && Object.entries(evaluationsStats[status]).map(([dept, count]: [string, any]) => (
                  <div key={dept} className="flex justify-between items-center text-muted-foreground border-b border-border/50 pb-1 last:border-0">
                    <span>{dept}</span>
                    <span className="font-medium text-foreground">{count ?? 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
