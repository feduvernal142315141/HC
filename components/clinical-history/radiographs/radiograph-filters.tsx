import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Filter, Grid3X3, List, Search } from "lucide-react";
import { radiographTypeConfig } from "./radiograph-type-config";

interface RadiographFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function RadiographFilters({
  searchTerm,
  onSearchTermChange,
  typeFilter,
  onTypeFilterChange,
  viewMode,
  onViewModeChange,
}: RadiographFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por descripción o pieza dental..."
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {Object.entries(radiographTypeConfig).map(([value, { label }]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex rounded-lg border">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          className="h-10 w-10 rounded-r-none"
          onClick={() => onViewModeChange("grid")}
          aria-label="Cambiar a vista de cuadrícula"
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          className="h-10 w-10 rounded-l-none"
          onClick={() => onViewModeChange("list")}
          aria-label="Cambiar a vista de lista"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
