"use strict"

//selectors
const $score = document.querySelector("#score")
const $btn_play = document.querySelector("#btn")
const $messageWin = document.querySelector("#messageWin")
const $messageAct = document.querySelector("#messageAct")


//initialization
let leftSideScore;
let rightSideScore;
let ballKeep = null;
let leftSideThrowChances = 99;
let rightSideThrowChances = 99;
let leftSideChances = 50;
let rightSideChances = 50;
let timeLeft = 15;
//listeners
$btn_play.addEventListener("click", startGame)
  


//main functions
async function startGame(e){
  clear()
  const elem = e.target
  elem.disabled = true
  
  while(timeLeft > 0){
    ballKeep = await faceOff()
    await new Promise(resolve => {
      setTimeout(async function(){
        if(ballKeep == "left"){
          await throwBall(leftSideThrowChances)
        }else{
          await throwBall(rightSideThrowChances)
        }
        resolve()
        console.log(timeLeft--)
      }, 0)
    })
  }
  determWinner()
  elem.disabled = false
}
async function throwBall(sideChances){
  const expectation = getRandom(0, 100)
  if(expectation <= sideChances){
    ballKeep == "left" ? leftSideScore += 2 : rightSideScore += 2
    showMessageAct("Попал")
    changeScore()
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    })
    timeLeft--
    return
  }
  showMessageAct("Промах")
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  })
  timeLeft--
}

function startTimer() {
  let timerId = setInterval(() => {
    if(timeLeft <= 0){
      clearInterval(timerId)
    }
    timeLeft--
  }, 1000);
}


function determWinner(){
  if(leftSideScore > rightSideScore){
    $messageWin.innerHTML = "Победили левые!"
  }else if(leftSideScore < rightSideScore){
    $messageWin.innerHTML = "Победили правые!"
  }else{
    $messageWin.innerHTML = "Победила дружба!"
  }
}

async function faceOff(){
  await new Promise(resolve => {
    showMessageAct("Вбрасывание")
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  let side = await new Promise(resolve => {
    let side = getRandom(0, 100) > leftSideChances ? "left" : "right"
    showMessageAct("мяч у " + side)
    setTimeout(() => {
      resolve(side)
    }, 1000 )
  })
  timeLeft--
  return Promise.resolve(side)
}

function determSide(side){
  
}

function showMessageAct(message){
  console.log(message)
  $messageAct.textContent = message
}

function changeScore(){
  $score.innerHTML = `${leftSideScore} : ${rightSideScore}`
}



//add functions

function getRandom(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function clear(){
  leftSideScore = 0;
  rightSideScore = 0;
  timeLeft = 15;

  $messageWin.innerHTML = ""
  $score.innerHTML = "0:0"
}