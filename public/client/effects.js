"use strict";

/*const effectsDef = [
    { type: "greyEffect", time: 120},
    { type: "colorEffect", time: 120},
    { type: "invertEffect", time: 300},
    { type: "zoomEffect", time: 1600},
    { type: "shakeEffect", time: 300},
    { type: "flipEffect", time: 300}
];*/

const effectsDef = [
  { type: "colorEffect", time: 300, desc: "PARTY" },
  { type: "swipeEffect", time: 2000, desc: "MEME" },
  { type: "flipEffect", time: 400, desc: "FLIP" },
  { type: "invertEffect", time: 400, desc: "FLASH" },
  { type: "shakeEffect", time: 500, desc: "FEEL" },
];

class VisualEffects {
  constructor() {
    this.effectIndex = 0;
    this.effect = effectsDef[this.effectIndex];
    this.elements = [];
    this.frame = 0;
    this.interval = null;
    this.settings = {
      optimizedSize: 200,
      rows: 9,
    };
    this.ms = 2000;
    this.globalSpeed = 1;

    this.applyEffect = (index) => {
      if (effectsDef[index]) {
        this.effectIndex = index;
        this.initEffect.call(this, effectsDef[index]);
      }
    };

    this.applyEffectType = (effectType) => {
      for (let i = 0; i < effectsDef.length; i++) {
        if (effectType == effectsDef[i].type) {
          this.applyEffect(i);
          return true;
        }
      }
      return false;
    };

    this.changeSpeed = (globalSpeed) => {
      this.globalSpeed = globalSpeed;
      this.setTiming.call(this, null);
    };

    this.updateElements = (settings) => {
      this.elements = settings.elements;
      this.settings = settings;
      this.initEffect.call(this);
      this.frame = 0;
    };

    this.nextEffect = () => {
      let index = this.effectIndex + 1;
      index = index >= effectsDef.length ? 0 : index;
      this.applyEffect.call(this, index);
    };
  }

  setTiming(ms) {
    this.ms = ms ? ms : this.ms;

    if (this.interval) {
      clearInterval(this.interval);
    }

    this.onFrame.call(this);

    this.interval = setInterval(() => {
      this.onFrame.call(this);
    }, this.ms / this.globalSpeed);
  }

  initEffect(effect) {
    effect = effect ? effect : this.effect;
    this.effect = effect;

    let elements = this.elements;

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      this.resetClasses(element);
      element.classList.add("effect", effect.type);
    }

    this.setTiming.call(this, effect.time);
  }

  renderEffect(frame) {
    frame = frame ? frame : this.frame;
    let elements = this.elements;
    let settings = this.settings;
    let len = elements.length;
    let rows = settings.rows;
    let cols = settings.cols;
    let range = Math.floor(len / 5);

    let i = 0;

    let row = frame % settings.rows;
    let col = frame % settings.cols;

    let effectType = this.effect.type;

    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        let element = elements[i];
        let lastFrame = frame + range;
        let prevFrame = frame - range;

        let gifWithEffects = "gif " + effectType;

        //this.resetEffectModes(element);

        if ((frame + i) % 2 == 0) {
          gifWithEffects += " even";
        } else {
          gifWithEffects += " odd";
        }

        if (i <= len / 2) {
          gifWithEffects += " above";
        } else {
          gifWithEffects += " bellow";
        }

        if (
          (i >= prevFrame && i <= lastFrame) ||
          (lastFrame >= len && i <= lastFrame - len) ||
          (prevFrame < 0 && i >= len + prevFrame)
        ) {
          gifWithEffects += " range";
        }

        if (col == y) {
          gifWithEffects += " col";
        }

        if (row == x) {
          gifWithEffects += " row";
        }

        if (i == frame - 1 || (frame == 0 && i == len - 1)) {
          gifWithEffects += " prev";
        } else if (i == frame + 1 || (frame == len - 1 && i == 0)) {
          gifWithEffects += " next";
        }

        if (i == frame) {
          gifWithEffects += " active";
        }

        element.className = gifWithEffects;

        i++;
      }
    }
  }

  onFrame() {
    let frame = this.frame;
    let elements = this.elements;

    this.renderEffect(frame);
    this.frame++;
    if (this.frame >= elements.length) {
      this.frame = 0;
    }
  }

  resetClasses(element) {
    element.classList.remove("effect");
    for (let i = 0; i < effectsDef.length; i++) {
      element.classList.remove(effectsDef[i].type);
    }
  }
}
