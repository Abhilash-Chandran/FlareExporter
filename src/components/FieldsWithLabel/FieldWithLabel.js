import React, { Component } from "react";
import "./FieldWithLabel.css";

class FieldWithLabel extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    this.props.onChange(e.target.value);
  }
  render() {
    return (
      <div className="Field-With-Label">
        <label>{this.props.label}</label>
        <input
          type={this.props.type}
          value={this.props.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default FieldWithLabel;
