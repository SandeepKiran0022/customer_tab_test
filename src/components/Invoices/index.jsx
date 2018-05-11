import React from 'react'
import { withRouter } from 'react-router-dom'
import InvoiceDetail from './InvoiceDetail'
import { Invoices as InvoicesApi } from '../../helper/api'
import { getUrlParameter, addOrRemoveUrlParameter, getDisplayDate } from '../../helper/utils'
import './Invoices.css'
import Loading from '../Common/Loading';
import { InvoiceStatus } from '../../constants/InvoiceStatus'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput'
import FilteredValue from '../Common/FilteredValue'

class Invoices extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      filter: getUrlParameter('status'),
      fromDateFilter: getUrlParameter('from_date'),
      toDateFilter: getUrlParameter('to_date'),
      search: getUrlParameter("search")
    }
    this.filters = {
      all: "All Invoices",
      unpaid: "Unpaid",
      partially_paid: "Partially Paid", 
      overdue: "Overdue", 
      paid: "Paid", 
      void: "Void"
    }
    this.closeDetail = this.closeDetail.bind(this);
    this.openDetail = this.openDetail.bind(this);
    this.getInvoiceList = this.getInvoiceList.bind(this);
    this.toggleFilterDropDown = this.toggleFilterDropDown.bind(this);
    this.updateInvoiceChanges = this.updateInvoiceChanges.bind(this);
  }

  componentWillMount() { 
    this.getInvoiceList()
  }
  
  componentDidUpdate(prevProps, prevState) { 
    if (prevState.filter !== this.state.filter || 
        this.state.search !== prevState.search ||
        this.state.fromDateFilter !== prevState.fromDateFilter ||
        this.state.toDateFilter !== prevState.toDateFilter) {
      this.getInvoiceList()
    }
  }

  closeDetail() {
    this.props.history.push('/invoices' + window.location.search);
  }

  openDetail(invoiceId) {
    if (this.state.invoiceId && this.state.invoiceId === invoiceId) {
      return
    }
    this.props.history.push('/invoices/' + invoiceId + window.location.search);
  }

  getInvoiceList(filter) {
    this.setState({ invoices: null })
    InvoicesApi.get(this.state.search, this.state.filter, this.state.fromDateFilter, this.state.toDateFilter)
      .then(({ data }) => this.setState({ 
        invoices: data,
        invoiceId: this.props.match.params.id
      }))
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      invoiceId: newProps.match.params.id,
      filter: getUrlParameter('status'),
      fromDateFilter: getUrlParameter('from_date'),
      fromDate: getUrlParameter('from_date'),
      toDateFilter: getUrlParameter('to_date'),
      toDate: getUrlParameter('to_date'),
      search: getUrlParameter("search")
    })
  }

  toggleFilterDropDown() {
    this.setState({
      isFilterDropDownOpen: !this.state.isFilterDropDownOpen
    })
  }

  handleFilter() {
    this.props.history.push(
      addOrRemoveUrlParameter("status", this.state.status,
        addOrRemoveUrlParameter("from_date", this.state.fromDate,
          addOrRemoveUrlParameter("to_date", this.state.toDate)
        )
      )
    )
  }

  updateInvoiceChanges(invoice) {
    let invoices = this.state.invoices
    let index = invoices.findIndex((inv) => inv.id === invoice.id)
    if (index !== -1) {
      invoices[index] = invoice
      this.setState({ invoices })
    }
  }

  render() {

    if (!this.state.invoices) {
      return (
        <Loading/>
      );
    }

    let filterText = this.state.invoiceId ? <i className="material-icons">filter_list</i> : "Filter";
    let dateFilteredText = "Invoice Date between"
    let dateFilteredValue = getDisplayDate(this.state.fromDateFilter) + " and " + getDisplayDate(this.state.toDateFilter)
    if (!this.state.fromDateFilter && this.state.toDateFilter) {
      dateFilteredText = "Invoice Date before"
      dateFilteredValue = getDisplayDate(this.state.toDateFilter)
    } else if (this.state.fromDateFilter && !this.state.toDateFilter) {
      dateFilteredText = "Invoice Date after"
      dateFilteredValue = getDisplayDate(this.state.fromDateFilter)
    }

    return (
      <div className="Invoices">

        <div className="row" style={{ margin: '0' }}>
          <div className={this.state.invoiceId ? "col-md-4" : "col-md-12"} style={{ padding: '0' }}>
            <div className="col-md-12 d-flex p-2 flex-row align-items-center justify-content-between">
              <div>
                {this.state.search && <FilteredValue filter="Invoice Number / Name / Mobile" value={this.state.search} param="search"/>}
                {this.state.filter && <FilteredValue filter="Invoice Status" value={this.filters[this.state.filter]} param="status"/>}
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
                      <label>Invoice Status</label>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <Input type="select" 
                        className="custom-select form-control" 
                        style={{ width: '100%' }}
                        value={this.state.status || this.state.filter}
                        onChange={event => this.setState({ status: event.target.value })}>
                        { Object.keys(this.filters).map((filter) => <option key={filter} value={filter}>{this.filters[filter]}</option> ) }
                      </Input>
                    </DropdownItem>
                    <DropdownItem disabled tag="div">
                      <label>Invoice Date</label>
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
            <div style={{ overflowY: 'auto' , height: 'calc(100vh - 100px)' }}>
              <table className={"InvoiceList table table-light table-hover " + (this.state.invoiceId ? " collapse-list" : "")} style={{ margin: '0' }}>
                <thead>
                  { !this.state.invoiceId &&
                    <tr>
                      <th>Date</th>
                      <th>Invoice</th>
                      <th>Customer Name</th>
                      <th>Item</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Balance Due</th>
                    </tr>
                  }
                </thead>
                <tbody>
                  {this.state.invoices.map((invoice, i) => <InvoiceListItem key={invoice.id} activeInvoiceId={this.state.invoiceId} onClick={() => this.openDetail(invoice.id)} data={invoice} />)}
                </tbody>
              </table>
              {this.state.invoices.length === 0 && 
                <div className="d-flex align-items-center justify-content-center p-4" style={{ backgroundColor: 'white', fontSize: '25px' }}>
                  There are no invoices...!
                </div>
              }
            </div>
          </div>
          {this.state.invoiceId &&
            <div className="col-md-8" style={{ paddingLeft: '5px', paddingRight: '0' }}>
              <InvoiceDetail invoiceId={this.state.invoiceId} refresh={this.getInvoiceList} closeDetail={this.closeDetail} updateInvoiceChanges={this.updateInvoiceChanges}/>
            </div>
          }
        </div>

      </div>
    )
  }
}

export default withRouter(Invoices);

function InvoiceListItem(props) {

  let data = props.data;
  let invoiceStatus = InvoiceStatus[data.status]

  if (props.activeInvoiceId)
    return (
      <tr onClick={props.onClick} className={(data.id === parseInt(props.activeInvoiceId, 10)) ? "selected" : ""}>
        <td>
          <div>
            <span>{data.name}</span><span className="float-right">{data.amount}</span>
          </div>
          <div>
            <span className="no">{'#' + data.invoice_no}</span><span>{getDisplayDate(data.invoice_date)}</span>
            <span className="float-right" style={{ color: invoiceStatus.color }}>{invoiceStatus.displayName}</span>
          </div>
        </td>
      </tr>
    )

  return (
    <tr onClick={props.onClick}>
      <td>{getDisplayDate(data.invoice_date)}</td>
      <td>{data.invoice_no}</td>
      <td>{data.name}</td>
      <td>{data.item}</td>
      <td style={{ color: invoiceStatus.color }}>{invoiceStatus.displayName}</td>
      <td>{getDisplayDate(data.due_date)}</td>
      <td>{data.invoice_amount}</td>
      <td>{data.due_amount}</td>
    </tr>
  )
}

