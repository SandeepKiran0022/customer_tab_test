import React from 'react'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import RecordPayment from './RecordPayment'
import { Invoices } from '../../helper/api'
import swal from 'sweetalert'
import Loading from '../Common/Loading'
import { InvoiceStatus } from '../../constants/InvoiceStatus'
import { handleErrors } from '../../helper/errorHandler';
import { getAPIBaseUrl } from '../../helper/utils';

export default class InvoiceDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isModalOpen: false,
      isDropDownOpen: false
    }
    this.toggleModal = this.toggleModal.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.voidInvoice = this.voidInvoice.bind(this);
    this.deleteInvoice = this.deleteInvoice.bind(this);
    this.printInvoice = this.printInvoice.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (parseInt(newProps.invoiceId, 10) !== this.state.invoice.id) {
      this.setState({ invoice: null })
      this.loadInvoice(newProps.invoiceId);
    }
  }
  
  componentWillMount() {
    this.loadInvoice(this.props.invoiceId);
  }

  loadInvoice(invoiceId) {
    Invoices.getInvoice(invoiceId, { include: 'html' })
      .then(({data}) => this.setState({ invoice: data }))
      .catch(err => handleErrors(this, err))
      .then(() => this.props.updateInvoiceChanges(this.state.invoice))
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  toggleDropDown() {
    this.setState({
      isDropDownOpen: !this.state.isDropDownOpen
    });
  }

  printInvoice() {
    let win = window.open(getAPIBaseUrl() + "/invoices/" + this.state.invoice.id + "?type=pdf", '_blank');
    win.focus();
  }

  voidInvoice() {
    swal({
      text: 'Are you sure that you want to void the invoice?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
        Invoices.void(this.state.invoice.id)
          .then(json => {
            swal({
              text: "Invoice Voided", 
              icon: "success"
            }).then(() => {
              this.loadInvoice(this.state.invoice.id)
            })
          }).catch(err => handleErrors(this, err))
      }
    })
  }

  deleteInvoice() {
    swal({
      text: 'Are you sure that you want to delete the invoice?',
      icon: "warning",
      dangerMode: true
    }).then(confirm => {
      if (confirm) {
        Invoices.delete(this.state.invoice.id)
          .then(json => {
            swal({
              text: "Invoice Deleted", 
              icon: "success"
            }).then(() => {
              this.props.closeDetail()
              this.props.refresh()
            })
          }).catch(err => handleErrors(this, err))
      }
    })
  }

  render() {

    if (!this.state.invoice) {
      return(
        <Loading/>
      )
    }

    let invoiceStatus = InvoiceStatus[this.state.invoice.status]

    return (
      <div>
        <div className="d-flex detail-action-bar">
          <span style={{ fontSize: '20px' }}>#{this.state.invoice.invoice_no}</span>
          <button className="btn btn-dark" style={{ marginLeft: 'auto' }} onClick={this.printInvoice}><span className="material-icons">file_download</span></button>
          <button className="btn btn-dark" onClick={this.printInvoice}><span className="material-icons">print</span></button>
          <button className="btn" onClick={this.toggleModal} {...(!this.state.invoice || !this.state.invoice.due_amount || this.state.invoice.status === 'void' ? {disabled: true} : {})}><span style={{ fontSize: '15px', padding: '2px', lineHeight: '1' }}>&#8377;</span> Record Payment</button>
          <RecordPayment invoice={this.state.invoice} isOpen={this.state.isModalOpen} toggle={this.toggleModal} className='RecordPayment' refresh={() => this.loadInvoice(this.state.invoice.id)}/>
          <Dropdown tag="span" isOpen={this.state.isDropDownOpen} toggle={this.toggleDropDown}>
            <DropdownToggle caret
              tag="button"
              className="btn"
              onClick={this.isDropDownOpen}
              data-toggle="dropdown"
              aria-expanded={this.state.isDropDownOpen}>
              More
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={this.voidInvoice}
                >
                Void
              </DropdownItem>
              <DropdownItem
                onClick={this.deleteInvoice}
                >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <button className="btn btn-light" onClick={this.props.closeDetail} ><span className="material-icons">close</span></button>
        </div>
        <div style={{ overflowY: 'auto', marginTop: '5px', paddingTop: '50px', backgroundColor: 'white', height: 'calc(100vh - 125px)'}}>
          <div style={{ position: 'relative' }}>
            <div style={{
              height: '119px',
              overflow: 'hidden',
              position: 'absolute',
              top: '-5px',
              left: '45px',
              fontSize: '14px'
            }}>
              <div style={{
                textAlign: 'center',
                top: '29px',
                left: '-35px',
                width: '150px',
                padding: '4px 4px 4px 8px',
                position: 'relative',
                transform: 'rotate(-45deg)',
                color: 'white',
                boxShadow: '0 0 10px -1px #888',
                backgroundColor: invoiceStatus.color
              }}>
                {invoiceStatus.displayName}
              </div>
            </div>
          <div id="invoice" dangerouslySetInnerHTML={{ __html: this.state.invoice.html }} style={{ boxShadow: '0 0 10px -1px #888', marginLeft: '50px', width: 'calc(100% - 100px)' }} />
          </div>
        </div>
      </div>
    )
  }
}