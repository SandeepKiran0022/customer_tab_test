import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Auth } from "../../helper/api";
import "./Settings.css";
import swal from 'sweetalert';
import { handleErrors } from '../../helper/errorHandler';
import { getDisplayDate } from "../../helper/utils";

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  
  render() {
    return (
      <div className="row" style={{ margin: 0, padding: '20px' }}>
        <div className="col-md-4 col-sm-12">
          <div className="d-flex align-items-center justify-content-center">
            <img src={window.me.image || "https://img.ontroapp.com/default/user.png"} alt="user" style={{ border: '1px solid gray', borderRadius: '50%' , margin: 'auto', height: '150px', width: '150px' }}/>
          </div>
        </div>
        <div className="col-md-8 col-sm-12">
          <table style={{ border: 0, width: '100%' }} cellpadding="10px">
            <tr>
              <th>User ID</th>
              <td>
                {window.me.id}
              </td>
            </tr>
            <tr>
              <th>User Name</th>
              <td>
                {window.me.name}
              </td>
            </tr>
            <tr>
              <th>Email</th>
              <td>
                {window.me.email}
              </td>
            </tr>
            <tr>
              <th>Mobile</th> 
              <td>
                {window.me.mobile}
              </td>
            </tr>
            <tr>
              <th>DOB</th> 
              <td>{getDisplayDate(window.me.dob)}</td>
            </tr>
            <tr>
              <th>Password</th> 
              <td><button className="btn" onClick={this.toggleModal}>Change</button></td>
            </tr>
          </table>
          <ChangePassword isOpen={this.state.isModalOpen} toggle={this.toggleModal}/>
        </div>
      </div>
    );
  }
}

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changePassword() {
    if (this.state.new_password === this.state.confirm_password) {
      Auth.changePassword(this.state)
      .then(json => {
        swal({
          text: "Password changed succesfully", 
          icon: "success"
        }).then(() => this.setState({}))
      })
      .catch(err => handleErrors(this, err));
    } else {
      swal({
        text: "Password and Confirm Password are not the same", 
        icon: "error"
      })
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Change Password</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="form-group col">
              <label className="col-form-label">
                Current Password
              </label>
              <input
                className="form-control"
                type="password"
                value={this.state.current_password}
                onChange={event => this.setState({ current_password: event.target.value })}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label className="col-form-label">
                New Password
              </label>
              <input
                className="form-control"
                type="password"
                value={this.state.new_password}
                onChange={event => this.setState({ new_password: event.target.value })}
              />
            </div>    
          </div>
          <div className="row">
            <div className="form-group col">
              <label className="col-form-label">
                Confirm Password
              </label>
              <input
                className="form-control"
                type="password"
                value={this.state.confirm_password}
                onChange={event => this.setState({ confirm_password: event.target.value })}
              />
            </div>    
          </div>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "flex-end" }}>
          <button className="btn"
            {...((this.state.current_password && this.state.new_password && this.state.confirm_password) ? {} : {disabled: true})}
            onClick={this.changePassword.bind(this)}>
            Change
          </button>
          <button className="btn" onClick={this.props.toggle}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}
