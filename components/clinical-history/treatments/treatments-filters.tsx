import { Filter, Search, Stethoscope } from "lucide-react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { TreatmentStatus } from "@/lib/clinical-history/types";
import { specialtyLabels, statusConfig } from "./treatments-domain";

interface TreatmentsFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  specialtyFilter: string;
  onSpecialtyFilterChange: (value: string) => void;
}

export function TreatmentsFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  specialtyFilter,
  onSpecialtyFilterChange,
}: TreatmentsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por procedimiento, diagnostico o pieza..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {Object.entries(statusConfig).map(([value, { label }]) => (
            <SelectItem key={value} value={value as TreatmentStatus}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={specialtyFilter} onValueChange={onSpecialtyFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Stethoscope className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Especialidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las especialidades</SelectItem>
          {Object.entries(specialtyLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
