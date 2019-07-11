import React, { Component } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";

class DataCard extends Component {
  state = {
    data: []
  };

  render() {
    function setData() {
      this.state.data = this.props.data;
    }

    return (
      <Card>
        <CardHeader>Data fra tabell</CardHeader>
        <CardContent>Tittel: {this.state.data}</CardContent>
      </Card>
    );
  }

  componentDidMount() {
    this.state.data = this.props.data;
  }
}

export default DataCard;
