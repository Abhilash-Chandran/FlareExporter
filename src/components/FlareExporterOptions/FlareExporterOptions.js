import FlareComponent from "flare-react";
import React, { Component } from "react";
import InputFieldWithLabel from "../FieldsWithLabel/InputFieldWithLabel";
import SelctionFieldWithLabel from "../FieldsWithLabel/SelectionFieldWithLabel";
import "./FlareExporterOptions.css";
import FlareAnimationController from "../FlareAnimationController/FlareAnimationController.js";
import IconButton from "../IconButtons/IconButton";
import getBitRate from "../Utils/Util";

export default class FlareExporterOptions extends Component {
  constructor(props) {
    super();
    // a set of variable to handle the video download.
    this.mediaRecorder = null; // this records the stream from the flare canvas and its handlers push data to recorded blobs.
    this.recordedBlobs = []; // Holds the recorded chunks of bytes as an array.

    this.state = {
      // variables to be sent to the FlareComponent
      selectedFile: "",
      canvasWidth: 500,
      canvasHeight: 440,
      animationName: "",
      renderAnimation: true, // a local varible to handle display of the canvas.
      flareController: new FlareAnimationController(""),

      // Variable to handle animations
      animations: [],
      isAnimationPaused: true,
      isRecording: false,

      // Video format variable
      videoType: "mp4",
      bitRate: 2500000, // 2.5 Mbits/s
      frameRate: 30,
      quality: "SDR",
      resolution: "360p",

      // variables to disable certain buttons to avoid errors.
      downloadVideoDisabled: true,
      playAnimationDisabled: true,
      recordAnimationDisabled: true
    };
  }

  // Handler for the file select input .
  handleFileSelect = evt => {
    evt.preventDefault();
    if (evt.target.value.length > 0) {
      // a guard to handle the user cliking cancel or close button.
      this.setState({
        ...this.state,
        isAnimationPaused: true,
        flareController: new FlareAnimationController("", false),
        selectedFile: evt.target.files[0],
        recordAnimationDisabled: false,
        playAnimationDisabled: false // enables the record animation button.
      });
    }
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
      isAnimationPaused: true,
      flareController: new FlareAnimationController(""),
      selectedFile: evt.dataTransfer.files[0],
      recordAnimationDisabled: false // enables the record animation button.
    });
  };

  /* Since there is no props exposed by FLare component to pause or stop animation this simply 
  stops removes the falre component from the page by conditional rendering. Check the render method.
  It uses the renderAnimation flag for this purpose.*/
  handlePlayPauseAnimation = evt => {
    console.log("Play pause is being caled.");
    if (this.state.isAnimationPaused) {
      this.setState({
        ...this.setState,
        downloadVideoDisabled: false,
        isAnimationPaused: false
      });
    } else {
      this.setState({
        ...this.setState,
        isAnimationPaused: true
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
  handleAnimationNameChange = evt => {
    this.setState({
      ...this.state,
      //animationName: value,
      flareController: new FlareAnimationController(evt.target.value)
      //recordAnimationDisabled: true
    });
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
  handleVideoTypeChange = evt => {
    this.setState({
      ...this.state,
      videoType: evt.target.value
    });
  };
  // this handleer is called when the user clicks start or stop recording. Just a delegate method.
  handleRecording = evt => {
    if (!this.state.isRecording) {
      // code for recording start
      this.setState({
        ...this.state,
        flareController: new FlareAnimationController(this.state.animationName),
        isAnimationPaused: false,
        downloadVideoDisabled: true,
        isRecording: true
      });
      this.startRecording();
    } else {
      // code for stopping the recording.
      this.stopRecording();
      this.setState({
        ...this.state,
        isAnimationPaused: true,
        downloadVideoDisabled: false,
        isRecording: false
      });
    }
  };

  /* This method handles the download of the video. It basically read the recordedblobs in a specified format
  and creates url for that blob object. Then it creates anchor tag with this url, appends it to the dom 
  and programatically clicks that link so that user is shown a save window. This link is removed after 10ms. */
  handleDownloadVideo = evt => {
    evt.preventDefault();
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
    const stream = canvas.captureStream(this.state.frameRate); // 120fps stream.

    //TODO: This should be configurable.
    //Mp4 format is default 2.5Mbit/s should be configurable.
    var options = {
      mimeType: "video/" + this.state.videoType + ";codecs=vp9",
      bitsPerSecond: this.setState.bitRate
    };

    this.recordedBlobs = [];
    try {
      this.mediaRecorder = new MediaRecorder(stream, options);
    } catch (e0) {
      console.log("Unable to create MediaRecorder with options Object: ", e0);
      try {
        options = {
          mimeType: "video/webm;codecs=vp8",
          bitsPerSecond: this.setState.bitRate
        };
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

  handleFrameRateChange = evt => {
    let newFrameRate = evt.target.value;
    let quality = this.state.quality;
    let resolution = this.state.resolution;
    let newBitRate = getBitRate(newFrameRate, quality, resolution);
    console.log(
      "Inside event handler bitrate is - " + newBitRate / 1000000 + "Mbps"
    );
    this.setState({
      ...this.state,
      frameRate: newFrameRate,
      bitRate: newBitRate
    });
  };

  handleVideoQualityChange = evt => {
    let quality = evt.target.options[evt.target.selectedIndex].parentNode.label;
    let frameRate = this.state.frameRate;
    let resolution = evt.target.value;
    let bitRate = getBitRate(frameRate, quality, resolution);
    console.log(
      "Inside event handler bitrate is - " + bitRate / 1000000 + "Mbps"
    );
    this.setState({
      ...this.state,
      bitRate: bitRate,
      quality: quality,
      resolution: resolution
    });
  };
  /**
   * Main render function which returns the UI to be displayed.
   */
  render() {
    return (
      <div className="Flare-Exporter-Options">
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
                isPaused={this.state.isAnimationPaused}
              />
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            onChange={this.handleFileSelect}
            className="inputfile"
            name="filechooser"
            id="filechooser"
          />
          <div className="IconButtons">
            <IconButton
              handleClick={() => {}}
              iconText=".flr"
              toggleClass="pause"
              labelFor="filechooser"
              label="Choose"
              disabled={false}
            />
            <InputFieldWithLabel
              label="Width"
              type="number"
              value={this.state.canvasWidth}
              onChange={this.handleCanvasWidthChange}
            />
            <InputFieldWithLabel
              label="Height"
              type="number"
              value={this.state.canvasHeight}
              onChange={this.handleCanvasHeightChange}
            />
            <SelctionFieldWithLabel
              label="AnimationName"
              options={{ "Available Animations": this.state.animations }}
              handleChange={this.handleAnimationNameChange}
            />
            <IconButton
              handleClick={this.handlePlayPauseAnimation}
              buttonName="Play"
              toggleClass="pause"
              label="Play"
              alterLabel="Pause"
              disabled={this.state.playAnimationDisabled}
            />
            <div className="VerticalLine" />
            <IconButton
              handleClick={this.handleRecording}
              buttonName="Record"
              toggleClass="stop"
              label="Record"
              disabled={this.state.recordAnimationDisabled}
            />
            <SelctionFieldWithLabel
              label="FrameRate"
              experimental={true}
              options={{
                "Standard FrameRate": [24, 25, 30],
                "High FrameRate": [48, 50, 60]
              }}
              handleChange={this.handleFrameRateChange}
            />
            <SelctionFieldWithLabel
              label="Quality"
              experimental={true}
              options={{
                SDR: ["1440p", "1080p", "720p", "480p", "360p"],
                HDR: ["1440p", "1080p", "720p"]
              }}
              handleChange={this.handleVideoQualityChange}
            />
            <SelctionFieldWithLabel
              label="Format"
              options={{ "Video Format": ["mp4", "webm"] }}
              handleChange={this.handleVideoTypeChange}
            />
            <IconButton
              handleClick={this.handleDownloadVideo}
              buttonName="Download"
              label="Download"
              disabled={this.state.downloadVideoDisabled}
            />
          </div>
        </div>
      </div>
    );
  }
}
