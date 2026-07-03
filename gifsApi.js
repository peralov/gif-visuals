"use strict";
const imagePath = "public/gifs/";
const fs = require("fs");

class gifsApi {
  constructor() {
    this.selected = [];
    this.effect = "colorEffect";
    this.grid = 8;
    this.speed = 1;
    this.word = "TRAP DA FUCK UP 2.4";

    this.imageTree = this.createList("/gifs/");
    this.setRandom.call(this);

    this.getData = () => {
      return {
        imageTree: this.imageTree,
        images: this.selected,
        effect: this.effect,
        speed: this.speed,
        word: this.word,
        grid: this.grid,
      };
    };

    this.setWord = (word) => {
      this.word = word;
    };

    this.setGrid = (grid) => {
      this.grid = parseInt(grid);
    };

    this.setEffect = (effect) => {
      this.effect = effect;
    };

    this.setSpeed = (speed) => {
      this.speed = Number(speed);
    };

    this.setImages = (index, hidden) => {
      if (index == null) {
        this.setRandom.call(this);
      } else {
        this.setSelected.call(this, this.imageTree[index]);
      }
    };
  }

  createList(path) {
    let list = [];

    let inPath = "public" + path;

    let paths = fs.readdirSync(inPath);

    for (let i = 0; i < paths.length; i++) {
      let pathUrl = inPath + paths[i];
      let fileNames = fs.readdirSync(pathUrl);

      list[i] = [];

      for (let j = 0; j < fileNames.length; j++) {
        list[i][j] = path + paths[i] + "/" + fileNames[j];
      }
    }

    return list;
  }

  setRandom() {
    let imageTree = this.imageTree;
    let randomList = imageTree[Math.floor(Math.random() * imageTree.length)];
    this.setSelected.call(this, randomList);
  }

  setSelected(newSelected) {
    this.selected = Object.assign([], newSelected);
  }

  selectContainer() {}

  getSelected() {}

  selectGroup() {}
}

module.exports = gifsApi;
