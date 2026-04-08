import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { cn } from "../../lib/utils"

const AlertBox = AlertDialog.Root

const AlertBoxTrigger = AlertDialog.Trigger

const AlertBoxPortal = AlertDialog.Portal

const AlertBoxOverlay = React.forwardRef((
  { className, ...props },
  ref
) => (
  <AlertDialog.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
    {...props}
  />
)
)
AlertBoxOverlay.displayName = AlertDialog.Overlay.displayName


const AlertBoxContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <AlertDialog.Content
    ref={ref}
    className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className)}
    {...props}
  >
    {children}
  </AlertDialog.Content>
))
AlertBoxContent.displayName = AlertDialog.Content.displayName

const AlertBoxTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialog.Title
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
))
AlertBoxTitle.displayName = AlertDialog.Title.displayName

const AlertBoxDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialog.Description
    ref={ref}
    {...props}
    className={cn("text-sm text-muted-foreground", className)}
  />
))
AlertBoxDescription.displayName = AlertDialog.Description.displayName

const AlertBoxCancel = React.forwardRef(({ className, type = "success", ...props }, ref) => {
  const variant = {
    success: "bg-red-600 text-white",
    delete: "bg-emerald-600 text-white",
    view: "bg-slate-600 text-white",
    default: "bg-slate-900 text-white",
  }
  return (
    <AlertDialog.Cancel
      ref={ref}
      {...props}
      className={cn(variant[type], "px-4 py-2 rounded-md", className)}
    />
  )
})
AlertBoxCancel.displayName = AlertDialog.Cancel.displayName

const AlertBoxAction = React.forwardRef(({ className, type = "success", ...props }, ref) => {
  const variant = {
    success: "bg-emerald-600 text-white",
    delete: "bg-red-600 text-white",
    view: "bg-blue-600 text-white",
    default: "bg-slate-900 text-white",
  }

  return (
    <AlertDialog.Action
      ref={ref}
      {...props}
      className={cn(variant[type], "px-4 py-2 rounded-md", className)}
    />
  )
})
AlertBoxAction.displayName = AlertDialog.Action.displayName

const AlertBoxContainer = ({
  title,
  description,
  cancelText,
  actionText,
  onOk = () => { return true },
  onCancel = () => { return false },
  type = "success"
}) => {
  return (
    <AlertBoxPortal>
      <AlertBoxOverlay />
      <AlertBoxContent>
        <AlertBoxTitle>{title}</AlertBoxTitle>
        {typeof description === "string" ? <AlertBoxDescription>{description}</AlertBoxDescription> : description}
        <div className="flex justify-end gap-[25px]">
          <AlertBoxCancel type={type} onClick={onCancel}>{cancelText}</AlertBoxCancel>
          <AlertBoxAction type={type} onClick={onOk}>{actionText}</AlertBoxAction>
        </div>
      </AlertBoxContent>
    </AlertBoxPortal>
  )
}

export {
  AlertBox,
  AlertBoxTrigger,
  AlertBoxContainer,
}