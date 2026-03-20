"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  Progress,
  Separator,
} from "@/components/ui"
import {
  Receipt,
  Plus,
  MoreVertical,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Calendar,
  User,
  Pen,
  Send,
  TrendingUp,
  ArrowRight,
  Printer,
  Copy,
  Trash2,
  GripVertical,
} from "lucide-react"
import { Budget, TreatmentPlan, DentalTreatment } from "@/lib/clinical-history/types"
import { cn } from "@/lib/utils/utils"

interface BudgetSectionProps {
  budgets: Budget[]
  treatmentPlans: TreatmentPlan[]
  treatments: DentalTreatment[]
  patientId: string
  onBudgetCreate?: (budget: Partial<Budget>) => void
  onBudgetApprove?: (budgetId: string) => void
  onPlanCreate?: (plan: Partial<TreatmentPlan>) => void
}

const budgetStatusConfig = {
  proposed: {
    label: "Propuesto",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: FileText,
  },
  approved: {
    label: "Aprobado",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rechazado",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
  expired: {
    label: "Expirado",
    color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    icon: Clock,
  },
}

export function BudgetSection({
  budgets,
  treatmentPlans,
  treatments,
  patientId,
  onBudgetCreate,
  onBudgetApprove,
  onPlanCreate,
}: BudgetSectionProps) {
  const [isCreateBudgetOpen, setIsCreateBudgetOpen] = useState(false)
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  // Calculate totals
  const totalProposed = budgets
    .filter((b) => b.status === "proposed")
    .reduce((sum, b) => sum + b.total, 0)
  const totalApproved = budgets
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + b.total, 0)
  const patientRef = patientId.slice(-6).toUpperCase()

  const handleCreatePlan = () => {
    onPlanCreate?.({ status: "pending" })
    setIsCreatePlanOpen(false)
  }

  const handleCreateBudget = () => {
    onBudgetCreate?.({ status: "proposed" })
    setIsCreateBudgetOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{budgets.length}</p>
                <p className="text-xs text-muted-foreground">Presupuestos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalProposed)}</p>
                <p className="text-xs text-muted-foreground">Propuesto</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalApproved)}</p>
                <p className="text-xs text-muted-foreground">Aprobado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{treatmentPlans.length}</p>
                <p className="text-xs text-muted-foreground">Planes de Tratamiento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="budgets" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="budgets">Presupuestos</TabsTrigger>
              <TabsTrigger value="plans">Planes de Tratamiento</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="w-fit">Paciente #{patientRef}</Badge>

          <div className="flex gap-2">
            <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Plan de Tratamiento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nombre del Plan</Label>
                    <Input placeholder="Ej: Rehabilitación Sector Posterior" />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea placeholder="Descripción del plan de tratamiento..." rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label>Tratamientos Incluidos</Label>
                    <div className="border rounded-lg divide-y">
                      {treatments.slice(0, 4).map((treatment, index) => (
                        <div key={treatment.id} className="flex items-center gap-3 p-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{treatment.procedure}</p>
                            <p className="text-xs text-muted-foreground">
                              Pieza {treatment.toothNumbers.join(", ")} - {treatment.specialty}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Orden {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{formatCurrency(treatment.cost)}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                      <Plus className="h-4 w-4" />
                      Agregar Tratamiento
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreatePlan}>Crear Plan</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateBudgetOpen} onOpenChange={setIsCreateBudgetOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Presupuesto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Crear Presupuesto</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh]">
                  <div className="space-y-4 py-4 pr-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Plan de Tratamiento</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {treatmentPlans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Válido hasta</Label>
                        <Input type="date" />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Tratamientos Incluidos</Label>
                      <div className="border rounded-lg">
                        <div className="grid grid-cols-12 gap-2 p-3 bg-muted/30 text-xs font-medium text-muted-foreground">
                          <div className="col-span-5">Tratamiento</div>
                          <div className="col-span-2">Pieza</div>
                          <div className="col-span-2 text-right">Precio</div>
                          <div className="col-span-2 text-right">Descuento</div>
                          <div className="col-span-1"></div>
                        </div>
                        <div className="divide-y">
                          {treatments.slice(0, 4).map((treatment) => (
                            <div key={treatment.id} className="grid grid-cols-12 gap-2 p-3 items-center">
                              <div className="col-span-5">
                                <p className="text-sm font-medium">{treatment.procedure}</p>
                                <p className="text-xs text-muted-foreground">{treatment.specialty}</p>
                              </div>
                              <div className="col-span-2 text-sm">
                                {treatment.toothNumbers.join(", ")}
                              </div>
                              <div className="col-span-2 text-right text-sm font-medium">
                                {formatCurrency(treatment.cost)}
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  placeholder="0%"
                                  className="h-8 text-right text-sm"
                                />
                              </div>
                              <div className="col-span-1 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Tratamiento
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(15500)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Descuento General</span>
                        <div className="flex items-center gap-2">
                          <Input type="number" placeholder="0%" className="h-7 w-20 text-right text-sm" />
                          <span className="text-red-500">-{formatCurrency(1550)}</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(13950)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Notas</Label>
                      <Textarea placeholder="Notas adicionales para el presupuesto..." rows={2} />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" onClick={() => setIsCreateBudgetOpen(false)}>
                        Cancelar
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Eye className="h-4 w-4" />
                        Vista Previa
                      </Button>
                      <Button onClick={handleCreateBudget} className="gap-2">
                        <Send className="h-4 w-4" />
                        Crear y Enviar
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="mt-0">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border/50">
                  {budgets.length === 0 ? (
                    <div className="text-center py-12">
                      <Receipt className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No hay presupuestos</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 gap-2"
                        onClick={() => setIsCreateBudgetOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Crear Presupuesto
                      </Button>
                    </div>
                  ) : (
                    budgets.map((budget) => {
                      const status = budgetStatusConfig[budget.status]
                      const StatusIcon = status.icon
                      const paidPercentage = (budget.paidAmount / budget.total) * 100

                      return (
                        <div
                          key={budget.id}
                          className="group p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedBudget(budget)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "p-3 rounded-xl",
                                budget.status === "approved"
                                  ? "bg-emerald-500/10"
                                  : budget.status === "proposed"
                                  ? "bg-blue-500/10"
                                  : "bg-zinc-500/10"
                              )}
                            >
                              <Receipt className="h-5 w-5 text-foreground" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-foreground">
                                      Presupuesto #{budget.id.slice(-6).toUpperCase()}
                                    </h4>
                                    <Badge className={cn("border", status.color)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {status.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {budget.items.length} tratamientos incluidos
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-foreground">
                                    {formatCurrency(budget.total)}
                                  </p>
                                  {budget.discount > 0 && (
                                    <p className="text-xs text-emerald-500">
                                      -{budget.discount}% descuento aplicado
                                    </p>
                                  )}
                                </div>
                              </div>

                              {budget.status === "approved" && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-muted-foreground">Progreso de pago</span>
                                    <span className="font-medium">
                                      {formatCurrency(budget.paidAmount)} / {formatCurrency(budget.total)}
                                    </span>
                                  </div>
                                  <Progress value={paidPercentage} className="h-2" />
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Creado: {formatDate(budget.createdAt)}
                                </span>
                                {budget.validUntil && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    Válido hasta: {formatDate(budget.validUntil)}
                                  </span>
                                )}
                                {budget.approvedAt && (
                                  <span className="flex items-center gap-1 text-emerald-500">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Aprobado: {formatDate(budget.approvedAt)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalle
                                </DropdownMenuItem>
                                {budget.status === "proposed" && (
                                  <>
                                    <DropdownMenuItem>
                                      <Pen className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-emerald-500">
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Marcar como Aprobado
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Printer className="h-4 w-4 mr-2" />
                                  Imprimir
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Descargar PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Items Preview */}
                          <div className="mt-3 ml-14 flex flex-wrap gap-2">
                            {budget.items.slice(0, 3).map((item) => (
                              <Badge
                                key={item.treatmentId}
                                variant="outline"
                                className="text-xs bg-muted/30"
                              >
                                {item.description}
                              </Badge>
                            ))}
                            {budget.items.length > 3 && (
                              <Badge variant="outline" className="text-xs bg-muted/30">
                                +{budget.items.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatment Plans Tab */}
        <TabsContent value="plans" className="mt-0">
          <Card className="border-border/50">
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border/50">
                  {treatmentPlans.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No hay planes de tratamiento</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 gap-2"
                        onClick={() => setIsCreatePlanOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Crear Plan
                      </Button>
                    </div>
                  ) : (
                    treatmentPlans.map((plan) => {
                      const completedCount = plan.treatments.filter(
                        (t) => t.status === "completed"
                      ).length
                      const progressPercentage = (completedCount / plan.treatments.length) * 100

                      return (
                        <div
                          key={plan.id}
                           className="group p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-foreground">{plan.name}</h4>
                                  {plan.description && (
                                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                                      {plan.description}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  className={cn(
                                    "border",
                                    plan.status === "active"
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                      : plan.status === "completed"
                                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                                  )}
                                >
                                  {plan.status === "active"
                                    ? "Activo"
                                    : plan.status === "completed"
                                    ? "Completado"
                                    : "Pendiente"}
                                </Badge>
                              </div>

                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Progreso</span>
                                  <span className="font-medium">
                                    {completedCount} / {plan.treatments.length} tratamientos
                                  </span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                              </div>

                              {/* Treatment Flow */}
                              <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1">
                                {plan.treatments.slice(0, 5).map((treatment, index) => (
                                  <div key={treatment.treatmentId} className="flex items-center">
                                    <div
                                      className={cn(
                                        "px-2 py-1 rounded text-xs whitespace-nowrap",
                                        treatment.status === "completed"
                                          ? "bg-emerald-500/10 text-emerald-500"
                                          : treatment.status === "in_progress"
                                          ? "bg-blue-500/10 text-blue-500"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {index + 1}. Pieza {treatments.find(t => t.id === treatment.treatmentId)?.toothNumbers[0] || "?"}
                                    </div>
                                    {index < plan.treatments.length - 1 && index < 4 && (
                                      <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground flex-shrink-0" />
                                    )}
                                  </div>
                                ))}
                                {plan.treatments.length > 5 && (
                                  <Badge variant="outline" className="text-xs ml-1">
                                    +{plan.treatments.length - 5}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(plan.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="h-3.5 w-3.5" />
                                  {plan.createdBy}
                                </span>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Pen className="h-4 w-4 mr-2" />
                                  Editar Plan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Generar Presupuesto
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Exportar PDF
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Budget Detail Dialog */}
      <Dialog open={!!selectedBudget} onOpenChange={() => setSelectedBudget(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Detalle de Presupuesto
            </DialogTitle>
          </DialogHeader>
          {selectedBudget && (
            <ScrollArea className="max-h-[65vh]">
              <div className="space-y-6 py-4 pr-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Presupuesto</p>
                    <p className="text-lg font-semibold">
                      #{selectedBudget.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <Badge
                    className={cn("border", budgetStatusConfig[selectedBudget.status].color)}
                  >
                    {budgetStatusConfig[selectedBudget.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Creación</p>
                    <p className="text-sm font-medium">{formatDate(selectedBudget.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Válido Hasta</p>
                    <p className="text-sm font-medium">
                      {selectedBudget.validUntil
                        ? formatDate(selectedBudget.validUntil)
                        : "Sin fecha límite"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Creado Por</p>
                    <p className="text-sm font-medium">{selectedBudget.createdBy}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Tratamientos Incluidos</h4>
                  <div className="border rounded-lg divide-y">
                    {selectedBudget.items.map((item) => (
                      <div key={item.treatmentId} className="flex items-center justify-between p-3">
                        <div>
                          <p className="text-sm font-medium">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Pieza {item.toothNumber || "General"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(item.finalPrice)}</p>
                          {item.discount > 0 && (
                            <p className="text-xs text-red-500">-{item.discount}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedBudget.subtotal)}</span>
                  </div>
                  {selectedBudget.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Descuento ({selectedBudget.discount}%)
                      </span>
                      <span className="text-red-500">
                        -{formatCurrency(selectedBudget.subtotal * (selectedBudget.discount / 100))}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(selectedBudget.total)}</span>
                  </div>
                </div>

                {selectedBudget.status === "approved" && (
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-emerald-500">Estado de Pago</span>
                      <span className="text-sm">
                        {formatCurrency(selectedBudget.paidAmount)} /{" "}
                        {formatCurrency(selectedBudget.total)}
                      </span>
                    </div>
                    <Progress
                      value={(selectedBudget.paidAmount / selectedBudget.total) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Saldo pendiente:{" "}
                      {formatCurrency(selectedBudget.total - selectedBudget.paidAmount)}
                    </p>
                  </div>
                )}

                {selectedBudget.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notas</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                      {selectedBudget.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                  {selectedBudget.status === "proposed" && (
                    <Button className="gap-2" onClick={() => onBudgetApprove?.(selectedBudget.id)}>
                      <CheckCircle2 className="h-4 w-4" />
                      Aprobar Presupuesto
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
