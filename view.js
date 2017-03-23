class VisualView {

    constructor(dom) {

        this.columns = 12;
        this.rows = null;
        this.images = [];
      	this.squareWidth = 0;
      	this.squareHeight = 0;
        this.elements = [];
        this.dom = dom;

    }

    changeImages(images) {

        this.images = images;

    }

    calculateRows(squareWidth) {
        return Math.ceil(window.innerHeight / squareWidth);
    }

    initGrid(images, columns) {

        this.images = images ? images : this.images;
        this.columns = columns ? columns : this.columns;
		this.squareWidth = window.innerWidth / this.columns;
      	this.rows = this.calculateRows(this.squareWidth);
      	this.squareHeight = window.innerHeight / this.rows;      
        
        this.dom.innerHTML = "";
      
        let elements = this.elements;
        let totalElements = this.columns * this.rows;
        let totalImages = this.images.length;
        let currentIndex = 0;
        
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {

                let image = this.images[currentIndex];
                elements.push(image);
                this.addElement.call(this, image, this.squareWidth, this.squareHeight, x, y);

                currentIndex++;
                if (currentIndex == totalImages) {
                    currentIndex = 0;
                }
            }

        }
    }

    addElement(image, width, height, x, y) {

        let columns = this.columns;
        let rows = this.rows;
        let element = document.createElement("div");
        let inner = document.createElement("div");

        element.className = "gif";
      	inner.className = "inner-div";

        helpers.applyStyle(element, {
            width: width + "px",
            height: height + "px",
          	left: width * x + "px",
            top: height * y + "px"         
        });
      
      	helpers.aplyStyle(inner, {
          	backgroundImage: "url(" + image + ")";
        });
      
        element.appendChild(inner);
        this.dom.appendChild(element)

        helpers.saveProps(element, {
            top: height * y + "px",
            left: width * x + "px"
        });
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

        img.style.transform = "rotateX(" + rotation[0] + "deg)rotateY(" + rotation[1] + "deg)rotateZ(" + rotation[2] + "deg)";
        img.setAttribute("data-rotation", rotation);

        setTimeout(() => {
            img.src = url
        }, 100);
    }

}
