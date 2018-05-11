import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import './Address.css'

class Address extends Component {

  constructor(props) {
    super(props);
    this.state = {
      place_id: '',
      formatted_address: '',
      lat: 0,
      lng: 0,
      pincode: '',
      country: '',
      state: '',
      city: '',
      area: '',
      sub_area: '',
    }
  }

  componentWillMount() {
    if (this.props.value)
      this.setState(this.props.value)
  }

  onSuggestSelect = (data) => {
    if (!data)
      return;

    let state = Object.assign({}, this.state, {
      place_id: data.placeId,
      formatted_address: data.gmaps.formatted_address,
      lat: data.location.lat,
      lng: data.location.lng,
      pincode: '',
      country: '',
      state: '',
      city: '',
      area: '',
      sub_area: '',
    });
    let street = {};
    data.gmaps.address_components.forEach(addr => {
      if (addr.types.indexOf('postal_code') !== -1)
        state.pincode = addr.long_name
      if (addr.types.indexOf('country') !== -1)
        state.country = addr.long_name
      else if (addr.types.indexOf('administrative_area_level_1') !== -1)
        state.state = addr.long_name
      else if (addr.types.indexOf('locality') !== -1)
        state.city = addr.long_name
      else if (addr.types.indexOf('sublocality_level_1') !== -1)
        state.area = addr.long_name
      else if (addr.types.indexOf('sublocality_level_2') !== -1)
        street.sub_area = addr.long_name
      else if (addr.types.indexOf('premise') !== -1)
        street.premise = addr.long_name
      else if (addr.types.indexOf('street_number') !== -1)
        street.street_number = addr.long_name
      else if (addr.types.indexOf('route') !== -1)
        street.route = addr.long_name
    });
    state.street = '' +
                  (street.premise ? (street.premise + ', ') : '') +
                  (street.street_number ? (street.street_number + ', ') : '') +
                  (street.route ? (street.route + ', ') : '') +
                  (street.sub_area ? street.sub_area : '')
    this.setState(state)

    if (this.props.onChange)
      this.props.onChange(state)
  }

  handleInput = event => {
    let state = Object.assign({}, this.state, { [event.target.name]: event.target.value })
    this.setState(state);
    if (this.props.onChange)
      this.props.onChange(state)
  }

  render() {
    return (
      <div className="ontro-address">

        <div className="row">
          <div className="col-md-12">
            <div className="form-group">
              <label>Search Place</label>
              <Geosuggest initialValue={this.state.formatted_address} inputClassName="form-control" onSuggestSelect={this.onSuggestSelect} renderSuggestItem={SuggestionItem} />
            </div>
          </div>
        </div>

        {this.state.place_id &&
          <div className="row">

            <div className="col-md-12">
              <div className="form-group">
                <label>Door no &amp; Street name</label>
                <input type="text" name="street" className="form-control"
                  value={this.state.street}
                  onChange={this.handleInput} />
              </div>
            </div>

            <div className="col-sm-4">
              <div className="form-group">
                <label>Area</label>
                <input type="text" name="area" className="form-control"
                  value={this.state.area}
                  onChange={this.handleInput} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" className="form-control"
                  value={this.state.city}
                  onChange={this.handleInput} />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" className="form-control"
                  value={this.state.pincode}
                  onChange={this.handleInput} />
              </div>
            </div>

          </div>
        }

      </div>
    )
  }
}


const SuggestionItem = (data) => {
  // matchedSubstrings: {length: 5, offset: 0}
  let splitIndex = data.label.indexOf(',')
  let mainText = data.label.substr(0, splitIndex)
  let subText = data.label.substr(splitIndex)
  return (
    <div>
      <i className="material-icons suggestion-icon">location_on</i>
      <span>{mainText}</span><small>{subText}</small>
    </div>
  )
}


export default Address;