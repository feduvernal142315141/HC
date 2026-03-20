# HC - historia clinica standalone

Proyecto aislado para trabajar solo el modulo de historia clinica fuera de `clinicalFront`.

## Alcance de este aislamiento

- Incluye el modulo `components/clinical-history`.
- Incluye soporte minimo para compilar y renderizar:
  - `lib/clinical-history` (tipos y mock service)
  - `components/odontogram`
  - `components/ui` (con barrel reducido a exports usados por historia clinica)
  - `lib/utils/utils.ts` (`cn`)
- NO incluye refactor funcional ni limpieza de codigo.
- NO modifica `clinicalFront`.

## Requisitos

- Node.js 20+
- Yarn 1.x (lockfile generado con Yarn Classic)

## Ejecutar local

```bash
cd /Users/frankhernandez/MenteVior/HC
yarn install
yarn dev
```

Abrir en navegador:

- Home: `http://localhost:3000/`
- Modulo historia clinica: `http://localhost:3000/historia-clinica`

Si el puerto `3000` esta ocupado, Next usara otro puerto automaticamente.

## Punto de entrada del modulo

- Ruta: `app/historia-clinica/page.tsx`
- Render: `ClinicalHistoryLayout` con `patientId` de `mockPatient`

## Pendiente para la etapa de refactor

- Reducir dependencia de `antd` dentro de `components/ui/primitives/shadcn/button.tsx`.
- Recortar `components/ui` fisicamente a solo primitives realmente usados.
- Reemplazar mocks por datos reales/API cuando se defina contrato.
