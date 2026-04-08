import React, { useMemo } from "react";
import FormInputRow from "../../ui/FormInputRaw";
import { cn } from "../../../lib/utils";
import { errorHandler } from "./helpers/errorHandler";
import UDLayouts from "./helpers/UDLayouts";
import UDSection from "./helpers/section";
import UDAccordion from "./helpers/accordions";
import UDSummary from "./helpers/summary";
import BookInput from "./helpers/BookInput";


/**
 * @param {Object} schema - Array of field objects or section objects
 * @param {Object} fields - Current state data
 * @param {Function} fieldsFunc - State setter
 * @param {String} mode - 'add' | 'update' | 'view'
 */
const UniversalDialog = ({
  open,
  onOpenChange,
  trigger,
  schema = [],
  onSubmit,
  mode = "add",
  config = {},
  grid = 2,
  children
}) => {
  const isView = mode === "view";
  const errors = useMemo(() => errorHandler(schema, isView), [schema, isView]);
  const isInvalid = Object.values(errors).some(e => e !== "");

  return (
    <UDLayouts
      trigger={trigger}
      onSubmit={onSubmit}
      mode={mode}
      config={config}
      isView={isView}
      isInvalid={isInvalid}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className={cn("grid gap-x-6 gap-y-6", `grid-cols-1 md:grid-cols-${grid}`)}>
        {schema.map((item, idx) => {
          if (item.type === "section") {
            return <UDSection label={item.label} key={`sec-${idx}`} />;
          }

          // 2. ACCORDION TYPE (New!)
          if (item.type === "accordion") {
            return (
              <UDAccordion
                accordionItems={item.accordionItems}
                variant={item.variant || "light"}
                allowMultiple={true}
                key={`acc-${idx}`}
              />
            );
          }

          if (item.type === "book_accordion") {
            const accordionItems = Object.keys(item.data).map(category => ({
              title: category.toUpperCase(),
              content: (
                <div className="p-4 gap-3 bg-slate-50/50 rounded-xl">
                  {item.data[category].map((book) => (
                    <BookInput
                      key={book.value}
                      label={book.label}
                      isView={isView}
                      value={item.details.find(d => d.livre_id === book.value)?.qte}
                      onChange={(qte) => item.onUpdateDetail(book.value, book.label, qte)}
                    />
                  ))}
                </div>
              )
            }));
            return (
              <UDAccordion
                accordionItems={accordionItems}
                variant={"light"}
                allowMultiple={true}
                key={idx}
              />
            );
          }

          // 3. SUMMARY TABLE TYPE (New!)
          if (item.type === "summary" && item.data?.length > 0) {
            return (
              <UDSummary
                key={idx}
                data={item.data}
              />
            );
          }

          const { name, label, value, onChange, className, ...rest } = item;
          if (!name) return null;
          return (
            <FormInputRow
              key={item.name || idx}
              label={item.label}
              type={item.type || "text"}
              inputType={item.inputType || "input"}
              items={item.items || []}
              // VALUES FROM SCHEMA
              value={item.value ?? ""}
              onChange={(val) => !isView && item.onChange(val)}
              // CONFIG FROM SCHEMA
              disabled={isView || item.disabled}
              error={errors[item.name]}
              className={cn(item.className || "space-y-2")}
              labelClassName="text-sm font-bold text-slate-700 uppercase"
              inputClassName="h-12 border-slate-200 rounded-xl bg-slate-50/50"
              {...rest}
            />
          );
        })}
      </div>
      {/* 2. Render Custom Content (Accordions, Summary, etc.) */}
      <div className="mt-6">
        {children}
      </div>
    </UDLayouts>
  );
};

export default UniversalDialog;