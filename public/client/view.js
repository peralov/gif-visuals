/* global helpers */

"use strict";

class VisualView {
  constructor(dom) {
    this.settings = {
      cols: 5,
      rows: 6,
      images: [],
      optimizedSize: 200,
      squareHeight: null,
      squareWidth: null,
      elements: [],
    };

    this.dom = dom;
  }

  changeImages(images) {
    this.images = images;
  }

  optimizeGrid() {
    let devicePixelRatio = window.devicePixelRatio || 1;

    let physicalWidth = window.innerWidth * devicePixelRatio;
    let physicalHeight = window.innerHeight * devicePixelRatio;

    let settings = this.settings;
    settings.cols = Math.floor(physicalWidth / settings.optimizedSize);
    settings.rows = Math.floor(physicalHeight / settings.optimizedSize);

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      let divideBy = 1;

      if (settings.cols > 4 && settings.rows < settings.cols) {
        divideBy = settings.cols / 4;
      } else if (settings.rows > 4) {
        divideBy = settings.rows / 4;
      }

      settings.cols = Math.floor(settings.cols / divideBy);
      settings.rows = Math.floor(settings.rows / divideBy);
    }
  }

  calculateRows(squareWidth) {
    return Math.ceil(window.innerHeight / squareWidth);
  }

  updateGrid(cols, rows) {
    let dom = this.dom;
    let elements = this.settings.elements;
    let newLen = cols * rows;
    let updated = elements.length == newLen ? false : true;

    while (elements.length > newLen) {
      elements.pop();
      this.removeELement.call(this, dom.lastChild);
    }

    while (elements.length < newLen) {
      elements.push(this.addElement.call(this));
    }

    this.settings.elements = elements;
    return updated;
  }

  initGrid(images, c, r) {
    let settings = this.settings;

    /*if(!c){
            this.optimizeGrid.call(this);
        }*/

    images = images ? images : settings.images;
    let cols = c ? c : settings.cols;
    let squareWidth = window.innerWidth / cols;
    let rows = r ? r : c ? this.calculateRows(squareWidth) : settings.rows;
    let squareHeight = window.innerHeight / rows;

    let updated = this.updateGrid.call(this, cols, rows);
    let elements = settings.elements;
    let currentIndex = 0;

    for (let i = 0; i < elements.length; i++) {
      let x = i % cols;
      let y = Math.floor(i / cols);

      let url = images[currentIndex];
      this.initElement.call(
        this,
        elements[i],
        url,
        squareWidth,
        squareHeight,
        x,
        y,
      );

      currentIndex++;
      if (currentIndex == images.length) {
        currentIndex = 0;
      }
    }

    this.settings = {
      images,
      cols,
      rows,
      squareWidth,
      squareHeight,
      elements,
      optimizedSize: settings.optimizedSize,
    };

    if (updated) {
      if (this.onUpdate) {
        this.onUpdate(this.settings);
      }
    }
  }

  addElement(image, width, height, x, y) {
    let element = document.createElement("div");
    let inner = document.createElement("div");

    element.className = "gif";
    inner.className = "inner-div";
    element.appendChild(inner);
    return this.dom.appendChild(element);
  }

  initElement(element, image, width, height, x, y) {
    let inner = element.querySelector(".inner-div");

    helpers.applyStyle(element, {
      width: width + "px",
      height: height + "px",
      left: width * x + "px",
      top: height * y + "px",
      zIndex: x * y,
    });

    helpers.applyStyle(inner, {
      backgroundImage: "url(" + image + ")",
    });
  }

  removeELement(element) {
    element.parentNode.removeChild(element);
  }

  flipImage(element, url) {
    let img = element.querySelector("img");
    let rotation = img.getAttribute("data-rotation").split(",");
    let random2 = Math.random() > 0.5 ? 180 : -180;
    if (Math.random() > 0) {
      rotation[1] = parseInt(rotation[1]) + 180;
    } else {
      rotation[0] = parseInt(rotation[0]) + random2;
      rotation[2] = parseInt(rotation[2]) + random2;
    }

    img.style.transform =
      "rotateX(" +
      rotation[0] +
      "deg)rotateY(" +
      rotation[1] +
      "deg)rotateZ(" +
      rotation[2] +
      "deg)";
    img.setAttribute("data-rotation", rotation);

    setTimeout(() => {
      img.src = url;
    }, 100);
  }
}
