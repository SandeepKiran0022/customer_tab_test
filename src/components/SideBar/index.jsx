import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './SideBar.css'

class SideBar extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  render() {
    return (
      <div className="SideBar">
        <div className="d-flex flex-column">
          <SideBarItem name="Dashboard" link="/" icon={'dashboard'} />
          <Separator />
          <SideBarItem name="Venues" link="/venues" icon={'location_on'} />
          <SideBarItem name="Trainers" link="/trainers" icon={'trainer'} />
          <SideBarItem name="Classes" link="/classes" icon={'class'} />
          <SideBarItem name="Plans" link="/plans" icon={'work'} />
          <SideBarItem name="Customers" link="/customers" icon={'person'} />
          <SideBarItem name="Enrollments" link="/enrollments" icon={'subscriptions'} />
          <SideBarItem name="Invoices " link="/invoices" icon={'receipt'} />
          <SideBarItem name="Payments" link="/payments" icon={'rupee'} />
          {/* <SideBarItem name="Analytics " link="/analytics" icon={'trending_up'} /> */}
          <Separator />
          <SideBarItem name="Settings " link="/settings" icon={'settings'} />
        </div>
      </div>
    );
  }
}

function SideBarItem(props) {
  let pathName = window.location.pathname;
  const active = (props.link === "/") ? (pathName === props.link) : pathName.startsWith(props.link);
  let icon
  switch(props.icon) {
    case 'rupee':
      icon = <span style={{ fontSize: '24px', padding: '15px' }}>&#8377;</span>
      break
    case 'trainer':
      icon = <img src="https://img.ontroapp.com/icons/trainer.png" style={{ padding: '10px', height: '44px', width: '44px' }} alt="trainer"/>
      break
    default:
      icon = <i className="material-icons">{props.icon}</i>
  }
  return (
    <Link to={props.link ? props.link : '#'} className={"item" + (active ? " active" : "")} style={props.style}>
      {icon}
      <span className="sidebar-item-name">{props.name}</span>
    </Link>
  )
}

function Separator() {
  return <div style={{ height: '2px', background: '#2C3E51' }}></div>
}

export default SideBar;