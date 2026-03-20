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
  ThemeToggle,
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
  Mail,
  Calendar,
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

const severityConfig: Record<AlertSeverity, { 
  variant: "destructive" | "warning" | "info";
  pulseClass: string;
}> = {
  critical: {
    variant: "destructive",
    pulseClass: "animate-pulse",
  },
  warning: {
    variant: "warning",
    pulseClass: "",
  },
  info: {
    variant: "info",
    pulseClass: "",
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
    <TooltipProvider delayDuration={100}>
      <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
        
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Patient Info */}
          <div className="flex items-center gap-4">
            {onClose && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose} 
                    className="shrink-0 rounded-xl hover:bg-muted"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Volver</TooltipContent>
              </Tooltip>
            )}

            {/* Avatar */}
            <Avatar className="h-12 w-12 border border-border">
              <AvatarImage src={patient.photoUrl} alt={patient.name} />
              <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
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
                <h1 className="text-base font-semibold text-foreground truncate">
                  {patient.name}
                </h1>
                <span className="text-xs text-muted-foreground font-mono">
                  {patient.id}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-0.5 text-sm text-muted-foreground flex-wrap">
                <span>{patient.age} anos</span>
                <span className="text-border">·</span>
                <span>{patient.gender === "M" ? "M" : patient.gender === "F" ? "F" : "O"}</span>
                {patient.bloodType && (
                  <>
                    <span className="text-border">·</span>
                    <span className="font-medium">{patient.bloodType}</span>
                  </>
                )}
                <span className="text-border">·</span>
                <span>{patient.phone}</span>
              </div>
            </div>
          </div>

          {/* Center: Clinical Alerts */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {/* Critical Alerts */}
            {criticalAlerts.map((alert) => {
              const AlertIcon = alertTypeIcons[alert.type];
              const config = severityConfig.critical;
              return (
                <Tooltip key={alert.id}>
                  <TooltipTrigger asChild>
                    <Badge
                      variant={config.variant}
                      className={cn(
                        "gap-1.5 cursor-help shrink-0",
                        config.pulseClass
                      )}
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <AlertIcon className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[100px]">{alert.title}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs p-3">
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 rounded-lg bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{alert.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
                      </div>
                    </div>
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
                    <Badge variant="warning" className="gap-1.5 cursor-help shrink-0">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <AlertIcon className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[100px]">{alert.title}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs p-3">
                    <div className="flex items-start gap-2">
                      <div className="p-1.5 rounded-lg bg-warning/15">
                        <AlertCircle className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{alert.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Info Alerts (collapsed) */}
            {infoAlerts.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="info" className="gap-1.5 cursor-help shrink-0">
                    <Info className="h-3.5 w-3.5" />
                    <span>
                      {infoAlerts.length === 1
                        ? infoAlerts[0].title
                        : `${infoAlerts.length} notas`}
                    </span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <div className="space-y-2.5">
                    {infoAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-2">
                        <div className="p-1 rounded-md bg-info/10">
                          <Info className="h-3.5 w-3.5 text-info" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{alert.title}</p>
                          <p className="text-xs text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Treatment Warning */}
            {!canTreat && (
              <Badge variant="destructive" className="gap-1.5 shrink-0 animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5" />
                Revisar antes de tratar
              </Badge>
            )}
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Acciones</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("new-treatment")}
                  className="gap-2 cursor-pointer"
                >
                  <Syringe className="h-4 w-4" />
                  Nuevo Tratamiento
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("new-evolution")}
                  className="gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  Nueva Evolucion
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("add-radiograph")}
                  className="gap-2 cursor-pointer"
                >
                  <ImageIcon className="h-4 w-4" />
                  Adjuntar Radiografia
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("view-budget")}
                  className="gap-2 cursor-pointer"
                >
                  <Receipt className="h-4 w-4" />
                  Ver Presupuesto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Insurance Badge */}
            {patient.insurancePlan && (
              <Badge variant="secondary" className="gap-1.5 hidden md:flex">
                <Shield className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{patient.insurancePlan}</span>
              </Badge>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

function PatientHeaderSkeleton({ onClose }: { onClose?: () => void }) {
  return (
    <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
      <div className="flex items-center gap-4">
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
    </header>
  );
}
