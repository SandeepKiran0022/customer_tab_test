import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class VenuePhotosGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      photos: this.props.photos
    }
  }

  render() {
    return (
      <Modal className="NewTrainer" isOpen={this.props.isModalOpen} toggle={this.props.toggle} size="lg">
        <ModalHeader toggle={this.props.toggle}>{this.props.name} - Photos</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <img src="https://placeimg.com/640/480/arch/1" alt="venue" className="VenuePhoto"/>
            </div>
            <div className="col-md-6 col-sm-12">
              <img src="https://placeimg.com/640/480/arch/2" alt="venue" className="VenuePhoto"/>
            </div>
            <div className="col-md-6 col-sm-12">
              <img src="https://placeimg.com/640/480/arch/3" alt="venue" className="VenuePhoto"/>
            </div>
            <div className="col-md-6 col-sm-12">
              <img src="https://placeimg.com/640/480/arch/4" alt="venue" className="VenuePhoto"/>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
            <button disabled className="btn">Upload Photo</button>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}