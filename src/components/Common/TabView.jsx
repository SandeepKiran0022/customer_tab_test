import React from 'react'
import { Nav, NavItem, NavLink, TabContent } from 'reactstrap'

export default class TabView extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: this.props.defaultTab
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      this.props.handleTabChange && this.props.handleTabChange(tab)
    }
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <Nav tabs>
        { Object.keys(this.props.tabs).map((key, i) =>
          <NavItem key={key}>
            <NavLink
              className={this.state.activeTab === key ? "active" : ""}
              onClick={() => { this.toggle(key) }}
            >
              {this.props.tabs[key]}
            </NavLink>
          </NavItem>
        )}
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          {this.props.children}
        </TabContent>
      </div>
    )
  }
}