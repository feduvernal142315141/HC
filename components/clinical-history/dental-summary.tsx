"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Progress,
  Button,
} from "@/components/ui";
import type { DentalSummaryData, DentalTreatment, TreatmentStatus } from "@/lib/clinical-history/types";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Receipt,
  CreditCard,
  Stethoscope,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface DentalSummaryProps {
  summary: DentalSummaryData | null;
  treatments: DentalTreatment[];
  onNavigate: (section: string) => void;
}

const statusConfig: Record<TreatmentStatus, { label: string; color: string; bgColor: string }> = {
  pending: { 
    label: "Pendiente", 
    color: "text-warning", 
    bgColor: "bg-warning/10" 
  },
  in_progress: { 
    label: "En Proceso", 
    color: "text-info", 
    bgColor: "bg-info/10" 
  },
  completed: { 
    label: "Completado", 
    color: "text-success", 
    bgColor: "bg-success/10" 
  },
  cancelled: { 
    label: "Cancelado", 
    color: "text-muted-foreground", 
    bgColor: "bg-muted" 
  },
};

export function DentalSummary({ summary, treatments, onNavigate }: DentalSummaryProps) {
  if (!summary) {
    return <SummarySkeleton />;
  }

  const activeTreatments = treatments.filter((t) => t.status === "in_progress");
  const pendingTreatments = treatments.filter((t) => t.status === "pending");

  const paymentProgress = summary.approvedBudget > 0
    ? (summary.totalPaid / summary.approvedBudget) * 100
    : 0;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Resumen</h2>
        <p className="text-sm text-muted-foreground">
          Vista general del estado clinico
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Activity}
          label="Tratamientos Activos"
          value={summary.activeTreatments}
          subtext={`${summary.pendingTreatments} pendientes`}
          onClick={() => onNavigate("treatments")}
        />

        <MetricCard
          icon={CheckCircle2}
          iconClass="text-success"
          label="Completados"
          value={summary.completedTreatments}
          subtext="finalizados"
          onClick={() => onNavigate("treatments")}
        />

        <MetricCard
          icon={Calendar}
          label="Ultima Visita"
          value={summary.lastVisit ? formatDate(summary.lastVisit) : "Sin registro"}
          isDateValue
          onClick={() => onNavigate("evolutions")}
        />

        <MetricCard
          icon={Clock}
          label="Proxima Cita"
          value={summary.nextAppointment ? formatDate(summary.nextAppointment) : "Sin agendar"}
          isDateValue
          highlight={!!summary.nextAppointment}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Treatments Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Tratamientos Activos</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1"
                onClick={() => onNavigate("treatments")}
              >
                Ver todos 
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTreatments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Activity className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No hay tratamientos activos</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTreatments.slice(0, 3).map((treatment) => (
                  <TreatmentItem key={treatment.id} treatment={treatment} />
                ))}
                {activeTreatments.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{activeTreatments.length - 3} mas
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Teeth & Diagnoses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Piezas Criticas</CardTitle>
          </CardHeader>
          <CardContent>
            {summary.criticalTeeth.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="h-6 w-6 text-success/50 mb-2" />
                <p className="text-sm text-muted-foreground">Sin piezas criticas</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {summary.criticalTeeth.map((tooth) => (
                    <Badge key={tooth} variant="secondary" className="font-mono text-xs">
                      #{tooth}
                    </Badge>
                  ))}
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Diagnosticos</p>
                  <ul className="space-y-1">
                    {summary.mainDiagnoses.map((diagnosis, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="h-1 w-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                        <span>{diagnosis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Budget Card */}
        <Card className="cursor-pointer" onClick={() => onNavigate("budget")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Presupuesto</CardTitle>
              <Badge variant={summary.pendingBudget > 0 ? "secondary" : "success"}>
                {summary.pendingBudget > 0 ? "Pendiente" : "Al dia"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Aprobado</p>
                <p className="text-2xl font-semibold">{formatCurrency(summary.approvedBudget)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Pendiente</p>
                <p className="text-lg font-medium">{formatCurrency(summary.pendingBudget)}</p>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progreso</span>
                <span>{Math.round(paymentProgress)}%</span>
              </div>
              <Progress value={paymentProgress} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Payments Card */}
        <Card className="cursor-pointer" onClick={() => onNavigate("payments")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Pagos Realizados</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                Ver historial <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Pagado</p>
              <p className="text-2xl font-semibold text-success">{formatCurrency(summary.totalPaid)}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Saldo</p>
                <p className="text-sm font-medium">{formatCurrency(summary.totalOwed)}</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className={cn("text-sm font-medium", summary.totalOwed === 0 ? "text-success" : "text-foreground")}>
                  {summary.totalOwed === 0 ? "Liquidado" : "Activo"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Treatments Preview */}
      {pendingTreatments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">Tratamientos Pendientes</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pendingTreatments.length} procedimientos
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => onNavigate("treatments")}>
                Ver Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {pendingTreatments.slice(0, 6).map((treatment) => (
                <TreatmentItem key={treatment.id} treatment={treatment} compact />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconClass?: string;
  label: string;
  value: string | number;
  subtext?: string;
  isDateValue?: boolean;
  highlight?: boolean;
  onClick?: () => void;
}

function MetricCard({ 
  icon: Icon, 
  iconClass, 
  label, 
  value, 
  subtext, 
  isDateValue, 
  highlight, 
  onClick 
}: MetricCardProps) {
  return (
    <Card
      className={cn("cursor-pointer hover:shadow-card-hover transition-shadow", highlight && "border-primary/30")}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={cn("font-semibold", isDateValue ? "text-sm" : "text-2xl")}>
              {value}
            </p>
            {subtext && (
              <p className="text-xs text-muted-foreground">{subtext}</p>
            )}
          </div>
          <Icon className={cn("h-5 w-5 text-muted-foreground", iconClass)} />
        </div>
      </CardContent>
    </Card>
  );
}

interface TreatmentItemProps {
  treatment: DentalTreatment;
  compact?: boolean;
  style?: React.CSSProperties;
}

function TreatmentItem({ treatment, compact, style }: TreatmentItemProps) {
  const config = statusConfig[treatment.status];

  return (
    <div 
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border p-3",
        "hover:bg-muted/50 transition-colors",
        compact && "p-2.5"
      )}
      style={style}
    >
      <div className="min-w-0 flex-1">
        <p className={cn("font-medium truncate", compact ? "text-sm" : "text-sm")}>
          {treatment.procedure}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {treatment.toothNumbers.length > 0 && (
            <span className="font-mono">#{treatment.toothNumbers.join(", #")}</span>
          )}
          <span className={config.color}>{config.label}</span>
        </div>
      </div>
      {!compact && (
        <div className="text-right shrink-0">
          <p className="font-medium text-sm">
            {new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(treatment.cost)}
          </p>
          <p className="text-xs text-muted-foreground">{treatment.doctorName}</p>
        </div>
      )}
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-4 w-48 bg-muted rounded" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4 space-y-2">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-6 w-12 bg-muted rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border p-4 space-y-3">
          <div className="h-5 w-32 bg-muted rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded" />
          ))}
        </div>
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="h-5 w-24 bg-muted rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
