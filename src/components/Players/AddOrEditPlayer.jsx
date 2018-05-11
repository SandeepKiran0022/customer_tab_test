import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import swal from 'sweetalert';
import './Players.css'
import { Players } from '../../helper/api'
import RadioGroup from '../Common/RadioGroup';
import { getTodayDate } from '../../helper/utils';
import Toggle from '../Common/Toggle';
import FileUploader from '../Common/FileUploader/FileUploader';
import Address from '../Common/Address';
import { handleErrors } from '../../helper/errorHandler';

const DEFAULT_USER_IMG="https://img.ontroapp.com/default/user.png";
export default class AddOrEditPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isExistingUser: false,
      editMode:false,
      player: {
        doj: getTodayDate(),
        registration_fee: (window.currentOrg && window.currentOrg.registration_fee) || 0
      },
      isUploading:false,
      key:'',
      error:'',
      isFetching:false
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.searchUser = this.searchUser.bind(this);
  }
  
  componentWillReceiveProps(newProps) {
    if (newProps.isModalOpen) {
      this.setState({
        isExistingUser: false,
        editMode:false,
        player: {
          doj: getTodayDate(),
          registration_fee: (window.currentOrg && window.currentOrg.registration_fee) || 0
        },
        isUploading:false,
        key:'',
        error:'',
        isFetching:false
      })
      newProps.player && this.setState({player:newProps.player,editMode:true});
    }
  }

  searchUser() {
    this.setState({isFetching:true});
    Players.getPublicDetail(this.state.player.mobile)
      .then(({data}) => {
        if (!!data.user_id) {
          this.setState({
            isExistingUser: true, 
            player: Object.assign({}, data, { 
              doj: this.state.player.doj,
              registration_fee: this.state.player.registration_fee
            }),
          })
        } else {
          this.handleSearchedUserNotFound();
        }
        //this.setState({isFetching:false});
      })
      .catch(error => {
        if(error.response.status === 400 || 404)
          this.handleSearchedUserNotFound(error.response.data);
      });
  }

  // TODO: yet to handle this for trainer
  handleSearchedUserNotFound = (data) => {
    let text = !!data && !!data.message ? data.message : "User doesn't have Ontro #ID. Please fill all the details.";
    this.setState({ isExistingUser: false })
    swal({ text, icon: "warning" })
  }

  handleFileChange(isUploading,key,error){
    this.setState({isUploading,key,error});

    this.setState({ player: Object.assign({}, this.state.player, { image: key}) });
    if(error !== '' && error !== null)
      swal("ooh!", error, "error")
  }

  addPlayer() {
    let data = this.state.player;
    if (this.state.isExistingUser) {
      data = {
        user_id: this.state.player.user_id,
        doj: this.state.player.doj,
        registration_fee: this.state.player.registration_fee
      }
    }
    Players.create(data).then(() => swal({
      text: "Customer added successfully",
      icon: "success"
    }).then(() => {
      this.setState({
        isExistingUser: false,
        player: {
          doj: getTodayDate(),
          registration_fee: (window.currentOrg && window.currentOrg.registration_fee) || 0
        }
      })
      this.props.toggle()
      this.props.refresh(data.user_id)
    })).catch(err => handleErrors(this, err))
  }

  editPlayer(){
    let data = this.state.player;
    data= Object.assign({}, this.state.player, { user_id: data.id });
    Players.edit(data).then(response =>{
      this.setState({
        player:response.data
      });
      
    }
  ).then(()=>swal({text: "Customer edited successfully",
  icon: "success"}).then(()=>{
    this.props.toggle();
    this.props.refresh(data.id);
    })).catch(err => handleErrors(this, err));
  }
  render() {
    let disabled = this.state.isExistingUser ? {disabled: true} : {};
    let editMode = this.state.editMode;
    return (
      <Modal isOpen={this.props.isModalOpen} toggle={this.props.toggle} size="lg">
        <ModalHeader toggle={this.props.toggle}>{editMode? 'Edit' : 'Add'} Customer</ModalHeader>
        <ModalBody>
        <form className="NewPlayer">
          <h4>Customer Details</h4>
          <div className="row">
            <div className="col-md-9">
              <div className="form-group">
                <input className="form-control" placeholder={!this.state.editMode?`Enter Mobile Number to search`:`Enter Mobile Number`} 
                ref="mobile"
                value={this.state.player.mobile}
                onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { mobile: event.target.value || null }) }) }/>
                <label><small>This number will be used to uniquely identify an user</small></label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
               {!editMode ?  (<button type="button" className="btn" 
                onClick={this.searchUser}
                style={{ width: '100%' }}
                {...(!this.state.player.mobile || this.state.player.mobile === "" ? {disabled: true} : {})}>Search Player</button>)
                :``}
                </div>
            </div>
          </div>

          <div className="row">
          <div className="col-md-4">
             <div className="form-group">
                <label>Profile Picture</label>
                
                <FileUploader name='image' defaultImage={this.state.player.image? this.state.player.image:DEFAULT_USER_IMG} style={{width:'170px',height:'170px'}}
                isFetching={this.state.isFetching}
                onChange={this.handleFileChange} {...disabled}/>
             </div>
          </div>
            <div className="col-md-8">
              <div className="row" style={{ margin: '0' }}>
                <div className="form-group col-12">
                  <label>Name*</label>
                  <input type="text" name="player_name" className="form-control"
                  ref="name"
                  {...disabled}
                  value={this.state.player.name}
                  onChange={ event =>this.setState({ player: Object.assign({}, this.state.player, { name: event.target.value }) }) }/>
                </div>
                <div className="form-group col-12">
                  <label>Notification Mobile Number*</label><br/>
                  { this.state.player.mobile && 
                      <label 
                        onClick={() => this.setState({ player: { ...this.state.player, mobile_alternate: this.state.player.mobile } })}
                        style={{ color: 'blue' }}>
                        <small>Copy Primary Mobile Number</small>
                      </label> 
                  }
                  <input name="secondary_mobile" className="form-control" {...disabled} 
                    value={this.state.player.mobile_alternate}
                    onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { mobile_alternate: event.target.value }) }) }/>
                  <label><small>This number will be used to send SMS notifications</small></label>
                </div>
                <div className="form-group col-md-6 col-sm-12">
                  <label>Gender*</label>
                  <select className="custom-select form-control"
                    {...disabled}
                    value={this.state.player.gender}
                    onChange={event => this.setState({ player: Object.assign({}, this.state.player, { gender: event.target.value }) })}>
                    <option value="">Select the gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Transgender</option>
                  </select>
                </div>
                <div className="form-group col-md-6 col-sm-12">
                  <label>Email</label>
                  <input type="text" name="email" className="form-control"
                  ref="email"
                  {...disabled}
                  value={this.state.player.email}
                  onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { email: event.target.value || null }) }) }/>
                </div>
                <div className="form-group col-md-6 col-sm-12">
                  <label>DOB*</label>
                  <input type="date" name="dob" className="form-control"
                    ref="dob"
                    {...disabled}
                    value={this.state.player.dob}
                    onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { dob: event.target.value }) }) }/>
                </div>
                <div className="form-group col-md-6 col-sm-12">
                  <div className="form-group">
                    <label>Date Of Joining*</label>
                    <input type="date" name="doj" className="form-control"
                    ref="doj"
                    value={this.state.player.doj}
                    onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { doj: event.target.value }) }) }/>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* <div className="d-flex flex-row align-items-center justify-content-start" style={{ padding: '20px' }}>
            Sport:
            <div style={{ padding: '10px' }}>
              <img src="/images/sports/cricket.png" alt="Cricket" height="30px" width="30px"/>
            </div>
            <div style={{ padding: '10px' }}>
              <img src="/images/sports/tennis.png" alt="Tennis" height="30px" width="30px"/>
            </div>
            <div style={{ padding: '10px' }}>
              <img src="/images/sports/basketball.png" alt="Basketball" height="30px" width="30px"/>
            </div>
            <div style={{ padding: '10px' }}>
              <img src="/images/sports/badminton.png" alt="Badminton" height="30px" width="30px"/>
            </div>
            <div style={{ padding: '10px' }}>
              <img src="/images/sports/volleyball.png" alt="Volleyball" height="30px" width="30px"/>
            </div>
            <div style={{ padding: '10px' }}>
              <img src="/images/sports/football.png" alt="Football" height="30px" width="30px"/>
            </div>
          </div> */}

          <h4>Address Details</h4>
          <Address value={this.state.player.address} onChange={address => this.setState({ player: Object.assign({}, this.state.player, { address }) })} />

          <h4>Registration Details</h4>
          <div className="row">
            { !this.state.player.id &&
              <div className="col-md-12">
                <div className="form-group">
                  <label>Registration Fee</label>
                  <input type="number" name="registration_fee" className="form-control"
                  value={this.state.player.registration_fee}
                  onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { registration_fee: event.target.value }) }) }/>
                </div>
              </div>  
            }
          </div>

          { this.state.player.registration_fee > 0 &&
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <Toggle
                  label="Paid?"
                  checked={this.state.player.is_paid}
                  onToggle={ checked => this.setState({ player: Object.assign({}, this.state.player, { is_paid: checked }) }) }/>
              </div>
            </div>
            { this.state.player.is_paid &&
            <div className="col-md-6">
              <div className="form-group">
                <RadioGroup label="Payment Mode*" data={{ cash: 'Cash', card: 'Card' }} 
                selected={this.state.player.pay_mode}
                onSelect={(arr, key) => this.setState({ player: Object.assign({}, this.state.player, { pay_mode: key }) }) }/>
              </div>
            </div>
            }
          </div>
          }

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <textarea className="form-control" placeholder="Comments"
                  value={this.state.player.comments}
                  onChange={ event => this.setState({ player: Object.assign({}, this.state.player, { comments: event.target.value }) }) }/>
              </div>
            </div>
          </div>
        
        </form>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-end">
         {this.state.editMode? <button className="btn" onClick={this.editPlayer.bind(this)}>Edit Customer</button> :<button className="btn" onClick={this.addPlayer.bind(this)}>Add Customer</button> }   
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}