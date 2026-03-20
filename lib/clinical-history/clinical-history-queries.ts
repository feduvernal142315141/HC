import { clinicalHistoryService } from "@/lib/clinical-history/mock-data";
import type {
  Budget,
  ClinicalEvolution,
  DentalSummaryData,
  DentalTreatment,
  Document,
  MedicalHistory,
  PatientClinical,
  Payment,
  Radiograph,
  TreatmentPlan,
} from "@/lib/clinical-history/types";

export interface ClinicalHistorySnapshot {
  patient: PatientClinical;
  medicalHistory: MedicalHistory;
  treatments: DentalTreatment[];
  evolutions: ClinicalEvolution[];
  radiographs: Radiograph[];
  documents: Document[];
  budgets: Budget[];
  treatmentPlans: TreatmentPlan[];
  payments: Payment[];
  dentalSummary: DentalSummaryData;
}

export async function loadClinicalHistorySnapshot(
  patientId: string
): Promise<ClinicalHistorySnapshot> {
  const [
    patient,
    medicalHistory,
    treatments,
    evolutions,
    radiographs,
    documents,
    budgets,
    treatmentPlans,
    payments,
    dentalSummary,
  ] = await Promise.all([
    clinicalHistoryService.getPatient(patientId),
    clinicalHistoryService.getMedicalHistory(patientId),
    clinicalHistoryService.getTreatments(patientId),
    clinicalHistoryService.getEvolutions(patientId),
    clinicalHistoryService.getRadiographs(patientId),
    clinicalHistoryService.getDocuments(patientId),
    clinicalHistoryService.getBudgets(patientId),
    clinicalHistoryService.getTreatmentPlans(patientId),
    clinicalHistoryService.getPayments(patientId),
    clinicalHistoryService.getDentalSummary(patientId),
  ]);

  return {
    patient,
    medicalHistory,
    treatments,
    evolutions,
    radiographs,
    documents,
    budgets,
    treatmentPlans,
    payments,
    dentalSummary,
  };
}
