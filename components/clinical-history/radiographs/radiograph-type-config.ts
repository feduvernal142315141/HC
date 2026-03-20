import { Camera, Image as ImageIcon } from "lucide-react";
import type { Radiograph } from "@/lib/clinical-history/types";

export const radiographTypeConfig: Record<
  Radiograph["type"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }
> = {
  panoramic: {
    label: "Panorámica",
    icon: ImageIcon,
    color: "text-sky-600 bg-sky-100 dark:bg-sky-900/30",
  },
  periapical: {
    label: "Periapical",
    icon: ImageIcon,
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30",
  },
  bitewing: {
    label: "Bite-wing",
    icon: ImageIcon,
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
  clinical_photo: {
    label: "Foto Clínica",
    icon: Camera,
    color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
  },
  other: {
    label: "Otro",
    icon: ImageIcon,
    color: "text-gray-600 bg-gray-100 dark:bg-gray-800",
  },
};
