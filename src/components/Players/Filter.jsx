import React, { Component } from 'react';
import { FormGroup, Input } from 'reactstrap';
import './Players.css'

export default class Filter extends Component {
  render() {
    return (
      <FormGroup>
        <Input type="select" className="custom-select"
        value={this.props.selectedOption !== undefined ? this.props.selectedOption : ""}
        onChange={this.props.onFilter}>
          <option value="" disabled>{this.props.placeHolder}</option>
          { this.props.options.map((item, index) => <option key={index} value={item}>{item}</option> ) }
        </Input>
      </FormGroup>
    );
  }
}