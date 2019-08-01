import React, { Component } from "react";
import "./IconButton.css";

class IconButton extends Component {
  constructor(props) {
    super(props);
    this.BtnRef = React.createRef();
    this.currentLabel = this.props.label;
    this.alterLabel = true;
  }
  handleClick = evt => {
    if (!this.props.disabled) {
      this.props.toggleClass != null &&
        this.BtnRef.current.classList.toggle(this.props.toggleClass);
      this.props.handleClick(evt);
      if (this.props.alterLabel != null) {
        this.currentLabel = !this.alterLabel
          ? this.props.label
          : this.props.alterLabel;
        this.alterLabel = !this.alterLabel;
      }
    }
  };
  render() {
    return (
      <div>
        <div onClick={this.handleClick} className="IconStyle">
          <div
            className={"OuterCircle" + (this.props.disabled ? " disabled" : "")}
          >
            <div
              ref={this.BtnRef}
              className={
                this.props.buttonName +
                " icon" +
                (this.props.disabled ? " disabled" : "")
              }
            />
            {this.props.iconText && (
              <label htmlFor={this.props.labelFor} className="IconText">
                {this.props.iconText}
              </label>
            )}
          </div>
        </div>
        <label className="IconLabel">{this.currentLabel}</label>
      </div>
    );
  }
}

export default IconButton;
