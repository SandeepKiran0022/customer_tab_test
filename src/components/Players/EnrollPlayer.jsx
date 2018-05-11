import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Card, CardText, CardBody } from 'reactstrap';
import swal from 'sweetalert';
import './Players.css'
import { Classes, Players, Plans, TaxGroup } from '../../helper/api'
import { getTodayDate,getDisplayTime, getDisplayDate } from '../../helper/utils'
import { Days } from '../../constants/days'
import { handleErrors } from '../../helper/errorHandler';
import moment from 'moment';

const BILLCYCLE=(expr)=>{
  switch(expr){
    case 0:{return "Onetime";}
    case 1:{return "Every Month";}
    case 12:{return "Every Year";}
    default:{return `Every ${expr} Months`;}
  }
} 
export default class EnrollPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      plans: [],
      taxgroups: [],
      player: {
        user_id: this.props.player.id,
        from_date: getTodayDate()
      }
    }
    this.handleBillPlanChange = this.handleBillPlanChange.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isModalOpen) {
      this.setState({ 
        enrollTo: newProps.enrollTo,
        selectedPlan: null,
        plans: [],
        player: {
          user_id: this.props.player.id,
          from_date: getTodayDate()
        }
       })
      if (newProps.enrollTo === 'class') {
        Classes.get().then(({ data }) => this.setState({ plans: data }))
      } else {
        Plans.get().then(({ data }) => this.setState({ plans: data }))
      }
      TaxGroup.get().then(({ data }) => this.setState({ taxgroups: data.taxgroups }))
    }
  }

  getBillPlanText() {
    if(Array.isArray(this.state.selectedPlan.bill_plans))
      return this.state.selectedPlan.bill_plans.map(plan => plan.fees + ' - ' + BILLCYCLE(plan.cycle) + (plan.name?` (${plan.name})`:''))
    return [];
  }

  handleBillPlanChange(event) {
    let billPlan = this.state.selectedPlan.bill_plans[event.target.value];
    let state = Object.assign({}, this.state)
    state.bill_cycle_index = event.target.value;
    if (billPlan) {
      state.player.bill_plan_name = billPlan.name;
      state.player.bill_cycle = billPlan.cycle;
      state.player.fees = billPlan.fees;
    } else {
      state.player.bill_plan_name = null;
      state.player.bill_cycle = null;
      state.player.fees = "";
    }
    this.setState(state)
  }

  enrollPlayer() {
    let data = this.state.player;
    if(this.state.selectedTaxGroup)
      data.tax_group_id = parseInt(this.state.selectedTaxGroup, 10);

    Players.enroll(this.state.enrollTo ,this.state.selectedPlan.id, data).then(() => swal({
      text: "Customer enrolled successfully",
      icon: "success"
    }).then(() => {
      this.props.toggle()
      this.props.refreshSubscriptions()
    })).catch(err => handleErrors(this, err));
  }
  render() {
    let disabled = !this.state.selectedPlan ? {disabled: true} : {}
    return (
      <Modal className="NewPlayer" isOpen={this.props.isModalOpen} toggle={this.props.toggle} size="md">
        <ModalHeader toggle={this.props.toggle}>Enroll Customer - {this.props.player.name}</ModalHeader>
        <ModalBody>
        <form>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <select className="custom-select form-control" 
                  value={ (this.state.selectedPlan && this.state.selectedPlan.id) || '0' }
                  onChange={ event => {
                    let selectedPlan = this.state.plans.filter(plan => plan.id === parseInt(event.target.value, 10))[0]
                    this.setState({
                      selectedPlan,
                      bill_cycle_index: -1,
                      player: Object.assign({}, this.state.player, {
                        fees: "",
                        bill_cycle: null,
                        bill_plan_name: null
                      })
                    })
                  }}>
                  <option disabled value="0">Select the {this.state.enrollTo}</option>
                  { this.state.plans.map((plan, index) => <option key={plan.id} value={plan.id}>{plan.name}</option>) }
                </select>
              </div>
            </div>
          </div>
          { this.state.selectedPlan &&
            <div className="d-flex justify-content-center">
              <Card>
                <CardBody>
                  <CardText>
                    <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">location_on</i> 
                      {this.state.selectedPlan.venue} 
                    </div>
                    { this.state.selectedPlan.trainer_name &&
                    <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">person</i> 
                      {this.state.selectedPlan.trainer_name}
                    </div>
                    }
                    <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">supervisor_account</i> 
                      {this.state.selectedPlan.entries} / {this.state.selectedPlan.max_entries} 
                  </div>
                      <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">view_day</i> 
                      {this.state.selectedPlan.days.map((day, index) => Days[day] + " ")} 
                    </div>
                    <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">date_range</i>
                      {getDisplayDate(this.state.selectedPlan.from_date)} {this.state.selectedPlan.to_date && "to " + getDisplayDate(this.state.selectedPlan.to_date)}
                    </div>
                    { (this.state.selectedPlan.from_time || this.state.selectedPlan.to_time) &&
                    <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">schedule</i> 
                      {getDisplayTime(this.state.selectedPlan.from_time)} {this.state.selectedPlan.to_time ? ' to ' + getDisplayTime(this.state.selectedPlan.to_time) : ''}
                    </div>
                    }
                    {this.getBillPlanText().map((p, i) =>
                      <div key={i} className="d-flex flex-row align-items-center">
                        <span style={{ fontSize: '24px', padding: '5px 10px', lineHeight: '1' }}>&#8377;</span>{p}
                      </div>
                    )}
                    <div className="d-flex flex-row align-items-center">
                      <i className="material-icons">notifications</i> 
                      {this.state.selectedPlan.due_after}
                    </div>
                    
                  </CardText>
                </CardBody>
              </Card>
            </div>
          }
          
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Date Of Joining*</label>
                  <input type="date" name="doj" className="form-control"
                  value={this.state.player.from_date}
                  onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { from_date: event.target.value }) }) }/>
                </div>
              </div>
            </div>

            {this.state.selectedPlan &&
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Billing Plan</label>
                    <select className="custom-select form-control" 
                      value={this.state.bill_cycle_index}
                      onChange={this.handleBillPlanChange}>
                      <option value="-1">Select the billing plan</option>
                      {Array.isArray(this.state.selectedPlan.bill_plans) && 
                        this.state.selectedPlan.bill_plans.map((p, i) => <option key={i} value={i+''}>{BILLCYCLE(p.cycle)  + (p.name?` (${p.name})`:'') }</option>)}
                    </select>
                  </div>
                </div>
              </div>
            }

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Fees</label>
                  <input className="form-control"
                    value={this.state.player.fees}
                    onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { fees: event.target.value }) }) }/>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Tax</label>
                  <select className="custom-select form-control" 
                    value={this.state.selectedTaxGroup}
                    onChange={ event => this.setState({ selectedTaxGroup: event.target.value }) }>
                    <option value=""> - - Non Taxable - - </option>
                    { this.state.taxgroups.map(item => <option key={item.id} value={item.id}>{item.name} ({item.taxes.map(tax => ` ${tax.name} - ${tax.value}% ` )}) </option>) }
                  </select>
                </div>
              </div>
            </div>


          {this.state.selectedPlan && this.state.selectedPlan.bill_cycle > 0 &&
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Ends After (leave empty if never ending)</label>
                  <input className="form-control" placeholder="No of Bill Cycles" value={this.state.player.ends_after}
                    onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { ends_after: event.target.value }) }) }/>
                  { window.currentOrg.bill_cycle_mode === 'standard' && this.state.player.ends_after && 
                      <label style={{ padding: '5px', paddingLeft: 0, color: 'gray' }}>Ends on {moment(this.state.player.from_date).add(this.state.selectedPlan.bill_cycle * this.state.player.ends_after, 'months').format('DD MMM YYYY')}</label> 
                  }
                </div>
              </div>
            </div>
            }

            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Comments</label>
                  <input type="textarea" className="form-control"
                  value={this.state.player.comments}
                  onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { comments: event.target.value }) }) }/>
                </div>
              </div>
            </div>
        
        </form>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button className="btn" 
              {...disabled}
              onClick={this.enrollPlayer.bind(this)}
            >Enroll Customer</button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}