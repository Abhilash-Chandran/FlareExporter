import React, { Component } from "react";
import "./IconButton.css";

class RecordButton extends Component {
  constructor(props) {
    super(props);
    this.RecordBtnRef = React.createRef();
  }
  handleClick = evt => {
    this.RecordBtnRef.current.classList.toggle("stop");
    this.props.handleClick(evt);
  };
  render() {
    return (
      <div onClick={this.handleClick}>
        <div className="OuterCircle">
          <div ref={this.RecordBtnRef} className="Record icon" />
        </div>
      </div>
    );
  }
}

export default RecordButton;
