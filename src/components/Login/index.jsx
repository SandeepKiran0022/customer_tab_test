import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import './Login.css';
import { Auth } from '../../helper/api';
import { handleErrors } from '../../helper/errorHandler';

export default class LoginModal extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      email: "",
      password: ""
    }
  }

  handleLogin() {
    Auth.login(this.state)
      .then(({ data }) => this.props.setLoggedIn(data))
      .catch(err => handleErrors(this, err)) 
  }

  render() {
    return (
      <div className="d-flex flex-row align-items-center justify-content-center" style={{ paddingTop: '5%'}}>
        <img src="https://img.ontroapp.com/logo/logo.png" alt="logo" style={{ height: '75px'}}/>
        <Modal isOpen={true} size="sm" className="LoginModal" backdrop={false}>
          <ModalHeader>
            <center>
              <h2>Sign In</h2>
            </center>
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="form-group">
                <input type="text" name="email" id="email" className="form-control" placeholder="Email*" 
                ref="email"
                value={this.state.email} 
                onChange={event => this.setState({ email: event.target.value })}
                onKeyPress={event => {
                  if (event.which === 13) {
                    this.handleLogin()
                  }
                }}/>
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <input type="password" name="password" id="password" className="form-control" placeholder="Password*" 
                ref="password"
                value={this.state.password} 
                onChange={event => this.setState({ password: event.target.value })}
                onKeyPress={event => {
                  if (event.which === 13) {
                    this.handleLogin()
                  }
                }}/>
              </div>
            </div>
            <div className="row">
              <div className="form-group">
                <button className="btn" 
                onClick={this.handleLogin.bind(this)} 
                style={{ width: '100%' }}
                {...((this.state.email === "" || this.state.password === "") ? {disabled: true} : {})}>Login</button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}