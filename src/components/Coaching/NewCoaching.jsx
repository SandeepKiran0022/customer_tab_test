import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';
import RadioGroup from '../Common/RadioGroup'
import { Trainers, Arenas, Plans, Classes } from '../../helper/api';
import './Coaching.css'
import { Sports } from '../../constants/sports'
import { Days } from '../../constants/days'
import { getTodayDate, getTimeList, getDisplayTime } from '../../helper/utils';
import { handleErrors } from '../../helper/errorHandler';

export default class NewCoaching extends Component {

  constructor(props) {
    super(props);
    this.defaultClass = {
      bill_plans: [ { } ],
      from_date: getTodayDate()
    }
    this.state = {
      arenas: [],
      trainers: [],
      class: this.defaultClass
    }
  }

  handleBillItem(data, i) {
    this.setState(state => {
      state.class.bill_plans[i] = data;
      return state;
    })
  }

  removeBillItem = (i) => {
    let state = Object.assign({}, this.state);
    state.class.bill_plans.splice(i, 1);
    this.setState(state)
  }

  addBillItem = () => {
    let state = Object.assign({}, this.state);
    state.class.bill_plans.push({});
    this.setState(state)
  }



  createOrEditClass() {
    let api = this.props.isCoaching ? Classes : Plans;
    api.createOrEdit(this.props.coachingId, this.state.class).then(json => {
      swal({
        text: (this.props.isCoaching ? "Class" : "Plan") + " " + (this.props.coachingId ? "updated" : "created") + " succesfully",
        icon: "success"
      }).then(() => {
        this.props.refresh()
        this.props.toggle()
      })
    }).catch(err => handleErrors(this, err));
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isModalOpen) {
      this.setState({
        class: newProps.coaching || this.defaultClass
      })
      Arenas.get().then(({ data }) => this.setState({ arenas: data }))
      if (this.props.isCoaching) {
        Trainers.get().then(({ data }) => this.setState({ trainers: data }))
      }
    }
  }

  render() {
    let editDisabled = this.props.coachingId && this.state.class.entries ? { disabled: true } : {};
    return (
      <Modal isOpen={this.props.isModalOpen} toggle={this.props.toggle} size="lg">
        <ModalHeader toggle={this.props.toggle}>{(this.props.coachingId ? "Edit" : "Add") + (this.props.isCoaching ? " Class" : " Plan")}</ModalHeader>
        <ModalBody>
          <form className="NewCoaching">

            <h4>{this.props.isCoaching ? "Class Details" : "Plan Details"}</h4>

            <div className="d-flex align-items-center">
              <div className="form-group col">
                <input type="text" className="form-control" placeholder={this.props.isCoaching ? "class name*" : "plan name*"}
                  value={this.state.class.name}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { name: event.target.value }) })} />
              </div>
              <div className="form-group col">
                <RadioGroup label="Gender" data={{ '': 'Both', M: 'Male', F: 'Female' }}
                  selected={this.state.class.gender || ''}
                  onSelect={(arr, key) => this.setState({ class: Object.assign({}, this.state.class, { gender: key }) })} />
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div className="form-group col">
                <select className="custom-select form-control"
                  value={this.state.class.sports || "0"}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { sports: event.target.value }) })}>
                  <option disabled value="0">Select the sport*</option>
                  {Object.keys(Sports).map((key, index) => <option key={key} value={key}>{Sports[key].display_name}</option>)}
                </select>
              </div>
              <div className="form-group col">
                <select className="custom-select form-control"
                  value={this.state.class.arena_id || "0"}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { arena_id: parseInt(event.target.value, 10) }) })}>
                  <option disabled value="0">Select the venue*</option>
                  {this.state.arenas.map((arena, index) => <option key={arena.id} value={arena.id}>{arena.name}</option>)}
                </select>
              </div>
              
            </div>

            <div className="d-flex align-items-center">
              <div className="form-group col">
                <input type="number" className="form-control" placeholder="max entries"
                  value={this.state.class.max_entries}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { max_entries: parseInt(event.target.value, 10) }) })} />
              </div>
              {this.props.isCoaching &&
                <div className="form-group col">
                  <select className="custom-select form-control"
                    value={this.state.class.trainer_id || "0"}
                    onChange={event => this.setState({ class: Object.assign({}, this.state.class, { trainer_id: parseInt(event.target.value, 10) }) })}>
                    <option disabled value="0">Select the trainer*</option>
                    {this.state.trainers.map((trainer, index) => <option key={trainer.user_id} value={trainer.user_id}>{trainer.name}</option>)}
                  </select>
                </div>
              }
            </div>

            <h4>Date &amp; Timing</h4>

            <div className="d-flex align-items-center">
              <div className="form-group col">
                <label className="col-form-label" htmlFor="form-from-date">From date*</label>
                <input type="date" className="form-control"
                  value={this.state.class.from_date}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { from_date: event.target.value }) })} />
              </div>
              <div className="form-group col">
                <label className="col-form-label" htmlFor="form-to-date">To date (leave empty if never ending)</label>
                <input type="date" className="form-control"
                  value={this.state.class.to_date}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { to_date: event.target.value || null }) })} />
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div className="form-group col">
                <RadioGroup multiple label="Days*" data={Days}
                  selected={this.state.class.days}
                  onSelect={(arr, key) => this.setState({ class: Object.assign({}, this.state.class, { days: arr }) })} />
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div className="form-group col">
                <label className="col-form-label" htmlFor="form-from-time">From time*</label>
                <select className="custom-select form-control"
                  value={this.state.class.from_time}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { from_time: event.target.value }) })}>
                  <option value="">Select the from time</option>
                  {getTimeList().map((time, index) => <option key={time} value={time}>{getDisplayTime(time)}</option>)}
                </select>
              </div>
              <div className="form-group col">
                <label className="col-form-label" htmlFor="form-to-time">To time*</label>
                <select className="custom-select form-control"
                  value={this.state.class.to_time}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { to_time: event.target.value }) })}>
                  <option value="">Select the to time</option>
                  {getTimeList().map((time, index) => <option key={time} value={time}>{getDisplayTime(time)}</option>)}
                </select>
              </div>
            </div>

            <h4>Billing Details</h4>

            {this.state.class.bill_plans.map((p, i) =>
              <BillPlanItem 
                key={i} 
                data={p} 
                onChange={d => this.handleBillItem(d, i)} 
                onRemove={() => {this.removeBillItem(i)}} 
                editDisabled={editDisabled} 
                isLast={i === (this.state.class.bill_plans.length - 1)} 
                onAddNew={this.addBillItem}
                isOnlyBillingPlan={this.state.class.bill_plans.length === 1}/>)
            }

            <div className="d-flex align-items-center">
              <div className="form-group col-md-6">
                <input type="number" className="form-control" placeholder="due after*"
                  value={this.state.class.due_after}
                  {...editDisabled}
                  onChange={event => this.setState({ class: Object.assign({}, this.state.class, { due_after: parseInt(event.target.value, 10) }) })} />
              </div>
            </div>
            
          </form>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn"
              onClick={this.createOrEditClass.bind(this)}>{(this.props.coachingId ? "Edit" : "Add") + (this.props.isCoaching ? " Class" : " Plan")}</button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}

/**
 * @prop {Object} data - { name, cycle, fees } 
 * @prop {Object} editDisabled
 */
function BillPlanItem(props) {
  let data = Object.assign({}, props.data)
  return (
    <div className="d-flex align-items-center">
      <div className="form-group col-md-3">
        <input type="text" className="form-control" placeholder="Name"
          value={data.name}
          {...props.editDisabled}
          onChange={event => { data.name = event.target.value; props.onChange(data) }} />
      </div>
      <div className="form-group col-md-4">
        <select className="custom-select form-control"
          value={data.cycle}
          {...props.editDisabled}
          onChange={event => { data.cycle = parseInt(event.target.value, 10); props.onChange(data) }}>
          <option value="-1">Select the billing cycle*</option>
          <option value="0">onetime</option>
          <option value="1">every month</option>
          <option value="2">every 2 month</option>
          <option value="3">every 3 month</option>
          <option value="4">every 4 month</option>
          <option value="6">every 6 month</option>
          <option value="12">every 1 year</option>
        </select>
      </div>
      <div className="form-group col-md-3">
        <input type="number" className="form-control" placeholder="fees*"
          value={data.fees}
          {...props.editDisabled}
          onChange={event => { data.fees = parseInt(event.target.value, 10); props.onChange(data) }} />
      </div>
      {!props.isOnlyBillingPlan && !props.editDisabled.disabled &&
        <div className="form-group col-md-1">
          <span className="btn" onClick={props.onRemove}>
            <span className="material-icons">close</span>
          </span>
        </div>
      }
      { !props.editDisabled.disabled && props.isLast && 
        <div className="form-group col-md-1">
          <span className="btn btn-warning" onClick={props.onAddNew}>
            <span className="material-icons">add</span>
          </span>
        </div>
      }
    </div>
  )
}