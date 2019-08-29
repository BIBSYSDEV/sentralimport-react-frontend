import ResultIcon from "../../assets/icons/result-active.svg";
import React from "react";
import '../../assets//styles/Results.scss'
import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel
} from "@material-ui/core";

export function Result(props) {

    console.log(props);
    const getMainImage = () => {return ResultIcon};

    return (
        <div>

        <li className={`card-horiz basic-background card-horiz-hover result`} key={props.data.cristin_result_id}>
            <Radio value={props.data.cristin_result_id}></Radio>
            <a className={`result result`} href={"https://app.cristin.no/results/show.jsf?id=" + props.data.cristin_result_id} target="_blank">
                <div className='image-wrapper'>
                    <img src={getMainImage('result')} />
                </div>
                <div className='content-wrapper'>
                    <h6>{ props.data.title.hasOwnProperty('nb') ? props.data.title.nb : props.data.title.en }</h6>
                    <div className={`metadata`}>
                        <p>{props.data.authors.map((author) => author.surname + ", "  + author.first_name + "; ")}</p>
                        <p className={`active`} >{props.data.category.name.en}</p>
                        <p className={`italic`} >
                            {props.data.hasOwnProperty('international_standard_numbers') ?
                                props.data.international_standard_numbers.map((issn) => "ISSN " + issn.type + ": " + issn.value + "; ") :
                            ""}
                        </p>
                        <p>{props.data.year_published + ", " + props.data.publisher.name}</p>
                    </div>
                </div>
            </a>
        </li>
        </div>
    )
}