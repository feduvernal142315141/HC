"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  ScrollArea,
  ScrollBar,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Odontogram, type OdontogramValue } from "@/components/odontogram/Odontogram";
import type { DentalTreatment, TreatmentStatus } from "@/lib/clinical-history/types";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  Maximize2,
  Info,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ClinicalOdontogramProps {
  treatments: DentalTreatment[];
  onToothSelect?: (toothId: string) => void;
}

const statusColors: Record<TreatmentStatus, { fill: string; label: string }> = {
  pending: { fill: "#fbbf24", label: "Pendiente" },
  in_progress: { fill: "#3b82f6", label: "En Proceso" },
  completed: { fill: "#22c55e", label: "Completado" },
  cancelled: { fill: "#6b7280", label: "Cancelado" },
};

const toothStatusLegend = [
  { status: "sano", color: "#86efac", label: "Sano" },
  { status: "caries", color: "#f87171", label: "Caries" },
  { status: "filled", color: "#60a5fa", label: "Restaurado" },
  { status: "falta", color: "#9ca3af", label: "Ausente" },
  { status: "implante", color: "#f59e0b", label: "Implante" },
];

export function ClinicalOdontogram({ treatments, onToothSelect }: ClinicalOdontogramProps) {
  const [odontogramValue, setOdontogramValue] = useState<OdontogramValue>({});
  const [zoom, setZoom] = useState(100);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  // Map treatments to teeth
  const teethWithTreatments = useMemo(() => {
    const map: Record<string, DentalTreatment[]> = {};
    treatments.forEach((treatment) => {
      treatment.toothNumbers.forEach((toothNum) => {
        const toothId = String(toothNum);
        if (!map[toothId]) map[toothId] = [];
        map[toothId].push(treatment);
      });
    });
    return map;
  }, [treatments]);

  // Filter treatments by status
  const filteredTreatments = useMemo(() => {
    if (filterStatus === "all") return treatments;
    return treatments.filter((t) => t.status === filterStatus);
  }, [treatments, filterStatus]);

  // Get teeth with filtered treatments
  const highlightedTeeth = useMemo(() => {
    const teeth = new Set<string>();
    filteredTreatments.forEach((t) => {
      t.toothNumbers.forEach((num) => teeth.add(String(num)));
    });
    return teeth;
  }, [filteredTreatments]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const handleOdontogramChange = (newValue: OdontogramValue) => {
    setOdontogramValue(newValue);
  };

  const selectedToothTreatments = selectedTooth ? teethWithTreatments[selectedTooth] || [] : [];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Odontograma</h2>
            <p className="text-muted-foreground">
              Visualización del estado dental y tratamientos
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="in_progress">En Proceso</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
              </SelectContent>
            </Select>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Alejar</TooltipContent>
              </Tooltip>
              <span className="text-xs font-medium w-12 text-center">{zoom}%</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Acercar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Restablecer</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Odontogram Card */}
          <Card className="xl:col-span-3">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vista del Odontograma</CardTitle>
                  <CardDescription>
                    Haga clic derecho en una pieza para cambiar su estado
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="w-full">
                <div
                  className="transition-transform duration-200 origin-center"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <Odontogram value={odontogramValue} onChange={handleOdontogramChange} />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Treatment Indicators */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-3">
                  Piezas con Tratamientos
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(teethWithTreatments).map(([toothId, toothTreatments]) => {
                    const isHighlighted = highlightedTeeth.has(toothId);
                    const hasActive = toothTreatments.some((t) => t.status === "in_progress");
                    const hasPending = toothTreatments.some((t) => t.status === "pending");
                    const isSelected = selectedTooth === toothId;

                    if (!isHighlighted && filterStatus !== "all") return null;

                    return (
                      <Tooltip key={toothId}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "font-mono h-9 px-3 relative",
                              hasActive && !isSelected && "border-sky-400 bg-sky-50 dark:bg-sky-950",
                              hasPending && !hasActive && !isSelected && "border-amber-400 bg-amber-50 dark:bg-amber-950"
                            )}
                            onClick={() => {
                              setSelectedTooth(isSelected ? null : toothId);
                              onToothSelect?.(toothId);
                            }}
                          >
                            #{toothId}
                            {toothTreatments.length > 1 && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                                {toothTreatments.length}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="font-semibold">Pieza #{toothId}</p>
                          <ul className="text-sm mt-1 space-y-1">
                            {toothTreatments.map((t) => (
                              <li key={t.id} className="flex items-center gap-2">
                                <Circle
                                  className="h-2 w-2"
                                  fill={statusColors[t.status].fill}
                                  stroke={statusColors[t.status].fill}
                                />
                                {t.procedure}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Sidebar - Legends and Selected Tooth */}
          <div className="space-y-4">
            {/* Legend Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Leyenda de Estados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tooth Status Legend */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Estado de Pieza
                    </p>
                    <div className="space-y-2">
                      {toothStatusLegend.map((item) => (
                        <div key={item.status} className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-sm border"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Status Legend */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Estado de Tratamiento
                    </p>
                    <div className="space-y-2">
                      {Object.entries(statusColors).map(([status, { fill, label }]) => (
                        <div key={status} className="flex items-center gap-2">
                          <Circle className="h-3 w-3" fill={fill} stroke={fill} />
                          <span className="text-sm">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Tooth Treatments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {selectedTooth
                    ? `Tratamientos Pieza #${selectedTooth}`
                    : "Seleccione una pieza"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTooth ? (
                  selectedToothTreatments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedToothTreatments.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="p-3 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {treatment.procedure}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {treatment.diagnosis}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                              style={{
                                backgroundColor: `${statusColors[treatment.status].fill}20`,
                                color: statusColors[treatment.status].fill,
                                borderColor: statusColors[treatment.status].fill,
                              }}
                            >
                              {statusColors[treatment.status].label}
                            </Badge>
                          </div>
                          <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                            <p>{treatment.doctorName}</p>
                            <p className="font-medium text-foreground">
                              {new Intl.NumberFormat("es-MX", {
                                style: "currency",
                                currency: "MXN",
                              }).format(treatment.cost)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay tratamientos para esta pieza
                    </p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Seleccione una pieza del odontograma para ver sus tratamientos
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Resumen de Piezas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">
                      {Object.keys(teethWithTreatments).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Con tratamiento</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">
                      {32 - Object.keys(teethWithTreatments).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Sin tratamiento</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-sky-50 dark:bg-sky-950">
                    <p className="text-2xl font-bold text-sky-600">
                      {treatments.filter((t) => t.status === "in_progress").length}
                    </p>
                    <p className="text-xs text-sky-600/80">En proceso</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950">
                    <p className="text-2xl font-bold text-amber-600">
                      {treatments.filter((t) => t.status === "pending").length}
                    </p>
                    <p className="text-xs text-amber-600/80">Pendientes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
