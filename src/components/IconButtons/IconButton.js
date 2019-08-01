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
      <div>
        <div onClick={this.handleClick} className="IconStyle">
          <div className="OuterCircle">
            <div
              ref={this.BtnRef}
              className={this.props.buttonName + " icon"}
            />
            {this.props.iconText && (
              <label for={this.props.labelFor} className="IconText">
                {this.props.iconText}
              </label>
            )}
          </div>
        </div>
        <label className="IconLabel">{this.props.label}</label>
      </div>
    );
  }
}

export default IconButton;
