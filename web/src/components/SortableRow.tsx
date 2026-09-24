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

// Renders the row and hands the drag handle to the caller so it can be
// placed inside the row's own layout.
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
      className="inline-flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted hover:bg-hover hover:text-foreground active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`relative border-t border-border bg-surface ${
        isDragging ? "z-10 shadow-lg" : ""
      }`}
    >
      {children(dragHandle)}
    </article>
  );
}
