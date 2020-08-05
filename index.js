"use strict"

//initialization
let leftScore = 0;
let rightScore = 0;



//selectors
const $score = document.querySelector("#score")
const $btn_play = document.querySelector("#btn")
const $message = document.querySelector("#message")

//listeners
$btn_play.addEventListener("click", startGame)
    


//main functions
function startGame(e){
    const elem = e.target
    elem.disabled = true
    let timeLeft = 60;
    const timerId = setInterval(function(){
        console.log(timeLeft);
        if(timeLeft == 0){
            clearInterval(timerId)
            determWinner()
        }else{
            throwBall()
            timeLeft -= 1
        }
    }, 1000)
    
}
function throwBall(time){
    const chosenSide = getRandom(0, 100) > 49
    if(chosenSide){
        leftScore += 2
    }else{
        rightScore += 2
    }
    $score.innerHTML = `${leftScore} : ${rightScore}`
}


function determWinner(){
    if(leftScore > rightScore){
        $message.innerHTML = "Победили левые!"
    }else if(leftScore < rightScore){
        $message.innerHTML = "Победили правые!"
    }else{
        $message.innerHTML = "Победила дружба!"
    }
}
//add functions

function getRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}