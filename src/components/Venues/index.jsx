import React, { Component } from 'react';
import { Arenas } from '../../helper/api';
import './venues.css';
import './Photos'
// import VenuePhotosGrid from './Photos'
import Loading from '../Common/Loading';
import { getUrlParameter } from '../../helper/utils';
import FilteredValue from '../Common/FilteredValue'
import { handleErrors } from '../../helper/errorHandler';

export default class VenuesList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isModalOpen: false,
      search: getUrlParameter("search")
    }
  }

  componentWillMount() {
    this.refresh()
  }

  refresh() {
    this.setState({ venues: null })
    Arenas.get(this.state.search)
      .then(({data}) => this.setState({ venues: data}))
      .catch(err => handleErrors(this, err))
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

  render() {

    if (!this.state.venues) {
      return (
        <Loading/>
      );
    }

    return (
      <div>
        {this.state.search && 
          <div className="d-flex p-2 align-items-center justify-content-start">
            <FilteredValue filter="Venue Name" value={this.state.search} param="search"/>
          </div>
        }
        <div className="row" style={{ margin: '0px'}}>
          { this.state.venues.map((venue, index) => <Venue key={venue.id} venue={venue}/>)}
        </div>
      </div>
    );
  }
}

class Venue extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      isPhotosModalOpen: false
    }
  }

  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }

  render() {
    return(
      <div className="col-md-3 col-sm-6 col-xs-12" style={{padding: '5px'}}>
        <div className="Venue">
          <div className="col-12 title" style={{ padding: '5px'}}>
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="material-icons">location_on</i> {this.props.venue.name}
            </div>
          </div>
          <div className="col-12" style={{ padding: '10px', marginLeft: '20px'}}>
            <div className="d-flex flex-row align-items-center justify-content-start">
              {this.props.venue.address} <br/> {this.props.venue.pincode}
            </div>
          </div>
          <div className="col-12" style={{ padding: '10px', marginLeft: '20px'}}>
            <div className="d-flex flex-row align-items-center justify-content-start">
              Address: <br />{this.props.venue.address_text || '-'}
            </div>
          </div>
          <div className="col-12" style={{ padding: '10px', marginLeft: '20px'}}>
            <div className="d-flex flex-row align-items-center justify-content-start">
              Amenities: {this.props.venue.amenities || '-'}
            </div>
          </div>
          {/* <div className="row">
            <button className="btn" onClick={this.toggleModal.bind(this)}>View Photos</button>
            <VenuePhotosGrid isModalOpen={this.state.isModalOpen} toggle={this.toggleModal.bind(this)} name={this.props.venue.name} photos={this.props.venue.photos}/>
          </div> */}
        </div>
      </div>
    )
  }
}