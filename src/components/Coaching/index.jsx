import React, { Component } from 'react';
import { Classes, Plans } from '../../helper/api'
import CoachingItem from './CoachingItem'
import './Coaching.css'
import Loading from '../Common/Loading';
import NewCoaching from './NewCoaching'
import { getUrlParameter } from '../../helper/utils';
import FilteredValue from '../Common/FilteredValue'

export default class Coaching extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      search: getUrlParameter("search")
    }

    this.isCoaching = props.match.url.startsWith('/classes');
    this.cloneCoaching = this.cloneCoaching.bind(this)
    this.editCoaching = this.editCoaching.bind(this)
  }

  componentWillMount() {
    this.refresh();
  }

  refresh() {
    this.setState({ classes: null })
    let api = this.isCoaching ? Classes : Plans;
    api.get(this.state.search).then(({ data }) => this.setState({ classes: data }))
  }

  componentWillReceiveProps(newProps) {
    this.setState({ 
      search: getUrlParameter("search")
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.search !== prevState.search) {
      this.refresh()
    }
  }


  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
      coachingId: null,
      coaching: null
    });
  }

  cloneCoaching(coaching) {
    this.setState({
      coaching,
      coachingId: null,
      isModalOpen: true
    })
  }

  editCoaching(coaching) {
    this.setState({
      coaching,
      coachingId: coaching.id,
      isModalOpen: true
    })
  }

  render() {

    if (!this.state.classes) {
      return (
        <Loading/>
      );
    }

    const addText = this.isCoaching ? '+ Add Class' : '+ Add Plan';

    return (
      <div className="Coaching" >
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex p-2 align-items-center justify-content-start">
            {this.state.search && <FilteredValue filter={(this.isCoaching ? "Class" : "Plan") + " Name"} value={this.state.search} param="search"/> }
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button className="btn" onClick={this.toggleModal.bind(this)}>{addText}</button>
            <NewCoaching 
              coachingId={this.state.coachingId}
              coaching={this.state.coaching}
              isModalOpen={this.state.isModalOpen} 
              toggle={this.toggleModal.bind(this)} 
              refresh={this.refresh.bind(this)} 
              isCoaching={this.isCoaching}/>
          </div>
        </div>
        <div className="row" style={{ margin: '0px', marginTop: '5px'}}>
          { this.state.classes.map((clazz, index) => 
              <CoachingItem 
                key={clazz.id} 
                clazz={clazz} 
                refresh={this.refresh.bind(this)} 
                cloneCoaching={this.cloneCoaching}
                editCoaching={this.editCoaching}/>)}
        </div>
        {this.state.classes.length === 0 && (
          <div
            className="d-flex align-items-center justify-content-center p-4"
            style={{ backgroundColor: "white", fontSize: "25px" }}
          >
            There are no {this.isCoaching ? 'Classes' : 'Plans'}...!
          </div>
        )}
      </div>
    );
  }
}