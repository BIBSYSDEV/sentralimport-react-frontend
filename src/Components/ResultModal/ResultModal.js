import React from "react";
import Modal from "react-responsive-modal";

export default class ResultModal extends React.Component {
  state = {
    open: false
  };

  componentDidMount() {
    this.state = this.props.open;
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    return (
      <div>
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>Simple centered modal</h2>
        </Modal>
      </div>
    );
  }
}
