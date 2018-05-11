import React, { Component } from "react";
import { Link } from 'react-router-dom';
import Loading from "../Common/Loading";
import { Table, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Players, Subscription, Classes, Plans } from "../../helper/api";
import { EnrollStatus } from "../../constants/EnrollStatus";
import { getUrlParameter, addOrRemoveUrlParameter } from '../../helper/utils';
import FilteredValue from '../Common/FilteredValue'
import "./Subscriptions.css";
import swal from 'sweetalert'
import { handleErrors } from '../../helper/errorHandler'
import { getTodayDate, getDisplayDate } from '../../helper/utils'

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptions: null,
      search: getUrlParameter("search"),
      statusFilter: getUrlParameter('status'),
      planFilter: getUrlParameter('plan')
    };
    this.toggleFilterDropDown = this.toggleFilterDropDown.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
    this.deleteEnrollment = this.deleteEnrollment.bind(this);
    this.endSubscription = this.endSubscription.bind(this);
    this.filters = {
      future: "Future",
      active: "Active",
      ends_today: "Ends Today",
      ends_this_month: "Ends This Month",
      ends_next_month: "Ends Next Month",
      ends_this_year: "Ends This Year",
      ended: "Ended"
    }
  }

  deleteEnrollment(customerId, enrollmentId) {
    swal({
      text: 'Are you sure that you want to delete the enrollment?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
        Subscription.delete(customerId, enrollmentId)
          .then(json => {
            swal({
              text: "Enrollment Deleted", 
              icon: "success"
            }).then(() => {
              this.closeDetail()
              this.refresh()
            })
          }).catch(err => handleErrors(this, err))
      }
    })
  }

  endSubscription(playerId, coachingId) {
    swal("End Enrollment", `Are you sure want to end this enrollment?`, 'warning', { buttons: true, dangerMode: true })
      .then(confirm => {
        if(confirm){
          let data = { ends_on: getTodayDate() }
          
          Players
          .endSubscription(playerId, coachingId, data)
          .then(() => {
            swal({
              text: "Enrollment Ended", 
              icon: "success"
            })
            this.refresh()
          })
          .catch(err => handleErrors(this, err))
        }
      })
  }

  refresh() {
    this.setState({ subscriptions: null })
    Subscription.get(this.state.search, this.state.statusFilter, this.state.planFilter).then(({ data }) => {
      this.setState({
        subscriptions: data,
        enrollmentId: this.props.match.params.id && parseInt(this.props.match.params.id, 10)
      });
    });
    Classes.get().then(({ data }) => this.setState({ classes: data }))
    Plans.get().then(({ data }) => this.setState({ plans: data }))
  }

  handleFilter() {
    this.props.history.push(
      addOrRemoveUrlParameter("status", this.state.status,
        addOrRemoveUrlParameter("plan", this.state.plan))
    )
  }

  componentWillMount() {
    this.refresh()
  }
  closeDetail() {
    this.props.history.push('/enrollments' + window.location.search);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search ||
      this.state.statusFilter !== prevState.statusFilter ||
      this.state.planFilter !== prevState.planFilter) {
      this.refresh()
    }
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      search: getUrlParameter("search"),
      statusFilter: getUrlParameter('status'),
      status: getUrlParameter('status'),
      planFilter: getUrlParameter('plan'),
      plan: getUrlParameter('plan'),
      enrollmentId: newProps.match.params.id && parseInt(newProps.match.params.id, 10)
    })
  }
  toggleFilterDropDown() {
    this.setState({
      isFilterDropDownOpen: !this.state.isFilterDropDownOpen
    })
  }

  openDetail(enrollmentId) {
    if (this.state.enrollmentId && this.state.enrollmentId === enrollmentId) {
      return
    }
    this.props.history.push('/enrollments/' + enrollmentId + window.location.search);
  }

  render() {
    if (!this.state.subscriptions || !this.state.classes || !this.state.plans) {
      return <Loading />;
    }
    let activeEnrollment = null
    let activeEnrollmentStatus = null
    if (this.state.enrollmentId) {
      activeEnrollment = this.state.subscriptions.filter(enrollment => enrollment.id === parseInt(this.state.enrollmentId, 10))[0]
      if (activeEnrollment) {
        activeEnrollmentStatus = EnrollStatus[activeEnrollment.status]
      }
    }
    let planFilterValue = this.state.classes.filter(clazz => clazz.id === parseInt(this.state.planFilter, 10))[0]
    if (!planFilterValue) {
      planFilterValue = this.state.plans.filter(plan => plan.id === parseInt(this.state.planFilter, 10))[0]
    }
    let filterText = activeEnrollment ? <i className="material-icons">filter_list</i> : "Filter";
    let statusFilterText = "";
    if (this.state.statusFilter) {
      statusFilterText = this.state.statusFilter.split(',').map((s) => this.filters[s]).join(',')
    }
    return (
      <div className="row" style={{ margin: 0 }}>
        <div className={activeEnrollment ? "col-md-8" : "col-md-12"} style={{ padding: 0, paddingRight: '5px' }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex p-2 align-items-center justify-content-start">
              {this.state.search && <FilteredValue filter="Customer Name / Mobile Number" value={this.state.search} param="search" />}
              {this.state.statusFilter && <FilteredValue filter="Status" value={statusFilterText} param="status" />}
              {this.state.planFilter && <FilteredValue filter="Class / Plan" value={planFilterValue.name} param="plan"/>}
            </div>
            <div className="d-flex flex-row justify-content-end">
              <Dropdown tag="span" isOpen={this.state.isFilterDropDownOpen} toggle={this.toggleFilterDropDown}>
                <DropdownToggle caret
                  tag="button"
                  className="btn"
                  onClick={this.toggleFilterDropDown}
                  data-toggle="dropdown"
                  aria-expanded={this.state.isFilterDropDownOpen}>
                  {filterText}
                </DropdownToggle>
                <DropdownMenu right
                  style={{ width: '350px', left: '20px', right: '10px' }}>
                  <DropdownItem disabled tag="div">
                    <label>Enrollment Status</label>
                  </DropdownItem>
                  <DropdownItem disabled tag="div">
                    <Input type="select"
                      className="custom-select form-control"
                      style={{ width: '100%' }}
                      value={this.state.status || this.state.statusFilter}
                      onChange={event => this.setState({ status: event.target.value })}>
                      <option value="">Select the status</option>
                      {Object.keys(this.filters).map((filter) => <option key={filter} value={filter}>{this.filters[filter]}</option>)}
                    </Input>
                  </DropdownItem>
                  <DropdownItem disabled tag="div">
                    <label>Class / Plan</label>
                  </DropdownItem>
                  <DropdownItem disabled tag="div">
                      <Input type="select" 
                        className="custom-select form-control" 
                        style={{ width: '100%' }}
                        value={this.state.plan || this.state.planFilter}
                        onChange={event => this.setState({ plan: event.target.value })}>
                        <option value="">Select the Class/Plan</option>
                        { this.state.classes.map((clazz) => <option key={clazz.id} value={clazz.id}>{clazz.name}</option> ) }
                        { this.state.plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option> ) }
                      </Input>
                    </DropdownItem>
                  <DropdownItem
                    onClick={this.handleFilter.bind(this)}>
                    <button className="btn" style={{ width: '100%', marginTop: '10px' }}>
                      Filter
                  </button>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div style={{ overflowY: "auto", height: "calc(100vh - 60px)" }}>
            <Table
              className={"SubscriptionList table table-light table-hover"}
              style={{ margin: "0" }}
            >
              <thead>
                {!activeEnrollment && (
                  <tr>
                    <th>Customer Name</th>
                    <th>Plan Name</th>
                    <th>Next billing Date</th>
                    <th>Status</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {this.state.subscriptions && this.state.subscriptions.map((subscription, i) =>
                  <SubscriptionListItem
                    key={subscription.id}
                    activeSubscriptionId={this.state.enrollmentId}
                    data={subscription}
                    onClick={() => this.openDetail(subscription.id)}
                  />
                )}
              </tbody>
            </Table>
          </div>
          {this.state.subscriptions.length === 0 && (
            <div
              className="d-flex align-items-center justify-content-center p-4"
              style={{ backgroundColor: "white", fontSize: "25px" }}
            >
              There are no enrollments...!
          </div>
          )}
        </div>
        {activeEnrollment &&
            <div className="col-md-4" style={{ backgroundColor: 'white', height: '500px' }}>

              <div className="d-flex align-items-center justify-content-end p-2">
                { activeEnrollment.status === 'active' && <button className="btn" onClick={() => this.endSubscription(activeEnrollment.user_id, activeEnrollment.plan_id)} >End Enrollment</button> }
                <button className="btn" onClick={() => this.deleteEnrollment(activeEnrollment.user_id, activeEnrollment.id)} ><span className="material-icons">delete</span></button>
                <button className="btn btn-light" onClick={this.closeDetail} ><span className="material-icons">close</span></button>
              </div>

              <table style={{ border: 0 }} cellpadding="10px">
                <tr>
                  <th>Customer</th>
                  <td>
                    <Link to={"/customers/" + activeEnrollment.user_id}>
                      {activeEnrollment.user_name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>Class / Plan</th>
                  <td>
                    <Link to={`/${activeEnrollment.type === 'membership_plan' ? 'plans' : 'classes'}`}>
                      {activeEnrollment.plan_name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span><span style={{ backgroundColor: activeEnrollmentStatus.color, height: '8px', width: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>{activeEnrollmentStatus.displayName}</span>
                  </td>
                </tr>
                <tr>
                  <th>Amount</th> 
                  <td>
                    <span style={{ fontSize: '15px', padding: '2px', lineHeight: '1' }}>&#8377;</span> {activeEnrollment.fees}
                  </td>
                </tr>
                <tr>
                  <th>Enrolled On</th> 
                  <td>{getDisplayDate(activeEnrollment.from_date)}</td>
                </tr>
                <tr>
                  <th>Ends At</th> 
                  <td>{getDisplayDate(activeEnrollment.to_date)}</td>
                </tr>
                <tr>
                  <th>Billed</th> 
                  <td>{activeEnrollment.bill_cycle === 0 ? 'Onetime' : activeEnrollment.bill_cycle < 12 ? 'Every ' + activeEnrollment.bill_cycle + ' Month(s)':'Yearly'}</td>
                </tr>
                <tr>
                  <th>Last Billed At</th> 
                  <td>{getDisplayDate(activeEnrollment.last_bill_date)}</td>
                </tr>
                <tr>
                  <th>Next Billing At</th> 
                  <td>{getDisplayDate(activeEnrollment.next_bill_date)}</td>
                </tr>
                <tr>
                  <th>Comments</th> 
                  <td>{activeEnrollment.comments}</td>
                </tr>
              </table>
            </div>
          }
      </div>
    );
  }
}

function SubscriptionListItem(props) {
  let data = props.data;
  let enrollStatus = EnrollStatus[data.status]
  let status = <span><span style={{ backgroundColor: enrollStatus.color, height: '8px', width: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>{enrollStatus.displayName}</span>
  if (props.activeSubscriptionId)
    return (
      <tr onClick={props.onClick} className={(data.id === parseInt(props.activeSubscriptionId, 10)) ? "selected" : ""}>
        <td>{data.user_name}</td>
        <td>{data.plan_name}</td>
        <td>{status}</td>
      </tr>
    )

  return (
    <tr onClick={props.onClick}>
      <td>{data.user_name}</td>
      <td>{data.plan_name}</td>
      <td>{getDisplayDate(data.next_bill_date)}</td>
      <td>{status}</td>
    </tr>
  );
}

export default Subscriptions;
