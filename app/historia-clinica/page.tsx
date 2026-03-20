"use client";

import { ClinicalHistoryLayout } from "@/components/clinical-history/clinical-history-layout";
import { DEFAULT_CLINICAL_PATIENT_ID } from "@/lib/clinical-history/constants";

export default function ClinicalHistoryPage() {
  return <ClinicalHistoryLayout patientId={DEFAULT_CLINICAL_PATIENT_ID} />;
}
