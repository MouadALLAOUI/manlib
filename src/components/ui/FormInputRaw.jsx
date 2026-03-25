import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CustomSelectComponent } from "./select";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

function FormInputRow({
    label,
    id,
    value,
    onChange,
    inputType = "text", // "text" | "textarea" | "select" | "password" | "number"
    type = "text",
    layout = "col",     // "row" | "col"
    placeholder = "",
    items = [],         // For select: ["Item 1"] or [{label: "X", value: "y"}]
    className = "",     // Styles for the container
    labelClassName = "",// Styles for the label
    inputClassName = "",// Styles for the input/select trigger
    allowEmpty = false,
    emptyLabel = "None",
    error = "",         // Error message
    required = false,   // Visual required indicator
    disabled = false,   // For submission states
    ...props
}) {
    // 1. Determine Layout Classes
    const isRow = layout === "row";

    const containerClasses = cn(
        isRow ? `grid grid-cols-3 items-center gap-4` : `flex flex-col gap-2`,
        className
    );


    // const labelClasses = `text-sm font-semibold text-slate-700 ${isRow ? "" : "mb-1"} ${labelClassName}`;
    const labelClasses = cn(
        "text-sm font-semibold text-slate-700",
        isRow ? "" : "mb-1",
        error && "text-red-500",
        labelClassName
    );

    const wrapperClasses = isRow ? "col-span-2" : "w-full";

    // 2. Helper to render the correct input field
    const renderInput = () => {
        const commonProps = {
            id,
            value,
            placeholder,
            disabled,
            ...props
        };

        const baseInputStyle = cn(
            "bg-white border-slate-300",
            error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-primary",
            inputClassName
        );

        switch (inputType) {
            case "textarea":
                return (
                    <Textarea
                        {...commonProps}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn("bg-slate-50 resize-none min-h-[80px]", baseInputStyle)}
                    />
                );

            case "select":
                return (
                    <CustomSelectComponent
                        items={items}
                        label={label}
                        placeholder={placeholder || "Sélectionner..."}
                        value={value}
                        onValueChange={onChange}
                        // Safe check for empty items array
                        defaultValue={props.defaultValue || (items.length > 0 ? (items[0].value || items[0]) : "")}
                        allowEmpty={allowEmpty}
                        emptyLabel={emptyLabel}
                        disabled={disabled}
                        className={baseInputStyle}
                    />
                );

            default: // text, password, number, etc.
                return (
                    <Input
                        {...commonProps}
                        type={type}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn("h-9", baseInputStyle)}
                    />
                );
        }
    };

    return (
        <div className={containerClasses}>
            <Label htmlFor={id} className={labelClasses}>
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className={wrapperClasses}>
                {renderInput()}

                {/* Error Message Display */}
                {error && (
                    <p className="mt-1 text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default FormInputRow;