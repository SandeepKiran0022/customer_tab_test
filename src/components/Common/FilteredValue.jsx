import React from 'react'
import * as Colors from '../../constants/colors';
import { addOrRemoveUrlParameter } from '../../helper/utils';
import { withRouter } from 'react-router-dom';

class FilteredValue extends React.PureComponent {
  handleClose() {
    let url = window.location.pathname + window.location.search
    if (this.props.param instanceof Array) {
      this.props.param.forEach((p, i) => url = addOrRemoveUrlParameter(p, '', url))
    } else {
      url = addOrRemoveUrlParameter(this.props.param, '', url)
    }
    this.props.history.push(url)
  }
  render() {
    return (
      <span style={{marginBottom: '5px',paddingRight:'10px', display: 'inline-block'}}>
        <span style={{ backgroundColor: Colors.primary, color: 'white', padding: '5px',borderBottomLeftRadius:'10px',borderTopLeftRadius:'10px',borderRight:'0px'}}>
          {this.props.filter} : {this.props.value}
        </span>
        <span style={{backgroundColor: Colors.primary, color: 'white',  padding: '5px', cursor: 'pointer',borderBottomRightRadius:'10px',borderTopRightRadius:'10px',borderLeft:'0px'}}
          onClick={this.handleClose.bind(this)}>
          X
        </span>
      </span>
    )
  }
}

export default withRouter(FilteredValue)