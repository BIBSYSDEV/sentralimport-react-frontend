import React, {useEffect, useLayoutEffect} from "react";

import Select from "react-select";
import axios from "axios";
import {Context} from "../../Context";
import {properties} from "../../properties.js"

export default function InstitutionCountrySelect(props) {
    const [institutions, setInstitutions] = React.useState("");
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
    }

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

    return (
        <Select
            placeholder="Søk på institusjoner eller sted"
            name="institutionSelect"
            options={groupOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={props.onChange}
            onInputChange={handleInput}
            aria-label="Institusjonsvelger"  
        />
    );
}