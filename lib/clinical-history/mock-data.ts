// Mock Data for Clinical History Module
// Ready for backend integration - replace with API calls

import type {
  PatientClinical,
  MedicalHistory,
  DentalTreatment,
  ClinicalEvolution,
  Radiograph,
  Document,
  Budget,
  TreatmentPlan,
  Payment,
  DentalSummaryData,
  AuditLog,
} from "./types"

export const mockPatient: PatientClinical = {
  id: "PAT-001",
  name: "Maria Garcia Lopez",
  age: 34,
  gender: "F",
  phone: "+52 55 1234 5678",
  email: "maria.garcia@email.com",
  bloodType: "O+",
  insurancePlan: "MetLife Dental Premium",
  emergencyContact: {
    name: "Juan Garcia",
    phone: "+52 55 8765 4321",
    relationship: "Esposo",
  },
  alerts: [
    {
      id: "ALT-001",
      type: "allergy",
      severity: "critical",
      title: "Alergia a Penicilina",
      description: "Reaccion anafilactica documentada. Usar alternativas.",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "ALT-002",
      type: "disease",
      severity: "warning",
      title: "Diabetes Tipo 2",
      description: "Controlada con metformina. Verificar niveles antes de cirugias.",
      createdAt: "2024-02-20T14:30:00Z",
      updatedAt: "2024-02-20T14:30:00Z",
    },
    {
      id: "ALT-003",
      type: "medication",
      severity: "info",
      title: "Anticonceptivos",
      description: "Toma anticonceptivos orales diarios.",
      createdAt: "2024-03-10T09:00:00Z",
      updatedAt: "2024-03-10T09:00:00Z",
    },
  ],
  lastVisit: "2024-12-15",
  nextAppointment: "2025-01-20",
}

export const mockMedicalHistory: MedicalHistory = {
  id: "MH-001",
  patientId: "PAT-001",
  occupation: "Contadora",
  maritalStatus: "Casada",
  address: "Av. Insurgentes Sur 1234, Col. Del Valle, CDMX",
  emergencyContact: {
    name: "Juan Garcia",
    phone: "+52 55 8765 4321",
    relationship: "Esposo",
  },
  insurance: {
    provider: "MetLife",
    policyNumber: "POL-2024-123456",
    validUntil: "2025-12-31",
  },
  systemicDiseases: ["Diabetes Tipo 2", "Hipertension controlada"],
  currentMedications: ["Metformina 850mg", "Losartan 50mg", "Anticonceptivos orales"],
  allergies: ["Penicilina", "Latex"],
  previousSurgeries: ["Apendicectomia (2018)", "Cesarea (2020)"],
  chiefComplaint: "Dolor en molar inferior derecho al masticar",
  habits: ["Bruxismo nocturno"],
  currentPain: {
    location: "Pieza 46",
    intensity: 6,
    type: "Punzante al masticar",
    duration: "2 semanas",
  },
  lastDentalVisit: "2024-06-15",
  isValidated: true,
  validatedAt: "2024-12-01T10:00:00Z",
  validatedBy: "Dr. Carlos Mendez",
  updatedAt: "2024-12-15T14:30:00Z",
  createdAt: "2024-01-10T09:00:00Z",
}

export const mockTreatments: DentalTreatment[] = [
  {
    id: "TRT-001",
    patientId: "PAT-001",
    toothNumbers: [46],
    diagnosis: "Caries profunda con compromiso pulpar",
    procedure: "Endodoncia",
    specialty: "endodontics",
    status: "in_progress",
    cost: 5500,
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    notes: "Primera sesion de conductos completada. Requiere 2 sesiones mas.",
    consentId: "DOC-001",
    startedAt: "2024-12-15T10:00:00Z",
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-15T12:00:00Z",
  },
  {
    id: "TRT-002",
    patientId: "PAT-001",
    toothNumbers: [46],
    diagnosis: "Post-endodoncia",
    procedure: "Corona metal-porcelana",
    specialty: "prosthetics",
    status: "pending",
    cost: 4500,
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    notes: "Programar despues de terminar endodoncia",
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-10T09:00:00Z",
  },
  {
    id: "TRT-003",
    patientId: "PAT-001",
    toothNumbers: [36],
    diagnosis: "Caries oclusal media",
    procedure: "Resina compuesta",
    specialty: "general",
    status: "completed",
    cost: 1200,
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    startedAt: "2024-11-20T11:00:00Z",
    completedAt: "2024-11-20T12:00:00Z",
    createdAt: "2024-11-15T09:00:00Z",
    updatedAt: "2024-11-20T12:00:00Z",
  },
  {
    id: "TRT-004",
    patientId: "PAT-001",
    toothNumbers: [17, 27],
    diagnosis: "Terceros molares impactados",
    procedure: "Extraccion quirurgica bilateral",
    specialty: "surgery",
    status: "pending",
    cost: 6000,
    doctorId: "DOC-002",
    doctorName: "Dra. Ana Rodriguez",
    notes: "Programar cirugia. Paciente prefiere sedacion consciente.",
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-01T09:00:00Z",
  },
  {
    id: "TRT-005",
    patientId: "PAT-001",
    toothNumbers: [11, 21],
    diagnosis: "Desgaste por bruxismo",
    procedure: "Carillas de porcelana",
    specialty: "prosthetics",
    status: "pending",
    cost: 12000,
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    notes: "Requiere guarda nocturna previamente.",
    createdAt: "2024-12-05T09:00:00Z",
    updatedAt: "2024-12-05T09:00:00Z",
  },
  {
    id: "TRT-006",
    patientId: "PAT-001",
    toothNumbers: [],
    diagnosis: "Bruxismo nocturno",
    procedure: "Guarda oclusal",
    specialty: "general",
    status: "pending",
    cost: 2500,
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    createdAt: "2024-12-05T09:30:00Z",
    updatedAt: "2024-12-05T09:30:00Z",
  },
  {
    id: "TRT-007",
    patientId: "PAT-001",
    toothNumbers: [14, 15],
    diagnosis: "Gingivitis localizada",
    procedure: "Limpieza profunda",
    specialty: "periodontics",
    status: "completed",
    cost: 800,
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    startedAt: "2024-10-05T10:00:00Z",
    completedAt: "2024-10-05T11:00:00Z",
    createdAt: "2024-10-01T09:00:00Z",
    updatedAt: "2024-10-05T11:00:00Z",
  },
]

export const mockEvolutions: ClinicalEvolution[] = [
  {
    id: "EVO-001",
    patientId: "PAT-001",
    treatmentId: "TRT-001",
    date: "2024-12-15",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    proceduresPerformed: ["Apertura cameral", "Conductometria", "Preparacion biomecanica"],
    teethTreated: [46],
    observations:
      "Se realizo primera sesion de endodoncia. Tres conductos localizados (MV, DV, D). Longitud de trabajo establecida. Paciente tolero bien el procedimiento.",
    nextIndication: "Continuar preparacion y obturacion en siguiente cita. Mantener medicacion intraconducto.",
    signature: "Dr. Carlos Mendez - MP 12345",
    signedAt: "2024-12-15T12:00:00Z",
    createdAt: "2024-12-15T12:00:00Z",
  },
  {
    id: "EVO-002",
    patientId: "PAT-001",
    treatmentId: "TRT-003",
    date: "2024-11-20",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    proceduresPerformed: [
      "Eliminacion de caries",
      "Grabado acido",
      "Aplicacion de adhesivo",
      "Restauracion con resina",
    ],
    teethTreated: [36],
    observations:
      "Caries oclusal clase I eliminada completamente. Restauracion con resina A2. Ajuste oclusal realizado. Sin sensibilidad post-operatoria.",
    signature: "Dr. Carlos Mendez - MP 12345",
    signedAt: "2024-11-20T12:00:00Z",
    createdAt: "2024-11-20T12:00:00Z",
  },
  {
    id: "EVO-003",
    patientId: "PAT-001",
    treatmentId: "TRT-007",
    date: "2024-10-05",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    proceduresPerformed: ["Detartraje supragingival", "Pulido dental", "Aplicacion de fluor"],
    teethTreated: [14, 15],
    observations:
      "Limpieza profunda realizada en zona de premolares superiores derechos. Se elimino calculo subgingival. Encias con leve sangrado.",
    nextIndication: "Reforzar tecnica de cepillado en zona. Control en 3 meses.",
    signature: "Dr. Carlos Mendez - MP 12345",
    signedAt: "2024-10-05T11:00:00Z",
    createdAt: "2024-10-05T11:00:00Z",
  },
  {
    id: "EVO-004",
    patientId: "PAT-001",
    date: "2024-10-05",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    proceduresPerformed: ["Examen clinico completo", "Toma de radiografias", "Plan de tratamiento"],
    teethTreated: [],
    observations:
      "Primera consulta. Se realiza examen completo y plan de tratamiento integral. Paciente acepta presupuesto para tratamientos prioritarios. Se detectan multiples necesidades de tratamiento.",
    nextIndication: "Iniciar con tratamiento de pieza 36 por ser menos invasivo.",
    signature: "Dr. Carlos Mendez - MP 12345",
    signedAt: "2024-10-05T11:00:00Z",
    createdAt: "2024-10-05T11:00:00Z",
  },
]

export const mockRadiographs: Radiograph[] = [
  {
    id: "RAD-001",
    patientId: "PAT-001",
    type: "panoramic",
    imageUrl: "/placeholder.svg?height=400&width=800",
    thumbnailUrl: "/placeholder.svg?height=100&width=200",
    title: "Radiografia panoramica inicial",
    description: "Panoramica de diagnostico inicial. Se observan terceros molares impactados bilaterales.",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    takenAt: "2024-10-05",
    createdAt: "2024-10-05T10:30:00Z",
  },
  {
    id: "RAD-002",
    patientId: "PAT-001",
    type: "periapical",
    toothNumbers: [46],
    imageUrl: "/placeholder.svg?height=300&width=300",
    thumbnailUrl: "/placeholder.svg?height=100&width=100",
    title: "Periapical pieza 46",
    description: "Evaluacion pulpar. Se observa imagen radiolucida periapical compatible con lesion.",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    takenAt: "2024-12-10",
    createdAt: "2024-12-10T09:30:00Z",
  },
  {
    id: "RAD-003",
    patientId: "PAT-001",
    type: "bitewing",
    toothNumbers: [16, 17, 46, 47],
    imageUrl: "/placeholder.svg?height=200&width=400",
    thumbnailUrl: "/placeholder.svg?height=100&width=200",
    title: "Bitewing derecho",
    description: "Control de caries interproximales lado derecho.",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    takenAt: "2024-10-05",
    createdAt: "2024-10-05T10:45:00Z",
  },
  {
    id: "RAD-004",
    patientId: "PAT-001",
    type: "bitewing",
    toothNumbers: [26, 27, 36, 37],
    imageUrl: "/placeholder.svg?height=200&width=400",
    thumbnailUrl: "/placeholder.svg?height=100&width=200",
    title: "Bitewing izquierdo",
    description: "Control de caries interproximales lado izquierdo.",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    takenAt: "2024-10-05",
    createdAt: "2024-10-05T10:50:00Z",
  },
  {
    id: "RAD-005",
    patientId: "PAT-001",
    type: "clinical_photo",
    toothNumbers: [11, 21],
    imageUrl: "/placeholder.svg?height=400&width=600",
    thumbnailUrl: "/placeholder.svg?height=100&width=150",
    title: "Fotografia frontal - Desgaste incisivos",
    description: "Documentacion fotografica del desgaste en borde incisal por bruxismo.",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    takenAt: "2024-12-05",
    createdAt: "2024-12-05T10:00:00Z",
  },
  {
    id: "RAD-006",
    patientId: "PAT-001",
    type: "periapical",
    toothNumbers: [46],
    imageUrl: "/placeholder.svg?height=300&width=300",
    thumbnailUrl: "/placeholder.svg?height=100&width=100",
    title: "Periapical pieza 46 - Control endodoncia",
    description: "Control post primera sesion de endodoncia. Medicacion intraconducto colocada.",
    doctorId: "DOC-001",
    doctorName: "Dr. Carlos Mendez",
    takenAt: "2024-12-15",
    createdAt: "2024-12-15T11:30:00Z",
  },
]

export const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    patientId: "PAT-001",
    type: "consent",
    title: "Consentimiento para Endodoncia",
    description: "Autorizacion para tratamiento de conductos en pieza 46",
    status: "signed",
    treatmentId: "TRT-001",
    signedBy: "Maria Garcia Lopez",
    signedAt: "2024-12-10T09:00:00Z",
    professionalSignature: "Dr. Carlos Mendez",
    professionalSignedAt: "2024-12-10T09:05:00Z",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-12-10T08:50:00Z",
    updatedAt: "2024-12-10T09:05:00Z",
  },
  {
    id: "DOC-002",
    patientId: "PAT-001",
    type: "authorization",
    title: "Autorizacion de Plan de Tratamiento",
    description: "Aceptacion del plan de tratamiento integral propuesto",
    status: "signed",
    signedBy: "Maria Garcia Lopez",
    signedAt: "2024-10-05T11:30:00Z",
    professionalSignature: "Dr. Carlos Mendez",
    professionalSignedAt: "2024-10-05T11:35:00Z",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-10-05T11:00:00Z",
    updatedAt: "2024-10-05T11:35:00Z",
  },
  {
    id: "DOC-003",
    patientId: "PAT-001",
    type: "surgical_consent",
    title: "Consentimiento Quirurgico - Terceros Molares",
    description: "Pendiente de firma para extraccion de terceros molares",
    status: "pending",
    treatmentId: "TRT-004",
    expirationDate: "2025-03-01",
    createdBy: "Dra. Ana Rodriguez",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "DOC-004",
    patientId: "PAT-001",
    type: "consent",
    title: "Consentimiento para Protesis",
    description: "Autorizacion para colocacion de corona en pieza 46",
    status: "pending",
    treatmentId: "TRT-002",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-12-10T09:30:00Z",
    updatedAt: "2024-12-10T09:30:00Z",
  },
  {
    id: "DOC-005",
    patientId: "PAT-001",
    type: "legal",
    title: "Aviso de Privacidad",
    description: "Documento de proteccion de datos personales",
    status: "signed",
    signedBy: "Maria Garcia Lopez",
    signedAt: "2024-10-05T10:00:00Z",
    createdBy: "Sistema",
    createdAt: "2024-10-05T09:55:00Z",
    updatedAt: "2024-10-05T10:00:00Z",
  },
]

export const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: "PLAN-001",
    patientId: "PAT-001",
    name: "Rehabilitacion Pieza 46",
    description: "Plan completo para rehabilitacion del primer molar inferior derecho",
    treatments: [
      {
        treatmentId: "TRT-001",
        order: 1,
        priority: "urgent",
        status: "in_progress",
        notes: "Iniciar con endodoncia por compromiso pulpar",
      },
      {
        treatmentId: "TRT-002",
        order: 2,
        priority: "high",
        dependsOn: ["TRT-001"],
        status: "pending",
        notes: "Corona despues de endodoncia",
      },
    ],
    status: "active",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-15T12:00:00Z",
  },
  {
    id: "PLAN-002",
    patientId: "PAT-001",
    name: "Tratamiento de Bruxismo",
    description: "Plan para manejo del bruxismo y rehabilitacion estetica",
    treatments: [
      {
        treatmentId: "TRT-006",
        order: 1,
        priority: "high",
        status: "pending",
        notes: "Guarda oclusal primero",
      },
      {
        treatmentId: "TRT-005",
        order: 2,
        priority: "medium",
        dependsOn: ["TRT-006"],
        status: "pending",
        notes: "Carillas despues de estabilizar oclusion",
      },
    ],
    status: "pending",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-12-05T10:00:00Z",
    updatedAt: "2024-12-05T10:00:00Z",
  },
  {
    id: "PLAN-003",
    patientId: "PAT-001",
    name: "Cirugia de Terceros Molares",
    description: "Extraccion quirurgica de terceros molares impactados",
    treatments: [
      {
        treatmentId: "TRT-004",
        order: 1,
        priority: "medium",
        status: "pending",
        notes: "Programar con sedacion consciente",
      },
    ],
    status: "pending",
    createdBy: "Dra. Ana Rodriguez",
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2024-12-01T09:00:00Z",
  },
]

export const mockBudgets: Budget[] = [
  {
    id: "BUD-001",
    patientId: "PAT-001",
    treatmentPlanId: "PLAN-001",
    items: [
      {
        treatmentId: "TRT-001",
        description: "Endodoncia pieza 46",
        toothNumber: 46,
        unitPrice: 5500,
        quantity: 1,
        discount: 0,
        finalPrice: 5500,
      },
      {
        treatmentId: "TRT-002",
        description: "Corona metal-porcelana pieza 46",
        toothNumber: 46,
        unitPrice: 4500,
        quantity: 1,
        discount: 10,
        finalPrice: 4050,
      },
    ],
    subtotal: 10000,
    discount: 450,
    total: 9550,
    paidAmount: 5500,
    status: "approved",
    notes: "Presupuesto para rehabilitacion completa de pieza 46",
    patientSignature: "Maria Garcia Lopez",
    patientSignedAt: "2024-12-10T09:30:00Z",
    validUntil: "2025-03-10",
    approvedAt: "2024-12-10T09:30:00Z",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-15T12:00:00Z",
  },
  {
    id: "BUD-002",
    patientId: "PAT-001",
    treatmentPlanId: "PLAN-002",
    items: [
      {
        treatmentId: "TRT-006",
        description: "Guarda oclusal",
        unitPrice: 2500,
        quantity: 1,
        discount: 0,
        finalPrice: 2500,
      },
      {
        treatmentId: "TRT-005",
        description: "Carillas de porcelana",
        toothNumber: 11,
        unitPrice: 6000,
        quantity: 2,
        discount: 15,
        finalPrice: 10200,
      },
    ],
    subtotal: 14500,
    discount: 1800,
    total: 12700,
    paidAmount: 0,
    status: "proposed",
    notes: "Presupuesto para tratamiento de bruxismo y estetica",
    validUntil: "2025-02-05",
    createdBy: "Dr. Carlos Mendez",
    createdAt: "2024-12-05T10:30:00Z",
    updatedAt: "2024-12-05T10:30:00Z",
  },
  {
    id: "BUD-003",
    patientId: "PAT-001",
    treatmentPlanId: "PLAN-003",
    items: [
      {
        treatmentId: "TRT-004",
        description: "Extraccion quirurgica terceros molares (bilateral)",
        unitPrice: 3000,
        quantity: 2,
        discount: 0,
        finalPrice: 6000,
      },
    ],
    subtotal: 6000,
    discount: 0,
    total: 6000,
    paidAmount: 0,
    status: "proposed",
    notes: "Incluye sedacion consciente",
    validUntil: "2025-03-01",
    createdBy: "Dra. Ana Rodriguez",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
  },
]

export const mockPayments: Payment[] = [
  {
    id: "PAY-001",
    patientId: "PAT-001",
    budgetId: "BUD-001",
    treatmentId: "TRT-003",
    amount: 1200,
    method: "card",
    status: "completed",
    concept: "Resina compuesta pieza 36",
    receiptNumber: "REC-2024-001",
    reference: "TXN-2024-11-20-001",
    processedBy: "Recepcion",
    date: "2024-11-20T12:30:00Z",
    createdAt: "2024-11-20T12:30:00Z",
  },
  {
    id: "PAY-002",
    patientId: "PAT-001",
    budgetId: "BUD-001",
    treatmentId: "TRT-001",
    amount: 2750,
    method: "transfer",
    status: "completed",
    concept: "Anticipo 50% Endodoncia pieza 46",
    receiptNumber: "REC-2024-002",
    reference: "SPEI-2024-12-10-001",
    notes: "Transferencia bancaria",
    processedBy: "Recepcion",
    date: "2024-12-10T09:30:00Z",
    createdAt: "2024-12-10T09:30:00Z",
  },
  {
    id: "PAY-003",
    patientId: "PAT-001",
    budgetId: "BUD-001",
    treatmentId: "TRT-001",
    amount: 2750,
    method: "cash",
    status: "completed",
    concept: "Liquidacion Endodoncia pieza 46",
    receiptNumber: "REC-2024-003",
    processedBy: "Recepcion",
    date: "2024-12-15T12:00:00Z",
    createdAt: "2024-12-15T12:00:00Z",
  },
  {
    id: "PAY-004",
    patientId: "PAT-001",
    treatmentId: "TRT-007",
    amount: 800,
    method: "card",
    status: "completed",
    concept: "Limpieza profunda",
    receiptNumber: "REC-2024-004",
    reference: "TXN-2024-10-05-001",
    processedBy: "Recepcion",
    date: "2024-10-05T11:30:00Z",
    createdAt: "2024-10-05T11:30:00Z",
  },
]

export const mockDentalSummary: DentalSummaryData = {
  activeTreatments: 1,
  pendingTreatments: 4,
  completedTreatments: 2,
  criticalTeeth: [46, 17, 27],
  lastVisit: "2024-12-15",
  nextAppointment: "2025-01-20",
  approvedBudget: 9550,
  pendingBudget: 18700,
  totalPaid: 7500,
  totalOwed: 2050,
  mainDiagnoses: ["Caries profunda con compromiso pulpar", "Terceros molares impactados", "Bruxismo nocturno"],
}

export const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    patientId: "PAT-001",
    action: "view",
    entity: "clinical-history",
    entityId: "PAT-001",
    userId: "DOC-001",
    userName: "Dr. Carlos Mendez",
    userRole: "doctor",
    timestamp: "2024-12-15T10:00:00Z",
  },
  {
    id: "LOG-002",
    patientId: "PAT-001",
    action: "update",
    entity: "evolution",
    entityId: "EVO-001",
    userId: "DOC-001",
    userName: "Dr. Carlos Mendez",
    userRole: "doctor",
    details: "Agrego evolucion de tratamiento",
    timestamp: "2024-12-15T12:00:00Z",
  },
  {
    id: "LOG-003",
    patientId: "PAT-001",
    action: "sign",
    entity: "document",
    entityId: "DOC-001",
    userId: "DOC-001",
    userName: "Dr. Carlos Mendez",
    userRole: "doctor",
    details: "Firmo consentimiento de endodoncia",
    timestamp: "2024-12-10T09:05:00Z",
  },
]

// Service functions - ready to swap for API calls
export const clinicalHistoryService = {
  getPatient: async (id: string): Promise<PatientClinical> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (mockPatient.id !== id) {
      throw new Error("Patient not found")
    }
    return mockPatient
  },

  getMedicalHistory: async (patientId: string): Promise<MedicalHistory> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (mockMedicalHistory.patientId !== patientId) {
      throw new Error("Medical history not found")
    }
    return mockMedicalHistory
  },

  getTreatments: async (patientId: string): Promise<DentalTreatment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    return mockTreatments.filter((treatment) => treatment.patientId === patientId)
  },

  getEvolutions: async (patientId: string): Promise<ClinicalEvolution[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockEvolutions.filter((evolution) => evolution.patientId === patientId)
  },

  getRadiographs: async (patientId: string): Promise<Radiograph[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockRadiographs.filter((radiograph) => radiograph.patientId === patientId)
  },

  getDocuments: async (patientId: string): Promise<Document[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockDocuments.filter((document) => document.patientId === patientId)
  },

  getBudgets: async (patientId: string): Promise<Budget[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockBudgets.filter((budget) => budget.patientId === patientId)
  },

  getTreatmentPlans: async (patientId: string): Promise<TreatmentPlan[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockTreatmentPlans.filter((plan) => plan.patientId === patientId)
  },

  getPayments: async (patientId: string): Promise<Payment[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockPayments.filter((payment) => payment.patientId === patientId)
  },

  getDentalSummary: async (patientId: string): Promise<DentalSummaryData> => {
    await new Promise((resolve) => setTimeout(resolve, 150))
    if (patientId !== mockPatient.id) {
      throw new Error("Dental summary not found")
    }
    return mockDentalSummary
  },

  getAuditLogs: async (patientId: string): Promise<AuditLog[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockAuditLogs.filter((log) => log.patientId === patientId)
  },

  // Mutations - ready for backend
  updateTreatment: async (id: string, data: Partial<DentalTreatment>): Promise<DentalTreatment> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const treatment = mockTreatments.find((t) => t.id === id)
    if (!treatment) throw new Error("Treatment not found")
    return { ...treatment, ...data, updatedAt: new Date().toISOString() }
  },

  createEvolution: async (data: Omit<ClinicalEvolution, "id" | "createdAt">): Promise<ClinicalEvolution> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      ...data,
      id: `EVO-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
  },

  signDocument: async (id: string, signature: string, role: "patient" | "doctor"): Promise<Document> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const doc = mockDocuments.find((d) => d.id === id)
    if (!doc) throw new Error("Document not found")
    const timestamp = new Date().toISOString()
    return {
      ...doc,
      ...(role === "patient" ? { signedBy: signature, signedAt: timestamp } : {}),
      ...(role === "doctor" ? { professionalSignature: signature, professionalSignedAt: timestamp } : {}),
      updatedAt: timestamp,
    }
  },
}
