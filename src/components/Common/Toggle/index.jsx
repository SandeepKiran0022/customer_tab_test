import React from 'react'
import './toggle.css'

export default class Toggle extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      checked: this.props.checked
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      checked: newProps.checked
    });
  }

  toggle() {
    let newState = !this.state.checked
    this.setState({
      checked: newState
    });
    this.props.onToggle(newState)
  }

  render() {
    return (
      <div className="d-flex align-items-center justify-content-start">
        { this.props.label &&
          <div style={{ paddingRight: '10px' }}>{this.props.label}</div>
        }
        <div className="toggle">
          <input type="checkbox" name="toggle" className="toggle-checkbox" id="toggle" checked={this.state.checked}/>
          <label className="toggle-label" htmlFor="toggle" onClick={this.toggle} style={{ marginBottom: '0' }}>
            <span className="toggle-inner"></span>
            <span className="toggle-switch"></span>
          </label>
        </div>
      </div>
    )
  }
}