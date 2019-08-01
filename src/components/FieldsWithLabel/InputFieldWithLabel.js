import React, { Component } from "react";
import "./FieldWithLabel.css";

class InputFieldWithLabel extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(e.target.value);
  }
  render() {
    return (
      <div className="Input-Field-With-Label">
        <input
          type={this.props.type}
          value={this.props.value}
          onChange={this.handleChange}
          className="InputField"
        />
        <label className="FieldLabel">{this.props.label}</label>
      </div>
    );
  }
}

export default InputFieldWithLabel;
