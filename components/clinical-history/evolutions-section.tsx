"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Input,
  Separator,
} from "@/components/ui";
import type { ClinicalEvolution, DentalTreatment } from "@/lib/clinical-history/types";
import {
  Plus,
  Search,
  Calendar,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  ChevronRight,
  Image as ImageIcon,
  Signature,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { toast } from "sonner";
import { NewEvolutionDialog } from "./new-evolution-dialog";
import { useEvolutionsViewModel } from "./evolutions/use-evolutions-view-model";
import { EvolutionActivitySummary } from "./evolutions/evolution-activity-summary";

interface EvolutionsSectionProps {
  patientId: string;
  evolutions: ClinicalEvolution[];
  treatments: DentalTreatment[];
  onEvolutionCreate: (evolution: ClinicalEvolution) => void;
}

export function EvolutionsSection({
  patientId,
  evolutions,
  treatments,
  onEvolutionCreate,
}: EvolutionsSectionProps) {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    selectedEvolution,
    setSelectedEvolutionId,
    groupedByMonth,
    sortedMonths,
    treatmentById,
    activitySummary,
  } = useEvolutionsViewModel({ evolutions, treatments });

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Evoluciones Clínicas</h2>
          <p className="text-muted-foreground">
            {evolutions.length} registros cronológicos
          </p>
        </div>

        <Button onClick={() => setIsNewDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evolución
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar en evoluciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolutions List */}
        <div className="lg:col-span-2 space-y-6">
          {sortedMonths.length > 0 ? (
            sortedMonths.map((monthKey) => (
              <div key={monthKey}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground capitalize">
                    {formatMonthLabel(monthKey)}
                  </h3>
                  <Badge variant="secondary" className="ml-auto">
                    {groupedByMonth[monthKey].length} registro(s)
                  </Badge>
                </div>
                <div className="space-y-4 relative">
                  {/* Timeline line */}
                  <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

                  {groupedByMonth[monthKey].map((evolution) => (
                    <EvolutionCard
                      key={evolution.id}
                      evolution={evolution}
                      treatment={
                        evolution.treatmentId
                          ? treatmentById.get(evolution.treatmentId)
                          : undefined
                      }
                      isSelected={selectedEvolution?.id === evolution.id}
                      onClick={() => setSelectedEvolutionId(evolution.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No hay evoluciones registradas</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Agrega una nueva evolución para documentar la atención
                </p>
                <Button onClick={() => setIsNewDialogOpen(true)} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Evolución
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detail Panel */}
        <div className="space-y-4">
          {selectedEvolution ? (
            <EvolutionDetailPanel
              evolution={selectedEvolution}
              treatment={
                selectedEvolution.treatmentId
                  ? treatmentById.get(selectedEvolution.treatmentId)
                  : undefined
              }
            />
          ) : (
            <Card className="sticky top-4">
              <CardContent className="py-12 text-center">
                <ChevronRight className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Selecciona una evolución para ver los detalles
                </p>
              </CardContent>
            </Card>
          )}

          <EvolutionActivitySummary
            total={activitySummary.total}
            doctors={activitySummary.doctors}
            treatedTeeth={activitySummary.treatedTeeth}
            withComplications={activitySummary.withComplications}
          />
        </div>
      </div>

      {/* New Evolution Dialog */}
      <NewEvolutionDialog
        patientId={patientId}
        evolutions={evolutions}
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        treatments={treatments}
        onSave={(evolution: ClinicalEvolution) => {
          onEvolutionCreate(evolution);
          setIsNewDialogOpen(false);
          toast.success("Evolución registrada correctamente");
        }}
      />
    </div>
  );
}

interface EvolutionCardProps {
  evolution: ClinicalEvolution;
  treatment?: DentalTreatment;
  isSelected: boolean;
  onClick: () => void;
}

function EvolutionCard({ evolution, treatment, isSelected, onClick }: EvolutionCardProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });

  return (
    <div
      className={cn(
        "relative pl-10 cursor-pointer transition-all",
        isSelected && "scale-[1.02]"
      )}
      onClick={onClick}
    >
      {/* Timeline dot */}
      <div
        className={cn(
          "absolute left-[13px] top-6 w-3.5 h-3.5 rounded-full border-2 z-10 transition-colors",
          isSelected
            ? "bg-primary border-primary"
            : "bg-background border-muted-foreground/30"
        )}
      />

      <Card
        className={cn(
          "hover:shadow-md transition-all",
          isSelected && "ring-2 ring-primary shadow-md"
        )}
      >
        <CardContent className="pt-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(evolution.date)}</span>
                <span className="text-muted-foreground/50">|</span>
                <User className="h-3.5 w-3.5" />
                <span>{evolution.doctorName}</span>
              </div>
              {treatment && (
                <Badge variant="outline" className="mt-2">
                  <Stethoscope className="h-3 w-3 mr-1" />
                  {treatment.procedure}
                </Badge>
              )}
            </div>
            {evolution.teethTreated.length > 0 && (
              <div className="flex gap-1">
                {evolution.teethTreated.slice(0, 3).map((tooth) => (
                  <Badge key={tooth} variant="secondary" className="font-mono text-xs">
                    #{tooth}
                  </Badge>
                ))}
                {evolution.teethTreated.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{evolution.teethTreated.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Procedures */}
          {evolution.proceduresPerformed.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Procedimientos</p>
              <div className="flex flex-wrap gap-1">
                {evolution.proceduresPerformed.map((proc, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-primary/5">
                    {proc}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Observations */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {evolution.observations}
          </p>

          {/* Complications warning */}
          {evolution.complications && (
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
              <AlertCircle className="h-3.5 w-3.5" />
              Complicaciones registradas
            </div>
          )}

          {/* Next indication */}
          {evolution.nextIndication && (
            <div className="mt-3 p-2 rounded-md bg-sky-50 dark:bg-sky-950 text-xs">
              <span className="font-medium text-sky-700 dark:text-sky-300">Indicación: </span>
              <span className="text-sky-600 dark:text-sky-400">{evolution.nextIndication}</span>
            </div>
          )}

          {/* Signature */}
          {evolution.signature && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
              <Signature className="h-3.5 w-3.5" />
              Firmado digitalmente
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface EvolutionDetailPanelProps {
  evolution: ClinicalEvolution;
  treatment?: DentalTreatment;
}

function EvolutionDetailPanel({ evolution, treatment }: EvolutionDetailPanelProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Detalle de Evolución
        </CardTitle>
        <CardDescription>
          {formatDate(evolution.date)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Doctor */}
        <div>
          <p className="text-xs text-muted-foreground">Profesional</p>
          <p className="font-medium">{evolution.doctorName}</p>
        </div>

        {/* Treatment */}
        {treatment && (
          <div>
            <p className="text-xs text-muted-foreground">Tratamiento</p>
            <p className="font-medium">{treatment.procedure}</p>
          </div>
        )}

        {/* Teeth */}
        {evolution.teethTreated.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Piezas Tratadas</p>
            <div className="flex flex-wrap gap-1">
              {evolution.teethTreated.map((tooth) => (
                <Badge key={tooth} variant="outline" className="font-mono">
                  #{tooth}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Procedures */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Procedimientos Realizados</p>
          <ul className="space-y-1">
            {evolution.proceduresPerformed.map((proc, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {proc}
              </li>
            ))}
          </ul>
        </div>

        {/* Observations */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Observaciones Clínicas</p>
          <p className="text-sm">{evolution.observations}</p>
        </div>

        {/* Complications */}
        {evolution.complications && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
              Complicaciones
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              {evolution.complications}
            </p>
          </div>
        )}

        {/* Next Indication */}
        {evolution.nextIndication && (
          <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800">
            <p className="text-xs font-medium text-sky-700 dark:text-sky-300 mb-1">
              Próxima Indicación
            </p>
            <p className="text-sm text-sky-600 dark:text-sky-400">
              {evolution.nextIndication}
            </p>
          </div>
        )}

        {/* Signature */}
        {evolution.signature && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2">
              <Signature className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  Firma Digital
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  {evolution.signature}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <ImageIcon className="h-3.5 w-3.5" />
            Adjuntar
          </Button>
          <Button variant="outline" size="sm" className="flex-1 gap-1">
            <FileText className="h-3.5 w-3.5" />
            Exportar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
