import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import type { TreatmentStatus } from "@/lib/clinical-history/types";

export const statusConfig: Record<
  TreatmentStatus,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bgColor: string }
> = {
  pending: {
    label: "Pendiente",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  in_progress: {
    label: "En Proceso",
    icon: Loader2,
    color: "text-sky-600",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
  },
  completed: {
    label: "Completado",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
};

export const specialtyLabels: Record<string, string> = {
  general: "Odontologia General",
  endodontics: "Endodoncia",
  orthodontics: "Ortodoncia",
  periodontics: "Periodoncia",
  surgery: "Cirugia",
  prosthetics: "Protesis",
  pediatric: "Odontopediatria",
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);
