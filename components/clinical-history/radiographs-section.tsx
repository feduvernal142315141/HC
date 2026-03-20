"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  Label,
  Textarea,
  AspectRatio,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
} from "@/components/ui";
import type { Radiograph } from "@/lib/clinical-history/types";
import {
  Plus,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Download,
  Trash2,
  MoreHorizontal,
  Calendar,
  User,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { toast } from "sonner";
import { useRadiographsViewModel } from "./radiographs/use-radiographs-view-model";
import { radiographTypeConfig } from "./radiographs/radiograph-type-config";
import { RadiographTypeSummary } from "./radiographs/radiograph-type-summary";
import { RadiographFilters } from "./radiographs/radiograph-filters";

interface RadioGraphsSectionProps {
  radiographs: Radiograph[];
}

export function RadioGraphsSection({ radiographs }: RadioGraphsSectionProps) {
  const {
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    viewMode,
    setViewMode,
    selectedImage,
    setSelectedImage,
    filteredRadiographs,
    groupedByType,
    currentIndex,
  } = useRadiographsViewModel({ radiographs });

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleImageSelect = (index: number) => {
    setSelectedImage(filteredRadiographs[index]);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredRadiographs[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredRadiographs.length - 1) {
      setSelectedImage(filteredRadiographs[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Radiografías e Imágenes</h2>
          <p className="text-muted-foreground">
            {radiographs.length} imágenes diagnósticas
          </p>
        </div>

        <Button onClick={() => setIsUploadDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Subir Imagen
        </Button>
      </div>

      <RadiographTypeSummary
        radiographs={radiographs}
        typeFilter={typeFilter}
        onTypeToggle={(type) => setTypeFilter(typeFilter === type ? "all" : type)}
      />

      <RadiographFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Content */}
      {filteredRadiographs.length > 0 ? (
        viewMode === "grid" ? (
          <div className="space-y-6">
            {Object.entries(groupedByType).map(([type, rads]) => {
              const config = radiographTypeConfig[type as Radiograph["type"]];
              const Icon = config.icon;
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("p-1.5 rounded-md", config.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-semibold text-foreground">{config.label}</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {rads.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {rads.map((rad) => (
                      <ImageCard
                        key={rad.id}
                        radiograph={rad}
                        onClick={() => handleImageSelect(filteredRadiographs.indexOf(rad))}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredRadiographs.map((rad) => (
                  <ImageListItem
                    key={rad.id}
                    radiograph={rad}
                    onClick={() => handleImageSelect(filteredRadiographs.indexOf(rad))}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground">No hay imágenes</p>
            <p className="text-sm text-muted-foreground mt-1">
              Sube radiografías o fotos clínicas para el expediente
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Subir Primera Imagen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image Viewer Dialog */}
      <ImageViewerDialog
        radiograph={selectedImage}
        onClose={() => setSelectedImage(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        hasPrev={currentIndex > 0}
        hasNext={currentIndex < filteredRadiographs.length - 1}
        currentIndex={currentIndex}
        totalCount={filteredRadiographs.length}
      />

      {/* Upload Dialog */}
      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}

interface ImageCardProps {
  radiograph: Radiograph;
  onClick: () => void;
}

function ImageCard({ radiograph, onClick }: ImageCardProps) {
  const config = radiographTypeConfig[radiograph.type];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });

  return (
    <Card
      className="group cursor-pointer overflow-hidden hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="relative">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={radiograph.imageUrl}
            alt={radiograph.description || "Radiografía"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover w-full h-full bg-muted"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <Badge
          variant="secondary"
          className={cn("absolute top-2 left-2 text-xs", config.color)}
        >
          {config.label}
        </Badge>
        {radiograph.toothNumbers && radiograph.toothNumbers.length > 0 && (
          <div className="absolute top-2 right-2 flex gap-1">
            {radiograph.toothNumbers.slice(0, 2).map((num) => (
              <Badge key={num} variant="outline" className="font-mono text-xs bg-black/50 text-white">
                #{num}
              </Badge>
            ))}
            {radiograph.toothNumbers.length > 2 && (
              <Badge variant="outline" className="text-xs bg-black/50 text-white">
                +{radiograph.toothNumbers.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <p className="text-sm font-medium text-foreground truncate">
          {radiograph.description || "Sin descripción"}
        </p>
        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatDate(radiograph.takenAt)}</span>
          <span className="truncate">{radiograph.doctorName}</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface ImageListItemProps {
  radiograph: Radiograph;
  onClick: () => void;
}

function ImageListItem({ radiograph, onClick }: ImageListItemProps) {
  const config = radiographTypeConfig[radiograph.type];
  const Icon = config.icon;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
        <Image
          src={radiograph.thumbnailUrl || radiograph.imageUrl}
          alt={radiograph.description || "Radiografía"}
          width={64}
          height={64}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("gap-1 text-xs", config.color)}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
          {radiograph.toothNumbers && radiograph.toothNumbers.length > 0 && (
            <span className="text-xs text-muted-foreground font-mono">
              #{radiograph.toothNumbers.join(", #")}
            </span>
          )}
        </div>
        <p className="font-medium text-foreground mt-1 truncate">
          {radiograph.description || "Sin descripción"}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(radiograph.takenAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {radiograph.doctorName}
          </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Abrir acciones de imagen">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onClick}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Ver Imagen
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface ImageViewerDialogProps {
  radiograph: Radiograph | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
}

function ImageViewerDialog({
  radiograph,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  currentIndex,
  totalCount,
}: ImageViewerDialogProps) {
  const [zoom, setZoom] = useState(100);

  if (!radiograph) return null;

  const config = radiographTypeConfig[radiograph.type];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <Dialog open={!!radiograph} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={config.color}>
              {config.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} de {totalCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setZoom(Math.max(50, zoom - 25))} aria-label="Reducir zoom">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(Math.min(200, zoom + 25))} aria-label="Aumentar zoom">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Descargar imagen">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar visor de imagen">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex-1 relative bg-black overflow-auto">
          <div
            className="min-h-full flex items-center justify-center p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
          >
            <Image
              src={radiograph.imageUrl}
              alt={radiograph.description || "Radiografía"}
              width={1200}
              height={900}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Navigation Buttons */}
          {hasPrev && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
              onClick={onPrev}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          {hasNext && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
              onClick={onNext}
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-4 py-3 border-t bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">
                {radiograph.description || "Sin descripción"}
              </p>
              {radiograph.toothNumbers && radiograph.toothNumbers.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {radiograph.toothNumbers.map((num) => (
                    <Badge key={num} variant="outline" className="font-mono text-xs">
                      #{num}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{radiograph.doctorName}</p>
              <p>{formatDate(radiograph.takenAt)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [teeth, setTeeth] = useState("");

  const handleSubmit = () => {
    toast.success("Imagen subida correctamente");
    onOpenChange(false);
    setType("");
    setDescription("");
    setTeeth("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            Subir Nueva Imagen
          </DialogTitle>
          <DialogDescription>
            Adjunta radiografías o fotografías clínicas al expediente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              Arrastra una imagen o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG hasta 10MB
            </p>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Tipo de Imagen *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(radiographTypeConfig).map(([value, { label }]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teeth */}
          <div className="space-y-2">
            <Label>Piezas Relacionadas (opcional)</Label>
            <Input
              value={teeth}
              onChange={(e) => setTeeth(e.target.value)}
              placeholder="Ej: 46, 47"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la imagen..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!type}>
            Subir Imagen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
