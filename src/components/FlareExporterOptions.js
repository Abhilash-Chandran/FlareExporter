import React, { Component } from "react";

import "./FlareExporterOptions.css";
import FlareComponent from "flare-react";
import FieldWithLabel from "./FieldsWithLabel/FieldWithLabel";

export default class FlareExporterOptions extends Component {
  constructor(props) {
    super();
    this.mediaSource = new MediaSource();
    this.mediaRecorder = null;
    this.recordedBlobs = null;
    this.sourceBuffer = null;

    this.state = {
      selectedFile: null,
      canvasWidth: 400,
      canvasHeight: 400,
      animationName: "",
      renderAnimation: true,
      startOrStopAnimation: "Stop Animation",
      startOrStopRecording: "Start Recording",
      downloadVideoDisabled: true,
      downloadGifDisabled: true
    };
  }

  handleFileSelect = evt => {
    evt.preventDefault();
    this.setState({ ...this.state, selectedFile: evt.target.files[0] });
  };

  handleDragOver = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
  };

  handleDragLeave = evt => {
    evt.stopPropagation();
    evt.preventDefault();
  };

  handleDrop = evt => {
    evt.preventDefault();
    this.setState({ ...this.state, selectedFile: evt.dataTransfer.files[0] });
  };

  // Starts the animation by setting the correct animation name.
  handleRestartAnimation = evt => {
    if (this.state.startOrStopAnimation === "Restart Animation") {
      this.setState({
        ...this.setState,
        renderAnimation: true,
        startOrStopAnimation: "Stop Animation"
      });
    } else {
      this.setState({
        ...this.setState,
        renderAnimation: false,
        startOrStopAnimation: "Restart Animation"
      });
    }
  };

  handleCanvasWidthChange = value => {
    this.setState({
      ...this.state,
      //renderAnimation: false,
      canvasWidth: Number.parseInt(value)
    });
  };

  handleCanvasHeightChange = value => {
    this.setState({
      ...this.state,
      //renderAnimation: false,
      canvasHeight: Number.parseInt(value)
    });
  };

  handleAnimationNameChange = value => {
    this.setState({
      ...this.state,
      //renderAnimation: false,
      animationName: value
    });
  };

  handleDownloadVideo = evt => {
    const blob = new Blob(this.recordedBlobs, { type: "video/webm" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "test.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  handleRecording = evt => {
    if (this.state.startOrStopRecording === "Start Recording") {
      // code for recording start
      this.startRecording();
    } else {
      this.stopRecording();

      // code for stopping the recording.
    }
  };

  startRecording() {
    const canvas = document.querySelector("canvas");
    const stream = canvas.captureStream(120);
    var options = { mimeType: "video/mp4;codecs=vp9", bitsPerSecond: 2500000 };
    this.recordedBlobs = [];
    try {
      this.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e0) {
      console.log("Unable to create MediaRecorder with options Object: ", e0);
      try {
        options = { mimeType: "video/webm;codecs=vp8", bitsPerSecond: 2500000 };
        this.mediaRecorder = new MediaRecorder(stream, options);
      } catch (e1) {
        console.log("Unable to create MediaRecorder with options Object: ", e1);
        try {
          options = "video/mp4";
          this.mediaRecorder = new MediaRecorder(stream, options);
        } catch (e2) {
          alert(
            "MediaRecorder is not supported by this browser.\n\n" +
              "Try Firefox 29 or later, or Chrome 47 or later, " +
              "with Enable experimental Web Platform features enabled from chrome://flags."
          );
          console.error("Exception while creating MediaRecorder:", e2);
          return;
        }
      }
    }

    this.setState({
      ...this.state,
      downloadVideoDisabled: true,
      startOrStopRecording: "Stop Recording"
    });
    this.mediaRecorder.onstop = this.handleStop.bind(this);
    this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
    this.mediaRecorder.start(10); // collect 100ms of data
  }

  stopRecording() {
    this.mediaRecorder.stop();
    console.log("Recorded Blobs: ", this.recordedBlobs);
    this.setState({
      ...this.state,
      downloadVideoDisabled: false,
      startOrStopRecording: "Start Recording"
    });
  }

  handleSourceOpen(event) {
    console.log("MediaSource opened");
    this.sourceBuffer = this.mediaSource.addSourceBuffer(
      'video/webm; codecs="vp8"'
    );
    console.log("Source buffer: ", this.sourceBuffer);
  }

  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }

  handleStop(event) {
    console.log("Recorder stopped: ", event);
    //const superBuffer = new Blob(this.recordedBlobs, { type: "video/webm" });
    //video.src = window.URL.createObjectURL(superBuffer);
  }

  render() {
    return (
      <div className="Flare-Exporter-Options">
        <div className="Options-Fields">
          <div
            className="DropZoneStyle"
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDrop={this.handleDrop}
          >
            Drop a flare file here
          </div>
          <input type="file" onChange={this.handleFileSelect} />
          <FieldWithLabel
            label="canvas-width"
            type="number"
            value={this.state.canvasWidth}
            onChange={this.handleCanvasWidthChange}
          />
          <FieldWithLabel
            label="canvas-heght"
            type="number"
            value={this.state.canvasHeight}
            onChange={this.handleCanvasHeightChange}
          />
          <FieldWithLabel
            label="Animation-Name"
            type="text"
            value={this.state.animationName}
            onChange={this.handleAnimationNameChange}
          />
          <input
            type="button"
            value={this.state.startOrStopAnimation}
            onClick={this.handleRestartAnimation}
          />
          <input
            type="button"
            value={this.state.startOrStopRecording}
            onClick={this.handleRecording}
          />
          <input
            type="button"
            value="Download Video"
            disabled={this.state.downloadVideoDisabled}
            onClick={this.handleDownloadVideo}
          />
          <input
            type="button"
            value="Download Gif"
            disabled={this.state.downloadGifDisabled}
          />
        </div>
        <div className="Canvas-Area">
          {this.state.renderAnimation && (
            <FlareComponent
              width={this.state.canvasWidth}
              height={this.state.canvasHeight}
              animationName={this.state.animationName}
              file={this.state.selectedFile}
            />
          )}
        </div>
      </div>
    );
  }
}
