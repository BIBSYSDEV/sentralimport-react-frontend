import React, {useEffect} from "react";

import Select from "react-select";
import axios from "axios";

export default function InstitutionSelect(props) {

    const [institutions, setInstitutions] = React.useState("");
    let done = true;

    useEffect(() => {
        async function fetch() {
            await getInstitutions();
            done = true;
        }
        fetch();
    }, []);

    async function getInstitutions() {
        let temp = await axios.get("https://api.cristin-utv.uio.no/v2/institutions?cristin_institution=true&lang=nb&per_page=300");

        temp = temp.data.filter(i => i.cristin_user_institution);
        let institutions = [];
        for (let i = 0; i < temp.length; i++) {
            institutions.push({value: temp[i].acronym, label: temp[i].institution_name.nb, institutionNr: temp[i].cristin_institution_id});
        }
        setInstitutions(institutions);
    }

    return (
        <Select
            placeholder="Søk på institusjoner"
            name="institutionSelect"
            options={institutions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={props.onChange}
        />
    );
}
