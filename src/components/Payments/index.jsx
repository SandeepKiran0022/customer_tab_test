import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import { Payments } from '../../helper/api'
import Loading from '../Common/Loading';
import { getUrlParameter, addOrRemoveUrlParameter, getDisplayDate } from '../../helper/utils';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import FilteredValue from '../Common/FilteredValue'
import { handleErrors } from '../../helper/errorHandler';
import { PaymentModes } from '../../constants/paymentMode'
import swal from 'sweetalert'

class PaymentsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      paymentId : this.props.match.params.id,
      search: getUrlParameter("search"),
      payModeFilter: getUrlParameter('pay_mode'),
      fromDateFilter: getUrlParameter('from_date'),
      toDateFilter: getUrlParameter('to_date'),
      isFilterDropDownOpen: false
    }
    this.filters = {
      all: "All Payments",
      cash: "Cash",
      card: "Card"
    }
    this.closeDetail = this.closeDetail.bind(this);
    this.openDetail = this.openDetail.bind(this);
    this.deletePayment = this.deletePayment.bind(this);
    this.toggleFilterDropDown = this.toggleFilterDropDown.bind(this);
  }

  deletePayment(paymentId) {
    swal({
      text: 'Are you sure that you want to delete the payment?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
        Payments.delete(paymentId)
          .then(json => {
            swal({
              text: "Payment Deleted", 
              icon: "success"
            }).then(() => {
              this.closeDetail()
              this.refresh()
            })
          }).catch(err => handleErrors(this, err))
      }
    })
  }

  componentWillMount() {
    Payments.get(this.state.search).then(({ data }) => this.setState({ payments: data }))
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      paymentId: newProps.match.params.id,
      search: getUrlParameter("search"),
      payModeFilter: getUrlParameter('pay_mode'),
      fromDateFilter: getUrlParameter('from_date'),
      fromDate: getUrlParameter('from_date'),
      toDateFilter: getUrlParameter('to_date'),
      toDate: getUrlParameter('to_date')
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search ||
      prevState.payModeFilter !== this.state.payModeFilter ||
      this.state.fromDateFilter !== prevState.fromDateFilter ||
      this.state.toDateFilter !== prevState.toDateFilter) {
      this.refresh(this.state.paymentId)
    }
  }

  refresh() {
    this.setState({ payments: null })
    Payments.get(this.state.search, this.state.payModeFilter, this.state.fromDateFilter, this.state.toDateFilter)
      .then(({data}) => this.setState({ payments: data }))
      .catch(err => handleErrors(this, err))
  }

  openDetail(paymentId) {
    if (this.state.paymentId && this.state.paymentId === paymentId) {
      return
    }
    this.props.history.push('/payments/' + paymentId + window.location.search);
  }

  closeDetail() {
    this.props.history.push('/payments' + window.location.search);
  }

  toggleFilterDropDown() {
    this.setState({
      isFilterDropDownOpen: !this.state.isFilterDropDownOpen
    })
  }

  handleFilter() {
    this.props.history.push(
      addOrRemoveUrlParameter("pay_mode", this.state.payMode,
        addOrRemoveUrlParameter("from_date", this.state.fromDate,
          addOrRemoveUrlParameter("to_date", this.state.toDate)
        )
      )
    )
  }

  render() {

    if (!this.state.payments) {
      return (
        <Loading/>
      );
    }

    let activePayment = null
    if (this.state.paymentId) {
      activePayment = this.state.payments.filter(payment => payment.id === parseInt(this.state.paymentId, 10))[0]
    }

    let filterText = this.state.paymentId ? <i className="material-icons">filter_list</i> : "Filter";
    let dateFilteredText = "Payment Date between"
    let dateFilteredValue = getDisplayDate(this.state.fromDateFilter) + " and " + getDisplayDate(this.state.toDateFilter)
    if (!this.state.fromDateFilter && this.state.toDateFilter) {
      dateFilteredText = "Payment Date before"
      dateFilteredValue = getDisplayDate(this.state.toDateFilter)
    } else if (this.state.fromDateFilter && !this.state.toDateFilter) {
      dateFilteredText = "Payment Date after"
      dateFilteredValue = getDisplayDate(this.state.fromDateFilter)
    }

    return (
      <div className="row">
        <div className={this.state.paymentId ? "col-md-8" : "col-md-12"} style={{ overflowY: 'auto' , height: 'calc(100vh - 100px)' }}>
          <div className="col-md-12 d-flex p-2 flex-row align-items-center justify-content-between">
            <div>
              {this.state.search && <FilteredValue filter="Invoice Number / Name" value={this.state.search} param="search"/>}
              {this.state.payModeFilter && <FilteredValue filter="Payment Mode" value={this.filters[this.state.payModeFilter]} param="pay_mode"/>}
              {(this.state.fromDateFilter || this.state.toDateFilter) && 
                <FilteredValue filter={dateFilteredText} value={dateFilteredValue} param={["from_date","to_date"]}/>
              }
            </div>
            <div className="d-flex align-items-center justify-content-end">
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
                  style={{ width: '350px' }}>
                  <DropdownItem disabled tag="div">
                    <label>Payment Mode</label>
                  </DropdownItem>
                  <DropdownItem disabled tag="div">
                    <Input type="select" 
                      className="custom-select form-control" 
                      style={{ width: '100%' }}
                      value={this.state.payMode || this.state.payModeFilter}
                      onChange={event => this.setState({ payMode: event.target.value })}>
                      { Object.keys(this.filters).map((filter) => <option key={filter} value={filter}>{this.filters[filter]}</option> ) }
                    </Input>
                  </DropdownItem>
                  <DropdownItem disabled tag="div">
                    <label>Payment Date</label>
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
            </div>
          </div>
          <table className="table table-light table-hover" style={{ margin: '0' }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Payment Date</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Payment Mode</th>
              </tr>
            </thead>
            <tbody>
              {this.state.payments.map((payment, index) => 
                <tr key={payment.id} onClick={() => this.openDetail(payment.id)} style={ (activePayment && payment.id === activePayment.id) ? { backgroundColor: "#EEE" } : {}}>
                  <td>{payment.user_name}</td>
                  <td>{getDisplayDate(payment.paid_date)}</td>
                  <td>{payment.invoice_no}</td>
                  <td>{payment.paid_amount}</td>
                  <td>{PaymentModes[payment.pay_mode].displayName}</td>
                </tr>
              )}
            </tbody>
          </table>
          {this.state.payments.length === 0 && 
            <div className="d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'white', fontSize: '25px' }}>
              There are no payments...!
            </div>
          }
        </div>
        { activePayment &&
          <div className="col-md-4" style={{ backgroundColor: 'white', height: '300px' }}>

            <div className="d-flex align-items-center justify-content-end p-2">
              <button className="btn" onClick={() => this.deletePayment(activePayment.id)} ><span className="material-icons">delete</span></button>
              <button className="btn btn-light" onClick={this.closeDetail} ><span className="material-icons">close</span></button>
            </div>
            
            <div className="d-flex align-items-center">
              <i className="material-icons">person</i>
              <Link to={"/customers/" + activePayment.user_id}>
                {activePayment.user_name}
              </Link>
            </div>
            <div className="d-flex align-items-center">
              <i className="material-icons">date_range</i> {getDisplayDate(activePayment.paid_date)}
            </div>
            <div className="d-flex align-items-center">
              <i className="material-icons">receipt</i>
              <Link to={"/invoices/" + activePayment.invoice_id}>
                {activePayment.invoice_no}
              </Link>
            </div>
            <div className="d-flex align-items-center">
              <span style={{ fontSize: '24px', padding: '10px', lineHeight: '1' }}>&#8377;</span> {activePayment.paid_amount}
            </div>
            <div className="d-flex align-items-center">
              <i className="material-icons">comment</i>{activePayment.comments}
            </div>
          </div>
        }
      </div>
    )
  }
}

export default withRouter(PaymentsList);