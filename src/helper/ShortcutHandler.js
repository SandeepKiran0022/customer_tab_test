import { withRouter } from 'react-router';
import React, { Component } from 'react';
import { Shortcuts, ShortcutManager } from 'react-shortcuts'
import keymap from './keymap';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import * as Cookies from 'js-cookie';

const shortcutManager = new ShortcutManager(keymap)
const actionVsPath = {
  DASHBOARD: '/',
  VENUES_LIST: '/venues',
  TRAINERS_LIST : '/trainers',
  CLASSES_LIST : '/classes',
  PLANS_LIST : '/plans',
  CUSTOMERS_LIST : '/customers',
  ENROLLMENTS_LIST : '/enrollments',
  PAYMENTS_LIST : '/payments',
  INVOICES_LIST : '/invoices',
  ANALYTICS : '/sales',
  SETTINGS : '/settings'
}

class ShortcutHandler extends Component {
  getChildContext() {
    return { 
      shortcuts: shortcutManager
    }
  }

  shortcutHandler(action, event) {
    if (action === 'CHANGE_BASE_URL') {
      swal({
        content: {
          element: "input",
          attributes: {
            value: Cookies.get('ontro-biz-base-url') || ''
          },
        },
      }).then((input) => {
        input ? Cookies.set('ontro-biz-base-url', input) : Cookies.remove('ontro-biz-base-url')
        window.location.reload()
      })
    } else {
      this.props.history.push(actionVsPath[action]);
    }
  }

  render() {
    return (
      <Shortcuts name='App' handler={this.shortcutHandler.bind(this)} isolate={true}>
        {this.props.children}
      </Shortcuts>
    )
  }

}

ShortcutHandler.childContextTypes = {
  shortcuts: PropTypes.object.isRequired
}

export default withRouter(ShortcutHandler);