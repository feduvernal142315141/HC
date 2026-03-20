import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface EvolutionActivitySummaryProps {
  total: number;
  doctors: number;
  treatedTeeth: number;
  withComplications: number;
}

export function EvolutionActivitySummary({
  total,
  doctors,
  treatedTeeth,
  withComplications,
}: EvolutionActivitySummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Resumen de Actividad</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <SummaryMetric label="Total" value={total} />
          <SummaryMetric label="Doctores" value={doctors} />
          <SummaryMetric label="Piezas tratadas" value={treatedTeeth} />
          <SummaryMetric label="Con complicaciones" value={withComplications} />
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
