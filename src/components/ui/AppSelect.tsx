"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/** Radix Select cannot use empty string as a value; map optional picks through this sentinel. */
const EMPTY_VALUE = "__app_select_empty__";

export type AppSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export interface AppSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: AppSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  id?: string;
}

function toRadixValue(value: string) {
  return value === "" ? EMPTY_VALUE : value;
}

function fromRadixValue(value: string) {
  return value === EMPTY_VALUE ? "" : value;
}

export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className,
  triggerClassName,
  id,
}: AppSelectProps) {
  const radixValue = toRadixValue(value);
  const selectedOption = options.find(
    (option) => toRadixValue(option.value) === radixValue,
  );

  return (
    <div className={cn("w-full", className)}>
      <Select
        value={radixValue}
        onValueChange={(next) => onValueChange(fromRadixValue(next))}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={triggerClassName}>
          <SelectValue placeholder={placeholder}>
            {selectedOption?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const itemValue = toRadixValue(option.value);
            return (
              <SelectItem
                key={itemValue}
                value={itemValue}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
