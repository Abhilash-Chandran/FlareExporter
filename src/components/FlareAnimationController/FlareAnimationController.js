import FlareComponent from "flare-react";

export default class FlareAnimationController extends FlareComponent.Controller {
  constructor() {
    super();
    this.animations = [];
    this._currentAnimation = null;
    this._animTime = 0;
    this._animationShouldRepeat = false;
  }

  initialize(artboard) {
    this.animations = artboard.animations;
    this._currentAnimation = this.animations[0];
  }

  advance(artboard, elapsed) {
    // advance the animation time
    this._animTime += elapsed;
    const { _currentAnimation: currenttAnimation, _animTime: animTime } = this;
    currenttAnimation.apply(
      animTime % currenttAnimation.duration,
      artboard,
      1.0
    );
    if (this._animationShallRepeat) {
      // keep rendering
      return true;
    }
  }
}
