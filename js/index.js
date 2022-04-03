const canvas = document.querySelector('canvas');
const canvasContext = canvas.getContext('2d');
const gravity = 0.8;

canvas.width = 1280;
canvas.height = 720;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

const background = new gameDesign({
    position: {
        x: 0,
        y: 0
    },
    offset:{
        x: 0,
        y: 0
    },
    imgSrc: './resource/background.png',
    scale: 1,
    frames: 1
});

const shop = new gameDesign({
    position: {
        x: 800,
        y: 250
    },
    offset:{
        x: 0,
        y: 0
    },
    imgSrc: './resource/shop.png',
    scale: 2.75,
    frames: 6
});

const player = new CharacterDesign({
    position: {
        x: 0,
        y: 0
    },
    speed: {
        x: 0,
        y: 0
    },
    offset:{
        x: 215,
        y: 157
    },
    imgSrc: './resource/samuraiMack/Idle.png',
    frames: 8,
    scale: 2.5,
    characterMovements: {
        idle: {
            imgSrc: './resource/samuraiMack/Idle.png',
            frames: 8
        },
        run: {
            imgSrc: './resource/samuraiMack/Run.png',
            frames: 8
        },
        jump: {
            imgSrc: './resource/samuraiMack/Jump.png',
            frames: 2
        },
        fall: {
            imgSrc: './resource/samuraiMack/Fall.png',
            frames: 2
        },
        attack1: {
            imgSrc: './resource/samuraiMack/Attack1.png',
            frames: 6
        },
        takeHit: {
            imgSrc: './resource/samuraiMack/Take Hit - white silhouette.png',
            frames: 4
        },
        death: {
            imgSrc: './resource/samuraiMack/Death.png',
            frames: 6
        }
    },
    attack: {
        offset: {
            x: 90,
            y: 50
        },
        width: 130, 
        height: 50
    }
});

const enemy = new CharacterDesign({
    position: {
        x: 400,
        y: 100
    },
    speed: {
        x: 0,
        y: 0
    },
    offset:{
        x: 215,
        y: 170
    },
    imgSrc: './resource/kenji/Idle.png',
    frames: 4,
    scale: 2.5,
    characterMovements: {
        idle: {
            imgSrc: './resource/kenji/Idle.png',
            frames: 4
        },
        run: {
            imgSrc: './resource/kenji/Run.png',
            frames: 8
        },
        jump: {
            imgSrc: './resource/kenji/Jump.png',
            frames: 2
        },
        fall: {
            imgSrc: './resource/kenji/Fall.png',
            frames: 2
        },
        attack1: {
            imgSrc: './resource/kenji/Attack1.png',
            frames: 4
        },
        takeHit: {
            imgSrc: './resource/kenji/Take hit.png',
            frames: 3
        },
        death: {
            imgSrc: './resource/kenji/Death.png',
            frames: 7
        },
    },
    attack: {
        offset: {
            x: -150,
            y: 50
        },
        width: 150, 
        height: 50
    }
});

//Player KeyPress
const playerKeyPress = {
    a: {
        pressState: false
    },
    d: {
        pressState: false
    },
    w: {
        pressState: false
    }
}

//Enemy KeyPress
const enemyKeyPress = {
    ArrowLeft: {
        pressState: false
    },
    ArrowRight: {
        pressState: false
    },
    ArrowUp: {
        pressState: false
    }
}

timer();

//Player and Enemy movements
function movements() {
    window.requestAnimationFrame(movements);
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    background.update();
    shop.update();

    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.2)';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    player.speed.x = 0;
    enemy.speed.x = 0;

    //Player Movements
    if (playerKeyPress.a.pressState && player.lastKey === 'a') {
        player.speed.x = -5;
        player.switchMovements('run');
    }
    else if (playerKeyPress.d.pressState && player.lastKey === 'd') {
        player.speed.x = 5;
        player.switchMovements('run');
    }
    else {
        player.switchMovements('idle');
    }

    //Player jump movements
    if(player.speed.y < 0){
        player.switchMovements('jump');
    }
    else if(player.speed.y > 0) {
        player.switchMovements('fall');
    }

    //Enemy Movements
    if (enemyKeyPress.ArrowLeft.pressState && enemy.lastKey === 'ArrowLeft') {
        enemy.speed.x = -5;
        enemy.switchMovements('run');
    }
    else if (enemyKeyPress.ArrowRight.pressState && enemy.lastKey === 'ArrowRight') {
        enemy.speed.x = 5;
        enemy.switchMovements('run');
    } else {
        enemy.switchMovements('idle');
    }

    //Enemy jump movements
    if(enemy.speed.y < 0){
        enemy.switchMovements('jump');
    }
    else if(enemy.speed.y > 0) {
        enemy.switchMovements('fall');
    }

    //Damage Made by Player
    if(
        damageConditions({
            playerAttack: player,
            enemyAttack: enemy 
        }) &&
        player.isDamaging && player.currentFrame === 4){
            enemy.takeHit();
            player.isDamaging = false;
            gsap.to('#enemyHealth', {width : enemy.health + '%'} );
    }
    
    //Player misses attack
    if(player.isDamaging && player.currentFrame === 4){
        player.isDamaging = false;
    }

    //Damage Made by Enemy
    if(
        damageConditions({
            playerAttack: enemy,
            enemyAttack: player 
        }) &&
        enemy.isDamaging && enemy.currentFrame === 2){
            player.takeHit();
            enemy.isDamaging = false;
            gsap.to('#playerHealth', {width : player.health + '%'} );
    }

    //Enemy misses attack
    if(enemy.isDamaging && enemy.currentFrame === 2){
        enemy.isDamaging = false;
    }

    //Display result if health is zero
    if(player.health === 0 || enemy.health === 0){
        displayResult(player, enemy, timerStop);
    }
}

movements();

window.addEventListener('keydown', (event) => {
    //Player Switch Events
    if(!player.dead) {
        switch (event.key) {
            case 'd': playerKeyPress.d.pressState = true;
                player.lastKey = 'd';
                break;
            case 'a': playerKeyPress.a.pressState = true;
                player.lastKey = 'a';
                break;
            case 'w': playerKeyPress.w.pressState = true;
                player.speed.y = -15;
                break;
            case ' ':
                player.damage();
                break;
        }
    }

        //Enemy Switch Events
        if(!enemy.dead) {
            switch (event.key) {
            case 'ArrowRight': enemyKeyPress.ArrowRight.pressState = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft': enemyKeyPress.ArrowLeft.pressState = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp': enemyKeyPress.ArrowUp.pressState = true;
                enemy.speed.y = -15;
                break;
            case 'ArrowDown':
                enemy.damage()
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    //Player Switch Events
    switch (event.key) {
        case 'd': playerKeyPress.d.pressState = false;
            break;
        case 'a': playerKeyPress.a.pressState = false;
            break;
        case 'w': playerKeyPress.w.pressState = false;
            break;
    }

        //Enemy Switch Events
        switch (event.key) {
        case 'ArrowRight': enemyKeyPress.ArrowRight.pressState = false;
            break;
        case 'ArrowLeft': enemyKeyPress.ArrowLeft.pressState = false;
            break;
        case 'ArrowUp': enemyKeyPress.ArrowUp.pressState = false;
            break;
    }
});

