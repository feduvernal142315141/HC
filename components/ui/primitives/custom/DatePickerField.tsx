"use client";

import * as React from "react";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/primitives/shadcn/button";
import { Label } from "@/components/ui/atomic/forms/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives/shadcn/popover";
import { Calendar } from "@/components/ui/primitives/shadcn/calendar";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";

type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  error?: string;
  required?: boolean;
  minYear?: number;
  maxDate?: Date;
  placeholder?: string;
};

type ControlledDatePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  minYear: number;
  maxDate: Date;
  placeholder: string;
  error?: string;
};

function ControlledDatePicker({
  value,
  onChange,
  label,
  required,
  minYear,
  maxDate,
  placeholder,
  error,
}: ControlledDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;
    try {
      return parseISO(value);
    } catch {
      return undefined;
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd/MM/yyyy")
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(minYear, 0)}
            endMonth={maxDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function DatePickerField<TFieldValues extends FieldValues>({
  name,
  control,
  label = "Fecha",
  error,
  required,
  minYear = 1900,
  maxDate = new Date(),
  placeholder = "Selecciona una fecha",
}: DatePickerFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const fieldValue = typeof field.value === "string" ? field.value : undefined;

        return (
          <ControlledDatePicker
            value={fieldValue}
            onChange={field.onChange}
            label={label}
            required={required}
            minYear={minYear}
            maxDate={maxDate}
            placeholder={placeholder}
            error={error}
          />
        );
      }}
    />
  );
}
