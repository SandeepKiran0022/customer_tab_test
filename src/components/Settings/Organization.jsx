import React, { Component } from "react";
import {Setting} from "../../helper/api";
import FileUploader from "../Common/FileUploader/FileUploader";
import "./Settings.css";
import swal from 'sweetalert';
import * as Color from '../../constants/colors'
import Address from "../Common/Address"
const ORG_IMAGE="https://img.ontroapp.com/default/organization.png";

class Organization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileUrl: "",
      address: props.data.address,
      fee: props.data.registration_fee,
      bill_cycle_mode: props.data.bill_cycle_mode,
      bill_day: props.data.bill_day,
      is_prorate: props.data.is_prorate,
      key:"",
      image: props.data.logo === "" ?ORG_IMAGE :props.data.logo,
      status:'Change Picture',
      isUploading:false,
      toggleIcon:false,
      error:''
      
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave=()=>{
    this.setState({toggleIcon:true})
    if(!this.state.isUploading){
      var formData={
        logo:this.state.key,
        address:this.state.address,
        registration_fee:this.state.fee
      };
      Setting.patch(formData).then(response=>{
        window.location.reload()
      }).catch(error => swal("ooh!", error, "error"))
    }
  }

  handleFileChange(isUploading,key,error){
    this.setState({isUploading,key,error});
    if(error)
      swal("ooh!", error, "error")
  }
  
  render() {
    
    return (
      <div
        className="Invoice"
        style={{ paddingTop: "20px", width: '100%' }}
      >
        <form>
          <div className="row">
            <div className="form-group col-md-6 col-sm-12">
              <label className="col-form-label">Organization Logo</label>
              <FileUploader defaultImage={this.state.image} onChange={this.handleFileChange}/>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form-group">
                <label className="col-form-label">
                  Organization Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={window.currentOrg && window.currentOrg.name}
                  readOnly
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="col-form-label">
                  Address
                </label>
                <Address value={this.state.address} onChange={address => this.setState({ address })} />
              </div>
            </div>
          </div>
          <h2 style={{ color: Color.primary }}>Billing Information</h2>
          <div className="form-row">
            <div className="form-group col-md-6 col-sm-12">
              <label className="col-form-label">
                Onetime Registration Fee
              </label>
              <input
                className="form-control"
                type="text"
                value={this.state.fee}
                onChange={event => this.setState({ fee: event.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6 col-sm-12">
              <label className="col-form-label">
                Billing Mode
              </label>
              <input
                className="form-control"
                type="text"
                value={this.props.data.bill_cycle_mode === 'standard' ? 'Standard' : 'Calender'}
                readOnly
                disabled
              />
            </div>
            <div className="form-group col-md-6 col-sm-12">
              <label className="col-form-label">
                Billing Day
              </label>
              <input
                className="form-control"
                type="text"
                value={this.props.data.bill_day}
                readOnly
                disabled
              />
            </div>
            <div className="form-group col-md-6 col-sm-12">
              <label className="col-form-label">
                Prorate Invoices
              </label>
              <input
                className="form-control"
                type="text"
                value={this.props.data.is_prorate ? "Enabled" : "Disabled"}
                readOnly
                disabled
              />
            </div>
          </div>
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

export default Organization;
