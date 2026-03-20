import { Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils/utils";
import type { Radiograph } from "@/lib/clinical-history/types";
import { radiographTypeConfig } from "./radiograph-type-config";

interface RadiographTypeSummaryProps {
  radiographs: Radiograph[];
  typeFilter: string;
  onTypeToggle: (type: string) => void;
}

export function RadiographTypeSummary({
  radiographs,
  typeFilter,
  onTypeToggle,
}: RadiographTypeSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {Object.entries(radiographTypeConfig).map(([type, config]) => {
        const count = radiographs.filter((radiograph) => radiograph.type === type).length;
        const Icon = config.icon;

        return (
          <Card
            key={type}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              typeFilter === type && "ring-2 ring-primary"
            )}
            onClick={() => onTypeToggle(type)}
          >
            <CardContent className="flex items-center gap-3 pb-4 pt-4">
              <div className={cn("rounded-lg p-2", config.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
