import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { AccordionComponent } from "../../components/ui/accordion";
import FormInputRow from "../../components/ui/FormInputRaw";
import destinationService from "../../api/services/destinationService";
import toast from "react-hot-toast";

function HomePage() {
    const [selectedDestination, setSelectedDestination] = useState("");
    const [destinations, setDestinations] = useState([]);

    const fetchData = async () => {
        try {
            const response = await destinationService.getAll();
            setDestinations(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching destinations:", error);
            toast.error("Erreur lors du chargement des destinations");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                        items={destinations.map((item) => ({
                            label: item.destination,
                            value: item.id
                        }))}
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
            title: "Achat - Vente - Stock / Niveau --|-- Categorie : Primaire",
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
