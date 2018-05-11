import React from 'react'
import * as Colors from '../../constants/colors'

/**
 * data - { m: "Male", f: "Female" }
 * multiple - true / false (default)
 * selected (string|array) - "key" -or- ["key1", "key2"]
 * label - "Gender" (optional)
 * onSelect(arr, key) - Function param 1.array of selected keys, 2. last clicked key
 */
export default class RadioGroup extends React.Component {

  constructor(props) {
    super(props);
    this.handleActive = this.handleActive.bind(this);

    this.handleActive(this.props);

    this.handleClick = this.handleClick.bind(this);
    this.style.itemActive = { ...this.style.item, fontWeight: 'bold', color: Colors.primary }
  }

  componentWillReceiveProps(newProps) {
    this.handleActive(newProps);
  }

  handleActive(props) {
    var active = [];
    if (typeof props.selected === 'string')
      active = [props.selected]
    else if (props.selected instanceof Array)
      active = props.selected
    
    if (this.state) {
      this.setState({ active })
    } else {
      this.state = { active }
    }
  }

  style = {
    label: {
      // color: 'grey',
      padding: '10px 10px 10px 0',
    },
    item: {
      color: 'black',
      padding: '7px',
      cursor: 'pointer',
    },
  }

  handleClick(key) {
    if (this.props.disabled) {
      return
    }
    var active = this.state.active;
    if (this.props.multiple) {
      if (active.indexOf(key) !== -1)
        active = active.filter(e => e !== key)
      else
        active.push(key)
    } else {
      active = [key];
    }
    this.setState({ active });

    if (this.props.onSelect)
      this.props.onSelect(active, key);
  }

  render() {

    const label = this.props.label && <span style={this.style.label}>{this.props.label}</span>;

    const items = this.props.data && Object.keys(this.props.data).map((key, i) => {
      return <span key={i} style={this.state.active.indexOf(key) !== -1 ? this.style.itemActive : this.style.item} onClick={() => this.handleClick(key)}>{this.props.data[key]}</span>
    })

    return (
      <div style={this.props.style} className={this.props.className}>{label}{items}</div>
    );
  }
}