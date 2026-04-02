import { ArrowBigDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

// 1. Define your style variants here
const variants = {
    green: {
        root: "bg-mauve6 shadow-black/5",
        trigger: "bg-emerald-400 hover:bg-emerald-500 text-black-900 shadow-emerald-300",
        content: "bg-lime-300 text-mauve11",
    },
    transparent: {
        root: "bg-transparent shadow-none",
        trigger: "bg-transparent hover:bg-white/10 text-white shadow-transparent",
        content: "bg-transparent text-white/80",
    },
    outline: {
        root: "bg-white border border-slate-200",
        trigger: "bg-white hover:bg-slate-50 text-slate-900 shadow-none",
        content: "bg-slate-50 text-slate-600",
    },
    slate: {
        root: "bg-white shadow-sm border border-slate-200",
        trigger: "bg-slate-900 hover:bg-black text-white shadow-slate-200",
        content: "bg-white text-slate-700",
    },
    light: {
        root: "bg-white border border-slate-100",
        trigger: "bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-none",
        content: "bg-white text-slate-600",
    },
};

export const AccordionComponent = ({
    AccordionItems = [],
    id = "default",
    variant = "slate",
    allowMultiple = false, // New: toggles single/multiple mode
    defaultValue,          // New: accepts a string (single) or array (multiple)
}) => {
    const selectedVariant = variants[variant] || variants.slate;

    return (
        <Accordion.Root
            className={`${styles.root} ${selectedVariant.root}`}
            // 1. Dynamic type selection
            type={allowMultiple ? "multiple" : "single"}
            // 2. Use provided defaultValue or fall back to the first item
            defaultValue={defaultValue || (allowMultiple ? [`item-${id}-1`] : `item-${id}-1`)}
            collapsible
        >
            {AccordionItems.map((item, index) => {
                const itemValue = `item-${id}-${index + 1}`;

                return (
                    <Accordion.Item
                        key={index}
                        value={itemValue}
                        // 3. Disable the item based on data
                        disabled={item.disabled}
                        className={`${styles.item} ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <Accordion.Header className="flex">
                            <Accordion.Trigger
                                className={`${styles.trigger} ${selectedVariant.trigger}`}
                                // Ensure the trigger doesn't look clickable if disabled
                                style={item.disabled ? { pointerEvents: 'none' } : {}}
                            >
                                {item.title}
                                <ArrowBigDown className={styles.triggerIcon} />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className={`${styles.content} ${selectedVariant.content}`}>
                            <div className="p-4">{item.content}</div>
                        </Accordion.Content>
                    </Accordion.Item>
                );
            })}
        </Accordion.Root>
    );
};

// 3. Keep layout-only styles here (padding, flex, transitions)
const styles = {
    root: "w-full rounded-md shadow-[0_2px_10px]",
    item: "mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-1 focus-within:shadow-[0_0_0_1px] focus-within:shadow-slate-100",
    trigger: "group flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none outline-none transition-colors duration-200",
    triggerIcon: "group-data-[state=open]:rotate-180 transition-transform duration-200",
    content: "overflow-hidden text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
};