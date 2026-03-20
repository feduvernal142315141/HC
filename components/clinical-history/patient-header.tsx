"use client";

import {
  Button,
  Badge,
  Skeleton,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import type { PatientClinical, ClinicalAlert, AlertSeverity } from "@/lib/clinical-history/types";
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  Info,
  Phone,
  User,
  Plus,
  FileText,
  Image as ImageIcon,
  Receipt,
  ChevronDown,
  Shield,
  Droplet,
  Pill,
  Baby,
  Syringe,
  Bug,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface PatientHeaderProps {
  patient: PatientClinical | null;
  isLoading?: boolean;
  onClose?: () => void;
  onQuickAction?: (action: string) => void;
}

const alertTypeIcons: Record<ClinicalAlert["type"], React.ComponentType<{ className?: string }>> = {
  allergy: Pill,
  disease: Shield,
  medication: Syringe,
  pregnancy: Baby,
  anticoagulant: Droplet,
  infectious: Bug,
};

const severityStyles: Record<AlertSeverity, { badge: string; text: string }> = {
  critical: {
    badge: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
  },
  warning: {
    badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
  },
  info: {
    badge: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
    text: "text-sky-700 dark:text-sky-300",
  },
};

export function PatientHeader({ patient, isLoading, onClose, onQuickAction }: PatientHeaderProps) {
  if (isLoading) {
    return <PatientHeaderSkeleton onClose={onClose} />;
  }

  if (!patient) {
    return null;
  }

  const criticalAlerts = patient.alerts.filter((a) => a.severity === "critical");
  const warningAlerts = patient.alerts.filter((a) => a.severity === "warning");
  const infoAlerts = patient.alerts.filter((a) => a.severity === "info");

  const canTreat = criticalAlerts.length === 0 || criticalAlerts.every((a) => a.type !== "pregnancy");

  return (
    <TooltipProvider>
      <header className="bg-card border-b border-border px-4 lg:px-6 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Patient Info */}
          <div className="flex items-center gap-4">
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}

            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={patient.photoUrl} alt={patient.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {patient.name}
                </h1>
                <Badge variant="outline" className="text-xs font-normal">
                  {patient.id}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {patient.age} años | {patient.gender === "M" ? "Masculino" : patient.gender === "F" ? "Femenino" : "Otro"}
                </span>
                {patient.bloodType && (
                  <span className="flex items-center gap-1">
                    <Droplet className="h-3.5 w-3.5" />
                    {patient.bloodType}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Clinical Alerts */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
            {/* Critical Alerts */}
            {criticalAlerts.map((alert) => {
              const AlertIcon = alertTypeIcons[alert.type];
              return (
                <Tooltip key={alert.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1.5 py-1 px-2 cursor-help animate-pulse",
                        severityStyles.critical.badge
                      )}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <AlertIcon className="h-3.5 w-3.5" />
                      <span className="font-medium truncate max-w-[120px]">{alert.title}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-semibold text-red-600">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Warning Alerts */}
            {warningAlerts.map((alert) => {
              const AlertIcon = alertTypeIcons[alert.type];
              return (
                <Tooltip key={alert.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className={cn("gap-1.5 py-1 px-2 cursor-help", severityStyles.warning.badge)}
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      <AlertIcon className="h-3.5 w-3.5" />
                      <span className="font-medium truncate max-w-[120px]">{alert.title}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-semibold text-amber-600">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Info Alerts (collapsed if many) */}
            {infoAlerts.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={cn("gap-1.5 py-1 px-2 cursor-help", severityStyles.info.badge)}
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {infoAlerts.length === 1
                        ? infoAlerts[0].title
                        : `${infoAlerts.length} notas`}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  {infoAlerts.map((alert) => (
                    <div key={alert.id} className="mb-2 last:mb-0">
                      <p className="font-semibold text-sky-600">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  ))}
                </TooltipContent>
              </Tooltip>
            )}

            {/* Treatment Status */}
            {!canTreat && (
              <Badge
                variant="destructive"
                className="gap-1.5 py-1 px-2"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Revisar antes de tratar
              </Badge>
            )}
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Acciones</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onQuickAction?.("new-treatment")}>
                  <Syringe className="h-4 w-4 mr-2" />
                  Nuevo Tratamiento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickAction?.("new-evolution")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Nueva Evolución
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onQuickAction?.("add-radiograph")}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Adjuntar Radiografía
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onQuickAction?.("view-budget")}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Ver Presupuesto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Insurance Badge */}
            {patient.insurancePlan && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="gap-1.5 py-1 px-2 hidden md:flex">
                    <Shield className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[100px]">{patient.insurancePlan}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>Plan de seguro dental</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

function PatientHeaderSkeleton({ onClose }: { onClose?: () => void }) {
  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-3">
      <div className="flex items-center gap-4">
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex-1" />
        <Skeleton className="h-9 w-24" />
      </div>
    </header>
  );
}
