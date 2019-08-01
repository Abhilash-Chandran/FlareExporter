import React, { Component } from "react";
import "./IconButton.css";

class PlayPauseButton extends Component {
  constructor(props) {
    super(props);
    this.PlayBtnRef = React.createRef();
  }
  handleClick = evt => {
    this.PlayBtnRef.current.classList.toggle("pause");
    this.props.handleClick(evt);
  };
  render() {
    return (
      <div onClick={this.handleClick}>
        <div className="OuterCircle">
          <div ref={this.PlayBtnRef} className="Play icon" />
        </div>
      </div>
    );
  }
}

export default PlayPauseButton;
