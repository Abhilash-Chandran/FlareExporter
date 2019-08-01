import "./FieldWithLabel.css";
import React, { Component } from "react";

export default class SlectionFieldWithLabel extends Component {
  handleChange = evt => {
    this.props.handleChange(evt.target.value);
  };

  render() {
    return (
      <div className="Selection-Field-With-Label">
        <label>{this.props.label}</label>
        <select onChange={this.handleChange}>
          {this.props.options.map((optionValue, i) => (
            <option key={this.props.label + "_" + i} value={optionValue}>
              {optionValue}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
