"use client";

import { useCallback, useEffect, useState } from "react";
import {
  loadClinicalHistorySnapshot,
  type ClinicalHistorySnapshot,
} from "@/lib/clinical-history/clinical-history-queries";
import type { ClinicalEvolution, DentalTreatment } from "@/lib/clinical-history/types";

interface UseClinicalHistoryDataState {
  snapshot: ClinicalHistorySnapshot | null;
  isLoading: boolean;
  error: string | null;
}

interface UseClinicalHistoryDataResult extends UseClinicalHistoryDataState {
  refresh: () => Promise<void>;
  updateTreatment: (updatedTreatment: DentalTreatment) => void;
  prependEvolution: (newEvolution: ClinicalEvolution) => void;
}

const INITIAL_STATE: UseClinicalHistoryDataState = {
  snapshot: null,
  isLoading: true,
  error: null,
};

export function useClinicalHistoryData(
  patientId: string
): UseClinicalHistoryDataResult {
  const [state, setState] = useState<UseClinicalHistoryDataState>(INITIAL_STATE);

  const refresh = useCallback(async () => {
    setState((previousState) => ({
      ...previousState,
      isLoading: true,
      error: null,
    }));

    try {
      const snapshot = await loadClinicalHistorySnapshot(patientId);
      setState({
        snapshot,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cargar la historia clínica";

      setState((previousState) => ({
        ...previousState,
        isLoading: false,
        error: message,
      }));
    }
  }, [patientId]);

  useEffect(() => {
    let cancelled = false;

    const loadSnapshot = async () => {
      try {
        const snapshot = await loadClinicalHistorySnapshot(patientId);
        if (!cancelled) {
          setState({
            snapshot,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "No se pudo cargar la historia clínica";

        if (!cancelled) {
          setState((previousState) => ({
            ...previousState,
            isLoading: false,
            error: message,
          }));
        }
      }
    };

    void loadSnapshot();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  const updateTreatment = useCallback((updatedTreatment: DentalTreatment) => {
    setState((previousState) => {
      if (!previousState.snapshot) {
        return previousState;
      }

      return {
        ...previousState,
        snapshot: {
          ...previousState.snapshot,
          treatments: previousState.snapshot.treatments.map((treatment) =>
            treatment.id === updatedTreatment.id ? updatedTreatment : treatment
          ),
        },
      };
    });
  }, []);

  const prependEvolution = useCallback((newEvolution: ClinicalEvolution) => {
    setState((previousState) => {
      if (!previousState.snapshot) {
        return previousState;
      }

      return {
        ...previousState,
        snapshot: {
          ...previousState.snapshot,
          evolutions: [newEvolution, ...previousState.snapshot.evolutions],
        },
      };
    });
  }, []);

  return {
    ...state,
    refresh,
    updateTreatment,
    prependEvolution,
  };
}
