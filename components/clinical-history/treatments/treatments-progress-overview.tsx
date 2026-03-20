import { Card, CardContent, Progress } from "@/components/ui";
import type { DentalTreatment } from "@/lib/clinical-history/types";
import { cn } from "@/lib/utils/utils";
import { formatCurrency, statusConfig } from "./treatments-domain";

interface TreatmentsProgressOverviewProps {
  treatments: DentalTreatment[];
  totalCost: number;
  progress: number;
}

export function TreatmentsProgressOverview({
  treatments,
  totalCost,
  progress,
}: TreatmentsProgressOverviewProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Status counters */}
          <div className="flex items-center gap-4 lg:gap-6 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = treatments.filter((t) => t.status === status).length;
              const Icon = config.icon;
              return (
                <div 
                  key={status} 
                  className="flex items-center gap-3 shrink-0 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className={cn("p-2 rounded-xl", config.bgColor)}>
                    <Icon className={cn(
                      "h-4 w-4", 
                      config.color, 
                      status === "in_progress" && "animate-spin"
                    )} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground tracking-tight">{count}</p>
                    <p className="text-xs text-muted-foreground font-medium">{config.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress section */}
          <div className="lg:w-72 space-y-2.5 p-4 rounded-xl bg-muted/30">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Progreso general</span>
              <span className="font-bold text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{formatCurrency(totalCost)}</span> plan total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
