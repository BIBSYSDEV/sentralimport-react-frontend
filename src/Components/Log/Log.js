import React from "react";
import ListModal from "../ListModal/ListModal";
import {Button} from "@material-ui/core";

export default function Log() {
    const [visible, setVisible] = React.useState(false);

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
        <div>
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
        </div>
    );
}