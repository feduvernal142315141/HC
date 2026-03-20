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
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Resumen Dental</h2>
            <p className="text-muted-foreground">
              Vista general del estado clinico del paciente
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid - Premium Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Loader2}
          iconClass="text-info"
          iconBgClass="bg-info/10"
          label="Tratamientos Activos"
          value={summary.activeTreatments}
          subtext={`${summary.pendingTreatments} pendientes`}
          onClick={() => onNavigate("treatments")}
          animate
        />

        <MetricCard
          icon={CheckCircle2}
          iconClass="text-success"
          iconBgClass="bg-success/10"
          label="Completados"
          value={summary.completedTreatments}
          subtext="tratamientos finalizados"
          onClick={() => onNavigate("treatments")}
        />

        <MetricCard
          icon={Calendar}
          iconClass="text-primary"
          iconBgClass="bg-primary/10"
          label="Ultima Visita"
          value={summary.lastVisit ? formatDate(summary.lastVisit) : "Sin registro"}
          isDateValue
          onClick={() => onNavigate("evolutions")}
        />

        <MetricCard
          icon={Clock}
          iconClass="text-warning"
          iconBgClass="bg-warning/10"
          label="Proxima Cita"
          value={summary.nextAppointment ? formatDate(summary.nextAppointment) : "Sin agendar"}
          isDateValue
          highlight={!!summary.nextAppointment}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Treatments Card */}
        <Card 
          className="lg:col-span-2 cursor-pointer group" 
          onClick={() => onNavigate("treatments")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Tratamientos Activos</CardTitle>
                  <CardDescription>Procedimientos en curso</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
              >
                Ver todos 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTreatments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <Activity className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-muted-foreground">No hay tratamientos activos actualmente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTreatments.slice(0, 3).map((treatment, index) => (
                  <TreatmentItem 
                    key={treatment.id} 
                    treatment={treatment} 
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
                {activeTreatments.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{activeTreatments.length - 3} tratamientos mas
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Teeth & Diagnoses */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle>Piezas Criticas</CardTitle>
                <CardDescription>Atencion prioritaria</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {summary.criticalTeeth.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <p className="text-sm text-muted-foreground">Sin piezas criticas</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {summary.criticalTeeth.map((tooth) => (
                    <Badge
                      key={tooth}
                      variant="outline"
                      className="bg-warning/5 text-warning border-warning/20 font-mono text-sm px-3 py-1.5 rounded-lg"
                    >
                      #{tooth}
                    </Badge>
                  ))}
                </div>
                
                <div className="h-px bg-border" />
                
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Diagnosticos Principales
                  </p>
                  <ul className="space-y-2">
                    {summary.mainDiagnoses.map((diagnosis, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Card */}
        <Card 
          className="cursor-pointer group" 
          onClick={() => onNavigate("budget")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Presupuesto</CardTitle>
                  <CardDescription>Estado del plan de tratamiento</CardDescription>
                </div>
              </div>
              <Badge 
                variant={summary.pendingBudget > 0 ? "warning" : "success"}
                className="rounded-lg"
              >
                {summary.pendingBudget > 0 ? "Pendiente" : "Al dia"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Total Aprobado
                </p>
                <p className="text-3xl font-bold text-foreground tracking-tight">
                  {formatCurrency(summary.approvedBudget)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Pendiente
                </p>
                <p className="text-xl font-semibold text-warning">
                  {formatCurrency(summary.pendingBudget)}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progreso de pago</span>
                <span className="font-semibold text-foreground">{Math.round(paymentProgress)}%</span>
              </div>
              <Progress value={paymentProgress} className="h-2.5" />
            </div>
          </CardContent>
        </Card>

        {/* Payments Card */}
        <Card 
          className="cursor-pointer group" 
          onClick={() => onNavigate("payments")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-success/10">
                  <CreditCard className="h-5 w-5 text-success" />
                </div>
                <div>
                  <CardTitle>Pagos Realizados</CardTitle>
                  <CardDescription>Historial financiero</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
              >
                Ver historial 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Total Pagado
                </p>
                <p className="text-3xl font-bold text-success tracking-tight">
                  {formatCurrency(summary.totalPaid)}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-success/10">
                <TrendingUp className="h-8 w-8 text-success/60" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Saldo Pendiente
                </p>
                <p className="text-lg font-bold text-foreground">
                  {formatCurrency(summary.totalOwed)}
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Estado
                </p>
                <p className={cn(
                  "text-lg font-bold",
                  summary.totalOwed === 0 ? "text-success" : "text-warning"
                )}>
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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-warning/10">
                  <Stethoscope className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <CardTitle>Tratamientos Pendientes</CardTitle>
                  <CardDescription>
                    {pendingTreatments.length} procedimientos por realizar
                  </CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onNavigate("treatments")}
                className="rounded-xl"
              >
                Ver Plan Completo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingTreatments.slice(0, 6).map((treatment, index) => (
                <TreatmentItem 
                  key={treatment.id} 
                  treatment={treatment} 
                  compact 
                  style={{ animationDelay: `${index * 50}ms` }}
                />
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
  iconBgClass?: string;
  label: string;
  value: string | number;
  subtext?: string;
  isDateValue?: boolean;
  highlight?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

function MetricCard({ 
  icon: Icon, 
  iconClass, 
  iconBgClass,
  label, 
  value, 
  subtext, 
  isDateValue, 
  highlight, 
  animate,
  onClick 
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer group",
        highlight && "ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className={cn(
              "font-bold tracking-tight",
              isDateValue ? "text-lg" : "text-3xl",
              highlight && "text-primary"
            )}>
              {value}
            </p>
            {subtext && (
              <p className="text-xs text-muted-foreground">{subtext}</p>
            )}
          </div>
          <div className={cn(
            "p-2.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105",
            iconBgClass || "bg-muted"
          )}>
            <Icon className={cn(
              "h-5 w-5", 
              iconClass,
              animate && "animate-spin"
            )} />
          </div>
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
        "flex items-center gap-3 rounded-xl border border-border bg-card p-3",
        "hover:bg-muted/50 transition-all duration-150",
        "animate-fade-in",
        compact && "p-2.5"
      )}
      style={style}
    >
      <div className={cn("p-2 rounded-xl shrink-0", config.bgColor)}>
        <Stethoscope className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          "font-medium text-foreground truncate",
          compact ? "text-sm" : "text-base"
        )}>
          {treatment.procedure}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {treatment.toothNumbers.length > 0 && (
            <span className="font-mono">
              #{treatment.toothNumbers.join(", #")}
            </span>
          )}
          <Badge 
            variant="ghost"
            size="sm"
            className={cn("text-[10px] px-1.5", config.bgColor, config.color)}
          >
            {config.label}
          </Badge>
        </div>
      </div>
      {!compact && (
        <div className="text-right shrink-0">
          <p className="font-semibold text-foreground">
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-muted skeleton-shimmer" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg skeleton-shimmer" />
          <div className="h-4 w-72 bg-muted rounded-lg skeleton-shimmer" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="h-4 w-28 bg-muted rounded skeleton-shimmer" />
              <div className="h-10 w-10 rounded-xl bg-muted skeleton-shimmer" />
            </div>
            <div className="h-9 w-20 bg-muted rounded-lg skeleton-shimmer" />
            <div className="h-3 w-32 bg-muted rounded skeleton-shimmer" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted skeleton-shimmer" />
              <div className="space-y-1.5">
                <div className="h-5 w-36 bg-muted rounded skeleton-shimmer" />
                <div className="h-3 w-24 bg-muted rounded skeleton-shimmer" />
              </div>
            </div>
            <div className="h-8 w-24 bg-muted rounded-xl skeleton-shimmer" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted skeleton-shimmer" />
            <div className="space-y-1.5">
              <div className="h-5 w-28 bg-muted rounded skeleton-shimmer" />
              <div className="h-3 w-20 bg-muted rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded-lg skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
