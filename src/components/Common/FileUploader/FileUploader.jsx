import React, { Component } from "react";
import { ImageUpload } from "../../../helper/api";
import "./FileUploader.css";
import Webcam from 'react-webcam';

class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload() {
    this.setState({ isUploading: true, isWebCam: false });
    this.props.onChange && this.props.onChange(true, null, null);

    var file = this.refs.chooser.files[0];
    if (this.state.isWebCam) {
      let data = this.refs.webcam.getScreenshot();
      this.setState({ image: data });
      file = data
    } else {
      var reader = new FileReader();
      reader.onloadend = () => {
        var data = reader.result;
        this.setState({ image: data });
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    }

    var formData = new FormData();
    formData.append('image', file);
    ImageUpload.post(formData)
      .then(({data}) => {
        this.setState({ isUploading: false });
        this.props.onChange && this.props.onChange(false, data.files[0].key, null);
      }).catch(error => {
        this.setState({ isUploading: false });
        this.props.onChange && this.props.onChange(false, null, error);
      });
  }
  render() {
    let preview = this.state.isWebCam ? 
      <Webcam
        audio={false}
        height={200}
        ref="webcam"
        screenshotFormat="image/jpeg"
        width={200}
      />:
      <img src={this.state.image || this.props.defaultImage} style={{ height: '100%', width: '100%' }} alt=""/>
    return (
      <div>
        <input
          type="file"
          id="chooser"
          ref="chooser"
          accept="image/*"
          capture
          onChange={this.handleUpload}
        />
        <div id="preview">
          {preview}
        </div>
        <button className="btn upload-button" type="button" onClick={() => this.refs.chooser.click()}>
          {this.state.isUploading ? 'Uploading' : 'Upload'}
          <i style={{ fontSize: "1.2em" }} className="material-icons">file_upload</i>
        </button>
        <br/>
        <button className="btn capture-button" type="button" onClick={() => {
            if (this.state.isWebCam) {
              this.handleUpload()
            } else {
              this.setState({ isWebCam: true })
            }
          }}>
          {this.state.isWebCam ? 'Take Photo' : 'Capture'}
          <i style={{ fontSize: "1.2em" }} className="material-icons">camera</i>
        </button>
      </div>
    );
  }
}

export default FileUploader;