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
  Separator,
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
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface DentalSummaryProps {
  summary: DentalSummaryData | null;
  treatments: DentalTreatment[];
  onNavigate: (section: string) => void;
}

const statusConfig: Record<TreatmentStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pendiente", color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  in_progress: { label: "En Proceso", color: "text-sky-600 dark:text-sky-400", bgColor: "bg-sky-100 dark:bg-sky-900/30" },
  completed: { label: "Completado", color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
  cancelled: { label: "Cancelado", color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-800" },
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
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Resumen Dental</h2>
        <p className="text-muted-foreground">
          Vista general del estado clínico del paciente
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Treatments */}
        <MetricCard
          icon={Loader2}
          iconClass="text-sky-600 animate-spin"
          label="Tratamientos Activos"
          value={summary.activeTreatments}
          subtext={`${summary.pendingTreatments} pendientes`}
          onClick={() => onNavigate("treatments")}
        />

        {/* Completed */}
        <MetricCard
          icon={CheckCircle2}
          iconClass="text-emerald-600"
          label="Completados"
          value={summary.completedTreatments}
          subtext="tratamientos finalizados"
          onClick={() => onNavigate("treatments")}
        />

        {/* Last Visit */}
        <MetricCard
          icon={Calendar}
          iconClass="text-primary"
          label="Última Visita"
          value={summary.lastVisit ? formatDate(summary.lastVisit) : "Sin registro"}
          isDateValue
          onClick={() => onNavigate("evolutions")}
        />

        {/* Next Appointment */}
        <MetricCard
          icon={Clock}
          iconClass="text-amber-600"
          label="Próxima Cita"
          value={summary.nextAppointment ? formatDate(summary.nextAppointment) : "Sin agendar"}
          isDateValue
          highlight={!!summary.nextAppointment}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Treatments Card */}
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("treatments")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Tratamientos Activos
                </CardTitle>
                <CardDescription>Procedimientos en curso</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTreatments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No hay tratamientos activos actualmente
              </div>
            ) : (
              <div className="space-y-3">
                {activeTreatments.slice(0, 3).map((treatment) => (
                  <TreatmentItem key={treatment.id} treatment={treatment} />
                ))}
                {activeTreatments.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    +{activeTreatments.length - 3} tratamientos más
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Critical Teeth & Diagnoses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Piezas Críticas
            </CardTitle>
            <CardDescription>Requieren atención prioritaria</CardDescription>
          </CardHeader>
          <CardContent>
            {summary.criticalTeeth.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Sin piezas críticas
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {summary.criticalTeeth.map((tooth) => (
                    <Badge
                      key={tooth}
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 font-mono text-sm px-3 py-1"
                    >
                      #{tooth}
                    </Badge>
                  ))}
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Diagnósticos Principales</p>
                  <ul className="space-y-1">
                    {summary.mainDiagnoses.map((diagnosis, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {diagnosis}
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
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("budget")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Presupuesto
                </CardTitle>
                <CardDescription>Estado del plan de tratamiento</CardDescription>
              </div>
              <Badge variant={summary.pendingBudget > 0 ? "secondary" : "default"}>
                {summary.pendingBudget > 0 ? "Pendiente" : "Al día"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Aprobado</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(summary.approvedBudget)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Pendiente</p>
                  <p className="text-lg font-semibold text-amber-600">
                    {formatCurrency(summary.pendingBudget)}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso de pago</span>
                  <span className="font-medium">{Math.round(paymentProgress)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Card */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate("payments")}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Pagos Realizados
                </CardTitle>
                <CardDescription>Historial financiero</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Ver historial <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Pagado</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(summary.totalPaid)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-200" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Saldo Pendiente</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(summary.totalOwed)}
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground">Estado</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    summary.totalOwed === 0 ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {summary.totalOwed === 0 ? "Liquidado" : "Activo"}
                  </p>
                </div>
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
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-amber-600" />
                  Tratamientos Pendientes
                </CardTitle>
                <CardDescription>
                  {pendingTreatments.length} procedimientos por realizar
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => onNavigate("treatments")}>
                Ver Plan Completo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

function MetricCard({ icon: Icon, iconClass, label, value, subtext, isDateValue, highlight, onClick }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all cursor-pointer",
        highlight && "ring-2 ring-primary/20"
      )}
      onClick={onClick}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn(
              "font-bold",
              isDateValue ? "text-lg" : "text-3xl",
              highlight && "text-primary"
            )}>
              {value}
            </p>
            {subtext && (
              <p className="text-xs text-muted-foreground">{subtext}</p>
            )}
          </div>
          <div className={cn("p-2 rounded-lg bg-muted/50")}>
            <Icon className={cn("h-5 w-5", iconClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface TreatmentItemProps {
  treatment: DentalTreatment;
  compact?: boolean;
}

function TreatmentItem({ treatment, compact }: TreatmentItemProps) {
  const config = statusConfig[treatment.status];

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors",
      compact && "p-2"
    )}>
      <div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
        <Stethoscope className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("font-medium text-foreground truncate", compact && "text-sm")}>
          {treatment.procedure}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {treatment.toothNumbers.length > 0 && (
            <span className="font-mono">
              #{treatment.toothNumbers.join(", #")}
            </span>
          )}
          <Badge variant="outline" className={cn("text-xs px-1.5 py-0", config.bgColor, config.color)}>
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
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-72 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-muted animate-pulse rounded-xl" />
        <div className="h-64 bg-muted animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
