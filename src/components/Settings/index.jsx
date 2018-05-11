import React, { Component } from "react";
import { TabPane } from "reactstrap";
import TabView from "../Common/TabView";
import Organization from './Organization';
import Invoice from './Invoice';
import Tax from './Tax';
import Account from './Account';
import {Setting} from '../../helper/api';
import "./Settings.css";
import Loading from '../Common/Loading';
import { handleErrors } from '../../helper/errorHandler';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUrl: "",
      address: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }
  handleChange(event) {
    var address = event.target.value;
    this.setState({ address });
  }
  handleFileChange(event) {
    var fileUrl = event.target.value;
    this.setState({ fileUrl });
  }
  componentWillMount() {
    if (!this.state.settings) {
      Setting.get().then(({data}) => this.setState({ 
        settings: data, 
      })).catch(err => handleErrors(this, err))
    }
  }
  render() {
    if (!this.state.settings) {
      return (
        <Loading/>
      );
    }
    return (
      <div className="settings">
        <TabView
          tabs={{
            organization: "Organization",
            invoice: "Invoice",
            tax: "Tax",
            account: "Account"
          }}
          defaultTab="organization"
        >
          <TabPane tabId="organization">
            <Organization data={this.state.settings}/>
          </TabPane>
          <TabPane tabId="invoice">
            <Invoice data={this.state.settings} />
          </TabPane>
          <TabPane tabId="tax">
            <Tax />
          </TabPane>
          <TabPane tabId="account">
            <Account />
          </TabPane>
        </TabView>
      </div>
    );
  }
}

export default Settings;
