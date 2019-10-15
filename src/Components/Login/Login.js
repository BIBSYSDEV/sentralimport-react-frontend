import React from "react"
import queryString from 'query-string';
import jwt from 'jsonwebtoken';
import '../../assets/styles/common.scss'
import Header from "../Header/Header";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Login(props) {
    //privat
    const client_id = "7848abba-1ae4-47c9-b928-f8e4a285a945";
    //unit
    // const client_id = "ab940329-87f9-40dc-a129-bf9d4ae07917";
    const search = queryString.parse(props.location.hash);
    const authState = "bra";

    function handleLogin(){
        localStorage.setItem("nonce", generateNonce());
        window.location.href = "https://auth.dataporten.no/oauth/authorization?client_id=" + client_id + "&redirect_uri=http://localhost:3000/login" +
            "&scope=openid userid email userid-feide profile gk_testing&response_type=id_token token&state=" + authState + "&nonce=" + localStorage.getItem("nonce");
    }

    function handleLogout(){
        localStorage.clear();
        window.location.href = "/login";
    }

    function generateNonce() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    async function testApi() {
        if(localStorage.getItem("access_token") != null) {
            let config = {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            };
            let test = await axios.get("https://testing.dataporten-api.no", config);
            console.log(test);
        } else {
            console.log("access-token no good")
        }
    }

    function validate() {

        let jsonToken = jwt.decode(search.id_token);

        if (jsonToken.aud !== client_id && jsonToken.nonce !== localStorage.getItem("nonce") && search.state === authState)
            console.log("Error! Wrong nonce!");
        else {
            console.log("Logged in");
            localStorage.setItem("authorized", "true");
            localStorage.setItem("access_token", search.access_token.toString());
            localStorage.setItem("expires", jsonToken.exp);
            // window.location.href = "/";
        }
    }

    if (search.access_token != null)
        validate();

    return (
        <div className={`login`} >
            <Header />
            <h2>Logg inn</h2>
            <br />
            { localStorage.getItem("authorized") ?
                (<div>
                    <p>Du er allerede logget inn. Ønsker du å logge ut?</p>
                    <Button onClick={handleLogout}>Logg ut</Button><br /><br />
                    <button onClick={testApi}>Test api</button>
                </div>) :
                (<Button onClick={handleLogin}>Logg inn</Button>)
            }
        </div>
    )
};