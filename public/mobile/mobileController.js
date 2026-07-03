class mobileController {
  constructor() {
    this.images = [];
    this.io = io();
    this.io.on("connect", () => {
      this.io.emit("update", "blabla");
      this.io.emit("init", (data) => this.init.call(this, data));
    });

    //document.querySelector("#changeImages").onclick = this.changeImages.bind(this);
    document.onclick = (e) => {
      this.onClick.call(this, e);
    };
    document.addEventListener("keyup", this.onKey.bind(this));

    this.initEvents.call(this);
  }

  init(data) {
    this.displayCategories(
      document.querySelector("#imageTree"),
      data.imageTree,
      "images",
    );
  }

  displayCategories(wrapper, imageTree, type) {
    if (!wrapper) {
      return false;
    }

    for (let i = 0; i < imageTree.length; i++) {
      let categoryDom = document.createElement("div");
      categoryDom.className = "imageTree-item";

      let currentCategory = imageTree[i];

      let imageElement = document.createElement("img");
      let randomIndex = Math.floor(Math.random() * currentCategory.length);
      imageElement.src = currentCategory[randomIndex];

      imageElement.dataset.id = i;
      imageElement.name = type;
      imageElement.value = i;

      wrapper.appendChild(categoryDom);
      categoryDom.appendChild(imageElement);
    }
  }

  initEvents() {
    let wordElement = document.querySelector("#word");
    let wordButton = document.querySelector("#wordButton");

    wordElement.addEventListener("keyup", (e) => {
      wordButton.value = String(e.currentTarget.value).toUpperCase();
    });
  }

  onKey(e) {
    let code = e.code;
    let wordElement = document.querySelector("#word");
    if (code == "Enter") {
      this.emitUpdate.call(
        this,
        "word",
        String(wordElement.value).toUpperCase(),
      );
    }
  }

  onClick(e) {
    let target = e.target;
    if (target.name && target.name.length) {
      this.emitUpdate.call(this, target.name, target.value);
    }
  }

  emitUpdate(type, value) {
    this.io.emit("update", type, value);
  }
}

window.onload = () => {
  window.mobile = new mobileController();
};
