import './general.js';
console.log('Memes JS File');
const deviceWidth = window.innerWidth;

class Memes { 
    constructor(){
        console.log('Inside Memes class');
        console.log(ENVIRONMENT);
        console.log(CONSTANT_VALUE);
        this.$canvas = document.querySelector('#imgCanvas');
        this.$topTextInput = document.querySelector('#topText');
        this.$bottomTextInput = document.querySelector('#bottomText');
        this.$imageInput = document.querySelector('#image');
        this.$downloadButton = document.querySelector('#downloadMeme');
        this.createCanvas();
        this.addEventListeners();
    }

    createCanvas(){
        let canvasHeight = Math.min(480 , (deviceWidth-30));
        let canvasWidth = Math.min(640, (deviceWidth-30));
        this.$canvas.height = canvasHeight;
        this.$canvas.width = canvasWidth;
    }

    createMeme(){
        console.log('Rendered');
        let context = this.$canvas.getContext('2d');
        if(this.$imageInput.files && this.$imageInput.files[0]){
            console.log('rendering');
            let reader = new FileReader();
            reader.onload = () =>{
                
                console.log('File read ompletely');
                let image = new Image();
                image.onload = () => {
                    this.$canvas.height = image.height;
                    this.$canvas.width = image.width;
                    context.clearRect(0,0,this.$canvas.height , this.$canvas.width);
                    context.drawImage(image,0,0);
                    let fontSize = ((this.$canvas.width + this.$canvas.height)/2) * 4/100;
                    context.font = `${fontSize}px sans-serif`;
                    context.textAlign = 'center';
                    context.textBaseline ='top';

                    //for stroke text
                    context.lineWidth = fontSize/3;
                    context.strokeStyle = 'black';

                    //for fill text
                    context.fillStyle = 'white';
                    context.lineJoin = 'round';

                    //Input texts
                    const topText = this.$topTextInput.value.toUpperCase();
                    const bottomText = this.$bottomTextInput.value.toUpperCase();

                    //Top text

                    context.strokeText(topText , this.$canvas.width/2 , this.$canvas.height * (5/100));  // text content , x ,y (text is rendered from middle of image , text will be vertically aligned from center from a height 5% from top)
                    context.fillText(topText, this.$canvas.width / 2, this.$canvas.height * (5 / 100));

                    //Bottom Text

                    context.strokeText(bottomText , this.$canvas.width/2 , this.$canvas.height * (90/100));
                    context.fillText(bottomText, this.$canvas.width / 2, this.$canvas.height * (90 / 100));

                    this.resizeCanvas(this.$canvas.height , this.$canvas.width);
                }
                image.src = reader.result;
            }
            reader.readAsDataURL(this.$imageInput.files[0]);
        }
    }

    addEventListeners(){
        let inputNodes = [this.$topTextInput , this.$bottomTextInput, this.$imageInput];

        inputNodes.forEach((element) => {
            element.addEventListener('keyup',this.createMeme.bind(this));
            element.addEventListener('change',this.createMeme.bind(this));
        });
        this.$downloadButton.addEventListener('click' , this.downloadMeme.bind(this));
    }

    downloadMeme(){

        let isValid = this.validateImageDownload();
        if(!isValid){
            return ;
        }

        const imageSource = this.$canvas.toDataURL('image/png');
        let attr = document.createAttribute('href');
        attr.value = imageSource.replace(/^data:image\/[^;]/,'data:application/octet-stream');
        this.$downloadButton.setAttributeNode(attr);
    }

    validateImageDownload(){
        let isValid = true;
        if(!this.$imageInput.files.length > 0){
            this.$imageInput.parentElement.classList.add('has-error');
            isValid = false;
        }
        if(this.$bottomTextInput.value === ""){
            this.$imageInput.parentElement.classList.remove('has-error');
            this.$bottomTextInput.parentElement.classList.add('has-error');
            isValid = false;
        }
        if(this.$imageInput.parentElement.classList.remove('has-error')){
            this.$topTextInput.parentElement.classList.add('has-error');
            isValid = false;
        }
        return isValid;
    }

    resizeCanvas(canvasHeight , canvasWidth){
        let height = canvasHeight;
        let width = canvasWidth;
        this.$canvas.style.height = `${height}px`;
        this.$canvas.style.width = `${width}px`;
        while(height > Math.min(1000,deviceWidth - 30) && width > Math.min(1000, deviceWidth -30)){
            height /=2;
            width /= 2;
            this.$canvas.style.height = `${height}px`;
            this.$canvas.style.width = `${width}px`;
        }
    }
}

new Memes();