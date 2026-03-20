"use client"

import {
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui"
import { cn } from "@/lib/utils/utils"
import {
  AlertTriangle,
  Calendar,
  Download,
  Eye,
  FileText,
  History,
  MoreVertical,
  Pen,
  Search,
  User,
} from "lucide-react"
import type { Document } from "@/lib/clinical-history/types"
import {
  documentTypeIcons,
  documentTypeLabels,
  statusConfig,
} from "./documents-domain"

interface DocumentsContentProps {
  filteredDocuments: Document[]
  searchTerm: string
  onSearchTermChange: (value: string) => void
  filterType: string
  onFilterTypeChange: (value: string) => void
  filterStatus: string
  onFilterStatusChange: (value: string) => void
  onViewDocument: (document: Document) => void
  onSignDocument: (document: Document) => void
  formatDate: (date: string) => string
  isExpiringSoon: (expirationDate?: string) => boolean
}

export function DocumentsContent({
  filteredDocuments,
  searchTerm,
  onSearchTermChange,
  filterType,
  onFilterTypeChange,
  filterStatus,
  onFilterStatusChange,
  onViewDocument,
  onSignDocument,
  formatDate,
  isExpiringSoon,
}: DocumentsContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="consent">Consentimiento</SelectItem>
            <SelectItem value="authorization">Autorización</SelectItem>
            <SelectItem value="surgical_consent">Quirúrgico</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="other">Otro</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="signed">Firmado</SelectItem>
            <SelectItem value="expired">Expirado</SelectItem>
            <SelectItem value="revoked">Revocado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-[300px] grid-cols-2">
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No se encontraron documentos</p>
                </div>
              ) : (
                filteredDocuments.map((document) => {
                  const status = statusConfig[document.status]
                  const StatusIcon = status.icon
                  const expiringSoon = isExpiringSoon(document.expirationDate)

                  return (
                    <div
                      key={document.id}
                      className={cn(
                        "group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-200",
                        document.status === "pending" && "border-l-4 border-l-amber-500",
                        document.status === "expired" && "border-l-4 border-l-red-500"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "p-3 rounded-xl",
                            document.status === "signed"
                              ? "bg-emerald-500/10"
                              : document.status === "pending"
                              ? "bg-amber-500/10"
                              : document.status === "expired"
                              ? "bg-red-500/10"
                              : "bg-zinc-500/10"
                          )}
                        >
                          {documentTypeIcons[document.type]}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium text-foreground truncate">{document.title}</h4>
                              <p className="text-sm text-muted-foreground">{documentTypeLabels[document.type]}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge className={cn("border", status.color)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {status.label}
                              </Badge>

                              {expiringSoon && (
                                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 border">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Por expirar
                                </Badge>
                              )}
                            </div>
                          </div>

                          {document.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{document.description}</p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Creado: {formatDate(document.createdAt)}
                            </span>

                            {document.signedAt && (
                              <span className="flex items-center gap-1 text-emerald-500">
                                <Pen className="h-3.5 w-3.5" />
                                Firmado: {formatDate(document.signedAt)}
                              </span>
                            )}

                            {document.expirationDate && (
                              <span
                                className={cn(
                                  "flex items-center gap-1",
                                  expiringSoon && "text-orange-500",
                                  document.status === "expired" && "text-red-500"
                                )}
                              >
                                <Calendar className="h-3.5 w-3.5" />
                                Expira: {formatDate(document.expirationDate)}
                              </span>
                            )}

                            {document.signedBy && (
                              <span className="flex items-center gap-1">
                                <User className="h-3.5 w-3.5" />
                                {document.signedBy}
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
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewDocument(document)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver Documento
                            </DropdownMenuItem>
                            {document.status === "pending" && (
                              <DropdownMenuItem onClick={() => onSignDocument(document)}>
                                <Pen className="h-4 w-4 mr-2" />
                                Firmar Documento
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="h-4 w-4 mr-2" />
                              Ver Historial
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
        </TabsContent>

        <TabsContent value="grid" className="mt-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => {
                const status = statusConfig[document.status]
                const StatusIcon = status.icon

                return (
                  <Card
                    key={document.id}
                    className={cn(
                      "group hover:shadow-lg transition-all duration-200 cursor-pointer",
                      document.status === "pending" && "border-t-4 border-t-amber-500",
                      document.status === "signed" && "border-t-4 border-t-emerald-500",
                      document.status === "expired" && "border-t-4 border-t-red-500"
                    )}
                    onClick={() => onViewDocument(document)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            document.status === "signed"
                              ? "bg-emerald-500/10"
                              : document.status === "pending"
                              ? "bg-amber-500/10"
                              : "bg-zinc-500/10"
                          )}
                        >
                          {documentTypeIcons[document.type]}
                        </div>
                        <Badge className={cn("border text-xs", status.color)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>

                      <h4 className="font-medium text-foreground mb-1 line-clamp-2">{document.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{documentTypeLabels[document.type]}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatDate(document.createdAt)}</span>
                        {document.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={(event) => {
                              event.stopPropagation()
                              onSignDocument(document)
                            }}
                          >
                            <Pen className="h-3 w-3 mr-1" />
                            Firmar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
