import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TabPane, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Card, CardHeader, CardText, CardBody, CardTitle, CardFooter, Row, Col } from 'reactstrap';
import swal from 'sweetalert';
import './Players.css'
import TabView from '../Common/TabView'
import { Players } from '../../helper/api';
import Loading from '../Common/Loading';
// import RecordPayment from '../Invoices/RecordPayment';
import ComingSoon from '../ComingSoon';
import EnrollPlayer from './EnrollPlayer';
import AddOrEditPlayer from './AddOrEditPlayer';
import { InvoiceStatus } from '../../constants/InvoiceStatus';
import { handleErrors } from '../../helper/errorHandler';
import {EnrollStatus} from "../../constants/EnrollStatus";
import * as Colors from '../../constants/colors'
import { CustomerStatus } from '../../constants/customerStatus';
import { getDisplayDate } from '../../helper/utils';

const DEFAULT_USER_IMG="https://img.ontroapp.com/default/user.png";


export default class PlayersList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isModalOpen: false,
      isEnrollModalOpen: false,
      isEnrollDropDownOpen: false,
      playerImage:''
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleEnrollModal = this.toggleEnrollModal.bind(this);
    this.toggleEnrollDropDown = this.toggleEnrollDropDown.bind(this);
    this.loadSubscriptions = this.loadSubscriptions.bind(this);
  }

  refresh(playerId) {
    this.setState({ players: null, playerId });
    this.props.refresh(playerId);
    Players.get(this.state.search, this.state.subscriptionFilter, '', this.state.fromDateFilter, this.state.toDateFilter, this.state.statusFilter)
      .then(({data}) => this.setState({ players: data }))
      .catch(err => handleErrors(this, err))
  }
  componentWillReceiveProps(newProps) {
    if (this.state.player && (newProps.playerId !== this.state.player.id)) {
      this.setState({ player: null ,subscriptions:null})
      this.loadPlayer(newProps);
    }
  }
  
  getTransactionList(playerId) {
    this.setState({ invoices: null,payments:null })
    Players.getTransactions(playerId).then(({ data }) => this.setState({ 
      invoices: data.invoices,
      payments: data.payments
    }))
  }
  componentWillMount() {
    this.loadPlayer(this.props);
  }
  
  loadPlayer(props) {
    Players.getPlayer(props.playerId)
      .then(({data}) => this.setState({ player: data}))
      .catch(err => handleErrors(this, err))
    this.loadSubscriptions(props)
  }

  loadSubscriptions(props) {
    Players.getSubscriptions((props && props.playerId) || this.state.player.id)
    .then(({data}) => this.setState({ subscriptions: data }))
    .catch(err => handleErrors(this, err))
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  toggleEnrollModal() {
    this.setState({
      isEnrollModalOpen: !this.state.isEnrollModalOpen
    });
  }

  toggleEnrollDropDown() {
    this.setState({
      isEnrollDropDownOpen: !this.state.isEnrollDropDownOpen
    });
  }

  deletePlayer() {
    swal({
      text: 'Are you sure that you want to delete?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
         Players.delete(this.props.playerId)
        .then(json => {
          swal({
            text: "Customer Deleted", 
            icon: "success"
          }).then(this.props.refresh()) 
        }).catch(err => handleErrors(this, err))
      }
    })
  }

  render() {
    

    if (!this.state.player) {
      return (
        <Loading/>
      );
    }

    return (
      <div style={{ backgroundColor: 'white'}}>
       <div className="d-flex flex-row align-items-center p-2">
        <div style={{ verticalAlign:'middle' }}>
          <img src={this.state.player.image ? this.state.player.image : DEFAULT_USER_IMG} alt="player" style={{ height: '64px', width: '64px', borderRadius: '50%', border: '1px solid gray' }} /> 
          <div style={{ position: 'relative', top: '-55px', left: '55px', backgroundColor: CustomerStatus[this.state.player.status].color, height: '10px', width: '10px', borderRadius: '50%' }}></div>
        </div>
        <div style={{ paddingLeft: '5px',verticalAlign:'middle'}} align-items-top>
          <div style={{height:'40px',fontWeight:'bold'}}>
            <span style={{ fontSize: '20px',color:"#AD2029" }}>{this.state.player.name} </span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          {/* <button disabled className="btn" onClick={this.toggleModal}>Record Payment</button> */}
          {/* <RecordPayment isOpen={this.state.isModalOpen} toggle={this.toggleModal} className='recordPayment'/> */}
          <Dropdown tag="span" isOpen={this.state.isEnrollDropDownOpen} toggle={this.toggleEnrollDropDown}>
            <DropdownToggle caret
              tag="button"
              className="btn"
              onClick={this.toggleEnrollDropDown}
              data-toggle="dropdown"
              aria-expanded={this.state.isEnrollDropDownOpen}>
              Enroll
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={() => {
                  this.setState({ enroll_to: 'class' })
                  this.toggleEnrollModal()
                }}
                >
                To Class
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  this.setState({ enroll_to: 'plan' })
                  this.toggleEnrollModal()
                }}
                >
                To Plan
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <EnrollPlayer enrollTo={this.state.enroll_to} player={this.state.player} isModalOpen={this.state.isEnrollModalOpen} toggle={this.toggleEnrollModal} refreshSubscriptions={this.loadSubscriptions}/>
          <button className="btn" onClick={this.toggleModal.bind(this)}><i className="material-icons">mode_edit</i></button>
          <AddOrEditPlayer isModalOpen={this.state.isModalOpen} toggle={this.toggleModal.bind(this)} refresh={this.refresh.bind(this)} player={this.state.player}/>
          <button className="btn" onClick={this.deletePlayer.bind(this)}><i className="material-icons">delete</i></button>
          <button className="btn btn-light" onClick={this.props.close} ><span className="material-icons">close</span></button>
        </div>
       </div>
       <Row style={{ padding: '10px', paddingTop: '0' }}>
        <Col md="4">
          <i className="material-icons" style={{opacity:"0.75",fontSize:'15px'}}>mail</i> {this.state.player.email}
        </Col>
        <Col md="4">
          <i className="material-icons" style={{opacity:"0.75",fontSize:'15px'}}>phone</i> {this.state.player.mobile}
        </Col>
        <Col md="4">
          <i className="material-icons" style={{opacity:"0.75",fontSize:'15px'}}>phone_iphone</i> {this.state.player.mobile_alternate || '-'}
        </Col>
        <Col md="4">
          <i className="material-icons" style={{opacity:"0.75",fontSize:'15px'}}>cake</i> {getDisplayDate(this.state.player.dob)}
        </Col>
        <Col md="4">
          <i className="material-icons" style={{opacity:"0.75",fontSize:'15px'}}>date_range</i> Since {getDisplayDate(this.state.player.doj)}
        </Col>
        <Col md="4">
          <div className="d-flex align-items-center justify-content-start">
            <span><i className="material-icons" style={{opacity:"0.75",fontSize:'15px'}}>location_on</i></span>
            <span style={{ wordWrap: 'break-word' }}>{this.state.player.address_text}</span>
          </div>
        </Col>
       </Row>
       <div className="d-flex flex-row align-items-end">
        <TabView tabs={{
            enrollments: "Enrollments",
            invoices: "Invoices",
            payments: "Payments",
            timesheet: "Timesheet"
          }}
          defaultTab="enrollments"
          handleTabChange={(tab) => {
            if (tab === 'invoices' || tab === 'payments') {
              this.getTransactionList(this.state.player.id)
            }
          }}>
          <TabPane tabId="enrollments">
            <div className="row overview" style={{ margin: '0',paddingBottom:'30px' }}>
              <div className="col-md-12" style={{ paddingTop: "10px"}}>
                  {!this.state.subscriptions && <Loading/>}
                  {this.state.subscriptions && this.state.subscriptions.memberships &&
                    this.state.subscriptions.memberships.map((membership, index) => <CoachingItem key={index} coaching={membership} />)
                  }
                  {this.state.subscriptions && this.state.subscriptions.coachings &&
                    this.state.subscriptions.coachings.map((coaching, index) => <CoachingItem key={index} coaching={coaching} />)
                  }
              </div>
            </div>
          </TabPane>
          <TabPane tabId="invoices">
          <table className={"InvoiceList table table-light table-hover collapse-list"} style={{ margin: '0' }}>
                <thead>
                  { this.state.invoices &&
                    <tr>
                      <th>Date</th>
                      <th>Invoice</th>
                      <th>Item</th>
                      <th>Amount</th>
                      <th>Balance Due</th>
                      <th>Status</th>
                    </tr>
                   }
                </thead>
                <tbody>
                  {!this.state.invoices && <Loading/>}
                  {this.state.invoices && this.state.invoices.map((invoice, i) => <InvoiceListItem key={invoice.id} onClick={() => this.props.history.push('/invoices/' + invoice.id)} data={invoice} />)}
                </tbody>
              </table>
          </TabPane>
          <TabPane tabId="payments">
          <table className={"PaymentList table table-light table-hover collapse-list"} style={{ margin: '0' }}>
                <thead>
                  {!this.state.payments && <Loading/>}
                  { this.state.payments &&
                    <tr>
                      <th>Payment Date</th>
                      <th>Invoice</th>
                      <th>Amount</th>
                      <th>Payment Mode</th>
                    </tr>
                   }
                </thead>
                <tbody>
                  {this.state.payments && this.state.payments.map((payment, i) => <PaymentListItem key={payment.id} onClick={() => this.props.history.push('/payments/' + payment.id)} data={payment} />)}
                </tbody>
              </table>
          </TabPane>
          <TabPane tabId="timesheet">
            <ComingSoon />
          </TabPane>
        </TabView>
       </div>
      </div>
    );
  }
}


class CoachingItem extends Component {

  render() {

    let status =this.props.coaching.status;
    let enrollStatus = EnrollStatus[status]
    let statusIcon = <span><span style={{ backgroundColor: enrollStatus.color, height: '8px', width: '8px', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span><small>{enrollStatus.displayName}</small></span>
    
  return(

  <Card style={{ marginTop: '10px' }}>
    <CardHeader>
      <CardTitle className="Coaching">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-start">
            <Link to={"/enrollments/" + this.props.coaching.enrollment_id } style={{ color: Colors.primary }}>{this.props.coaching.name}</Link> &nbsp; <small>({ this.props.coaching.type === 'C' ? 'Class' : 'Plan' })</small>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            {statusIcon}
          </div>
        </div>
      </CardTitle>
    </CardHeader>
    <CardBody>
      <Row style={{ opacity:'0.65', margin: '0' }}>
        <Col md="2" style={{ padding: '5px' }}><CardText style={{fontVariant:'small-caps', opacity:'0.75',fontWeight:'bold'}}>start date</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText>{this.props.coaching.from_date}</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText style={{fontVariant:'small-caps',opacity:'0.75',fontWeight:'bold'}}>last billed date</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText>{this.props.coaching.last_bill_date}</CardText></Col>
        <Col md="4" style={{textAlign:'right', paddingRight: '0'}}>
          <CardTitle>
            <div style={{ color: Colors.primary, fontSize: '20px' }}>&#8377; {this.props.coaching.fees}</div>  
          </CardTitle>
        </Col>
      </Row>
      <Row style={{ opacity:'0.65', margin: '0' }}>
        <Col md="2" style={{ padding: '5px' }}><CardText style={{fontVariant:'small-caps',opacity:'0.75',fontWeight:'bold'}}>end date</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText>{this.props.coaching.to_date}</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText style={{fontVariant:'small-caps',opacity:'0.75',fontWeight:'bold'}}>next billing date</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText>{this.props.coaching.next_bill_date}</CardText></Col>
      </Row>
      <Row style={{ opacity:'0.65', margin: '0' }}>
        <Col md="2" style={{ padding: '5px' }}><CardText style={{fontVariant:'small-caps',opacity:'0.75',fontWeight:'bold'}}>billed</CardText></Col>
        <Col md="2" style={{ padding: '5px' }}><CardText>{this.props.coaching.bill_cycle === 0 ? 'Onetime' : this.props.coaching.bill_cycle < 12 ? 'Every ' + this.props.coaching.bill_cycle + ' Month(s)':'Yearly'}</CardText></Col>
      </Row>
    </CardBody>

    <CardFooter style={{ padding: '5px' }}>
      <div className="d-flex flex-row align-items-center justify-content-start">
        <i className="material-icons">message</i> {this.props.coaching.comments}
      </div>
    </CardFooter>

  </Card>
)
}
}

function InvoiceListItem(props) {

  let data = props.data;
  let invoiceStatus = InvoiceStatus[data.status]

  return (
    <tr onClick={props.onClick}>
      <td>{data.invoice_date}</td>
      <td>{data.invoice_no}</td>
      <td>{data.item}</td>
      <td>{data.invoice_amount}</td>
      <td>{data.due_amount}</td>
      <td style={{ color: invoiceStatus.color }}>{invoiceStatus.displayName}</td>
    </tr>
  )
}
function PaymentListItem(props) {

  let data = props.data;

  return (
    <tr onClick={props.onClick}>
      <td>{data.paid_date}</td>
      <td>{data.invoice_no}</td>
      <td>{data.paid_amount}</td>
      <td>{data.pay_mode}</td>
    </tr>
  )
}