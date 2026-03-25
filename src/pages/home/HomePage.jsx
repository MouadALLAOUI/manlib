import { Button } from "../../components/ui/button";
import { AccordionComponent } from "../../components/ui/accordion";
import FormInputRow from "../../components/ui/FormInputRaw";
import { useState } from "react";

function HomePage() {
    const [selectedDestination, setSelectedDestination] = useState("");
    const accordionItems = [
        {
            title: "Choisir une déstination",
            content: (
                <div className="px-5 py-[15px]">
                    <FormInputRow
                        label="déstination"
                        name="déstination"
                        placeholder="MSM-Medias"
                        id="msmMedias"
                        inputType="select"
                        items={[
                            { label: "MSM", value: "msm" },
                            { label: "Kech", value: "kech" },
                            { label: "Safi", value: "safi" }
                        ]}
                        layout="column"
                        allowEmpty={true}
                        emptyLabel="MSM-Medias"
                        value={selectedDestination}
                        onChange={(value) => setSelectedDestination(value)}
                    />
                </div>
            ),
        },
        {
            title: "Stock - Livraison --|-- Categorie : Primaire",
            content: (
                <div className="px-5 py-[15px]">
                    <Button variant="outline" className="mb-2">
                        <img src="https://img.icons8.com/ios/24/000000/box--v1.png" alt="stock" className="inline-block mr-2" />
                        Stock: 150
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <div className="HomePage px-5">
            {/* <HeaderComponent /> */}
            <AccordionComponent AccordionItems={accordionItems} id="home" allowMultiple={true} />
        </div >
    );
}

export default HomePage;
