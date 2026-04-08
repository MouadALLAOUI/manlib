import { AccordionComponent } from "../../../ui/accordion";

const UDAccordion = ({ accordionItems, variant = "slate", allowMultiple, id = "default", defaultValue }) => {
    return (
        <div className="col-span-full mt-6">
            <AccordionComponent
                AccordionItems={accordionItems}
                variant={variant}
                id={id}
                defaultValue={defaultValue}
                allowMultiple={allowMultiple}
            />
        </div>
    )
}

export default UDAccordion;