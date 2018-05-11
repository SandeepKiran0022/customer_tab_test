import React, { Component } from "react";
import {Setting} from "../../helper/api";
import "./Settings.css";
import { handleErrors } from "../../helper/errorHandler";

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remNo: 1,
      data:props.data,
      toggleIcon:false,
    };
    // this.reminder = this.reminder.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave=()=>{
    this.setState({toggleIcon:true})
    var formData={
      invoice_prefix: this.state.data.invoice_prefix,
      invoice_next_no: this.state.data.invoice_next_no,
      invoice_terms: this.state.data.invoice_terms
    };
    Setting.patch(formData)
    .then(response=>{
      window.location.reload()
    })
    .catch(error => {
      this.setState({toggleIcon:false})
      handleErrors(this, error)
    })
  }

  reminder = () => {
    var reminderList = [];
    for (let i = 1; i <= this.state.remNo; i++) {
      reminderList.push(
        <Reminder key={i}
          last={i}
          remNo={this.state.remNo}
          onClick={remNo => this.setState({ remNo })}
        />
      );
    }
    return reminderList;
  };
  render() {
    return (
      <div
        className="Invoice"
        style={{ width: "100%", paddingTop: "20px" }}
      >
        <form>
          <div className="form-row">
            <div className="form-group col">
              <label>Invoice Prefix</label>
              <input
                type="text"
                className="form-control"
                placeholder="Prefix"
                value={this.state.data.invoice_prefix}
                onChange={(event)=>{this.setState({data:Object.assign({},this.state.data,{invoice_prefix:event.target.value})})}}
              />
            </div>
            <div className="form-group col">
              <label>Next Invoice Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Number"
                value={this.state.data.invoice_next_no}
                onChange={(event)=>{this.setState({data:Object.assign({},this.state.data,{invoice_next_no:event.target.value})})}}
              />
            </div>
          </div>
          {/* {this.reminder()} */}
          <div className="form-row">
            <div className="form-group col">
              <label htmlFor="">Invoice Terms</label>
              <textarea
                className="form-control"
                name="invoiceTerms"
                id="invoiceTerms"
                cols="120"
                rows="5"
                value={this.state.data.invoice_terms}
                onChange={(event)=>{this.setState({data:Object.assign({},this.state.data,{invoice_terms:event.target.value})})}}
              />
            </div>
          </div>
          {/* <div className="form-row">
            <div className="form-group col">
              <label htmlFor="">Reminder Message</label>
              <textarea
                className="form-control"
                name="reminderMsg"
                id="reminderMsg"
                cols="150"
                rows="5"
              />
            </div>
          </div> */}
          <div className="form-row d-flex justify-content-end">
            <button type='button' className="btn" onClick={this.handleSave} >
              Save  
              {this.state.toggleIcon === true  && 
              <img src="https://img.ontroapp.com/default/loader-15.svg" alt=''/>
              }
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function Reminder(props) {
  return (
    <div className="form-row">
      <div className="form-group col">
        <label htmlFor="">Reminder {props.remNo}</label>
      </div>
      <div className="form-group col">
        <div className="form-row">
          <div className="form-group col">
            <input
              type="text"
              className="form-control"
              style={{ width: "100px" }}
            />
          </div>
          <div className="form-group col">
            <div>
              {props.remNo === props.last && <AddReminder {...props} />}
              {props.remNo !== 1 && <RemoveReminder {...props} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddReminder(props) {
  return (
    <span 
      style={{ fontSize: "20px", color: "#800",cursor:'pointer' }}
      onClick={() => {
        var remNo = props.remNo + 1;
        props.onClick(remNo);
      }}
    >
      <i className="material-icons">add_alert</i>
    </span>
  );
}

function RemoveReminder(props) {
  return (
    <span
      style={{ fontSize: "20px", color: "#800",cursor:'pointer' }}
      onClick={() => {
        var remNo = props.remNo - 1;
        props.onClick(remNo);
      }}
    >
      <i className="material-icons">delete</i>
    </span>
  );
}
export default Invoice;
