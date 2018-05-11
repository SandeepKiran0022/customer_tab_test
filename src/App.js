import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as Cookies from 'js-cookie';
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import Coaching from './components/Coaching';
import PlayersList from './components/Players';
import Invoices from './components/Invoices';
import LoginModal from './components/Login';
import ComingSoon from './components/ComingSoon';
import Settings from './components/Settings';
import ShortcutHandler from './helper/ShortcutHandler'
import TrainersList from './components/Trainers';
import PaymentsList from './components/Payments';
import Venues from './components/Venues';
import Dashboard from './components/Dashboard';
import Loading from './components/Common/Loading';
import Subscriptions from './components/Subscriptions';
import { handleErrors } from './helper/errorHandler';
import { Account, Auth } from './helper/api'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: Cookies.get('isLoggedIn')
    }
  }

  componentWillMount() {
    if (this.state.isLoggedIn) {
      Account.get().then(({data}) => {
        this.setState({ user: data })
        window.me = data
      }).catch(err => handleErrors(this, err))
    }
  }

  render() {
    if (!this.state.isLoggedIn) {
      return <LoginModal setLoggedIn={(data) => {
        Cookies.set('isLoggedIn', true);
        this.setState({ user: data, isLoggedIn: true });
        window.me = data;
      }}/>
    }
    if (!this.state.user) {
      return <Loading/>
    }
    return (
      <div>
        <Router>
          <ShortcutHandler>
            <TopBar user={this.state.user}/>
            <div className="ContentPane d-flex">
              <SideBar />
              <div className="Content">
                <Route exact path="/" component={Dashboard} />
                <Route path="/venues" component={Venues} />
                <Route path="/trainers" component={TrainersList} />
                <Route path="/classes" component={Coaching} />
                <Route path="/plans" component={Coaching} />
                <Route path="/customers/:id(\d+)?" component={PlayersList} />
                <Route path="/enrollments/:id(\d+)?" component={Subscriptions} />
                <Route path="/invoices/:id(\d+)?" component={Invoices} />
                <Route path="/payments/:id(\d+)?" component={PaymentsList} />
                <Route path="/analytics" component={ComingSoon} />
                <Route path="/settings" component={Settings} />
                <Route path="/logout" component={logout.bind(this)} />
              </div>
            </div>
          </ShortcutHandler>
        </Router>
      </div>
    );
  }
}

export default App;

export const logout = () => {
  Auth.logout()
    .then(() => {
      Cookies.remove('isLoggedIn');
      window.me = undefined;
      window.currentOrg = undefined;
      window.location.pathname = '/';
      return null;
    })
    .catch(() => window.location.pathname = '/')
}
