"use client";

import { useState } from "react";

import Icon from "@/components/Icon";

export default function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  options: { value: number; label: string }[];
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div
        className="relative"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-input-border bg-surface px-3 text-left text-foreground focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        >
          <span className="truncate">{selected?.label}</span>
          <Icon
            name="arrow"
            className={`size-4 shrink-0 text-muted transition-transform ${
              open ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>
        {open && (
          <ul
            role="listbox"
            aria-label={label}
            className="absolute z-10 mt-1 max-h-56 w-full min-w-36 overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-xl"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex min-h-9 w-full items-center px-3 text-left text-sm transition-colors hover:bg-hover ${
                    option.value === value
                      ? "bg-primary-soft font-medium text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
