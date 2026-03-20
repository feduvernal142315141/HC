"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Input,
  Label,
  Textarea,
  Separator,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import type { MedicalHistory, PatientClinical } from "@/lib/clinical-history/types";
import {
  User,
  Phone,
  Mail,
  Heart,
  Pill,
  AlertTriangle,
  Stethoscope,
  Activity,
  Calendar,
  CheckCircle,
  Edit,
  Save,
  Shield,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface MedicalHistorySectionProps {
  history: MedicalHistory | null;
  patient: PatientClinical | null;
}

export function MedicalHistorySection({ history, patient }: MedicalHistorySectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (!history || !patient) {
    return <MedicalHistorySkeleton />;
  }

  const handleSave = async () => {
    // TODO: API call to save changes
    toast.success("Historia clínica actualizada correctamente");
    setIsEditing(false);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Historia Clínica General</h2>
          <p className="text-muted-foreground">
            Anamnesis y antecedentes del paciente
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.isValidated && (
            <Badge variant="outline" className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle className="h-3.5 w-3.5" />
              Validada
            </Badge>
          )}
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Validation Warning */}
      {!history.isValidated && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Historia Clínica Pendiente de Validación
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Esta historia clínica debe ser validada antes de iniciar tratamientos invasivos.
                </p>
                <Button size="sm" variant="outline" className="mt-3 border-amber-400 text-amber-700 hover:bg-amber-100">
                  Validar Historia Clínica
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient & Contact Info */}
        <div className="space-y-4">
          {/* Patient Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Datos Personales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow label="Nombre Completo" value={patient.name} />
              <InfoRow label="Edad" value={`${patient.age} años`} />
              <InfoRow
                label="Sexo"
                value={
                  patient.gender === "M"
                    ? "Masculino"
                    : patient.gender === "F"
                    ? "Femenino"
                    : "Otro"
                }
              />
              <InfoRow label="Tipo de Sangre" value={patient.bloodType || "No registrado"} />
              <Separator />
              <InfoRow icon={Phone} label="Teléfono" value={patient.phone} />
              <InfoRow icon={Mail} label="Email" value={patient.email} />
            </CardContent>
          </Card>

          {/* Emergency Contact Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-500" />
                Contacto de Emergencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.emergencyContact ? (
                <>
                  <InfoRow label="Nombre" value={patient.emergencyContact.name} />
                  <InfoRow label="Teléfono" value={patient.emergencyContact.phone} />
                  <InfoRow label="Parentesco" value={patient.emergencyContact.relationship} />
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No registrado</p>
              )}
            </CardContent>
          </Card>

          {/* Insurance Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-sky-500" />
                Seguro / Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.insurancePlan ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{patient.insurancePlan}</p>
                    <p className="text-sm text-muted-foreground">Plan activo</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sin seguro registrado</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center Column - Medical Background */}
        <div className="lg:col-span-2 space-y-4">
          {/* Medical Accordion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Antecedentes Médicos
              </CardTitle>
              <CardDescription>
                Información médica relevante para el tratamiento dental
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={["diseases", "allergies"]} className="w-full">
                {/* Systemic Diseases */}
                <AccordionItem value="diseases">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-amber-500" />
                      <span>Enfermedades Sistémicas</span>
                      <Badge variant="secondary" className="ml-2">
                        {history.systemicDiseases.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={history.systemicDiseases.join("\n")}
                        placeholder="Una enfermedad por línea..."
                        className="min-h-[100px]"
                      />
                    ) : history.systemicDiseases.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {history.systemicDiseases.map((disease, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin enfermedades registradas</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Medications */}
                <AccordionItem value="medications">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-sky-500" />
                      <span>Medicamentos Actuales</span>
                      <Badge variant="secondary" className="ml-2">
                        {history.currentMedications.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={history.currentMedications.join("\n")}
                        placeholder="Un medicamento por línea..."
                        className="min-h-[100px]"
                      />
                    ) : history.currentMedications.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {history.currentMedications.map((med, i) => (
                          <Badge key={i} variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin medicamentos registrados</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Allergies */}
                <AccordionItem value="allergies">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>Alergias</span>
                      <Badge variant="secondary" className="ml-2 bg-red-100 text-red-700">
                        {history.allergies.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={history.allergies.join("\n")}
                        placeholder="Una alergia por línea..."
                        className="min-h-[100px]"
                      />
                    ) : history.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {history.allergies.map((allergy, i) => (
                          <Badge key={i} variant="destructive">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin alergias registradas</p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Previous Surgeries */}
                <AccordionItem value="surgeries">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-emerald-500" />
                      <span>Cirugías Previas</span>
                      <Badge variant="secondary" className="ml-2">
                        {history.previousSurgeries.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={history.previousSurgeries.join("\n")}
                        placeholder="Una cirugía por línea..."
                        className="min-h-[100px]"
                      />
                    ) : history.previousSurgeries.length > 0 ? (
                      <ul className="space-y-2">
                        {history.previousSurgeries.map((surgery, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            {surgery}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin cirugías registradas</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Dental Background */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" />
                Antecedentes Odontológicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chief Complaint */}
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Motivo de Consulta</p>
                    {isEditing ? (
                      <Textarea
                        defaultValue={history.chiefComplaint}
                        className="mt-2"
                        placeholder="Describa el motivo principal de consulta..."
                      />
                    ) : (
                      <p className="text-foreground mt-1">{history.chiefComplaint}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Habits */}
              <div>
                <Label className="text-sm font-medium">Hábitos</Label>
                {isEditing ? (
                  <Input
                    defaultValue={history.habits.join(", ")}
                    className="mt-2"
                    placeholder="Bruxismo, tabaquismo, etc."
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {history.habits.length > 0 ? (
                      history.habits.map((habit, i) => (
                        <Badge key={i} variant="outline">
                          {habit}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin hábitos registrados</p>
                    )}
                  </div>
                )}
              </div>

              {/* Current Pain */}
              {history.currentPain && (
                <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">Dolor Actual</p>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <p className="text-xs text-red-600 dark:text-red-300">Ubicación</p>
                          <p className="font-medium text-red-800 dark:text-red-200">
                            {history.currentPain.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-red-600 dark:text-red-300">Intensidad</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500"
                                style={{ width: `${history.currentPain.intensity * 10}%` }}
                              />
                            </div>
                            <span className="font-medium text-red-800 dark:text-red-200">
                              {history.currentPain.intensity}/10
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-red-600 dark:text-red-300">Tipo</p>
                          <p className="font-medium text-red-800 dark:text-red-200">
                            {history.currentPain.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Dental Visit */}
              <InfoRow
                icon={Calendar}
                label="Última Atención Dental"
                value={history.lastDentalVisit ? formatDate(history.lastDentalVisit) : "No registrada"}
              />
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span>Creada: {formatDate(history.createdAt)}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Última actualización: {formatDate(history.updatedAt)}</span>
                </div>
                {history.isValidated && history.validatedBy && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Validada por: {history.validatedBy}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function MedicalHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-32 bg-muted animate-pulse rounded-xl" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    </div>
  );
}
