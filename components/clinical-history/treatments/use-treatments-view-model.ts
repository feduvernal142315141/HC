import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { DentalTreatment, TreatmentStatus } from "@/lib/clinical-history/types";
import { statusConfig } from "./treatments-domain";

interface UseTreatmentsViewModelParams {
  treatments: DentalTreatment[];
  onTreatmentUpdate: (treatment: DentalTreatment) => void;
}

export function useTreatmentsViewModel({ treatments, onTreatmentUpdate }: UseTreatmentsViewModelParams) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [selectedTreatment, setSelectedTreatment] = useState<DentalTreatment | null>(null);

  const filteredTreatments = useMemo(
    () =>
      treatments.filter((treatment) => {
        const matchesSearch =
          treatment.procedure.toLowerCase().includes(searchTerm.toLowerCase()) ||
          treatment.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
          treatment.toothNumbers.some((num) => String(num).includes(searchTerm));

        const matchesStatus = statusFilter === "all" || treatment.status === statusFilter;
        const matchesSpecialty = specialtyFilter === "all" || treatment.specialty === specialtyFilter;

        return matchesSearch && matchesStatus && matchesSpecialty;
      }),
    [searchTerm, specialtyFilter, statusFilter, treatments],
  );

  const groupedByStatus = useMemo(
    () => ({
      in_progress: filteredTreatments.filter((t) => t.status === "in_progress"),
      pending: filteredTreatments.filter((t) => t.status === "pending"),
      completed: filteredTreatments.filter((t) => t.status === "completed"),
      cancelled: filteredTreatments.filter((t) => t.status === "cancelled"),
    }),
    [filteredTreatments],
  );

  const totalCost = useMemo(() => treatments.reduce((sum, t) => sum + t.cost, 0), [treatments]);
  const completedCost = useMemo(
    () => treatments.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.cost, 0),
    [treatments],
  );
  const progress = totalCost > 0 ? (completedCost / totalCost) * 100 : 0;

  const handleStatusChange = (treatment: DentalTreatment, newStatus: TreatmentStatus) => {
    const updated = { ...treatment, status: newStatus, updatedAt: new Date().toISOString() };
    onTreatmentUpdate(updated);
    toast.success(`Tratamiento actualizado a "${statusConfig[newStatus].label}"`);
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    specialtyFilter,
    setSpecialtyFilter,
    selectedTreatment,
    setSelectedTreatment,
    filteredTreatments,
    groupedByStatus,
    totalCost,
    progress,
    handleStatusChange,
  };
}
