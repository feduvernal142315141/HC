import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FilePlus,
  FileSignature,
  FileText,
  Shield,
  XCircle,
} from "lucide-react"
import type { DocumentStatus, DocumentType } from "@/lib/clinical-history/types"

export const documentTypeLabels: Record<DocumentType, string> = {
  consent: "Consentimiento Informado",
  authorization: "Autorización de Tratamiento",
  surgical_consent: "Consentimiento Quirúrgico",
  legal: "Documento Legal",
  other: "Otro Documento",
}

export const documentTypeIcons: Record<DocumentType, ReactNode> = {
  consent: <FileSignature className="h-4 w-4" />,
  authorization: <CheckCircle2 className="h-4 w-4" />,
  surgical_consent: <Shield className="h-4 w-4" />,
  legal: <FileText className="h-4 w-4" />,
  other: <FilePlus className="h-4 w-4" />,
}

interface DocumentStatusConfig {
  label: string
  color: string
  icon: LucideIcon
}

export const statusConfig: Record<DocumentStatus, DocumentStatusConfig> = {
  pending: {
    label: "Pendiente de Firma",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  signed: {
    label: "Firmado",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
  },
  expired: {
    label: "Expirado",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: AlertTriangle,
  },
  revoked: {
    label: "Revocado",
    color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    icon: XCircle,
  },
}
