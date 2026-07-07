class helpers {

    static applyStyle(element, props){
        for(var i in props){
            let val = props[i];
            element.style[i] = val;
        }
    }

    static saveProps(element, props){
        for(var i in props){
            let val = props[i];
            element.dataset[i] = val;
        }
    }

    static shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
}