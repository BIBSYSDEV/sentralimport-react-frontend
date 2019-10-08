import React from "react"
import axios from "axios";

export default function Login() {

    function handleClick(){
        window.location.href = "https://auth.dataporten.no/oauth/authorization?client_id=7848abba-1ae4-47c9-b928-f8e4a285a945&redirect_uri=http://localhost:3000/login&scope=openid&response_type=code&state=bra";
        // axios.get("https://auth.dataporten.no/oauth/authorization?client_id=7848abba-1ae4-47c9-b928-f8e4a285a945&redirect_uri=http://localhost:3000/login&scope=openid&response_type=code&state=bra");
    }
    return (
        <div>
            Login test
            <br />
            <button onClick={handleClick}>Login</button>
        </div>
    );
};