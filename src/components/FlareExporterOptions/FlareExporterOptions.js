import FlareComponent from "flare-react";
import React, { Component } from "react";
import InputFieldWithLabel from "../FieldsWithLabel/InputFieldWithLabel";
import SelctionFieldWithLabel from "../FieldsWithLabel/SelectionFieldWithLabel";
import "./FlareExporterOptions.css";
import FlareAnimationController from "../FlareAnimationController/FlareAnimationController.js";
import IconButton from "../IconButtons/IconButton";

export default class FlareExporterOptions extends Component {
  constructor(props) {
    super();
    // a set of variable to handle the video download.
    this.mediaRecorder = null; // this records the stream from the flare canvas and its handlers push data to recorded blobs.
    this.recordedBlobs = []; // Holds the recorded chunks of bytes as an array.

    this.state = {
      // variables to be sent to the FlareComponent
      selectedFile: "",
      canvasWidth: 400,
      canvasHeight: 400,
      animationName: "",
      renderAnimation: true, // a local varible to handle display of the canvas.
      flareController: new FlareAnimationController(),

      // Variable to handle animations
      animations: [],
      isAnimating: false,
      isRecording: false,
      // Video format variable
      videoType: "mp4",

      // variables to switch the button text.
      startOrStopAnimation: "Stop Animation",
      startOrStopRecording: "Start Recording",

      // variables to disable certain buttons to avoid errors.
      downloadVideoDisabled: true,
      downloadGifDisabled: true,
      recordAnimationDisabled: true
    };
  }

  // Handler for the file select input .
  handleFileSelect = evt => {
    evt.preventDefault();
    this.setState({
      ...this.state,
      selectedFile: evt.target.files[0],
      recordAnimationDisabled: false // enables the record animation button.
    });
  };

  // A set of handlers to handle the drag and drop of a file into the canvas.

  handleDragOver = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy"; // switches the mouse hint to copy
  };

  handleDragLeave = evt => {
    evt.stopPropagation();
    evt.preventDefault();
  };

  handleDrop = evt => {
    evt.preventDefault();
    this.setState({
      ...this.state,
      selectedFile: evt.dataTransfer.files[0],
      recordAnimationDisabled: false // enables the record animation button.
    });
  };

  /* Since there is no props exposed by FLare component to pause or stop animation this simply 
  stops removes the falre component from the page by conditional rendering. Check the render method.
  It uses the renderAnimation flag for this purpose.*/
  handleRestartAnimation = evt => {
    if (this.state.startOrStopAnimation === "Restart Animation") {
      this.setState({
        ...this.setState,
        renderAnimation: true,
        recordAnimationDisabled: false,
        downloadVideoDisabled: false,
        startOrStopAnimation: "Stop Animation"
      });
    } else {
      this.setState({
        ...this.setState,
        renderAnimation: false,
        recordAnimationDisabled: true,
        startOrStopAnimation: "Restart Animation"
      });
    }
  };
  /* following set of methods handle the change of the canvas widht, canvas height and animation name changes.
  Note once all the fields are filled properly, the FlareComponent starts playing the animation automatically 
  as it doesn't expose any props to achieve the start, stop, and pause animation. */
  // sets canvas width
  handleCanvasWidthChange = value => {
    this.setState({
      ...this.state,
      canvasWidth: Number.parseInt(value)
    });
  };

  // sets the canvas height
  handleCanvasHeightChange = value => {
    this.setState({
      ...this.state,
      canvasHeight: Number.parseInt(value)
    });
  };

  // sets the animation name to be played.
  handleAnimationNameChange = value => {
    if (value != null || value !== "") {
      this.setState({
        ...this.state,
        animationName: value,
        recordAnimationDisabled: false
      });
    } else {
      this.setState({
        ...this.state,
        animationName: value,
        recordAnimationDisabled: true
      });
    }
  };

  handleFlareComponentLoaded = evt => {
    console.log("On loade is called with");
    this.setState({
      ...this.state,
      animations: this.state.flareController.animations.map(
        animation => animation._Name
      )
    });
  };
  //handles the video export type format
  handleVideoTypeChange = value => {
    this.setState({
      ...this.state,
      videoType: value
    });
  };
  // this handleer is called when the user clicks start or stop recording. Just a delegate method.
  handleRecording = evt => {
    if (this.state.startOrStopRecording === "Start Recording") {
      // code for recording start
      this.startRecording();
    } else {
      // code for stopping the recording.
      this.stopRecording();
    }
  };

  /* This method handles the download of the video. It basically read the recordedblobs in a specified format
  and creates url for that blob object. Then it creates anchor tag with this url, appends it to the dom 
  and programatically clicks that link so that user is shown a save window. This link is removed after 10ms. */
  handleDownloadVideo = evt => {
    if (this.recordedBlobs.length === 0) {
      return;
    }
    const blob = new Blob(this.recordedBlobs, {
      type: "video/" + this.state.videoType
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = this.state.animationName + "." + this.state.videoType;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
    //this.recordedBlobs = []; // hope this clears the record buffer blob and avoid any memory leaks.
  };

  /** This method starts the recording proces.
   * 1. it creates stream out of the canvas element. Not we are expecting only one canvas in the dom
   *    which is the FlareComponent canvas.
   * 2. Then create options where we mention the quality and format options for the video recorded.
   * 3. Create mediaRecorder object passing the stream and options.
   * 4. Handle browser version and support. To be documented later.
   * 5. Attach the handlers mediaRecorder's onDataAvaialble(pushes data to recodedblobs variable)
   *    and onstop events. Handle on error logi is missing but important will be done later.
   * 6. Start the mediarecorder defining 100ms chunk size for recording.
   *    This means it records for 100ms before anouncing the dataavailable event.
   */
  startRecording() {
    const canvas = document.querySelector("canvas");
    const stream = canvas.captureStream(120); // 120fps stream.

    //TODO: This should be configurable.
    //Mp4 format is default 2.5Mbit/s should be configurable.
    var options = {
      mimeType: "video/" + this.state.videoType + ";codecs=vp9",
      bitsPerSecond: 2500000
    };

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
          options = "video/" + this.state.videoType;
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
      startOrStopRecording: "Stop Recording", // switches the recording button text.
      isRecording: true
    });
    this.mediaRecorder.onstop = this.handleStop.bind(this);
    this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
    this.mediaRecorder.start(100); // collect 100ms of data
  }

  /** this method is called when a user initiates the stop recording.
   *  this is important otherwise browser will run out of memory. :()
   */
  stopRecording() {
    this.mediaRecorder.stop();
    console.log("Recorded Blobs: ", this.recordedBlobs);
    this.setState({
      ...this.state,
      downloadVideoDisabled: false,
      startOrStopRecording: "Start Recording",
      isRecording: false
    });
  }

  /* Media recorder records chunks of 100ms of data and creates data availabel event. 
  This methods fetches the data and pushes it into the blob array.*/
  handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }

  // handles the stop of of media recorder.
  handleStop(event) {
    console.log("Recorder stopped: ", event);
  }

  /**
   * Main render function which returns the UI to be displayed.
   */
  render() {
    return (
      <div className="Flare-Exporter-Options">
        <div className="Options-Fields">
          <input type="file" onChange={this.handleFileSelect} />
          <InputFieldWithLabel
            label="canvas-width"
            type="number"
            value={this.state.canvasWidth}
            onChange={this.handleCanvasWidthChange}
          />
          <InputFieldWithLabel
            label="canvas-heght"
            type="number"
            value={this.state.canvasHeight}
            onChange={this.handleCanvasHeightChange}
          />
          {/* <InputFieldWithLabel
            label="Animation-Name"
            type="text"
            value={this.state.animationName}
            onChange={this.handleAnimationNameChange}
          /> */}
          <SelctionFieldWithLabel
            label="Animation Name"
            options={this.state.animations}
            handleChange={this.handleAnimationNameChange}
          />
          <SelctionFieldWithLabel
            label="Video Format"
            options={["mp4", "webm"]}
            handleChange={this.handleVideoTypeChange}
          />
        </div>
        <div>
          {this.state.selectedFile === "" && (
            <div
              className="DropZoneStyle"
              style={{
                height: this.state.canvasHeight / 2,
                width: this.state.canvasWidth,
                paddingTop: this.state.canvasHeight / 2
              }}
              onDragOver={this.handleDragOver}
              onDragLeave={this.handleDragLeave}
              onDrop={this.handleDrop}
            >
              Drop a flare file here
            </div>
          )}
          {this.state.renderAnimation && (
            <div>
              <FlareComponent
                width={this.state.canvasWidth}
                height={this.state.canvasHeight}
                animationName={this.state.animationName}
                file={this.state.selectedFile}
                controller={this.state.flareController}
                onLoadedAnimations={this.handleFlareComponentLoaded}
                isPaused={this.state.animationPaused}
              />
            </div>
          )}
          <hr />
          <div className="IconButtons">
            <IconButton
              handleClick={this.handleRestartAnimation}
              buttonName="Play"
              toggleClass="pause"
            />
            <IconButton
              handleClick={this.handleRecording}
              buttonName="Record"
              toggleClass="stop"
            />
            <IconButton
              handleClick={this.handleDownloadVideo}
              buttonName="Download"
            />
          </div>
        </div>
      </div>
    );
  }
}
