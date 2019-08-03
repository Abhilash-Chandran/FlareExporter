import "./FieldWithLabel.css";
import React, { Component } from "react";

export default class SlectionFieldWithLabel extends Component {
  handleChange = evt => {
    this.props.handleChange(evt);
  };

  render() {
    const options = this.props.options;
    return (
      <div className="Selection-Field-With-Label">
        <select className="SelectField" onChange={this.handleChange}>
          <optgroup />
          {Object.keys(options).map(opt_group => (
            <optgroup key={opt_group} label={opt_group}>
              {options[opt_group].map((optionValue, i) => (
                <option
                  key={opt_group + "_" + this.props.label + "_" + i}
                  value={optionValue}
                >
                  {optionValue}
                </option>
              ))}
            </optgroup>
          ))}
          <optgroup />
        </select>
        <label className="FieldLabel">{this.props.label}</label>
        {this.props.experimental && (
          <div className="ExperimentalNote">experimental</div>
        )}
      </div>
    );
  }
}
