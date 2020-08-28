"use strict"

//selectors
const $score = document.querySelector("#score")
const $btn_play = document.querySelector("#btn")
const $messageWin = document.querySelector("#messageWin")
const $messageAct = document.querySelector("#messageAct")
const $timer = document.querySelector("#timer")
const $teamNames = document.querySelector("#teams")


//variables
let leftSideScore;
let rightSideScore;
let ballKeep = null;
const chances = {
  throwChances: {
    left: 60,
    right: 70
  },
  stealChances: {
    left: 50,
    right: 50
  },
  faceOffChances: {
    left: 50,
    right: 50
  }
}

let leftTeamName = "Left team"
let rightTeamName = "Right team"
// let timeLeft = 60;




//listeners
$btn_play.addEventListener("click", startGame)
$teamNames.addEventListener("input", changeNames)


//main functions
function startGame(e) {
  let actions = createGame() 
  timePlay(actions)
}

function createGame() {
  clear()
  let result = []
  while(result.length < 20) {
    if (result.length == 0) {
      result.push(faceOff(`Вбрасывание`, {startTime: 60}))
    }
    const prevAction = result[result.length - 1]
    switch (prevAction.type) {
      case "faceOff":
        result.push(getBall(prevAction))
        break;
      case "getBall":
        result.push(throwBall(prevAction))
        break;
      case "throwBall":
        if (prevAction.throw) {
          result.push(getBall(prevAction))
        } else {
          result.push(faceOff(`Подбор`, prevAction))
        }
        break;
    }
  }
  console.log(result)
  return result
}
createGame()
function faceOff(message, {startTime}){
  const playAction = {
    side: getRandom(0, 100) > chances.faceOffChances ? leftTeamName : rightTeamName ,
    message: showMessageAct.bind(null, message),
    startTime: startTime - 1,
    type: "faceOff"
  }

  return playAction
}


function getBall({side, startTime}) {
  const playAction = {
    side,
    message: showMessageAct.bind(null,`Мяч у ${side}`),
    startTime: startTime - getRandom(1, 2),
    type: "getBall"
  }

  return playAction
}


// createGame()

function timePlay(actions) {
  let j = 0
  let timer = setInterval(() => {
    $timer.innerHTML = $timer.innerHTML - 1
    console.log("timeLeft:", $timer.innerHTML)
    if (actions[j].startTime == $timer.innerHTML) {
      actions[j].message()
      j++
    }
    if ($timer.innerHTML <= 0){
      clearInterval(timer)
    } 
  }, 1000)
}

function throwBall({side, startTime}){
  const playAction = {
    type: "throwBall"
  }
  const expectation = getRandom(0, 100)
  if (expectation < chances.throwChances[side]) {
    playAction.message = function() {
      showMessageAct(`${side} попал`)
      plus2p(side)
    }
    playAction.throw = true
    playAction.startTime = startTime - getRandom(1, 3)
    playAction.side = side == "left" ? "right" : "left"
  }else {
    playAction.message = showMessageAct.bind(this, `${side} промахнулся`)
    playAction.throw = false
    playAction.startTime = startTime - getRandom(1, 4)
  }

  return playAction
}

function plus2p(side) {
  side == "left" ? leftSideScore += 2 : rightSideScore += 2
  changeScore()
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

function showMessageAct(message){
  console.log(message)
  $messageAct.textContent = message
}

function changeScore(){
  $score.innerHTML = `${leftSideScore} : ${rightSideScore}`
}

//teamNames functions

function changeNames(event) {
  if (event.target.dataset.teamname) {
    if (event.target.dataset.teamname == "left") {
      leftTeamName = event.target.textContent
    } else if (event.target.dataset.teamname == "right") {
      rightTeamName = event.target.textContent
    }
    
  }
}


//utils

function getRandom(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function clear(){
  leftSideScore = 0;
  rightSideScore = 0;

  $messageWin.innerHTML = ""
  $score.innerHTML = "0:0"
}