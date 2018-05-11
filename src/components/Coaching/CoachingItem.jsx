import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import swal from 'sweetalert';
import { Plans } from '../../helper/api'
import { getDisplayTime, getDisplayDate } from '../../helper/utils'
import { Days } from '../../constants/days'
import { handleErrors } from '../../helper/errorHandler';
import { Sports } from '../../constants/sports'

const BILLCYCLE=(expr)=>{
  switch(expr){
    case 0:{return "Onetime";}
    case 1:{return "Every Month";}
    case 12:{return "Every Year";}
    default:{return `Every ${expr} Months`;}
  }
} 
export default class CoachingItem extends Component {

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

  getBillPlan() {
    if(Array.isArray(this.props.clazz.bill_plans))
      return this.props.clazz.bill_plans.map(plan => plan.fees + ' - ' + BILLCYCLE(plan.cycle) + (plan.name?` (${plan.name})`:''))
    return [];
  }

  deleteClass() {
    swal({
      text: 'Are you sure that you want to delete ' + this.props.clazz.name + '?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
        Plans.delete(this.props.clazz.id)
        .then(json => {
          swal({
            text: "Plan Deleted", 
            icon: "success"
          }).then(this.props.refresh())
        }).catch(err => handleErrors(this, err))
      }
    })
  }

  render() {
    let sport = Sports[this.props.clazz.sports]
    return (
      <div className="col col-md-3 col-sm-6 col-xs-12" style={{ padding: '5px' }}>

        <div className="CoachingItem p-4">
          <div className="title d-flex flex-row align-items-center justify-content-between">
            <div className="d-flex flex-row align-items-center justify-content-start" style={{ width: '95%' }}>
              <span style={{ padding: '5px' }}>
                <div className="sprite-sports" style={{ backgroundPosition: `-${sport.sprite_position_x}px -${sport.sprite_position_y}px`, height: '32px', width: '32px' }} />
              </span>
              <span style={{ overflowX: 'auto' }}>{this.props.clazz.name}</span>
            </div>
            <div className="d-flex flex-row align-items-start justify-content-end">
              <Dropdown tag="span" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                <DropdownToggle caret
                  tag="span"
                  onClick={this.toggle}
                  data-toggle="dropdown"
                  aria-expanded={this.state.dropdownOpen}>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    onClick={() => this.props.editCoaching(this.props.clazz)}>
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => this.props.cloneCoaching(this.props.clazz)}>
                    Clone
                  </DropdownItem>
                  <DropdownItem
                    onClick={this.deleteClass.bind(this)}>
                    Delete
                  </DropdownItem>
                  <DropdownItem tag="div">
                    <Link to={"/enrollments?status=active,ends_today&plan=" + this.props.clazz.id} style={{ textDecoration: 'none', color: 'black' }}>
                      View Enrollments
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div>
            <div>
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">location_on</i> 
                {this.props.clazz.arena} 
              </div>
              { this.props.clazz.trainer_name &&
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">person</i> 
                {this.props.clazz.trainer_name}
              </div>
              }
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">supervisor_account</i> 
                {this.props.clazz.entries} {this.props.clazz.max_entries ? ' / ' + this.props.clazz.max_entries : ''} 
              </div>
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">view_day</i> 
                {this.props.clazz.days.map((day, index) => Days[day] + " ")} 
              </div>
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">date_range</i>
                {getDisplayDate(this.props.clazz.from_date)} {this.props.clazz.to_date && "to " + getDisplayDate(this.props.clazz.to_date)}
              </div>
              { (this.props.clazz.from_time || this.props.clazz.to_time) &&
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">schedule</i> 
                {getDisplayTime(this.props.clazz.from_time)} {this.props.clazz.to_time ? ' to ' + getDisplayTime(this.props.clazz.to_time) : ''}
              </div>
              }
              <div className="d-flex flex-row align-items-center">
                <i className="material-icons">notifications</i> 
                {this.props.clazz.due_after}
              </div>
              {this.getBillPlan().map((p, i) =>
                <div key={i} className="d-flex flex-row align-items-center">
                  <span style={{ fontSize: '24px', padding: '5px 10px', lineHeight: '1' }}>&#8377;</span>{p}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}