import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './Players.css'
import { Players, Classes, Plans } from '../../helper/api';
import AddOrEditPlayer from './AddOrEditPlayer';
import PlayerDetails from './PlayerDetails';
import Loading from '../Common/Loading';
import { getUrlParameter, addOrRemoveUrlParameter, getDisplayDate } from '../../helper/utils';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import FilteredValue from '../Common/FilteredValue'
import { handleErrors } from '../../helper/errorHandler';
import { CustomerStatus } from '../../constants/customerStatus';
import swal from 'sweetalert'

class PlayersList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isModalOpen: false,
      subscriptionFilter: getUrlParameter('enrollment'),
      search: getUrlParameter("search"),
      statusFilter: getUrlParameter('status'),
      fromDateFilter: getUrlParameter('from_date'),
      toDateFilter: getUrlParameter('to_date'),
      playerIds: []
    }
    this.toggleFilterDropDown = this.toggleFilterDropDown.bind(this);
    this.toggleSMSDropDown = this.toggleSMSDropDown.bind(this);
    this.toggleSMSNotificationModal = this.toggleSMSNotificationModal.bind(this);
    this.filters = {
      new : "New",
      active : "Active",
      inactive : "Inactive"
    }
  }

  componentWillMount() {
    if (!this.state.players) {
      Players.get(this.state.search, this.state.subscriptionFilter, '', this.state.fromDateFilter, this.state.toDateFilter, this.state.statusFilter)
        .then(({data}) => this.setState({
          players: data, 
          playerId: this.props.match.params.id && parseInt(this.props.match.params.id, 10)
        })).catch(err => handleErrors(this, err))
      Classes.get().then(({ data }) => this.setState({ classes: data }))
      Plans.get().then(({ data }) => this.setState({ plans: data }))
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      playerId: newProps.match.params.id && parseInt(newProps.match.params.id, 10),
      subscriptionFilter: getUrlParameter('enrollment'),
      search: getUrlParameter("search"),
      fromDateFilter: getUrlParameter('from_date'),
      fromDate: getUrlParameter('from_date'),
      toDateFilter: getUrlParameter('to_date'),
      toDate: getUrlParameter('to_date'),
      statusFilter: getUrlParameter('status'),
      status: getUrlParameter('status')
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search || 
      this.state.subscriptionFilter !== prevState.subscriptionFilter ||
      this.state.fromDateFilter !== prevState.fromDateFilter ||
      this.state.toDateFilter !== prevState.toDateFilter ||
      this.state.statusFilter !== prevState.statusFilter) {
      this.refresh(this.state.playerId)
    }
  }

  refresh(playerId) {
    this.setState({ players: null, playerId })
    Players.get(this.state.search, this.state.subscriptionFilter, '', this.state.fromDateFilter, this.state.toDateFilter, this.state.statusFilter)
      .then(({data}) => this.setState({ players: data }))
      .catch(err => handleErrors(this, err))
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  openDetails(playerId) {
    if (playerId === null) {
      this.props.history.push('/customers' + window.location.search);
    } else if (this.state.playerId !== playerId) {
      this.props.history.push('/customers/' + playerId + window.location.search);
    }
  }

  toggleFilterDropDown() {
    this.setState({
      isFilterDropDownOpen: !this.state.isFilterDropDownOpen
    })
  }

  toggleSMSDropDown() {
    this.setState({
      isSMSDropDownOpen: !this.state.isSMSDropDownOpen
    })
  }

  toggleSMSNotificationModal() {
    this.setState({
      isSMSNotificationModalOpen: !this.state.isSMSNotificationModalOpen
    })
  }

  sendBalanceReminder() {
    swal({
      text: 'Are you sure that you want to send the balance reminder?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
         Players.remind(this.state.playerIds)
        .then(({data}) => {
          swal({
            text: data.message,
            icon: "success"
          })
        }).catch(err => handleErrors(this, err))
      }
    })
  }

  handleFilter() {
    this.props.history.push(
      addOrRemoveUrlParameter("enrollment", this.state.subscription,
        addOrRemoveUrlParameter("from_date", this.state.fromDate,
          addOrRemoveUrlParameter("to_date", this.state.toDate,
            addOrRemoveUrlParameter("status", this.state.status)
          )
        )
      )
    )
  }

  render() {

    if (!this.state.players || !this.state.classes || !this.state.plans) {
      return (
        <Loading/>
      );
    }

    let filterText = this.state.playerId ? <i className="material-icons">filter_list</i> : "Filter";
    let addPlayerText = this.state.playerId ? <i className="material-icons">add</i> : (<span><i className="material-icons">add</i> Add Customer</span>);
    let dateFilteredText = "DOJ between"
    let dateFilteredValue = getDisplayDate(this.state.fromDateFilter) + " and " + getDisplayDate(this.state.toDateFilter)
    if (!this.state.fromDateFilter && this.state.toDateFilter) {
      dateFilteredText = "DOJ before"
      dateFilteredValue = getDisplayDate(this.state.toDateFilter)
    } else if (this.state.fromDateFilter && !this.state.toDateFilter) {
      dateFilteredText = "DOJ after"
      dateFilteredValue = getDisplayDate(this.state.fromDateFilter)
    }

    let subscriptionFilterValue = this.state.classes.filter(clazz => clazz.id === parseInt(this.state.subscriptionFilter, 10))[0]
    if (!subscriptionFilterValue) {
      subscriptionFilterValue = this.state.plans.filter(plan => plan.id === parseInt(this.state.subscriptionFilter, 10))[0]
    }

    return (
      <div className="PlayersList">
        <div className="row" style={{ margin: '0' }}>
          <div className={this.state.playerId ? "col-md-4" : "col-md-12"} style={{ padding: '0',radius:'50%'}}>
            { this.state.playerIds.length > 0 && 
              <div className="d-flex align-items-start justify-content-start" style={{ marginBottom: '5px' }}>
                <Dropdown tag="span" isOpen={this.state.isSMSDropDownOpen} toggle={this.toggleSMSDropDown}>
                  <DropdownToggle caret
                    tag="button"
                    className="btn"
                    onClick={this.toggleSMSDropDown}
                    data-toggle="dropdown"
                    aria-expanded={this.state.isSMSDropDownOpen}>
                    Send SMS ({this.state.playerIds.length})
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem tag="div"
                      onClick={this.sendBalanceReminder.bind(this)}>
                      Balance Reminder
                    </DropdownItem>
                    <DropdownItem tag="div"
                      onClick={this.toggleSMSNotificationModal}>
                      Custom Text
                      <SMSNotificationModal 
                        isOpen={this.state.isSMSNotificationModalOpen}
                        toggle={this.toggleSMSNotificationModal}
                        playerIds={this.state.playerIds}/>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <button className="btn" onClick={() => this.setState({ playerIds: [] })}>
                  Clear Selection
                </button>
              </div>
            }
            { this.state.playerIds.length === 0 &&
            <div className="d-flex flex-row align-items-center justify-content-between" style={{ marginBottom: '5px' }}>
              <div>
                {this.state.search && <FilteredValue filter="Customer Name / Mobile / Email" value={this.state.search} param="search"/>}
                {this.state.statusFilter && <FilteredValue filter="Status" value={this.filters[this.state.statusFilter]} param="status"/>}
                {this.state.subscriptionFilter && <FilteredValue filter="Enrolled to" value={subscriptionFilterValue.name} param="enrollment"/>}
                {(this.state.fromDateFilter || this.state.toDateFilter) && 
                  <FilteredValue filter={dateFilteredText} value={dateFilteredValue} param={["from_date","to_date"]}/>
                }
              </div>
              <div className="d-flex flex-row align-items-center justify-content-end">
                <Dropdown tag="span" isOpen={this.state.isFilterDropDownOpen} toggle={this.toggleFilterDropDown}>
                  <DropdownToggle caret
                    tag="button"
                    className="btn"
                    onClick={this.toggleFilterDropDown}
                    data-toggle="dropdown"
                    aria-expanded={this.state.isFilterDropDownOpen}>
                    {filterText}
                  </DropdownToggle>
                  <DropdownMenu right style={{ width:'350px',left:'20px',right:'10px'}} id="mySidenavR" class="sidenavR">
                    <DropdownItem disabled tag="div">
                      <label>Customer Status</label>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <Input type="select" 
                        className="custom-select form-control" 
                        style={{ width: '100%' }}
                        value={this.state.status || this.state.statusFilter}
                        onChange={event => this.setState({ status: event.target.value })}>
                        <option value="">Select the status</option>
                        { Object.keys(this.filters).map((filter) => <option key={filter} value={filter}>{this.filters[filter]}</option> ) }
                      </Input>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <label>Class / Plan</label>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <Input type="select" 
                        className="custom-select form-control" 
                        style={{ width: '100%' }}
                        value={this.state.subscription || this.state.subscriptionFilter}
                        onChange={event => this.setState({ subscription: event.target.value })}>
                        <option value="">Select the Class/Plan</option>
                        { this.state.classes.map((clazz) => <option key={clazz.id} value={clazz.id}>{clazz.name}</option> ) }
                        { this.state.plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option> ) }
                      </Input>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <label>DOJ</label>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <DayPickerInput 
                        placeholder="From Date"
                        className="date-picker"
                        showOutsideDays
                        todayButton="Today"
                        value={getDisplayDate(this.state.fromDate || this.state.fromDateFilter)}
                        onDayChange={(day) => {
                          this.setState({ 
                            fromDate: (day && moment(day).format("YYYY-MM-DD")) || null
                          })
                        }}/>
                      <span style={{ width: '10px', display: 'inline-block' }} />
                      <DayPickerInput 
                        placeholder="To Date"
                        className="date-picker"
                        showOutsideDays
                        todayButton="Today"
                        value={getDisplayDate(this.state.toDate || this.state.toDateFilter)}
                        onDayChange={(day) => {
                          this.setState({ 
                            toDate: (day && moment(day).format("YYYY-MM-DD")) || null
                          })
                        }}/>
                    </DropdownItem>
                    <DropdownItem
                      onClick={this.handleFilter.bind(this)}>
                      <button className="btn" style={{ width: '100%', marginTop: '10px' }}>
                       Filter
                      </button>
                    </DropdownItem>
                  </DropdownMenu>  
                </Dropdown>
                <button className="btn" onClick={this.toggleModal.bind(this)}>{addPlayerText}</button>
                <AddOrEditPlayer isModalOpen={this.state.isModalOpen} toggle={this.toggleModal.bind(this)} refresh={this.refresh.bind(this)}/>
              </div>
            </div>
            }

            <div className="d-flex align-items-start">
              <div style={{ overflowY: 'auto' , height: 'calc(100vh - 110px)', padding: '0', width: '100%' }}>
                <Table style={{ backgroundColor: 'white', marginLeft:'10px',marginTop:'5px',marginBottom:'10px',marginRight:'20px',padding:'5px'}} hover responsive>
                  { !this.state.playerId &&
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          checked={this.state.players.length === this.state.playerIds.length}
                          onClick={e => {
                            let playerIds = []
                            if (e.target.checked) {
                              this.state.players.forEach(player => playerIds.push(player.user_id))
                            }
                            this.setState({ playerIds })
                          }}
                        />
                      </th>
                      <th class="black">Name</th>
                      <th class="black">Email</th>
                      <th class="black">Status</th>
                      <th class="black">DOJ</th>
                      <th class="black">Mobile</th>
                      <th class="black">Balance due</th>
                    </tr>
                  </thead>
                  }
                  <tbody>
                    { this.state.players.map((player, index) => 
                        <PlayerItem 
                          key={player.user_id} 
                          player={player} 
                          refresh={this.refresh.bind(this)} 
                          activePlayerId={this.state.playerId} 
                          openDetails={this.openDetails.bind(this)} 
                          playerIds={this.state.playerIds} 
                          addOrRemovePlayerId={(playerId, isAdd) => {
                            let temp = this.state.playerIds
                            if (isAdd) {
                              temp.push(playerId)
                            } else if (this.state.playerIds.includes(playerId)) {
                              temp.splice(this.state.playerIds.indexOf(playerId), 1)
                            }
                            this.setState({ playerIds: temp })
                          }}/>
                    )}
                  </tbody>
                </Table>
                {this.state.players.length === 0 && 
                  <div className="d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'white', fontSize: '25px' }}>
                    There are no Customers...!
                  </div>
                }
              </div>
            </div>
          </div>
          { this.state.playerId &&
          <div className="col-md-8" style={{ overflowY: 'auto' , height: 'calc(100vh - 75px)', paddingLeft: '5px', paddingRight: '0' }}>
            <PlayerDetails 
              playerId={this.state.playerId} 
              refresh={this.refresh.bind(this)} 
              close={() => {this.openDetails(null)}}
              history={this.props.history}/>
          </div>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(PlayersList);

class PlayerItem extends Component {
  render() {
    let customerStatus = CustomerStatus[this.props.player.status]
	
    return (
      <tr onClick={() => this.props.openDetails(this.props.player.user_id)} className={(this.props.player.user_id === parseInt(this.props.activePlayerId, 10)) ? "selected" : ""}>
        { !this.props.activePlayerId && 
          <td onClick={e => {
            e.stopPropagation()
            this.props.addOrRemovePlayerId(this.props.player.user_id, e.target.checked)
          }}>
            <input type="checkbox" checked={this.props.playerIds.includes(this.props.player.user_id)} />
          </td> 
        }
	
	
  <td><img src={"http://via.placeholder.com/35?text="+this.props.player.name[0].toUpperCase()} alt=" " class="pqrs"/> &nbsp;&nbsp;{this.props.player.name}</td>
        <td>{this.props.player.email}</td>
		{ !this.props.activePlayerId && <td><span><span style={{ backgroundColor: customerStatus.color, height: '8px', width: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>{customerStatus.displayName}</span></td> }
        { !this.props.activePlayerId && <td>{getDisplayDate(this.props.player.doj)}</td> }
		{ !this.props.activePlayerId && <td>{this.props.player.mobile}</td> }
        { !this.props.activePlayerId && <td>{this.props.player.due_amount}</td> }
	  <td>
	  <div class="icon-bar" tag="span"> 
  <span><a href="mailto:sandeepkiran821@gmail.com"><i class="fa fa-envelope"></i></a>
  &nbsp;&nbsp;
  <a href="tel:7358467771"><i class="fa fa-phone"></i></a>
  </span>
</div>
</td>
	  </tr>
    )
  }
}

class SMSNotificationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(newProps) {
    if (newProps.isOpen) {
      this.setState({})
    }
  }

  sendSMSNotification() {
    swal({
      text: 'Are you sure that you want to send the SMS notication?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
         Players.notify({ message: this.state.message, user_ids: this.props.playerIds, 'notification_method' : 'sms' })
        .then(({data}) => {
          swal({
            text: data.message,
            icon: "success"
          }).then(() => this.props.toggle())
        }).catch(err => handleErrors(this, err))
      }
    })
  }

  render() {
    return (
      <Modal className="NewPlayer" isOpen={this.props.isOpen} toggle={this.props.toggle} size="sm">
        <ModalHeader toggle={this.props.toggle}>Send SMS Notifcation</ModalHeader>
        <ModalBody>
          <div className="form-group col">
            <label>Message</label>
            <input type="textarea" className="form-control"
            value={this.state.message}
            onChange={ event => this.setState({ message: event.target.value }) }/>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button className="btn" 
              onClick={this.sendSMSNotification.bind(this)}
            >Send</button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}