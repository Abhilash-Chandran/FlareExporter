import FlareComponent from "flare-react";

export default class FlareAnimationController extends FlareComponent.Controller {
  constructor(currentAnimationName) {
    super();
    this.animations = [];
    this._currentAnimation = null;
    this.currentAnimationName = currentAnimationName;
    this._animTime = 0;
    this._animationShouldRepeat = false;
  }

  initialize(artboard) {
    this.animations = artboard.animations;
    if (this.currentAnimationName === "") {
      this._currentAnimation = this.animations[0];
    } else {
      this._currentAnimation = this.animations.find(
        animation => animation._Name === this.currentAnimationName
      );
    }
  }

  advance(artboard, elapsed) {
    // advance the animation time
    this._animTime += elapsed;
    const { _currentAnimation: currentAnimation, _animTime: animTime } = this;
    currentAnimation.apply(animTime % currentAnimation.duration, artboard, 1.0);

    // keep rendering
    return true;
  }
}
