import Header from "../Header/Header";
import Grid from "@material-ui/core/Grid/Grid";
import {Card, CardContent, Typography} from "@material-ui/core";
import {Button} from "react-bootstrap";
import React from "react";
import ErrorIcon from "../../assets/icons/alert-triangle.svg";
import {useHistory} from "react-router-dom";

export default function Error() {
    let history = useHistory();

    const getMainImage = () => {
        return ErrorIcon;
    };

    function logIn() {
        history.push("/login");
    }

    return (
        <div>
            <Header />
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item>
                    <img src={getMainImage()} alt="warning icon" />
                </Grid>
                <br />
                <Grid item>
                    <Card>
                        <CardContent alignItems="center">
                            <Typography variant="h4">
                                Det har skjedd en feil
                            </Typography>
                            <hr />
                            <div>
                                <p>Dette kan være fordi:</p>
                                <p>
                                    1. Du ikke har blitt gitt tilgang til Sentralimport av
                                    administrator
                                </p>
                                <p>2. Det har skjedd noe galt ved innlogging </p>
                                <p>3. Din sesjon har gått ut og du må logge inn på nytt</p>
                                <p>4. Det har skjedd en feil på serveren</p>
                                <p> --- </p>
                                <p>Dersom problemet vedvarer, kontakt administrator</p>
                                <p> --- </p>
                            </div>
                            <hr />

                            <Button
                                variant="dark"
                                className="errorLogoutButton"
                                onClick={() => logIn()}
                            >
                                Logg inn
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}