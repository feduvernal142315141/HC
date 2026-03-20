"use client";

import { useMemo, useState } from "react";
import type { ClinicalEvolution, DentalTreatment } from "@/lib/clinical-history/types";

interface UseEvolutionsViewModelParams {
  evolutions: ClinicalEvolution[];
  treatments: DentalTreatment[];
}

export function useEvolutionsViewModel({
  evolutions,
  treatments,
}: UseEvolutionsViewModelParams) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvolutionId, setSelectedEvolutionId] = useState<string | null>(null);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEvolutions = useMemo(
    () =>
      evolutions.filter((evolution) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          evolution.observations.toLowerCase().includes(normalizedSearch) ||
          evolution.proceduresPerformed.some((procedure) =>
            procedure.toLowerCase().includes(normalizedSearch)
          ) ||
          evolution.doctorName.toLowerCase().includes(normalizedSearch)
        );
      }),
    [evolutions, normalizedSearch]
  );

  const groupedByMonth = useMemo(
    () =>
      filteredEvolutions.reduce<Record<string, ClinicalEvolution[]>>(
        (accumulator, evolution) => {
          const date = new Date(evolution.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (!accumulator[monthKey]) {
            accumulator[monthKey] = [];
          }
          accumulator[monthKey].push(evolution);
          return accumulator;
        },
        {}
      ),
    [filteredEvolutions]
  );

  const sortedMonths = useMemo(
    () => Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a)),
    [groupedByMonth]
  );

  const selectedEvolution = useMemo(() => {
    if (!selectedEvolutionId) {
      return null;
    }

    return evolutions.find((evolution) => evolution.id === selectedEvolutionId) ?? null;
  }, [evolutions, selectedEvolutionId]);

  const treatmentById = useMemo(
    () =>
      new Map(
        treatments.map((treatment) => [treatment.id, treatment] as const)
      ),
    [treatments]
  );

  const activitySummary = useMemo(
    () => ({
      total: evolutions.length,
      doctors: new Set(evolutions.map((evolution) => evolution.doctorId)).size,
      treatedTeeth: new Set(evolutions.flatMap((evolution) => evolution.teethTreated)).size,
      withComplications: evolutions.filter((evolution) => evolution.complications).length,
    }),
    [evolutions]
  );

  return {
    searchTerm,
    setSearchTerm,
    selectedEvolution,
    setSelectedEvolutionId,
    filteredEvolutions,
    groupedByMonth,
    sortedMonths,
    treatmentById,
    activitySummary,
  };
}
