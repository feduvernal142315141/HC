"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/utils";
import {
  Button,
  ScrollArea,
  Separator,
  Skeleton,
  Card,
  CardContent,
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
}

const navigationItems: ClinicalNavItem[] = [
  { id: "summary", label: "Resumen Dental", icon: LayoutDashboard, description: "Vista general del paciente" },
  { id: "odontogram", label: "Odontograma", icon: Stethoscope, description: "Estado dental visual" },
  { id: "history", label: "Historia Clínica", icon: FileText, description: "Anamnesis y antecedentes" },
  { id: "treatments", label: "Tratamientos", icon: Syringe, description: "Procedimientos dentales" },
  { id: "evolutions", label: "Evoluciones", icon: ClipboardList, description: "Registro cronológico" },
  { id: "radiographs", label: "Radiografías", icon: Image, description: "Imágenes diagnósticas" },
  { id: "documents", label: "Documentos", icon: FileCheck, description: "Consentimientos y legales" },
  { id: "budget", label: "Presupuesto", icon: Receipt, description: "Plan de tratamiento" },
  { id: "payments", label: "Pagos", icon: CreditCard, description: "Estado financiero" },
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
        <Card>
          <CardContent className="space-y-3 py-10 text-center">
            <p className="text-base font-semibold text-foreground">
              No pudimos cargar la historia clínica
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={refresh}>
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
              // Navigate to treatments filtered by tooth
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Patient Header - Always visible */}
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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}

        {/* Left Navigation */}
        <aside
          className={cn(
            "fixed lg:relative z-50 lg:z-auto h-[calc(100vh-80px)] bg-card border-r border-border transition-all duration-300",
            isNavCollapsed ? "w-16" : "w-64",
            isMobileNavOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Nav Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              {!isNavCollapsed && (
                <span className="text-sm font-semibold text-foreground">
                  Historia Clínica
                </span>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden lg:flex"
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isNavCollapsed && "rotate-180"
                  )}
                />
              </Button>
            </div>

            {/* Navigation Items */}
            <ScrollArea className="flex-1 py-2">
              <nav className="space-y-1 px-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto py-3",
                        isNavCollapsed && "justify-center px-0",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => handleSectionChange(item.id)}
                      title={isNavCollapsed ? item.label : undefined}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
                      {!isNavCollapsed && (
                        <div className="flex flex-col items-start text-left">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span
                            className={cn(
                              "text-xs",
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {item.description}
                          </span>
                        </div>
                      )}
                    </Button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Nav Footer */}
            <Separator />
            <div className="p-3">
              {!isNavCollapsed && (
                <p className="text-xs text-muted-foreground text-center">
                  Sistema Médico Dental v1.0
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          {/* Mobile Nav Toggle */}
          <div className="lg:hidden p-3 border-b border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileNavOpen(true)}
              className="gap-2"
            >
              <Menu className="h-4 w-4" />
              <span>Navegación</span>
            </Button>
          </div>

          <ScrollArea className="h-full">
            <div className="p-4 lg:p-6">{renderSection()}</div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
