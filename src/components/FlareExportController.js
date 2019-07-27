import FlareComponent from "flare-react";
import CCapture from "ccapture.js";

export default class FalreExportController extends FlareComponent.Controller {
  constructor() {
    super();
    this._MassMove2 = null;
    this._WalkTime = 0;
    this.ccapturer = null;
    this.started = false;
  }

  initialize(artboard) {
    this._ = artboard.getAnimation("MassMove2");
    this.ccapturer = new CCapture({ format: "webm" });
  }

  advance(artboard, elapsed) {
    // advance the walk time
    this._WalkTime += elapsed;
    const { _MassMove2: massMove2, _WalkTime: walkTime } = this;
    // mix the two animations together by applying one and then the other (note that order matters).
    massMove2.apply(walkTime % massMove2.duration, artboard, 1.0);
    // if you want to slowly disable the head bobbing (musicWalk animation) you could ramp down the
    // final argument (the mix argument) to 0.0 over some time. For now we're mixing at full strength.
    //musicWalk.apply(walkTime % musicWalk.duration, artboard, 1.0);
    // keep rendering
    if (walkTime % massMove2.duration == 0 && this.started) {
      return false;
    } else if (!this.started) {
      this.started = true;
    }

    return true;
  }
}
