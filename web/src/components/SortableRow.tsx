"use client";

import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type SortableRowProps = {
  id: number;
  label: string;
  children: (dragHandle: ReactNode) => ReactNode;
};

export default function SortableRow({ id, label, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dragHandle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      aria-label={`Drag to reorder ${label}`}
      title="Drag to reorder"
      className="inline-flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-md border border-border-strong bg-background text-foreground transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary-hover focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary active:cursor-grabbing dark:hover:text-foreground"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-5" />
    </button>
  );

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative border-t border-border bg-surface ${
        isDragging ? "z-10 rounded-md ring-2 ring-primary shadow-xl" : ""
      }`}
    >
      {children(dragHandle)}
    </article>
  );
}
