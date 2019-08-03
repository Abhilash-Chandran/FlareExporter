import React, { Component } from "react";
import "./Overlay.css";
import ReactMarkdown from "react-markdown";

class ButtonWithOverlayText extends Component {
  constructor(props) {
    super(props);
    this.markdown = fetch(this.props.mdfile)
      .then(res => res.text())
      .then(text => {
        this.setState({
          ...this.state,
          markdownText: text
        });
      });
    this.overlayRef = React.createRef();
    this.state = {
      markdownText: "relevant md file is missing."
    };
  }
  handleClick = evt => {
    this.overlayRef.current.classList.toggle("appear");
  };
  render() {
    const { markdownText } = this.state;
    return (
      <div>
        <div
          ref={this.overlayRef}
          onClick={this.handleClick}
          className="Overlay"
        >
          <ReactMarkdown className="OverlayText" source={markdownText} />
        </div>
        <div
          className={this.props.styleName + "Button"}
          onClick={this.handleClick}
        >
          {this.props.menuText}
        </div>
      </div>
    );
  }
}

export default ButtonWithOverlayText;
