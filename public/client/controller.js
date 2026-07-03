"use strict";

/*global VisualView
 global VisualEffects
 global gifObj*/

const mockData = {
  imageTree: [
    [
      "/gifs/8bit/comp.gif",
      "/gifs/8bit/icecream.gif",
      "/gifs/8bit/man.gif",
      "/gifs/8bit/palm.gif",
      "/gifs/8bit/shoe.gif",
    ],
    [
      "/gifs/8bit2/ban.gif",
      "/gifs/8bit2/car.gif",
      "/gifs/8bit2/ghost.gif",
      "/gifs/8bit2/obrazec.gif",
      "/gifs/8bit2/people.gif",
      "/gifs/8bit2/random.gif",
      "/gifs/8bit2/trump.gif",
    ],
    [
      "/gifs/cartoon/adventure.gif",
      "/gifs/cartoon/aku.gif",
      "/gifs/cartoon/bemo.gif",
      "/gifs/cartoon/dd2.gif",
      "/gifs/cartoon/ed.gif",
      "/gifs/cartoon/powerpuff.gif",
      "/gifs/cartoon/samurai2.gif",
    ],
    [
      "/gifs/cartoon2/adventure2.gif",
      "/gifs/cartoon2/dd.gif",
      "/gifs/cartoon2/explosion.gif",
      "/gifs/cartoon2/jake.gif",
    ],
    [
      "/gifs/cute/boy.gif",
      "/gifs/cute/burger.gif",
      "/gifs/cute/cake.gif",
      "/gifs/cute/crazy.gif",
      "/gifs/cute/cute.gif",
      "/gifs/cute/ice.gif",
      "/gifs/cute/tape.gif",
    ],
    [
      "/gifs/fun/1.gif",
      "/gifs/fun/12.gif",
      "/gifs/fun/2.gif",
      "/gifs/fun/mustafa1.gif",
      "/gifs/fun/nyan2.gif",
      "/gifs/fun/nyan3.gif",
    ],
    [
      "/gifs/fun2/13.gif",
      "/gifs/fun2/ludo.gif",
      "/gifs/fun2/mustafa2.gif",
      "/gifs/fun2/mustafa3.gif",
      "/gifs/fun2/super3.gif",
      "/gifs/fun2/tekken1.gif",
    ],
    [
      "/gifs/simple/s1.gif",
      "/gifs/simple/s2.gif",
      "/gifs/simple/s3.gif",
      "/gifs/simple/s4.gif",
      "/gifs/simple/s5.gif",
      "/gifs/simple/s6.gif",
    ],
    [
      "/gifs/tdfu/bounce.gif",
      "/gifs/tdfu/dare.gif",
      "/gifs/tdfu/fake.gif",
      "/gifs/tdfu/tdfu.gif",
      "/gifs/tdfu/tdfu2.gif",
    ],
  ],
  hiddenTree: [],
  images: [
    "/gifs/fun2/13.gif",
    "/gifs/fun2/ludo.gif",
    "/gifs/fun2/mustafa2.gif",
    "/gifs/fun2/mustafa3.gif",
    "/gifs/fun2/super3.gif",
    "/gifs/fun2/tekken1.gif",
  ],
  effect: "colorEffect",
  speed: 1,
  word: "Gif Visuals",
  grid: 6,
};

class gifVisual {
  constructor(view, effects) {
    this.view = view;
    this.effects = effects;
    this.allImages = [];
    this.images = [];
    this.visual = window;
    this.firstIndex = 0;
    this.word = "TRAP";
    this.io = null;

    this.index = 0;

    this.mainElement = this.visual.document.querySelector(".wrapper-main");

    //this.getImages.call(this);
    this.initSockets.call(this);
    this.initEvents.call(this, this.view);

    //setInterval(this.switchRandom.bind(this), 3000);
    window.addEventListener("keypress", this.onKey.bind(this));
  }

  initSockets() {
    if (window.io === undefined) {
      this.init.call(this, mockData);
    } else {
      this.io = io ? io() : null;
      this.io.on("connect", () => {
        this.io.emit("init", (data) => this.init.call(this, data));
        this.io.on("update", (data) => this.onUpdate.call(this, data));
      });
    }
  }

  init(data) {
    this.loadImages.call(this, data.images);
    this.changeWord(data.word);
    this.view.initGrid.call(this.view, null, data.grid);
    this.effects.applyEffectType(data.effect);
    this.effects.changeSpeed(data.speed);
  }

  loadImages(images) {
    this.images = images;
    helpers.shuffle(this.images);

    this.view.initGrid.call(this.view, this.images);
  }

  initEvents(view) {
    let timeout = null;

    ["orientationchange", "resize"].forEach((event) =>
      window.addEventListener(event, () => {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          this.view.initGrid.call(this.view, this.images);
          timeout = null;
        }, 60);
      }),
    );

    view.onUpdate = (settings) => {
      this.effects.updateElements(settings);
    };
  }

  onUpdate(update) {
    let data = update.data;
    let type = update.type;

    if (type == "images") {
      this.loadImages.call(this, data.images);
    } else if (type == "grid") {
      this.view.initGrid.call(this.view, null, data.grid);
    } else if (type == "effect") {
      this.effects.applyEffectType(data.effect);
    } else if (type == "speed") {
      this.effects.changeSpeed(data.speed);
    } else if (type == "word") {
      this.changeWord(data.word);
    }
  }

  changeWord(word) {
    let header = document.querySelector("#header-title");
    header.innerHTML = word;
    if (word.length) {
      header.classList.remove("hidden");
    } else {
      header.classList.add("hidden");
    }
  }

  onKey(e) {
    var key = e.key;
    if (key > 0) {
      this.view.initGrid.call(this.view, null, parseInt(key));
      return false;
    }

    let elements = document.querySelectorAll(".gif");

    switch (key) {
      case "q":
        this.effects.applyEffect(0);
        break;
      case "w":
        this.effects.applyEffect(1);
        break;
      case "e":
        this.effects.applyEffect(2);
        break;
      case "r":
        this.effects.applyEffect(3);
        break;
      case "t":
        this.effects.applyEffect(4);
        break;
      case "a":
        //this.getImages.call(this);
        break;
      case "s":
        let header = document.querySelector("#header");
        header.classList.toggle("hidden");
      default:
        break;
    }
  }
}

window.onload = () => {
  let view = new VisualView(document.querySelector(".wrapper-main"));
  let effects = new VisualEffects(view);
  let controller = new gifVisual(view, effects);
};
