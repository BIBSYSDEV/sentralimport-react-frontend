import React, {useEffect} from "react";

import Select from "react-select";
import axios from "axios";
import {Context} from "../../Context";
import {properties} from "../../properties.js"
import { Card } from "@material-ui/core";

export default function InstitutionCountrySelect(props) {
    const [institutions, setInstitutions] = React.useState("");
    const [units, setUnits] = React.useState("");
    let {state, dispatch} = React.useContext(Context);
    const [places, setPlaces] = React.useState("");
    const [groupOptions, setGroupOptions] = React.useState([{label: "Cristin-institusjoner", options: state.institutions}, {label: "Annet", options: places}]);
    const [inputValue, setInputValue] = React.useState("");

    useEffect(() => {
        async function fetch() {
            await getInstitutions();
        }

        fetch();
        var temp = [{label: "Cristin-institusjoner", options: state.institutions}, {label: "Annet", options: places}];
        setGroupOptions(temp);
    }, []);


    useEffect(() => {
        async function fetchPlaces() {
            await getPlaces();
        }

        fetchPlaces();
        var temp = [{label: "Cristin-institusjoner", options: state.institutions}, {label: "Annet", options: places}];
        setGroupOptions(temp);
    }, [inputValue]);

    useEffect(() => {
        console.log(props.institution);
        getUnits();
    }, [props.institution]);

    const cardStyle = {
        overflow: "visible",
        padding: "10px"
    };

    const unitSelectStyle = {
        marginTop: "10px"
    };

    async function getPlaces() {
        if (inputValue !== "") {
            let temp = await axios.get(
                properties.crisrest_gatekeeper_url + "/institutions?cristin_institution=false&lang=nb&name=" + inputValue, JSON.parse(localStorage.getItem("config"))
            );

            let places = [];
            for (let i = 0; i < temp.data.length; i++) {
                places.push({
                    value: temp.data[i].acronym,
                    label: temp.data[i].institution_name.nb,
                    institutionNr: temp.data[i].cristin_institution_id
                });
            }
            setPlaces(places);
        }
    }

    function handleInput(event) {
        console.log(event);
        setInputValue(event);
    };

    async function getInstitutions() {
        if (state.institutions === null) {
            let temp = await axios.get(
                properties.crisrest_gatekeeper_url + "/institutions?cristin_institution=true&lang=nb&per_page=300", JSON.parse(localStorage.getItem("config"))
            );

            temp = temp.data.filter(i => i.cristin_user_institution);
            let institutions = [];
            for (let i = 0; i < temp.length; i++) {
                institutions.push({
                    value: temp[i].acronym,
                    label: temp[i].institution_name.nb,
                    institutionNr: temp[i].cristin_institution_id
                });
            }
            setInstitutions(institutions);
            await dispatch({type: "institutions", payload: institutions});
        } else {
            setInstitutions(state.institutions);
        }
    }

    async function getUnits() {
      
        if(props.institution.institutionNr) {
            let temp = await axios.get(properties.crisrest_gatekeeper_url + "/units?parent_unit_id=" + props.institution.institutionNr + ".0.0.0&per_page=900", JSON.parse(localStorage.getItem("config")));
            console.log(temp);
            let units = [];
            for (let i = 0; i < temp.data.length; i++) {
                if(temp.data[i].hasOwnProperty("unit_name") && (temp.data[i].unit_name.nb || temp.data[i].unit_name.en)) {
                units.push({
                    label: temp.data[i].unit_name.nb || temp.data[i].unit_name.en,
                    value: temp.data[i].cristin_unit_id
                });
            }
            }
            console.log(units);
            setUnits(units);
        }
    }

    return (
        <Card style={cardStyle}>
        <Select
            placeholder="Søk på institusjoner eller sted"
            name="institutionSelect"
            options={groupOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={props.onChange}
            onInputChange={handleInput}
            aria-label="Institusjonsvelger"
            value={props.institution}  
        />

        {props.institution.value && units.length > 0 ? <div style={unitSelectStyle}><Select placeholder="Søk på enheter" name="unitSelect" options={units} value={props.unit} onChange={props.handleChange} isClearable /></div> : ""}
        </Card>
    );
}