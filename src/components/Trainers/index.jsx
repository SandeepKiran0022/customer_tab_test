import React, { Component } from 'react';
import { Trainers } from '../../helper/api';
import './Trainers.css'
import AddOrEditTrainer from './AddOrEditTrainer'
import Loading from '../Common/Loading';
import { getUrlParameter, getDisplayDate } from '../../helper/utils';
import FilteredValue from '../Common/FilteredValue'
import { handleErrors } from '../../helper/errorHandler';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import swal from 'sweetalert'

export default class TrainersList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isModalOpen: false,
      search: getUrlParameter("search")
    }
  }

  componentWillMount() {
    this.refresh()
  }

  refresh() {
    this.setState({ trainers: null })
    Trainers.get(this.state.search)
      .then(({data}) => this.setState({ trainers: data}))
      .catch(err => handleErrors(this, err))
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      search: getUrlParameter("search")
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search) {
      this.refresh()
    }
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      trainer: null,
      trainerId: null
    });
  }

  editTrainer(trainer) {
    this.setState({
      trainer,
      trainerId: trainer.user_id,
      isModalOpen: true
    })
  }

  render() {

    if (!this.state.trainers) {
      return (
        <Loading/>
      );
    }

    return (
      <div>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex p-2 align-items-center justify-content-start">
            {this.state.search && <FilteredValue filter="Trainer Name / Mobile / Email" value={this.state.search} param="search"/> }
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button className="btn" onClick={this.toggleModal.bind(this)}>+ Add Trainer</button>
            <AddOrEditTrainer 
              isModalOpen={this.state.isModalOpen} 
              toggle={this.toggleModal.bind(this)} 
              refresh={this.refresh.bind(this)} 
              trainerId={this.state.trainerId}
              trainer={this.state.trainer}/>
          </div>
        </div>

        <div className="row" style={{ margin: '0px'}}>
          { this.state.trainers.map((trainer, index) => <Trainer key={trainer.user_id} trainer={trainer} refresh={this.refresh.bind(this)} editTrainer={this.editTrainer.bind(this)}/>)}
        </div>
      </div>
    );
  }
}

class Trainer extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  deleteTrainer() {
    swal({
      text: 'Are you sure that you want to delete ' + this.props.trainer.name + '?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
        Trainers.delete(this.props.trainer.user_id)
        .then(json => {
          swal({
            text: "Trainer Deleted", 
            icon: "success"
          }).then(this.props.refresh())
        }).catch(err => handleErrors(this, err))
      }
    })
  }

  render() {
    return(
      <div className="col-md-3 col-sm-6 col-xs-12" style={{padding: '5px'}}>
        <div className="Trainer">
          <div className="d-flex flex-row align-items-start justify-content-end">
            <Dropdown tag="span" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle
                tag="span"
                className="trainer-options-toggle"
                onClick={this.toggle}
                data-toggle="dropdown"
                aria-expanded={this.state.dropdownOpen}>
                ...
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  onClick={() => this.props.editTrainer(this.props.trainer)}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={this.deleteTrainer.bind(this)}>
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-12" style={{ padding: '5px'}}>
            <center>
              {this.props.trainer.image ? <img src={this.props.trainer.image} alt="trainer" style={{ height: '150px', width: '150px', borderRadius: '50%', verticalAlign: 'center' }} /> : <i className="material-icons" style={{ fontSize: '150px' }}>account_circle</i> }
            </center>
          </div>
          <div className="col-12" style={{ padding: '5px'}}>
            <center>
              {this.props.trainer.name}
            </center>
          </div>
          <Separator />
          <div className="col-12" style={{ padding: '5px'}}>
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="material-icons">mail</i> {this.props.trainer.email}
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="material-icons">phone</i> {this.props.trainer.mobile}
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="material-icons">phone_iphone</i> {this.props.trainer.mobile_alternate}
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="material-icons">cake</i> {getDisplayDate(this.props.trainer.dob)}
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="material-icons">date_range</i> Since {getDisplayDate(this.props.trainer.doj)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function Separator() {
  return <div style={{ height: '1px', background: 'gray' }}></div>
}