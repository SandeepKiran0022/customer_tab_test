import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Dropdown, DropdownToggle } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as Cookies from 'js-cookie';
import * as Color from '../../constants/colors'
import { getUrlParameter, addOrRemoveUrlParameter } from '../../helper/utils'
import './TopBar.css'

class TopBar extends Component {

  constructor(props) {
    super(props);
    this.currentOrgId = this.props.user.organizations[0].id
    this.currentOrgName = this.props.user.organizations[0].name

    let currentOrgFromCookie = Cookies.get('current-ontro-org');
    if (currentOrgFromCookie) {
      this.currentOrgId = parseInt(currentOrgFromCookie, 10)
    }

    let currentOrg = this.props.user.organizations.filter(organization => organization.id === this.currentOrgId)[0]
    if (!currentOrg) {
      currentOrg = this.props.user.organizations[0]   
    }
    this.currentOrgId = currentOrg.id
    this.currentOrgName = currentOrg.name
    window.currentOrg = currentOrg
    Cookies.set('current-ontro-org', this.currentOrgId)
    
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      searchText: getUrlParameter('search')
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      searchText: getUrlParameter('search')
    })
  }

  handleOrgChange(orgID) {
    Cookies.set('current-ontro-org', orgID)
    window.location.reload();
    window.location.pathname = '/'
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  render() {
    let placeholder="Search";
    if(window.location.pathname.match("players")){
      placeholder="Search by Name/Mobile"
    };
    if(window.location.pathname.match("invoices")){
      placeholder="Search by Inv.No/Name/Mobile"
    };
    if(window.location.pathname.match("payments")){
      placeholder="Search by Inv.No/Name"
    }
    if(window.location.pathname.match("enrollments")){
      placeholder="Search by Customer Name"
    }
    return (
      <div className="TopBar d-flex align-items-center p-2" style={{ height: '50px' }} >
        <span className="logo" style={{ color: Color.primary }}>ontro</span>
        <div style={{ width: '300px', marginRight: 'auto', marginLeft: '0px' }}>
        <div className="input-group">
          <span className="input-group-addon" id="search" 
            style={{ padding: '0', backgroundColor: 'white', borderBottomLeftRadius: '20px', borderTopLeftRadius: '20px', borderRight: '0' }}>
            <i className="material-icons">search</i>
          </span>
          <input type="text" className="form-control" placeholder={placeholder}
            value={this.state.searchText}
            onChange={event => this.setState({ searchText: event.target.value })}
            onKeyPress={event => {
              if (event.which === 13) {
                this.props.history.push(addOrRemoveUrlParameter("search", this.state.searchText))
              }
            }}
            style={{ borderBottomRightRadius: '20px', borderTopRightRadius: '20px', borderLeft: '0', boxShadow: 'none' , borderColor: '#ccc' }}/>
        </div>
        </div>
        <span className="org-name">{this.currentOrgName}</span>
        <i className="material-icons">notifications</i>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret 
            tag="div"
            onClick={this.toggle}
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}>
            <img src={this.props.user.image || "https://img.ontroapp.com/default/user.png"} alt="user" style={{ border: '1px solid gray', borderRadius: '50%', height: '45px', width: '45px' }}/>
          </DropdownToggle>
        </Dropdown>
        <div className={"flyout" + (this.state.dropdownOpen ? " show" : "") }>
          <div className="d-flex flex-column">
            <div style={{ backgroundColor: '#E0E0E0' }}>
              <div className="d-flex align-items-center justify-content-center">
                <img src={this.props.user.image || "https://img.ontroapp.com/default/user.png"} alt="user" style={{ border: '1px solid gray', borderRadius: '50%' , margin: '20px', height: '100px', width: '100px' }}/>
              </div>
              <div className="d-flex justify-content-center p-1">
              {this.props.user.name} (User ID : {this.props.user.id})
              </div>
              <div className="d-flex justify-content-center p-1">
                {this.props.user.email}
              </div>
              <div style={{ padding: '10px' }}>
                <div className="d-flex align-items-center justify-content-center">
                <Link to="/settings" style={{ textDecoration: 'none', color: 'black' }}>
                    Settings
                </Link>
                &nbsp;|&nbsp;
                <Link to="/logout" style={{ textDecoration: 'none', color: Color.primary }}>
                    Logout
                </Link>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center p-2">
              Organizations
            </div>
            { this.props.user.organizations.map((organization, index) => 
              <div 
                key={organization.id} 
                className={"flyout-org" + (organization.id === this.currentOrgId ? " current" : "") }
                onClick={() => this.handleOrgChange(organization.id)}>
                {organization.name}
              </div>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TopBar);