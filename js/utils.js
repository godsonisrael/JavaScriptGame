//Game timer
let gameTime = 60;
let timerStop;
function timer() {
    timerStop = setTimeout(timer, 1000);
    if(gameTime > 0){
        gameTime--;
        document.querySelector('#timer').innerHTML = gameTime;
    }
    if(gameTime === 0){ 
        displayResult(player, enemy, timerStop);
    }
}

//Display Result
function displayResult(player, enemy, timerStop){  
    clearTimeout(timerStop);
    document.querySelector('#result').style.display = 'flex'; 
    if(player.health === enemy.health){
        document.querySelector('#result').innerHTML = 'Tie!';
    }

    else if(player.health > enemy.health){
        document.querySelector('#result').innerHTML = 'You Win!';
    }

    else if(player.health < enemy.health){
        document.querySelector('#result').innerHTML = 'You Lose!';
    }
}

//Player and Enemy damage conditions
function damageConditions({playerAttack, enemyAttack}) {
    return(
        playerAttack.attack.position.x + playerAttack.attack.width >= enemyAttack.position.x &&
        playerAttack.attack.position.x <= enemyAttack.position.x + enemyAttack.width &&
        playerAttack.attack.position.y + playerAttack.attack.height >= enemyAttack.position.y &&
        playerAttack.attack.position.y <= enemyAttack.position.y + enemyAttack.height
    )
}