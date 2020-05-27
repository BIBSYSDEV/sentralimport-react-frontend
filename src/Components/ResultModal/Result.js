import ResultIcon from "../../assets/icons/result-active.svg";
import React from "react";
import '../../assets/styles/Results.scss'
import {
    Radio
} from "@material-ui/core";

export function Result({data}) {

    const getMainImage = () => {return ResultIcon};

    const titleStyle = {
        display: 'block',
        fontSize: '1rem',
        marginTop: '0',
        marginBottom: '.5rem',
        marginLeft: '0',
        marginRight: 0,
        fontWeight: '500',
        lineHeight: '1.2'
    };

    return (
        <div>
            <li className={`card-horiz basic-background card-horiz-hover result`} key={data.cristin_result_id}>
                <Radio value={data.cristin_result_id} aria-label="Duplikat"></Radio>
                <a className={`result result`} href={process.env.REACT_APP_LINK_URL +"/results/show.jsf?id=" + data.cristin_result_id} target="_blank" rel="noopener noreferrer">
                    <div className='image-wrapper'>
                        <img src={getMainImage('result')} alt="result"/>
                    </div>
                    <div className='content-wrapper'>
                        <p style={titleStyle}>{ data.title[data.original_language] }</p>
                        <div className={`metadata`}>
                            <p>{data.authors.map((author) => author.surname + ", "  + author.first_name + "; ") + (data.authors.length < data.authorTotalCount ? " et al" : "")}</p>
                            <p className={`active`} >{data.category.name.en}</p>
                            <p className={`italic`} >
                                {data.hasOwnProperty('international_standard_numbers') ?
                                    data.international_standard_numbers.map((issn) => "ISSN " + issn.type + ": " + issn.value + "; ") :
                                ""}
                            </p>
                            <p>{ data.year_published }{ data.hasOwnProperty('publisher') ? ', ' + data.publisher.name : '' }</p>
                        </div>
                    </div>
                </a>
            </li>
        </div>
    )
}