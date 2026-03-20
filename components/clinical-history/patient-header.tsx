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
      <header className="relative bg-card/95 backdrop-blur-xl border-b border-border px-4 lg:px-6 py-4">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-transparent to-success/[0.02] pointer-events-none" />
        
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

            {/* Premium Avatar with status ring */}
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-background shadow-lg ring-2 ring-primary/20">
                <AvatarImage src={patient.photoUrl} alt={patient.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg font-bold text-foreground tracking-tight truncate">
                  {patient.name}
                </h1>
                <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider">
                  {patient.id}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{patient.age} anos</span>
                  <span className="text-border">|</span>
                  <span>{patient.gender === "M" ? "Masculino" : patient.gender === "F" ? "Femenino" : "Otro"}</span>
                </span>
                
                {patient.bloodType && (
                  <span className="flex items-center gap-1.5">
                    <Droplet className="h-3.5 w-3.5 text-destructive/70" />
                    <span className="font-medium text-foreground">{patient.bloodType}</span>
                  </span>
                )}
                
                <span className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
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
                <Button 
                  size="sm" 
                  className={cn(
                    "gap-2 rounded-xl shadow-sm",
                    "bg-primary hover:bg-primary/90",
                    "transition-all duration-150"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Acciones</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1.5 rounded-xl">
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("new-treatment")}
                  className="gap-2.5 rounded-lg py-2.5 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Syringe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Nuevo Tratamiento</p>
                    <p className="text-xs text-muted-foreground">Agregar procedimiento</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("new-evolution")}
                  className="gap-2.5 rounded-lg py-2.5 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-info/10">
                    <FileText className="h-4 w-4 text-info" />
                  </div>
                  <div>
                    <p className="font-medium">Nueva Evolucion</p>
                    <p className="text-xs text-muted-foreground">Registrar consulta</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1.5" />
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("add-radiograph")}
                  className="gap-2.5 rounded-lg py-2.5 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-muted">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">Adjuntar Radiografia</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onQuickAction?.("view-budget")}
                  className="gap-2.5 rounded-lg py-2.5 cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-muted">
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">Ver Presupuesto</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Insurance Badge */}
            {patient.insurancePlan && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant="outline" 
                    className="gap-1.5 hidden md:flex cursor-help bg-card hover:bg-muted/50 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-success" />
                    <span className="truncate max-w-[100px] font-medium">{patient.insurancePlan}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">Plan de Seguro Dental</p>
                  <p className="text-xs text-muted-foreground">{patient.insurancePlan}</p>
                </TooltipContent>
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
    <header className="bg-card/95 backdrop-blur-xl border-b border-border px-4 lg:px-6 py-4">
      <div className="flex items-center gap-4">
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Skeleton className="h-14 w-14 rounded-full skeleton-shimmer" />
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48 rounded-lg skeleton-shimmer" />
            <Skeleton className="h-5 w-20 rounded-full skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-32 rounded-lg skeleton-shimmer" />
            <Skeleton className="h-4 w-24 rounded-lg skeleton-shimmer" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl skeleton-shimmer" />
          <Skeleton className="h-6 w-24 rounded-full skeleton-shimmer hidden md:block" />
        </div>
      </div>
    </header>
  );
}
