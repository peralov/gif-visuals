"use strict";

/*global VisualView
 global VisualEffects
 global gifObj*/

const mockData = {
  imageTree: [
    [
      "/gif-visuals/gifs/8bit/comp.gif",
      "/gif-visuals/gifs/8bit/icecream.gif",
      "/gif-visuals/gifs/8bit/man.gif",
      "/gif-visuals/gifs/8bit/palm.gif",
      "/gif-visuals/gifs/8bit/shoe.gif",
    ],
    [
      "/gif-visuals/gifs/8bit2/ban.gif",
      "/gif-visuals/gifs/8bit2/car.gif",
      "/gif-visuals/gifs/8bit2/ghost.gif",
      "/gif-visuals/gifs/8bit2/obrazec.gif",
      "/gif-visuals/gifs/8bit2/people.gif",
      "/gif-visuals/gifs/8bit2/random.gif",
      "/gif-visuals/gifs/8bit2/trump.gif",
    ],
    [
      "/gif-visuals/gifs/cartoon/adventure.gif",
      "/gif-visuals/gifs/cartoon/aku.gif",
      "/gif-visuals/gifs/cartoon/bemo.gif",
      "/gif-visuals/gifs/cartoon/dd2.gif",
      "/gif-visuals/gifs/cartoon/ed.gif",
      "/gif-visuals/gifs/cartoon/powerpuff.gif",
      "/gif-visuals/gifs/cartoon/samurai2.gif",
    ],
    [
      "/gif-visuals/gifs/cartoon2/adventure2.gif",
      "/gif-visuals/gifs/cartoon2/dd.gif",
      "/gif-visuals/gifs/cartoon2/explosion.gif",
      "/gif-visuals/gifs/cartoon2/jake.gif",
    ],
    [
      "/gif-visuals/gifs/cute/boy.gif",
      "/gif-visuals/gifs/cute/burger.gif",
      "/gif-visuals/gifs/cute/cake.gif",
      "/gif-visuals/gifs/cute/crazy.gif",
      "/gif-visuals/gifs/cute/cute.gif",
      "/gif-visuals/gifs/cute/ice.gif",
      "/gif-visuals/gifs/cute/tape.gif",
    ],
    [
      "/gif-visuals/gifs/fun/1.gif",
      "/gif-visuals/gifs/fun/12.gif",
      "/gif-visuals/gifs/fun/2.gif",
      "/gif-visuals/gifs/fun/mustafa1.gif",
      "/gif-visuals/gifs/fun/nyan2.gif",
      "/gif-visuals/gifs/fun/nyan3.gif",
    ],
    [
      "/gif-visuals/gifs/fun2/13.gif",
      "/gif-visuals/gifs/fun2/ludo.gif",
      "/gif-visuals/gifs/fun2/mustafa2.gif",
      "/gif-visuals/gifs/fun2/mustafa3.gif",
      "/gif-visuals/gifs/fun2/super3.gif",
      "/gif-visuals/gifs/fun2/tekken1.gif",
    ],
    [
      "/gif-visuals/gifs/simple/s1.gif",
      "/gif-visuals/gifs/simple/s2.gif",
      "/gif-visuals/gifs/simple/s3.gif",
      "/gif-visuals/gifs/simple/s4.gif",
      "/gif-visuals/gifs/simple/s5.gif",
      "/gif-visuals/gifs/simple/s6.gif",
    ],
    [
      "/gif-visuals/gifs/tdfu/bounce.gif",
      "/gif-visuals/gifs/tdfu/dare.gif",
      "/gif-visuals/gifs/tdfu/fake.gif",
      "/gif-visuals/gifs/tdfu/tdfu.gif",
      "/gif-visuals/gifs/tdfu/tdfu2.gif",
    ],
  ],
  images: [
    "/gif-visuals/gifs/fun2/13.gif",
    "/gif-visuals/gifs/fun2/ludo.gif",
    "/gif-visuals/gifs/fun2/mustafa2.gif",
    "/gif-visuals/gifs/fun2/mustafa3.gif",
    "/gif-visuals/gifs/fun2/super3.gif",
    "/gif-visuals/gifs/fun2/tekken1.gif",
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
      setTimeout(() => {
        this.view.initGrid.call(this.view, null, 8);
      }, 5);
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
        this.effects.applyEffect(4);
        break;
      case "r":
        this.effects.applyEffect(2);
        break;
      case "e":
        this.effects.applyEffect(3);
        break;
      case "f":
        this.effects.applyEffect(1);
        break;
      case "a":
        // only from client list
        const { imageTree } = mockData;
        const imageList = imageTree[(Math.random() * imageTree.length) | 0];
        this.loadImages.call(this, imageList);
        break;
      case " ":
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
