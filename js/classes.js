class gameDesign {
    constructor({position, imgSrc, scale, frames, offset = {x: 0, y: 0}}){
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imgSrc
        this.scale = scale;
        this.frames = frames;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    }

    elementsDesign() {
        canvasContext.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.frames),
            0,
            this.image.width / this.frames,
            this.image.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.frames) * this.scale,
            this.image.height * this.scale
            )
     }

    update(){
        this.elementsDesign();
        this.animateFrames();
    }

    //Animate Frames
    animateFrames() {
        this.framesElapsed++;
        if((this.framesElapsed % this.framesHold) === 0){  
            if(this.currentFrame < this.frames - 1){
                this.currentFrame++;
            }
            else {
                this.currentFrame = 0;
            }
        }
    }
}

class CharacterDesign extends gameDesign {
    constructor({ 
        position, 
        speed, 
        imgSrc, 
        scale, 
        frames, 
        offset, 
        characterMovements,
        attack}) {

        super({
            position,
            imgSrc,
            scale,
            frames,
            offset
        });
        this.speed = speed;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attack = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attack.offset,
            width: attack.width,
            height: attack.height
        }
        this.isDamaging;
        this.health = 100;
        this.currentFrame = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.characterMovements = characterMovements;
        this.dead = false;

        for (const characterMovement in this.characterMovements){
            characterMovements[characterMovement].image = new Image();
            characterMovements[characterMovement].image.src = characterMovements[characterMovement].imgSrc;
        }
    }

    update() {
        this.elementsDesign();
        if(!this.dead) {
            this.animateFrames();
        }

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        this.attack.position.x = this.position.x + this.attack.offset.x;
        this.attack.position.y = this.position.y + this.attack.offset.y;
        
        //Gravity pull
        if (this.position.y + this.height + this.speed.y >= canvas.height - 120) {
            this.speed.y = 0;
            this.position.y = 450;
        }
        else {
            this.speed.y += gravity;
        }

    }

    damage() {
        this.switchMovements('attack1');
        this.isDamaging = true;
    }

    takeHit() {
        
        this.health -= 10;

        if(this.health === 0){
            this.switchMovements('death');
        }
        else {
            this.switchMovements('takeHit');
        }
    }

    //Switching Movements
    switchMovements(movement) { 

        if(this.image === this.characterMovements.death.image){
            if(this.currentFrame === this.characterMovements.death.frames - 1) {
                this.dead = true;
                }
                return;
            }

        if(this.image === this.characterMovements.attack1.image && 
            this.currentFrame < this.characterMovements.attack1.frames - 1){
                return;
            }

        if(this.image === this.characterMovements.takeHit.image && 
            this.currentFrame < this.characterMovements.takeHit.frames - 1){
                return;
            }
            
        switch(movement) {
            case 'idle':
                if(this.image != this.characterMovements.idle.image){ 
                    this.image = this.characterMovements.idle.image;
                    this.frames = this.characterMovements.idle.frames;
                    this.currentFrame = 0;
                }
            break;
            case 'run':
                if(this.image != this.characterMovements.run.image){ 
                    this.image = this.characterMovements.run.image;
                    this.frames = this.characterMovements.run.frames;
                    this.currentFrame = 0;
                }
            break;
            case 'jump':
                if(this.image != this.characterMovements.jump.image){ 
                    this.image = this.characterMovements.jump.image;
                    this.frames = this.characterMovements.jump.frames;
                    this.currentFrame = 0;
                }
            break;
            case 'fall':
                if(this.image != this.characterMovements.fall.image){ 
                    this.image = this.characterMovements.fall.image;
                    this.frames = this.characterMovements.fall.frames;
                    this.currentFrame = 0;
                }
            break;
            case 'attack1':
                if(this.image != this.characterMovements.attack1.image){ 
                    this.image = this.characterMovements.attack1.image;
                    this.frames = this.characterMovements.attack1.frames;
                    this.currentFrame = 0;
                }
            break;
            case 'takeHit':
                if(this.image != this.characterMovements.takeHit.image){ 
                    this.image = this.characterMovements.takeHit.image;
                    this.frames = this.characterMovements.takeHit.frames;
                    this.currentFrame = 0;
                }
            break;
            case 'death':
                if(this.image != this.characterMovements.death.image){ 
                    this.image = this.characterMovements.death.image;
                    this.frames = this.characterMovements.death.frames;
                    this.currentFrame = 0;
                }
            break;
        }
    }
}

