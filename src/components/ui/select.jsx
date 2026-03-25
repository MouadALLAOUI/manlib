import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, ChevronUpIcon } from "lucide-react"

import { Select as RadixSelect } from "radix-ui";

import { cn } from "../../lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}>
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}>
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}>
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn("p-1", position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

const SelectComponent = ({ items = [], label, placeholder = "default ...", ...props }) => {
  return (
    <RadixSelect.Root className={SelectComponentStyles.root}>
      <RadixSelect.Trigger className={SelectComponentStyles.trigger} aria-label={label}>
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="text-black-400">
          <ChevronDown />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal className="relative">
        <RadixSelect.Content className={SelectComponentStyles.content}>
          <RadixSelect.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-black-400">
            <ChevronUpIcon />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className={SelectComponentStyles.viewport}>
            {items.map((item, index) => {
              return (
                // <RadixSelect.Group key={index}>
                //   <RadixSelect.Label value={item} className={SelectComponentStyles.label}>4</RadixSelect.Label>
                <RadixSelect.Item
                  key={index}
                  value={item}
                  className={SelectComponentStyles.item}
                  {...props}
                >
                  <RadixSelect.ItemText>{item}</RadixSelect.ItemText>
                </RadixSelect.Item>
                // </RadixSelect.Group>
              )
            })}

          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-black-400">
            <ChevronDown />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const CustomSelectComponent = ({
  items = [],           // Can be ["Apple", "Orange"] or [{ label: "Apple", value: "apple" }]
  label,                // For accessibility
  placeholder = "Select...",
  value,                // Controlled value
  onValueChange,        // Change handler
  defaultValue,         // Initial value
  allowEmpty = false,   // If true, adds an "Empty" option
  emptyLabel = "None",  // Label for the empty option
  className,            // Additional trigger styling
  ...props
}) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      {...props}
    >
      <SelectTrigger
        className={`h-12 border-slate-200 focus:ring-primary bg-white w-full ${className}`}
        aria-label={label}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="bg-white border border-slate-200 shadow-md">
        <SelectGroup>
          {/* 1. Optional Empty/Reset Value */}
          {allowEmpty && (
            <SelectItem value="none" className="text-slate-400">
              {emptyLabel}
            </SelectItem>
          )}

          {/* 2. Controlled Item Mapping */}
          {items.map((item, index) => {
            // Support both simple strings and objects { label, value }
            const itemValue = typeof item === "object" ? item.value : item;
            const itemLabel = typeof item === "object" ? item.label : item;

            return (
              <SelectItem
                key={`${itemValue}-${index}`}
                value={itemValue}
                className="hover:bg-slate-100 cursor-pointer"
              >
                {itemLabel}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const SelectComponentStyles = {
  trigger: "flex w-[60%] h-[35px] items-center justify-between gap-[5px] rounded bg-white px-[15px] text-[16px] leading-none text-black-400 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-zinc-50 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-black-400",
  content: "absolute left-0 top-[40px] overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]",
  viewport: "p-[5px]",
  label: "px-[25px] text-xs leading-[25px] text-tail-500 ",
  item: "relative flex h-[25px] w-full cursor-pointer hover:bg-zinc-50 focus:bg-zinc-50 select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-black-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-black-400 data-[disabled]:text-mauve8 data-[highlighted]:text-emerald-400 data-[highlighted]:outline-none"
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectComponent,
  CustomSelectComponent
}
