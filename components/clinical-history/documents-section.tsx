"use client"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui"
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSignature,
  FileText,
  Lock,
  Pen,
  Plus,
  Upload,
} from "lucide-react"
import type { Document } from "@/lib/clinical-history/types"
import { cn } from "@/lib/utils/utils"
import { DocumentsContent } from "./documents/documents-content"
import {
  documentTypeIcons,
  documentTypeLabels,
  statusConfig,
} from "./documents/documents-domain"
import { useDocumentsViewModel } from "./documents/use-documents-view-model"

interface DocumentsSectionProps {
  documents: Document[]
  patientId: string
  onDocumentAdd?: (document: Partial<Document>) => void
  onDocumentSign?: (documentId: string) => void
}

export function DocumentsSection({
  documents,
  patientId,
  onDocumentAdd,
  onDocumentSign,
}: DocumentsSectionProps) {
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    selectedDocument,
    filteredDocuments,
    pendingCount,
    signedCount,
    expiredCount,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isViewDialogOpen,
    setViewDialogOpen,
    isSignDialogOpen,
    setSignDialogOpen,
    handleAddDocument,
    openViewDialog,
    openSignDialog,
    confirmSign,
    formatDate,
    isExpiringSoon,
  } = useDocumentsViewModel({
    documents,
    patientId,
    onDocumentAdd,
    onDocumentSign,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                <p className="text-xs text-muted-foreground">Total Documentos</p>
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
                <p className="text-2xl font-bold text-foreground">{signedCount}</p>
                <p className="text-xs text-muted-foreground">Firmados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10">
                <FileSignature className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{expiredCount}</p>
                <p className="text-xs text-muted-foreground">Expirados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              Documentos y Consentimientos
            </CardTitle>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Documento
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Documento</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tipo de Documento</Label>
                    <Select defaultValue="consent">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consent">Consentimiento Informado</SelectItem>
                        <SelectItem value="authorization">Autorización de Tratamiento</SelectItem>
                        <SelectItem value="surgical_consent">Consentimiento Quirúrgico</SelectItem>
                        <SelectItem value="legal">Documento Legal</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Título del Documento</Label>
                    <Input placeholder="Ej: Consentimiento para Extracción Dental" />
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Textarea placeholder="Descripción detallada del documento..." rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tratamiento Relacionado (Opcional)</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tratamiento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t1">Endodoncia - Pieza 36</SelectItem>
                          <SelectItem value="t2">Corona - Pieza 36</SelectItem>
                          <SelectItem value="t3">Implante - Pieza 46</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Expiración (Opcional)</Label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Plantilla o Archivo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Arrastra un archivo o haz clic para seleccionar</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOC hasta 10MB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="require-signature" defaultChecked />
                    <label
                      htmlFor="require-signature"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Requiere firma del paciente
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddDocument}>Crear Documento</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          <DocumentsContent
            filteredDocuments={filteredDocuments}
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            onViewDocument={openViewDialog}
            onSignDocument={openSignDialog}
            formatDate={formatDate}
            isExpiringSoon={isExpiringSoon}
          />
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDocument && documentTypeIcons[selectedDocument.type]}
              {selectedDocument?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-3">
                  <Badge className={cn("border", statusConfig[selectedDocument.status].color)}>
                    {statusConfig[selectedDocument.status].label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {documentTypeLabels[selectedDocument.type]}
                  </span>
                </div>

                {selectedDocument.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">{selectedDocument.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha de Creación</p>
                    <p className="text-sm font-medium">{formatDate(selectedDocument.createdAt)}</p>
                  </div>
                  {selectedDocument.signedAt && (
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de Firma</p>
                      <p className="text-sm font-medium text-emerald-500">{formatDate(selectedDocument.signedAt)}</p>
                    </div>
                  )}
                  {selectedDocument.expirationDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de Expiración</p>
                      <p className="text-sm font-medium">{formatDate(selectedDocument.expirationDate)}</p>
                    </div>
                  )}
                  {selectedDocument.signedBy && (
                    <div>
                      <p className="text-xs text-muted-foreground">Firmado por</p>
                      <p className="text-sm font-medium">{selectedDocument.signedBy}</p>
                    </div>
                  )}
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">Vista previa del documento</p>
                  <p className="text-xs text-muted-foreground mt-1">El contenido del documento se mostrará aquí</p>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Este documento está protegido y no puede ser eliminado. Solo se puede marcar como inactivo.
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </Button>
                  {selectedDocument.status === "pending" && (
                    <Button
                      className="gap-2"
                      onClick={() => {
                        setViewDialogOpen(false)
                        openSignDialog(selectedDocument)
                      }}
                    >
                      <Pen className="h-4 w-4" />
                      Firmar Documento
                    </Button>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isSignDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              Firmar Documento
            </DialogTitle>
          </DialogHeader>

          {selectedDocument && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-1">{selectedDocument.title}</h4>
                <p className="text-sm text-muted-foreground">{documentTypeLabels[selectedDocument.type]}</p>
              </div>

              <div className="space-y-2">
                <Label>Firma Digital</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20">
                  <Pen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Área de firma digital</p>
                  <p className="text-xs text-muted-foreground mt-1">Toque o dibuje su firma aquí</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="confirm-read" />
                <label
                  htmlFor="confirm-read"
                  className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Confirmo que he leído y entendido completamente el contenido de este documento
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSignDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={confirmSign} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Confirmar Firma
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
