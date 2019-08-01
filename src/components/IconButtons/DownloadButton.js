import React, { Component } from "react";
import "./IconButton.css";

class DownloadButton extends Component {
  constructor(props) {
    super(props);
    this.DownloadBtnRef = React.createRef();
  }
  handleClick = evt => {
    this.props.handleClick(evt);
  };
  render() {
    return (
      <div onClick={this.handleClick}>
        <div className="OuterCircle">
          <div ref={this.DownloadBtnRef} className="Download icon" />
        </div>
      </div>
    );
  }
}

export default DownloadButton;
