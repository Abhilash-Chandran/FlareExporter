import React, { Component } from "react";
import "./IconButton.css";

class IconButton extends Component {
  constructor(props) {
    super(props);
    this.BtnRef = React.createRef();
  }
  handleClick = evt => {
    this.props.toggleClass != null &&
      this.BtnRef.current.classList.toggle(this.props.toggleClass);
    this.props.handleClick(evt);
  };
  render() {
    return (
      <div onClick={this.handleClick}>
        <div className="OuterCircle">
          <div ref={this.BtnRef} className={this.props.buttonName + " icon"} />
        </div>
      </div>
    );
  }
}

export default IconButton;
