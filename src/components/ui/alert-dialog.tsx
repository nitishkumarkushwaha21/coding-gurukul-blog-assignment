"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function AlertDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) return null;

  return (
    <span
      onClick={() => ctx.setOpen(true)}
      role="button"
      tabIndex={0}
      className="inline-flex"
    >
      {children}
    </span>
  );
}

export function AlertDialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={cn(
          "w-full max-w-md rounded-lg border bg-white p-5 shadow-xl",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

export function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-slate-600", className)} {...props} />;
}

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
  );
}

export function AlertDialogCancel({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={() => ctx.setOpen(false)}
      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const ctx = React.useContext(AlertDialogContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        ctx.setOpen(false);
      }}
      className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
    >
      {children}
    </button>
  );
}
