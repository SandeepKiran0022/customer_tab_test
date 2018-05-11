import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';
import './Trainers.css'
import { Trainers } from '../../helper/api'
import FileUploader from '../Common/FileUploader/FileUploader';
import { getTodayDate } from '../../helper/utils';
import { handleErrors } from '../../helper/errorHandler';
import Address from '../Common/Address';
import { DEFAULT_USER_IMG } from '../../constants/images'

export default class AddOrEditTrainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isExistingUser: false,
      trainer: {
        doj: getTodayDate()
      },
      isUploading: false
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.searchUser = this.searchUser.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isModalOpen) {
      this.setState({
        isExistingUser: false,
        trainer: newProps.trainer || {
          doj: getTodayDate()
        },
        isUploading: false
      })
    }
  }

  searchUser() {
    Trainers.getPublicDetail(this.state.trainer.mobile)
      .then(({ data }) => {
        this.setState({ isExistingUser: true, trainer: { ...data, doj: getTodayDate() } })
      })
      .catch(err => {
        this.setState({ isExistingUser: false })
        if(err.response.status === 404) {
          swal({
            text: "User doesn't have Ontro #ID. Please fill all the details.",
            icon: "error"
          })
        } else {
          handleErrors(this, err)
        }
      })
  }

  handleFileChange(isUploading, key, error) {
    if (error) {
      swal("ooh!", error, "error")
    } else {
      this.setState({ isUploading, trainer: { ...this.state.trainer, image: key } });
    }
  }

  addOrEditTrainer() {
    let data = this.state.trainer;
    if (!this.props.trainerId && this.state.isExistingUser) {
      data = {
        user_id: this.state.trainer.user_id,
        doj: this.state.trainer.doj
      }
    }
    Trainers.createOrEdit(this.props.trainerId, data)
      .then(() =>
        swal({
          text: "Trainer " + (this.props.trainerId ? "updated" : "added") + " successfully",
          icon: "success"
        }).then(() => {
          this.setState({
            isExistingUser: false,
            trainer: {
              doj: getTodayDate()
            }
          })
          this.props.toggle()
          this.props.refresh()
        })
      )
      .catch(err => handleErrors(this, err))
  }
  render() {
    let disabled = this.state.isExistingUser ? { disabled: true } : {}
    return (
      <Modal className="NewTrainer" isOpen={this.props.isModalOpen} toggle={this.props.toggle} size="lg">
        <ModalHeader toggle={this.props.toggle}>Add new Trainer</ModalHeader>
        <ModalBody>
          <form>
            <div className="row">
              <div className={this.props.trainerId ? "col-md-12" : "col-md-9"}>
                <div className="form-group">
                  <input className="form-control" placeholder="Enter Mobile Number to search"
                    ref="mobile"
                    value={this.state.trainer.mobile}
                    onChange={event => this.setState({ trainer: { ...this.state.trainer, mobile: event.target.value } })} />
                  <label><small>This number will be used to uniquely identify an user</small></label>
                </div>
              </div>
              { !this.props.trainerId &&
              <div className="col-md-3">
                <div className="form-group">
                  <button type="button" className="btn"
                    onClick={this.searchUser}
                    style={{ width: '100%' }}
                    {...(!this.state.trainer.mobile ? { disabled: true } : {})}>Search Trainer</button>
                </div>
              </div>
              }
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Profile Picture</label>
                  <FileUploader
                    defaultImage={this.state.trainer.image ? this.state.trainer.image : DEFAULT_USER_IMG}
                    isFetching={this.state.isFetching}
                    onChange={this.handleFileChange}
                    {...disabled} />
                </div>
              </div>
              <div className="col-md-8">
                <div className="row" style={{ margin: '0' }}>
                  <div className="form-group col-12">
                    <label>Name*</label>
                    <input type="text" className="form-control"
                      ref="name"
                      {...disabled}
                      value={this.state.trainer.name}
                      onChange={event => this.setState({ trainer: { ...this.state.trainer, name: event.target.value } })} />
                  </div>
                  <div className="form-group col-12">
                    <label>Notification Mobile Number*</label><br/>
                    { this.state.trainer.mobile && 
                        <label 
                          onClick={() => this.setState({ trainer: { ...this.state.trainer, mobile_alternate: this.state.trainer.mobile } })}
                          style={{ color: 'blue' }}>
                          <small>Copy Primary Mobile Number</small>
                        </label> 
                    }
                    <input className="form-control"
                      {...disabled}
                      value={this.state.trainer.mobile_alternate}
                      onChange={event => this.setState({ trainer: { ...this.state.trainer, mobile_alternate: event.target.value } })} />
                    <label><small>This number will be used to send SMS notifications</small></label>
                  </div>
                  <div className="form-group col-md-6 col-sm-12">
                    <label>Gender*</label>
                    <select className="custom-select form-control"
                      {...disabled}
                      value={this.state.trainer.gender}
                      onChange={event => this.setState({ trainer: Object.assign({}, this.state.trainer, { gender: event.target.value }) })}>
                      <option value="">Select the gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Transgender</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6 col-sm-12">
                    <label>Email</label>
                    <input type="text" className="form-control"
                      ref="email"
                      {...disabled}
                      value={this.state.trainer.email}
                      onChange={event => this.setState({ trainer: { ...this.state.trainer, email: event.target.value } })} />
                  </div>
                  <div className="form-group col-md-6 col-sm-12">
                    <label>DOB*</label>
                    <input type="date" className="form-control"
                      ref="dob"
                      {...disabled}
                      value={this.state.trainer.dob}
                      onChange={event => this.setState({ trainer: { ...this.state.trainer, dob: event.target.value } })} />
                  </div>
                  <div className="form-group col-md-6 col-sm-12">
                    <label>Date Of Joining*</label>
                    <input type="date" className="form-control"
                      value={this.state.trainer.doj}
                      onChange={event => this.setState({ trainer: { ...this.state.trainer, doj: event.target.value } })} />
                  </div>
                </div>
              </div>
            </div>

            <h4>Address Details</h4>
            <Address value={this.state.trainer.address} onChange={address => this.setState({ trainer: { ...this.state.trainer, address } })} />

          </form>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button className="btn"
              {...(this.state.isUploading ? { disabled: true } : {})}
              onClick={this.addOrEditTrainer.bind(this)}>
              {this.props.trainerId ? "Edit" : "Add"} Trainer
            </button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}