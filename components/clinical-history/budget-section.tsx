"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Sparkles,
  CreditCard,
  Target,
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
    variant: "info" as const,
    icon: FileText,
  },
  approved: {
    label: "Aprobado",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rechazado",
    variant: "destructive" as const,
    icon: XCircle,
  },
  expired: {
    label: "Expirado",
    variant: "ghost" as const,
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
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Presupuestos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona planes de tratamiento y presupuestos
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
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
                  <Input placeholder="Ej: Rehabilitacion Sector Posterior" />
                </div>

                <div className="space-y-2">
                  <Label>Descripcion</Label>
                  <Textarea placeholder="Descripcion del plan de tratamiento..." rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>Tratamientos Incluidos</Label>
                  <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
                    {treatments.slice(0, 4).map((treatment, index) => (
                      <div key={treatment.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{treatment.procedure}</p>
                          <p className="text-xs text-muted-foreground">
                            Pieza {treatment.toothNumbers.join(", ")}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{formatCurrency(treatment.cost)}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 mt-2">
                    <Plus className="h-4 w-4" />
                    Agregar Tratamiento
                  </Button>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreatePlan}>Crear Plan</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateBudgetOpen} onOpenChange={setIsCreateBudgetOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
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
                      <Label>Valido hasta</Label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  <div className="space-y-2">
                    <Label>Tratamientos Incluidos</Label>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-12 gap-2 p-2.5 bg-muted text-xs font-medium text-muted-foreground">
                        <div className="col-span-5">Tratamiento</div>
                        <div className="col-span-2">Pieza</div>
                        <div className="col-span-2 text-right">Precio</div>
                        <div className="col-span-2 text-right">Desc.</div>
                        <div className="col-span-1"></div>
                      </div>
                      <div className="divide-y divide-border">
                        {treatments.slice(0, 4).map((treatment) => (
                          <div key={treatment.id} className="grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-muted/50 transition-colors">
                            <div className="col-span-5">
                              <p className="text-sm font-medium">{treatment.procedure}</p>
                              <p className="text-xs text-muted-foreground">{treatment.specialty}</p>
                            </div>
                            <div className="col-span-2 text-sm font-mono">
                              {treatment.toothNumbers.join(", ")}
                            </div>
                            <div className="col-span-2 text-right text-sm font-medium">
                              {formatCurrency(treatment.cost)}
                            </div>
                            <div className="col-span-2">
                              <Input type="number" placeholder="0%" className="h-8 text-right text-sm" />
                            </div>
                            <div className="col-span-1 text-right">
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                      <Plus className="h-4 w-4" />
                      Agregar Tratamiento
                    </Button>
                  </div>

                  <div className="h-px bg-border" />

                  <div className="space-y-3 p-5 bg-muted/30 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">{formatCurrency(15500)}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-muted-foreground">Descuento General</span>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="0%" className="h-7 w-20 text-right text-sm rounded-lg" />
                        <span className="text-destructive font-medium">-{formatCurrency(1550)}</span>
                      </div>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">{formatCurrency(13950)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Notas</Label>
                    <Textarea placeholder="Notas adicionales para el presupuesto..." rows={2} className="rounded-xl" />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateBudgetOpen(false)} className="rounded-xl">
                      Cancelar
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <Eye className="h-4 w-4" />
                      Vista Previa
                    </Button>
                    <Button onClick={handleCreateBudget} className="gap-2 rounded-xl shadow-sm">
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

      {/* Overview Stats - Premium Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Presupuestos</p>
                <p className="text-3xl font-bold text-foreground tracking-tight">{budgets.length}</p>
                <p className="text-xs text-muted-foreground">Total creados</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 group-hover:scale-105 transition-transform">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Propuesto</p>
                <p className="text-3xl font-bold text-foreground tracking-tight">{formatCurrency(totalProposed)}</p>
                <p className="text-xs text-muted-foreground">Pendientes de aprobar</p>
              </div>
              <div className="p-3 rounded-xl bg-info/10 group-hover:scale-105 transition-transform">
                <Clock className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Aprobado</p>
                <p className="text-3xl font-bold text-success tracking-tight">{formatCurrency(totalApproved)}</p>
                <p className="text-xs text-muted-foreground">Total aprobado</p>
              </div>
              <div className="p-3 rounded-xl bg-success/10 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Planes</p>
                <p className="text-3xl font-bold text-foreground tracking-tight">{treatmentPlans.length}</p>
                <p className="text-xs text-muted-foreground">Planes activos</p>
              </div>
              <div className="p-3 rounded-xl bg-warning/10 group-hover:scale-105 transition-transform">
                <Target className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="budgets" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <TabsList className="rounded-xl p-1 bg-muted/50">
            <TabsTrigger value="budgets" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Presupuestos
            </TabsTrigger>
            <TabsTrigger value="plans" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
              Planes de Tratamiento
            </TabsTrigger>
          </TabsList>
          <Badge variant="outline" className="w-fit font-mono text-xs rounded-lg">
            Paciente #{patientRef}
          </Badge>
        </div>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                <div className="divide-y divide-border">
                  {budgets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <Receipt className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-lg font-semibold text-foreground mb-1">No hay presupuestos</p>
                      <p className="text-sm text-muted-foreground mb-4">Crea tu primer presupuesto para este paciente</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-xl"
                        onClick={() => setIsCreateBudgetOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Crear Presupuesto
                      </Button>
                    </div>
                  ) : (
                    budgets.map((budget, index) => {
                      const status = budgetStatusConfig[budget.status]
                      const StatusIcon = status.icon
                      const paidPercentage = (budget.paidAmount / budget.total) * 100

                      return (
                        <div
                          key={budget.id}
                          className="group p-5 hover:bg-muted/30 transition-all duration-150 cursor-pointer animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                          onClick={() => setSelectedBudget(budget)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "p-3 rounded-xl transition-transform group-hover:scale-105",
                                budget.status === "approved"
                                  ? "bg-success/10"
                                  : budget.status === "proposed"
                                  ? "bg-info/10"
                                  : "bg-muted"
                              )}
                            >
                              <Receipt className={cn(
                                "h-5 w-5",
                                budget.status === "approved"
                                  ? "text-success"
                                  : budget.status === "proposed"
                                  ? "text-info"
                                  : "text-muted-foreground"
                              )} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2.5">
                                    <h4 className="font-semibold text-foreground">
                                      Presupuesto #{budget.id.slice(-6).toUpperCase()}
                                    </h4>
                                    <Badge variant={status.variant} className="rounded-lg">
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {status.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {budget.items.length} tratamientos incluidos
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-foreground tracking-tight">
                                    {formatCurrency(budget.total)}
                                  </p>
                                  {budget.discount > 0 && (
                                    <p className="text-xs text-success font-medium">
                                      -{budget.discount}% descuento
                                    </p>
                                  )}
                                </div>
                              </div>

                              {budget.status === "approved" && (
                                <div className="mt-4">
                                  <div className="flex items-center justify-between text-xs mb-2">
                                    <span className="text-muted-foreground font-medium">Progreso de pago</span>
                                    <span className="font-semibold text-foreground">
                                      {formatCurrency(budget.paidAmount)} / {formatCurrency(budget.total)}
                                    </span>
                                  </div>
                                  <Progress value={paidPercentage} variant="success" className="h-2" />
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Creado: {formatDate(budget.createdAt)}
                                </span>
                                {budget.validUntil && (
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Valido hasta: {formatDate(budget.validUntil)}
                                  </span>
                                )}
                                {budget.approvedAt && (
                                  <span className="flex items-center gap-1.5 text-success">
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
                                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-48">
                                <DropdownMenuItem className="rounded-lg">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalle
                                </DropdownMenuItem>
                                {budget.status === "proposed" && (
                                  <>
                                    <DropdownMenuItem className="rounded-lg">
                                      <Pen className="h-4 w-4 mr-2" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-success rounded-lg">
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Marcar como Aprobado
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="rounded-lg">
                                  <Printer className="h-4 w-4 mr-2" />
                                  Imprimir
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg">
                                  <Download className="h-4 w-4 mr-2" />
                                  Descargar PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg">
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Items Preview Tags */}
                          <div className="mt-4 ml-16 flex flex-wrap gap-2">
                            {budget.items.slice(0, 3).map((item) => (
                              <Badge
                                key={item.treatmentId}
                                variant="outline"
                                className="text-xs rounded-lg bg-muted/50"
                              >
                                {item.description}
                              </Badge>
                            ))}
                            {budget.items.length > 3 && (
                              <Badge variant="ghost" className="text-xs rounded-lg">
                                +{budget.items.length - 3} mas
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
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                <div className="divide-y divide-border">
                  {treatmentPlans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-lg font-semibold text-foreground mb-1">No hay planes de tratamiento</p>
                      <p className="text-sm text-muted-foreground mb-4">Crea un plan para organizar los tratamientos</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 rounded-xl"
                        onClick={() => setIsCreatePlanOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Crear Plan
                      </Button>
                    </div>
                  ) : (
                    treatmentPlans.map((plan, index) => {
                      const completedCount = plan.treatments.filter(
                        (t) => t.status === "completed"
                      ).length
                      const progressPercentage = (completedCount / plan.treatments.length) * 100

                      return (
                        <div
                          key={plan.id}
                          className="group p-5 hover:bg-muted/30 transition-all duration-150 animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-primary/10 transition-transform group-hover:scale-105">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h4 className="font-semibold text-foreground">{plan.name}</h4>
                                  {plan.description && (
                                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                                      {plan.description}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  variant={
                                    plan.status === "active"
                                      ? "success"
                                      : plan.status === "completed"
                                      ? "info"
                                      : "ghost"
                                  }
                                  className="rounded-lg"
                                >
                                  {plan.status === "active"
                                    ? "Activo"
                                    : plan.status === "completed"
                                    ? "Completado"
                                    : "Pendiente"}
                                </Badge>
                              </div>

                              <div className="mt-4">
                                <div className="flex items-center justify-between text-xs mb-2">
                                  <span className="text-muted-foreground font-medium">Progreso</span>
                                  <span className="font-semibold text-foreground">
                                    {completedCount} / {plan.treatments.length} tratamientos
                                  </span>
                                </div>
                                <Progress value={progressPercentage} className="h-2" />
                              </div>

                              {/* Treatment Flow */}
                              <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                                {plan.treatments.slice(0, 5).map((treatment, idx) => (
                                  <div key={treatment.treatmentId} className="flex items-center">
                                    <div
                                      className={cn(
                                        "px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium",
                                        treatment.status === "completed"
                                          ? "bg-success/10 text-success"
                                          : treatment.status === "in_progress"
                                          ? "bg-info/10 text-info"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {idx + 1}. Pieza {treatments.find(t => t.id === treatment.treatmentId)?.toothNumbers[0] || "?"}
                                    </div>
                                    {idx < plan.treatments.length - 1 && idx < 4 && (
                                      <ArrowRight className="h-3 w-3 mx-1.5 text-muted-foreground/50 shrink-0" />
                                    )}
                                  </div>
                                ))}
                                {plan.treatments.length > 5 && (
                                  <Badge variant="ghost" className="text-xs ml-1 rounded-lg">
                                    +{plan.treatments.length - 5}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(plan.createdAt)}
                                </span>
                                <span className="flex items-center gap-1.5">
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
                                  className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-48">
                                <DropdownMenuItem className="rounded-lg">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver Detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg">
                                  <Pen className="h-4 w-4 mr-2" />
                                  Editar Plan
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="rounded-lg">
                                  <Receipt className="h-4 w-4 mr-2" />
                                  Generar Presupuesto
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg">
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
        <DialogContent className="max-w-3xl max-h-[85vh] rounded-2xl">
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
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Presupuesto</p>
                    <p className="text-xl font-bold text-foreground">
                      #{selectedBudget.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <Badge variant={budgetStatusConfig[selectedBudget.status].variant} className="rounded-lg">
                    {budgetStatusConfig[selectedBudget.status].label}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Fecha de Creacion</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(selectedBudget.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Valido Hasta</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">
                      {selectedBudget.validUntil
                        ? formatDate(selectedBudget.validUntil)
                        : "Sin fecha limite"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Creado Por</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{selectedBudget.createdBy}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Tratamientos Incluidos</h4>
                  <div className="border border-border rounded-xl divide-y divide-border overflow-hidden">
                    {selectedBudget.items.map((item) => (
                      <div key={item.treatmentId} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Pieza {item.toothNumber || "General"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{formatCurrency(item.finalPrice)}</p>
                          {item.discount > 0 && (
                            <p className="text-xs text-destructive">-{item.discount}%</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-3 p-4 bg-muted/30 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(selectedBudget.subtotal)}</span>
                  </div>
                  {selectedBudget.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Descuento ({selectedBudget.discount}%)
                      </span>
                      <span className="text-destructive font-medium">
                        -{formatCurrency(selectedBudget.subtotal * (selectedBudget.discount / 100))}
                      </span>
                    </div>
                  )}
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatCurrency(selectedBudget.total)}</span>
                  </div>
                </div>

                {selectedBudget.status === "approved" && (
                  <div className="p-4 bg-success/5 rounded-xl border border-success/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-success">Estado de Pago</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(selectedBudget.paidAmount)} / {formatCurrency(selectedBudget.total)}
                      </span>
                    </div>
                    <Progress
                      value={(selectedBudget.paidAmount / selectedBudget.total) * 100}
                      variant="success"
                      className="h-2.5"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Saldo pendiente: {formatCurrency(selectedBudget.total - selectedBudget.paidAmount)}
                    </p>
                  </div>
                )}

                {selectedBudget.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Notas</h4>
                    <p className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-xl">
                      {selectedBudget.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" className="gap-2 rounded-xl">
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button variant="outline" className="gap-2 rounded-xl">
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                  {selectedBudget.status === "proposed" && (
                    <Button className="gap-2 rounded-xl shadow-sm" onClick={() => onBudgetApprove?.(selectedBudget.id)}>
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
