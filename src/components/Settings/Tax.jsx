import React, { Component } from "react";
import { TaxGroup } from "../../helper/api";
import "./Settings.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { TaxGroups, TaxPercentages } from '../../constants/taxes'
import swal from 'sweetalert';
import { handleErrors } from '../../helper/errorHandler';
import Loading from '../Common/Loading';

export default class Tax extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
    this.toggleModal = this.toggleModal.bind(this)
    this.refresh = this.refresh.bind(this)
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  componentWillMount() {
    this.refresh()
  }

  refresh() {
    TaxGroup.get()
      .then(({data}) => this.setState({ taxGroups: data.taxgroups }))
      .catch(err => handleErrors(this, err));
  }

  render() {
    if (!this.state.taxGroups) {
      return (
        <Loading/>
      );
    }
    return (
      <div>
        <div className="col-md-12 d-flex p-2 align-items-center justify-content-end">
          <button className="btn" onClick={this.toggleModal}>Create</button>
          <CreateOrEditTax isOpen={this.state.isModalOpen} toggle={this.toggleModal} refresh={this.refresh}/>
        </div>
        <table className="table table-light table-hover" style={{ margin: '0' }}>
            <thead>
              <tr>
                <th>Tax Name</th>
                <th>Taxes</th>
              </tr>
            </thead>
            <tbody>
              {this.state.taxGroups.map((taxGroup, index) => 
                <tr key={taxGroup.id}>
                  <td>{taxGroup.name}</td>
                  <td>
                    { taxGroup.taxes.map((tax, index) => <div>{`${tax.name} - ${tax.value}`}</div>) }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    );
  }
}

class CreateOrEditTax extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createOrEditTax() {
    let taxList = TaxGroups[this.state.type].taxes
    let taxes = []
    taxList.map((tax) => taxes.push({ name: tax, value: this.state.tax_percentage / taxList.length}))
    let data = {
      name: this.state.type,
      taxes
    }
    TaxGroup.create(data)
      .then(json => {
        swal({
          text: "Tax created succesfully", 
          icon: "success"
        }).then(() => {
          this.props.refresh()
          this.props.toggle()
        })
      })
      .catch(err => handleErrors(this, err));
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Create Tax</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="form-group col">
              <label className="col-form-label">Tax Type*</label>
              <select className="custom-select form-control"
                value={this.state.type}
                onChange={event => this.setState({ type: event.target.value })}>
                <option value="0">Select the tax type</option>
                {Object.keys(TaxGroups).map((type, index) => <option key={index} value={type}>{type} - {TaxGroups[type].description}</option>)}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label className="col-form-label">Tax Percentage*</label>
              <select className="custom-select form-control"
                value={this.state.tax_percentage}
                onChange={event => this.setState({ tax_percentage: event.target.value })}>
                <option value="0">Select the percentage</option>
                {TaxPercentages.map((percentage, index) => <option key={percentage} value={percentage}>{percentage}%</option>)}
              </select>
            </div>    
          </div>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "flex-end" }}>
          <button className="btn"
            {...((this.state.type && this.state.tax_percentage) ? {} : {disabled: true})}
            onClick={this.createOrEditTax.bind(this)}>
            Create
          </button>
          <button className="btn" onClick={this.props.toggle}>
            Cancel
          </button>
        </ModalFooter>
      </Modal>
    );
  }
}