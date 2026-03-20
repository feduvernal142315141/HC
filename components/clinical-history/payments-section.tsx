"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  ScrollArea,
  Progress,
  Separator,
} from "@/components/ui"
import {
  CreditCard,
  Banknote,
  Wallet,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Receipt,
  AlertCircle,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui"
import { Payment, Budget } from "@/lib/clinical-history/types"
import { cn } from "@/lib/utils/utils"

interface PaymentsSectionProps {
  payments: Payment[]
  budgets: Budget[]
  patientId: string
}

const paymentMethodIcons: Record<string, React.ReactNode> = {
  cash: <Banknote className="h-4 w-4" />,
  card: <CreditCard className="h-4 w-4" />,
  transfer: <ArrowUpRight className="h-4 w-4" />,
  other: <Wallet className="h-4 w-4" />,
}

const paymentMethodLabels: Record<string, string> = {
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  other: "Otro",
}

const paymentStatusConfig = {
  completed: {
    label: "Completado",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pendiente",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: Clock,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
  refunded: {
    label: "Reembolsado",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: ArrowDownRight,
  },
}

export function PaymentsSection({ payments, budgets, patientId }: PaymentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMethod, setFilterMethod] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount)
  }

  const patientRef = patientId.slice(-6).toUpperCase()

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate totals
  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)
  
  const totalPending = budgets
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + (b.total - b.paidAmount), 0)

  const totalBudgeted = budgets
    .filter((b) => b.status === "approved")
    .reduce((sum, b) => sum + b.total, 0)

  const paymentProgress = totalBudgeted > 0 ? (totalPaid / totalBudgeted) * 100 : 0

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod = filterMethod === "all" || payment.method === filterMethod
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus
    return matchesSearch && matchesMethod && matchesStatus
  })

  // Group payments by month
  const paymentsByMonth = filteredPayments.reduce((groups, payment) => {
    const date = new Date(payment.date)
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(payment)
    return groups
  }, {} as Record<string, Payment[]>)

  const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => b.localeCompare(a))

  const getMonthLabel = (monthYear: string) => {
    const [year, month] = monthYear.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      {/* Read-only notice */}
      <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-500">Vista de Solo Lectura</p>
          <p className="text-xs text-muted-foreground">
            Los pagos son gestionados por el área administrativa. Esta vista es informativa para el equipo clínico.
          </p>
          <p className="text-xs text-muted-foreground">Paciente #{patientRef}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-muted-foreground">Total Pagado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPending)}</p>
                <p className="text-xs text-muted-foreground">Saldo Pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{payments.length}</p>
                <p className="text-xs text-muted-foreground">Transacciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalBudgeted)}</p>
                <p className="text-xs text-muted-foreground">Total Presupuestado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-medium text-foreground">Progreso de Pagos</h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(totalPaid)} de {formatCurrency(totalBudgeted)} pagados
              </p>
            </div>
            <Badge
              className={cn(
                "border",
                paymentProgress >= 100
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : paymentProgress >= 50
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}
            >
              {paymentProgress.toFixed(0)}% completado
            </Badge>
          </div>
          <Progress value={paymentProgress} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Pagado: {formatCurrency(totalPaid)}</span>
            <span>Pendiente: {formatCurrency(totalPending)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Historial de Pagos
            </CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por concepto o recibo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="card">Tarjeta</SelectItem>
                <SelectItem value="transfer">Transferencia</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments Timeline */}
          <ScrollArea className="h-[450px] pr-4">
            {filteredPayments.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No se encontraron pagos</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedMonths.map((monthYear) => (
                  <div key={monthYear}>
                    <div className="sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                      <h3 className="text-sm font-medium text-muted-foreground capitalize">
                        {getMonthLabel(monthYear)}
                      </h3>
                    </div>
                    <div className="space-y-3 mt-2">
                      {paymentsByMonth[monthYear].map((payment) => {
                        const status = paymentStatusConfig[payment.status]
                        const StatusIcon = status.icon

                        return (
                          <div
                            key={payment.id}
                            className={cn(
                              "group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-200 cursor-pointer",
                              payment.status === "completed" && "border-l-4 border-l-emerald-500",
                              payment.status === "pending" && "border-l-4 border-l-amber-500",
                              payment.status === "refunded" && "border-l-4 border-l-blue-500"
                            )}
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  "p-3 rounded-xl",
                                  payment.status === "completed"
                                    ? "bg-emerald-500/10"
                                    : payment.status === "pending"
                                    ? "bg-amber-500/10"
                                    : payment.status === "refunded"
                                    ? "bg-blue-500/10"
                                    : "bg-zinc-500/10"
                                )}
                              >
                                {paymentMethodIcons[payment.method]}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-medium text-foreground">
                                      {payment.concept}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {paymentMethodLabels[payment.method]}
                                      </Badge>
                                      <Badge className={cn("border text-xs", status.color)}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {status.label}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={cn(
                                        "text-lg font-bold",
                                        payment.status === "refunded"
                                          ? "text-blue-500"
                                          : payment.status === "completed"
                                          ? "text-emerald-500"
                                          : "text-foreground"
                                      )}
                                    >
                                      {payment.status === "refunded" && "-"}
                                      {formatCurrency(payment.amount)}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDateTime(payment.date)}
                                  </span>
                                  {payment.receiptNumber && (
                                    <span className="flex items-center gap-1">
                                      <Receipt className="h-3.5 w-3.5" />
                                      Recibo: {payment.receiptNumber}
                                    </span>
                                  )}
                                  {payment.processedBy && (
                                    <span className="text-muted-foreground">
                                      Por: {payment.processedBy}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Detalle de Pago
            </DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Badge
                  className={cn("border", paymentStatusConfig[selectedPayment.status].color)}
                >
                  {paymentStatusConfig[selectedPayment.status].label}
                </Badge>
                <span className="text-2xl font-bold text-foreground">
                  {formatCurrency(selectedPayment.amount)}
                </span>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Concepto</span>
                  <span className="text-sm font-medium">{selectedPayment.concept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Método de Pago</span>
                  <span className="text-sm font-medium flex items-center gap-2">
                    {paymentMethodIcons[selectedPayment.method]}
                    {paymentMethodLabels[selectedPayment.method]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha y Hora</span>
                  <span className="text-sm font-medium">{formatDateTime(selectedPayment.date)}</span>
                </div>
                {selectedPayment.receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Número de Recibo</span>
                    <span className="text-sm font-medium">{selectedPayment.receiptNumber}</span>
                  </div>
                )}
                {selectedPayment.processedBy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Procesado Por</span>
                    <span className="text-sm font-medium">{selectedPayment.processedBy}</span>
                  </div>
                )}
              </div>

              {selectedPayment.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notas</p>
                    <p className="text-sm p-3 bg-muted/30 rounded-lg">{selectedPayment.notes}</p>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Descargar Recibo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
