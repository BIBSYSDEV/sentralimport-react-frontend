import React from "react";
import queryString from "query-string";
import jwt from "jsonwebtoken";
import "../../assets/styles/common.scss";
import loginIcon from "../../assets/icons/login.png";
import logo from "../../assets/icons/Hovedlogo-Liten-Farge.svg";
import axios from "axios";
import { Button } from "reactstrap";
import { Grid, CardContent, Typography } from "@material-ui/core";
import { Card } from "@material-ui/core";

export default function Login(props) {
  const client_id = "ab940329-87f9-40dc-a129-bf9d4ae07917";
  const search = queryString.parse(props.location.hash);
  const authState = "bra";
  const gateway_scope = "gk_piarest-utv";

  function handleLogin() {
    localStorage.setItem("nonce", generateNonce());
    window.location.href =
      "https://auth.dataporten.no/oauth/authorization?client_id=" +
      client_id +
      "&redirect_uri=http://localhost:3000/login" +
      "&scope=openid userid email userid-feide userid-nin profile " +
      gateway_scope +
      "&response_type=id_token token&state=" +
      authState +
      "&nonce=" +
      localStorage.getItem("nonce");
  }

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/login";
    window.location.href = "https://auth.dataporten.no/logout";
  }

  function generateNonce() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }

  async function testApi() {
    if (localStorage.getItem("access_token") != null) {
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      };
      let test = await axios.get(
        "https://piarest-utv.dataporten-api.no",
        config
      );
      console.log(test);
    } else {
      console.log("access-token no good");
    }
  }

  function validate() {
    let jsonToken = jwt.decode(search.id_token);

    if (
      jsonToken.aud !== client_id &&
      jsonToken.nonce !== localStorage.getItem("nonce") &&
      search.state === authState
    )
      console.log("Error! Wrong nonce!");
    else {
      console.log("Logged in");
      localStorage.setItem("authorized", "true");
      localStorage.setItem("access_token", search.access_token.toString());
      localStorage.setItem("expires", jsonToken.exp);
    }
  }

  if (search.access_token != null) validate();

  return (
    <div className={`login`}>
      <br />
      {localStorage.getItem("authorized") &&
      localStorage.getItem("authorized") === "true" ? (
        <div>
          <p>Du er allerede logget inn. Ønsker du å logge ut?</p>
          <Button onClick={handleLogout}>Logg ut</Button>
          <br />
          <br />
          <Button onClick={testApi}>Test api</Button>
        </div>
      ) : (
        <Grid
          container
          alignItems="center"
          justify="center"
          direction="row"
          className={"login-grid"}
        >
          <Grid item xs={12}>
            <img
              src={logo}
              className={"cristin-logo"}
              title="CRISTIN-logo"
              alt="CRISTIN-logo"
            ></img>
            <h1> CRISTIN Sentralimport</h1>
          </Grid>
          <Grid container item xs={12} justify="center">
            <Card className={"login-card"}>
              <CardContent>
                <Typography variant="body1" component="div" gutterBottom>
                  Logg inn til Sentralimport:
                </Typography>
                <Button
                  onClick={handleLogin}
                  color="primary"
                  variant="contained"
                >
                  <Grid container alignContent="center" spacing={2}>
                    <Grid item xs={2}>
                      <img
                        src={loginIcon}
                        className={"feide-login-icon"}
                        title="Feide Login"
                        alt="Feide Login"
                      ></img>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={10}
                      alignItems="center"
                      justify="center"
                    >
                      <div>
                        Logg inn via{" "}
                        <span className={"feide-login-button"}> Feide</span>
                      </div>
                    </Grid>
                  </Grid>
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
