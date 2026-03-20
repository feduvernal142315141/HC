"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import {
  Button,
  ScrollArea,
  Skeleton,
  Card,
  CardContent,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  ThemeToggle,
} from "@/components/ui";
import { PatientHeader } from "./patient-header";
import { DentalSummary } from "./dental-summary";
import { ClinicalOdontogram } from "./clinical-odontogram";
import { MedicalHistorySection } from "./medical-history-section";
import { TreatmentsSection } from "./treatments-section";
import { EvolutionsSection } from "./evolutions-section";
import { RadioGraphsSection } from "./radiographs-section";
import { DocumentsSection } from "./documents-section";
import { BudgetSection } from "./budget-section";
import { PaymentsSection } from "./payments-section";
import { useClinicalHistoryData } from "./hooks/use-clinical-history-data";
import {
  LayoutDashboard,
  FileText,
  Stethoscope,
  Syringe,
  ClipboardList,
  Image,
  FileCheck,
  Receipt,
  CreditCard,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

type ClinicalSection =
  | "summary"
  | "odontogram"
  | "history"
  | "treatments"
  | "evolutions"
  | "radiographs"
  | "documents"
  | "budget"
  | "payments";

interface ClinicalNavItem {
  id: ClinicalSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: "overview" | "clinical" | "financial";
}

const navigationItems: ClinicalNavItem[] = [
  { id: "summary", label: "Resumen", icon: LayoutDashboard, description: "Vista general", category: "overview" },
  { id: "odontogram", label: "Odontograma", icon: Stethoscope, description: "Estado dental", category: "overview" },
  { id: "history", label: "Historia", icon: FileText, description: "Anamnesis", category: "clinical" },
  { id: "treatments", label: "Tratamientos", icon: Syringe, description: "Procedimientos", category: "clinical" },
  { id: "evolutions", label: "Evoluciones", icon: ClipboardList, description: "Registro", category: "clinical" },
  { id: "radiographs", label: "Radiografias", icon: Image, description: "Imagenes", category: "clinical" },
  { id: "documents", label: "Documentos", icon: FileCheck, description: "Legales", category: "clinical" },
  { id: "budget", label: "Presupuesto", icon: Receipt, description: "Plan de pago", category: "financial" },
  { id: "payments", label: "Pagos", icon: CreditCard, description: "Financiero", category: "financial" },
];

interface ClinicalHistoryLayoutProps {
  patientId: string;
  onClose?: () => void;
}

export function ClinicalHistoryLayout({ patientId, onClose }: ClinicalHistoryLayoutProps) {
  const [activeSection, setActiveSection] = useState<ClinicalSection>("summary");
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const { snapshot, isLoading, error, refresh, updateTreatment, prependEvolution } =
    useClinicalHistoryData(patientId);

  const patient = snapshot?.patient ?? null;
  const medicalHistory = snapshot?.medicalHistory ?? null;
  const treatments = snapshot?.treatments ?? [];
  const evolutions = snapshot?.evolutions ?? [];
  const radiographs = snapshot?.radiographs ?? [];
  const documents = snapshot?.documents ?? [];
  const budgets = snapshot?.budgets ?? [];
  const treatmentPlans = snapshot?.treatmentPlans ?? [];
  const payments = snapshot?.payments ?? [];
  const dentalSummary = snapshot?.dentalSummary ?? null;

  const handleSectionChange = (section: ClinicalSection) => {
    setActiveSection(section);
    setIsMobileNavOpen(false);
  };

  const renderSection = () => {
    if (isLoading) {
      return <SectionSkeleton />;
    }

    if (error) {
      return (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
              <X className="w-7 h-7 text-destructive" />
            </div>
            <p className="text-lg font-semibold text-foreground mb-1">
              No pudimos cargar la historia clinica
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">{error}</p>
            <Button onClick={refresh} className="gap-2">
              Reintentar carga
            </Button>
          </CardContent>
        </Card>
      );
    }

    switch (activeSection) {
      case "summary":
        return (
          <DentalSummary
            summary={dentalSummary}
            treatments={treatments}
            onNavigate={(section) => handleSectionChange(section as ClinicalSection)}
          />
        );
      case "odontogram":
        return (
          <ClinicalOdontogram
            treatments={treatments}
            onToothSelect={() => {
              setActiveSection("treatments");
            }}
          />
        );
      case "history":
        return <MedicalHistorySection history={medicalHistory} patient={patient} />;
      case "treatments":
        return (
          <TreatmentsSection
            treatments={treatments}
            onTreatmentUpdate={(updated) => {
              updateTreatment(updated);
            }}
          />
        );
      case "evolutions":
        return (
          <EvolutionsSection
            patientId={patientId}
            evolutions={evolutions}
            treatments={treatments}
            onEvolutionCreate={(newEvolution) => {
              prependEvolution(newEvolution);
            }}
          />
        );
      case "radiographs":
        return <RadioGraphsSection radiographs={radiographs} />;
      case "documents":
        return (
          <DocumentsSection
            documents={documents}
            patientId={patientId}
          />
        );
      case "budget":
        return <BudgetSection budgets={budgets} treatmentPlans={treatmentPlans} treatments={treatments} patientId={patientId} />;
      case "payments":
        return <PaymentsSection payments={payments} budgets={budgets} patientId={patientId} />;
      default:
        return null;
    }
  };

  const categories = [
    { key: "overview", label: "General" },
    { key: "clinical", label: "Clinico" },
    { key: "financial", label: "Financiero" },
  ] as const;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col h-screen bg-background">
        {/* Patient Header */}
        <PatientHeader
          patient={patient}
          isLoading={isLoading}
          onClose={onClose}
          onQuickAction={(action) => {
            switch (action) {
              case "new-treatment":
                setActiveSection("treatments");
                break;
              case "new-evolution":
                setActiveSection("evolutions");
                break;
              case "add-radiograph":
                setActiveSection("radiographs");
                break;
              case "view-budget":
                setActiveSection("budget");
                break;
            }
          }}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Nav Overlay */}
          {isMobileNavOpen && (
            <div
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
              onClick={() => setIsMobileNavOpen(false)}
            />
          )}

          {/* Premium Sidebar Navigation */}
          <aside
            className={cn(
              "fixed lg:relative z-50 lg:z-auto h-[calc(100vh-76px)] transition-all duration-300 ease-out",
              // Clean background
              "bg-sidebar border-r border-sidebar-border",
              // Width states
              isNavCollapsed ? "w-[68px]" : "w-60",
              // Mobile states
              isMobileNavOpen
                ? "translate-x-0 shadow-lg"
                : "-translate-x-full lg:translate-x-0"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Nav Header */}
              <div className={cn(
                "flex items-center h-14 px-3 border-b border-border/50",
                isNavCollapsed ? "justify-center" : "justify-between"
              )}>
                {!isNavCollapsed && (
                  <span className="text-sm font-semibold text-foreground tracking-tight">
                    Historia Clinica
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted",
                    "transition-colors duration-150",
                    "hidden lg:flex"
                  )}
                  onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                >
                  <ChevronLeft
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isNavCollapsed && "rotate-180"
                    )}
                  />
                </Button>
              </div>

              {/* Navigation Items */}
              <ScrollArea className="flex-1">
                <nav className="p-2 space-y-6">
                  {categories.map((category) => {
                    const items = navigationItems.filter((item) => item.category === category.key);
                    
                    return (
                      <div key={category.key}>
                        {!isNavCollapsed && (
                          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                            {category.label}
                          </p>
                        )}
                        <div className="space-y-1">
                          {items.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            const navButton = (
                              <button
                                key={item.id}
                                onClick={() => handleSectionChange(item.id)}
                                className={cn(
                                  "w-full flex items-center gap-3 rounded-lg transition-all duration-150",
                                  isNavCollapsed ? "justify-center p-2" : "px-3 py-2",
                                  // Active state - clean and professional
                                  isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                                  // Relative for indicator
                                  "relative"
                                )}
                              >
                                {/* Subtle active indicator */}
                                {isActive && (
                                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-foreground rounded-r-full" />
                                )}
                                
                                <Icon className="h-4 w-4 shrink-0" />
                                
                                {!isNavCollapsed && (
                                  <span className="text-sm truncate">
                                    {item.label}
                                  </span>
                                )}
                              </button>
                            );

                            // Wrap with tooltip when collapsed
                            if (isNavCollapsed) {
                              return (
                                <Tooltip key={item.id}>
                                  <TooltipTrigger asChild>
                                    {navButton}
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="font-medium">
                                    {item.label}
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }

                            return navButton;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </ScrollArea>

              {/* Nav Footer */}
              <div className={cn(
                "border-t border-sidebar-border p-3",
                isNavCollapsed ? "flex flex-col items-center gap-2" : ""
              )}>
                <div className={cn(
                  "flex items-center",
                  isNavCollapsed ? "justify-center" : "justify-between px-2"
                )}>
                  {!isNavCollapsed && (
                    <p className="text-xs text-muted-foreground">v2.0</p>
                  )}
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileNavOpen(true)}
                className="gap-2 rounded-xl"
              >
                <Menu className="h-4 w-4" />
                <span>Menu</span>
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                {navigationItems.find((item) => item.id === activeSection)?.label}
              </span>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
                {renderSection()}
              </div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-56 rounded-xl skeleton-shimmer" />
        <Skeleton className="h-5 w-80 rounded-lg skeleton-shimmer" />
      </div>
      
      {/* Metrics grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-11 w-11 rounded-xl skeleton-shimmer" />
              <Skeleton className="h-4 w-16 rounded-lg skeleton-shimmer" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg skeleton-shimmer" />
            <Skeleton className="h-4 w-32 rounded-lg skeleton-shimmer" />
          </div>
        ))}
      </div>

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 rounded-lg skeleton-shimmer" />
            <Skeleton className="h-9 w-24 rounded-xl skeleton-shimmer" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border p-6 space-y-4">
          <Skeleton className="h-6 w-32 rounded-lg skeleton-shimmer" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
