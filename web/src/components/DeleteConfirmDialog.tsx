"use client";

import { useEffect } from "react";

type DeleteConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  itemName?: string;
  isDeleting?: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmDialog({
  open,
  title,
  description,
  itemName,
  isDeleting = false,
  error = "",
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeleting) {
        onCancel();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isDeleting, onCancel]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        className="w-full max-w-md rounded-xl border border-border bg-surface p-5 text-foreground shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-dialog-title" className="text-lg font-semibold">
          {title}
        </h2>

        {itemName && (
          <p className="mt-2 text-sm font-medium wrap-anywhere">{itemName}</p>
        )}

        <p id="delete-dialog-description" className="mt-2 text-sm text-muted">
          {description}
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            aria-busy={isDeleting}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-danger px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
