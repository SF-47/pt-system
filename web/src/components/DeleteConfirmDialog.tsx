"use client";

import { useEffect, useState } from "react";

type DeleteConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  itemName?: string;
  isDeleting?: boolean;
  error?: string;
  confirmLabel?: string;
  confirmingLabel?: string;
  /** When set, the confirm button stays disabled until this exact text is typed. */
  requiredText?: string;
  confirmTone?: "danger" | "primary";
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmDialog(props: DeleteConfirmDialogProps) {
  // The body mounts only while open, so the typed confirmation resets every time.
  return props.open ? <DeleteConfirmDialogBody {...props} /> : null;
}

function DeleteConfirmDialogBody({
  open,
  title,
  description,
  itemName,
  isDeleting = false,
  error = "",
  confirmLabel = "Delete",
  confirmingLabel = "Deleting...",
  requiredText,
  confirmTone = "danger",
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [typedText, setTypedText] = useState("");

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

        {requiredText && (
          <div className="mt-3">
            <label
              htmlFor="delete-dialog-confirm-text"
              className="mb-1.5 block text-sm font-medium"
            >
              Type <span className="font-semibold">{requiredText}</span> to
              confirm
            </label>
            <input
              id="delete-dialog-confirm-text"
              type="text"
              autoComplete="off"
              value={typedText}
              disabled={isDeleting}
              onChange={(event) => setTypedText(event.target.value)}
              className="min-h-11 w-full rounded-md border border-input-border bg-background px-3 py-2 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
          </div>
        )}

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
            disabled={
              isDeleting ||
              (requiredText !== undefined && typedText.trim() !== requiredText)
            }
            aria-busy={isDeleting}
            className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
              confirmTone === "danger" ? "bg-danger" : "bg-primary"
            }`}
          >
            {isDeleting ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
