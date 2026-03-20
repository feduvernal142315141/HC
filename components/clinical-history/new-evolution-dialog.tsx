"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import type { ClinicalEvolution, DentalTreatment } from "@/lib/clinical-history/types";
import { FileText } from "lucide-react";

interface NewEvolutionDialogProps {
  patientId: string;
  evolutions: ClinicalEvolution[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  treatments: DentalTreatment[];
  onSave: (evolution: ClinicalEvolution) => void;
}

type EvolutionAuthor = {
  doctorId: string;
  doctorName: string;
  signature: string;
};

const DEFAULT_EVOLUTION_AUTHOR: EvolutionAuthor = {
  doctorId: "DOC-001",
  doctorName: "Dr. Carlos Mendez",
  signature: "Dr. Carlos Mendez - MP 12345",
};

function resolveEvolutionAuthor(
  selectedTreatment: DentalTreatment | undefined,
  evolutions: ClinicalEvolution[]
): EvolutionAuthor {
  if (selectedTreatment) {
    return {
      doctorId: selectedTreatment.doctorId,
      doctorName: selectedTreatment.doctorName,
      signature: `${selectedTreatment.doctorName} - MP pendiente`,
    };
  }

  const lastEvolution = [...evolutions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  if (lastEvolution) {
    return {
      doctorId: lastEvolution.doctorId,
      doctorName: lastEvolution.doctorName,
      signature: `${lastEvolution.doctorName} - MP pendiente`,
    };
  }

  // TODO: reemplazar fallback cuando exista contexto de usuario autenticado.
  return DEFAULT_EVOLUTION_AUTHOR;
}

export function NewEvolutionDialog({
  patientId,
  evolutions,
  open,
  onOpenChange,
  treatments,
  onSave,
}: NewEvolutionDialogProps) {
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [procedures, setProcedures] = useState("");
  const [observations, setObservations] = useState("");
  const [complications, setComplications] = useState("");
  const [nextIndication, setNextIndication] = useState("");

  const activeTreatments = treatments.filter(
    (treatment) => treatment.status === "in_progress" || treatment.status === "pending"
  );

  const handleSubmit = () => {
    const treatment = treatments.find((t) => t.id === selectedTreatment);
    const author = resolveEvolutionAuthor(treatment, evolutions);

    const newEvolution: ClinicalEvolution = {
      id: `EVO-${Date.now()}`,
      patientId,
      treatmentId: selectedTreatment || undefined,
      date: new Date().toISOString().split("T")[0],
      doctorId: author.doctorId,
      doctorName: author.doctorName,
      proceduresPerformed: procedures
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean),
      teethTreated: treatment?.toothNumbers || [],
      observations,
      complications: complications || undefined,
      nextIndication: nextIndication || undefined,
      signature: author.signature,
      createdAt: new Date().toISOString(),
    };

    onSave(newEvolution);

    setSelectedTreatment("");
    setProcedures("");
    setObservations("");
    setComplications("");
    setNextIndication("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Nueva Evolucion Clinica
          </DialogTitle>
          <DialogDescription>
            Registra los procedimientos y observaciones de esta cita
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tratamiento Relacionado (opcional)</Label>
            <Select value={selectedTreatment} onValueChange={setSelectedTreatment}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tratamiento..." />
              </SelectTrigger>
              <SelectContent>
                {activeTreatments.map((treatment) => (
                  <SelectItem key={treatment.id} value={treatment.id}>
                    {treatment.procedure}
                    {treatment.toothNumbers.length > 0 && ` (${treatment.toothNumbers.join(", ")})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Procedimientos Realizados *</Label>
            <Textarea
              value={procedures}
              onChange={(event) => setProcedures(event.target.value)}
              placeholder="Un procedimiento por linea..."
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Observaciones Clinicas *</Label>
            <Textarea
              value={observations}
              onChange={(event) => setObservations(event.target.value)}
              placeholder="Describa las observaciones del procedimiento..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Complicaciones (si aplica)</Label>
            <Textarea
              value={complications}
              onChange={(event) => setComplications(event.target.value)}
              placeholder="Describa cualquier complicacion..."
            />
          </div>

          <div className="space-y-2">
            <Label>Proxima Indicacion</Label>
            <Input
              value={nextIndication}
              onChange={(event) => setNextIndication(event.target.value)}
              placeholder="Ej: Continuar tratamiento en siguiente cita"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!procedures.trim() || !observations.trim()}
          >
            Guardar y Firmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
