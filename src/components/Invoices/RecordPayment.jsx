import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Payments } from '../../helper/api';
import swal from 'sweetalert';
import { handleErrors } from '../../helper/errorHandler';

class RecordPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      invoice_id: newProps.invoice.id,
      paid_amount: newProps.invoice.due_amount
    })
  }

  recordPayment() {
    Payments.create({ payments: [this.state] }).then(json => {
      swal({
        text: "Payments recorded succesfully", 
        icon: "success"
      }).then(() => {
        this.props.refresh()
        this.props.toggle()
      })
    }).catch(err => handleErrors(this, err));
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} className={this.props.className}>
        <ModalHeader toggle={this.props.toggle}>Record Payment</ModalHeader>
        <ModalBody>
          <div className="d-flex flex-row" style={{ padding: "10px" }}>
            <div
              onClick={() => this.setState({ pay_mode: 'cash' })}
              className={"d-flex flex-column align-items-center payment-option" + (this.state.pay_mode === 'cash' ? " active" : "")}
            >
              <span style={{ fontSize: '100px', lineHeight: '1' }}>&#8377;</span> 
              <label>
                Cash <i className={"material-icons check-circle" + (this.state.pay_mode === 'cash' ? " active" : "")}> check_circle </i>
              </label>
            </div>
            <div
              onClick={() => this.setState({ pay_mode: 'card' })}
              className={"d-flex flex-column align-items-center payment-option" + (this.state.pay_mode === 'card' ? " active" : "")}
            >
              <i className="material-icons" style={{ fontSize: '100px' }}>payment</i>
              <label>
                Card <i className={"material-icons check-circle" + (this.state.pay_mode === 'card' ? " active" : "")}> check_circle </i>
              </label>
            </div>
          </div>
          <div className="d-flex flex-column">
            <div className="d-flex flex-row p-4 justify-content-center">
              Balance: {this.props.invoice.due_amount - this.state.paid_amount}
            </div>
            <div className="form-group">
              <label> Amount Paid </label>
              <input className="form-control" type='number'
                value={this.state.paid_amount}
                onChange={event => this.setState({ paid_amount: event.target.value })}
              />
            </div>
            <div className="form-group">
              <input className="form-control" type='textarea' placeholder='Comments'
                value={this.state.comments}
                onChange={event => this.setState({ comments: event.target.value })}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "flex-end" }}>
          <button className="btn" 
          {...(!this.state.pay_mode ? {disabled: true} : {})}
          onClick={this.recordPayment.bind(this)}>
            Confirm
          </button>
          <button className="btn" onClick={this.props.toggle}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RecordPayment;
