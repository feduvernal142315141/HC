"use client";

import {
  Card,
  CardContent,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Separator,
} from "@/components/ui";
import type { DentalTreatment, TreatmentStatus } from "@/lib/clinical-history/types";
import {
  Plus,
  MoreHorizontal,
  Stethoscope,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Edit,
  Eye,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { toast } from "sonner";
import { useTreatmentsViewModel } from "./treatments/use-treatments-view-model";
import { TreatmentsFilters } from "./treatments/treatments-filters";
import { TreatmentsProgressOverview } from "./treatments/treatments-progress-overview";
import { formatCurrency, specialtyLabels, statusConfig } from "./treatments/treatments-domain";

interface TreatmentsSectionProps {
  treatments: DentalTreatment[];
  onTreatmentUpdate: (treatment: DentalTreatment) => void;
}

export function TreatmentsSection({ treatments, onTreatmentUpdate }: TreatmentsSectionProps) {
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    specialtyFilter,
    setSpecialtyFilter,
    selectedTreatment,
    setSelectedTreatment,
    filteredTreatments,
    groupedByStatus,
    totalCost,
    progress,
    handleStatusChange,
  } = useTreatmentsViewModel({ treatments, onTreatmentUpdate });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tratamientos Dentales</h2>
          <p className="text-muted-foreground">
            {treatments.length} tratamientos | {formatCurrency(totalCost)} total
          </p>
        </div>

        <Button onClick={() => toast.info("Alta de tratamiento pendiente de implementacion")} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Tratamiento
        </Button>
      </div>

      <TreatmentsProgressOverview treatments={treatments} totalCost={totalCost} progress={progress} />

      <TreatmentsFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        specialtyFilter={specialtyFilter}
        onSpecialtyFilterChange={setSpecialtyFilter}
      />

      {/* Treatments Content */}
      <Tabs defaultValue="cards">
        <div className="flex justify-end mb-4">
          <TabsList>
            <TabsTrigger value="cards">Tarjetas</TabsTrigger>
            <TabsTrigger value="table">Tabla</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="cards" className="space-y-6">
          {/* In Progress */}
          {groupedByStatus["in_progress"].length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-sky-600 animate-spin" />
                En Proceso ({groupedByStatus["in_progress"].length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedByStatus["in_progress"].map((treatment) => (
                  <TreatmentCard
                    key={treatment.id}
                    treatment={treatment}
                    onSelect={() => setSelectedTreatment(treatment)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Pending */}
          {groupedByStatus.pending.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Pendientes ({groupedByStatus.pending.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedByStatus.pending.map((treatment) => (
                  <TreatmentCard
                    key={treatment.id}
                    treatment={treatment}
                    onSelect={() => setSelectedTreatment(treatment)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {groupedByStatus.completed.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Completados ({groupedByStatus.completed.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedByStatus.completed.map((treatment) => (
                  <TreatmentCard
                    key={treatment.id}
                    treatment={treatment}
                    onSelect={() => setSelectedTreatment(treatment)}
                  />
                ))}
              </div>
            </div>
          )}

          {filteredTreatments.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Stethoscope className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">No se encontraron tratamientos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Intenta ajustar los filtros o agrega un nuevo tratamiento
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pieza(s)</TableHead>
                      <TableHead>Procedimiento</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                      <TableHead>Especialidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Costo</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTreatments.map((treatment) => {
                      const config = statusConfig[treatment.status];
                      const Icon = config.icon;
                      return (
                        <TableRow key={treatment.id}>
                          <TableCell className="font-mono">
                            {treatment.toothNumbers.length > 0
                              ? `#${treatment.toothNumbers.join(", #")}`
                              : "-"}
                          </TableCell>
                          <TableCell className="font-medium">{treatment.procedure}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{treatment.diagnosis}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{specialtyLabels[treatment.specialty]}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("gap-1", config.bgColor, config.color)}>
                              <Icon className={cn("h-3 w-3", treatment.status === "in_progress" && "animate-spin")} />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(treatment.cost)}</TableCell>
                          <TableCell className="text-muted-foreground">{treatment.doctorName}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedTreatment(treatment)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalles
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(treatment, "in_progress")}>
                                  Iniciar Tratamiento
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(treatment, "completed")}>
                                  Marcar Completado
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Treatment Detail Dialog */}
      <TreatmentDetailDialog
        treatment={selectedTreatment}
        onClose={() => setSelectedTreatment(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

interface TreatmentCardProps {
  treatment: DentalTreatment;
  onSelect: () => void;
}

function TreatmentCard({ treatment, onSelect }: TreatmentCardProps) {
  const config = statusConfig[treatment.status];
  const Icon = config.icon;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={onSelect}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn("p-2 rounded-lg shrink-0", config.bgColor)}>
              <Stethoscope className={cn("h-5 w-5", config.color)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{treatment.procedure}</h3>
                {treatment.toothNumbers.length > 0 && (
                  <Badge variant="outline" className="font-mono text-xs">
                    #{treatment.toothNumbers.join(", #")}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {treatment.diagnosis}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={cn("gap-1 shrink-0", config.bgColor, config.color)}>
            <Icon className={cn("h-3 w-3", treatment.status === "in_progress" && "animate-spin")} />
            {config.label}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {treatment.doctorName}
            </span>
            <Badge variant="secondary" className="text-xs">
              {specialtyLabels[treatment.specialty]}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{formatCurrency(treatment.cost)}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        {treatment.notes && (
          <div className="mt-3 p-2 rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground line-clamp-2">{treatment.notes}</p>
          </div>
        )}

        {!treatment.consentId && treatment.status !== "completed" && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            Sin consentimiento firmado
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface TreatmentDetailDialogProps {
  treatment: DentalTreatment | null;
  onClose: () => void;
  onStatusChange: (treatment: DentalTreatment, status: TreatmentStatus) => void;
}

function TreatmentDetailDialog({ treatment, onClose, onStatusChange }: TreatmentDetailDialogProps) {
  if (!treatment) return null;

  const config = statusConfig[treatment.status];
  const Icon = config.icon;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Dialog open={!!treatment} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            {treatment.procedure}
          </DialogTitle>
          <DialogDescription>{treatment.diagnosis}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado</span>
            <Badge variant="outline" className={cn("gap-1", config.bgColor, config.color)}>
              <Icon className={cn("h-3 w-3", treatment.status === "in_progress" && "animate-spin")} />
              {config.label}
            </Badge>
          </div>

          {/* Teeth */}
          {treatment.toothNumbers.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Piezas</span>
              <div className="flex gap-1">
                {treatment.toothNumbers.map((id) => (
                  <Badge key={id} variant="outline" className="font-mono">
                    #{id}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Specialty */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Especialidad</span>
            <Badge variant="secondary">{specialtyLabels[treatment.specialty]}</Badge>
          </div>

          {/* Doctor */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Doctor</span>
            <span className="font-medium">{treatment.doctorName}</span>
          </div>

          {/* Cost */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Costo</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(treatment.cost)}</span>
          </div>

          <Separator />

          {/* Notes */}
          {treatment.notes && (
            <div>
              <span className="text-sm font-medium text-foreground">Notas</span>
              <p className="text-sm text-muted-foreground mt-1">{treatment.notes}</p>
            </div>
          )}

          {/* Dates */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Creado: {formatDate(treatment.createdAt)}</p>
            {treatment.startedAt && <p>Iniciado: {formatDate(treatment.startedAt)}</p>}
            {treatment.completedAt && <p>Completado: {formatDate(treatment.completedAt)}</p>}
          </div>
        </div>

        <DialogFooter className="gap-2">
          {treatment.status === "pending" && (
            <Button onClick={() => onStatusChange(treatment, "in_progress")}>
              Iniciar Tratamiento
            </Button>
          )}
          {treatment.status === "in_progress" && (
            <Button onClick={() => onStatusChange(treatment, "completed")}>
              Marcar Completado
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
