// Clinical History Types - Dental SaaS
// Ready for backend integration - just swap mock data for API calls

export type AlertSeverity = "critical" | "warning" | "info"
export type TreatmentStatus = "pending" | "in_progress" | "completed" | "cancelled"
export type DocumentStatus = "pending" | "signed" | "expired" | "revoked"
export type BudgetStatus = "proposed" | "approved" | "rejected" | "expired"
export type PaymentStatus = "pending" | "completed" | "cancelled" | "refunded"
export type RadiographType = "periapical" | "panoramic" | "bitewing" | "clinical_photo" | "other"
export type DocumentType = "consent" | "authorization" | "surgical_consent" | "legal" | "other"
export type PaymentMethod = "cash" | "card" | "transfer" | "other"

export interface ClinicalAlert {
  id: string
  type: "allergy" | "disease" | "medication" | "pregnancy" | "anticoagulant" | "infectious"
  severity: AlertSeverity
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface PatientClinical {
  id: string
  name: string
  age: number
  gender: "M" | "F" | "O"
  phone: string
  email: string
  photoUrl?: string
  bloodType?: string
  insurancePlan?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  alerts: ClinicalAlert[]
  lastVisit?: string
  nextAppointment?: string
}

export interface MedicalHistory {
  id: string
  patientId: string
  // Personal Info
  occupation?: string
  maritalStatus?: string
  address?: string
  // Emergency contact
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  insurance?: {
    provider: string
    policyNumber: string
    validUntil: string
  }
  // Systemic diseases
  systemicDiseases: string[]
  currentMedications: string[]
  allergies: string[]
  previousSurgeries: string[]
  // Dental specific
  chiefComplaint: string
  habits: string[] // bruxism, smoking, etc.
  currentPain?: {
    location: string
    intensity: number // 1-10
    type: string
    duration?: string
  }
  lastDentalVisit?: string
  // Validation
  isValidated: boolean
  validatedAt?: string
  validatedBy?: string
  updatedAt: string
  createdAt: string
}

export interface DentalTreatment {
  id: string
  patientId: string
  toothNumbers: number[] // FDI notation
  diagnosis: string
  procedure: string
  specialty: "general" | "endodontics" | "orthodontics" | "periodontics" | "surgery" | "prosthetics" | "pediatric" | "implantology"
  status: TreatmentStatus
  cost: number
  doctorId: string
  doctorName: string
  notes?: string
  consentId?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ClinicalEvolution {
  id: string
  patientId: string
  treatmentId?: string
  date: string
  doctorId: string
  doctorName: string
  proceduresPerformed: string[]
  teethTreated: number[]
  observations: string
  complications?: string
  nextIndication?: string
  attachments?: string[]
  signature?: string
  signedAt?: string
  createdAt: string
}

export interface Radiograph {
  id: string
  patientId: string
  type: RadiographType
  toothNumbers?: number[]
  imageUrl: string
  thumbnailUrl?: string
  title: string
  description?: string
  doctorId: string
  doctorName: string
  takenAt: string
  createdAt: string
}

export interface Document {
  id: string
  patientId: string
  type: DocumentType
  title: string
  description?: string
  fileUrl?: string
  status: DocumentStatus
  expirationDate?: string
  treatmentId?: string
  signedBy?: string
  signedAt?: string
  professionalSignature?: string
  professionalSignedAt?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TreatmentPlanItem {
  treatmentId: string
  order: number
  priority: "urgent" | "high" | "medium" | "low"
  dependsOn?: string[]
  status: TreatmentStatus
  notes?: string
}

export interface TreatmentPlan {
  id: string
  patientId: string
  name: string
  description?: string
  treatments: TreatmentPlanItem[]
  status: "pending" | "active" | "completed" | "cancelled"
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface BudgetItem {
  treatmentId: string
  description: string
  toothNumber?: number
  unitPrice: number
  quantity: number
  discount: number
  finalPrice: number
}

export interface Budget {
  id: string
  patientId: string
  treatmentPlanId?: string
  items: BudgetItem[]
  subtotal: number
  discount: number
  total: number
  paidAmount: number
  status: BudgetStatus
  notes?: string
  patientSignature?: string
  patientSignedAt?: string
  validUntil?: string
  approvedAt?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  patientId: string
  budgetId?: string
  treatmentId?: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  concept: string
  receiptNumber?: string
  reference?: string
  notes?: string
  processedBy?: string
  date: string
  createdAt: string
}

export interface AuditLog {
  id: string
  patientId: string
  action: "view" | "create" | "update" | "sign" | "export" | "delete"
  entity: string
  entityId: string
  userId: string
  userName: string
  userRole: string
  details?: string
  reason?: string
  previousValue?: string
  newValue?: string
  ipAddress?: string
  timestamp: string
}

// Summary types for dashboard
export interface DentalSummaryData {
  activeTreatments: number
  pendingTreatments: number
  completedTreatments: number
  criticalTeeth: number[]
  lastVisit?: string
  nextAppointment?: string
  approvedBudget: number
  pendingBudget: number
  totalPaid: number
  totalOwed: number
  mainDiagnoses: string[]
}
