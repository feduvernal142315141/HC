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
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const count = treatments.filter((t) => t.status === status).length;
              const Icon = config.icon;
              return (
                <div key={status} className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-md", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.color, status === "in_progress" && "animate-spin")} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sm:w-64 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso general</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{formatCurrency(totalCost)} plan total</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
