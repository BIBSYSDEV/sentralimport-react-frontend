import React from "react";
import ListModal from "../ListModal/ListModal";
import {Button} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
        card: {
            marginTop: 25,
            marginLeft: 10,
            [theme.breakpoints.down("md")]: {
                marginLeft: 0
            }
        }
    }
));

export default function Log() {
    const [visible, setVisible] = React.useState(false);
    const classes = useStyles();

    function toggleLog() {
        setVisible(!visible);
    }

    function close() {
        setVisible(false);
    }

    function createRows() {
        let publications = JSON.parse(localStorage.getItem("log"));
        return publications !== null ? (
            <div>
                {publications.map((pub, i) => (<div style={{padding: '5px'}} key={i}><p><b>{"CristinId: " + pub.id}<br />{"Tittel: " + pub.title}</b></p></div>))}
            </div>
        ) : <div>Ingen publikasjoner</div>;
    }

    return (
        <Card className={classes.card}>
            <CardContent>
                <Button
                    color="primary"
                    onClick={toggleLog}
                    variant="contained"
                    style={{margin: "10px"}}
                >
                    Logg
                </Button>
                <ListModal
                    title={"Siste importerte publikasjoner"}
                    open={visible}
                    handleClose={close}
                    body={createRows()}
                />
            </CardContent>
        </Card>
    );
}