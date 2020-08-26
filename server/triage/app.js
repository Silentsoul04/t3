// Credit: Mateusz Rybczonec

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 70;
const ALERT_THRESHOLD = 20;
const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}


/////////////////////////////////////////////////////////////////////////////////

function pushButton () {
  if(TIME_LEFT < 600) {}
  else {
    var endtime = ((new Date()).getTime() + 600 * 1000);
    var current = {'question' : question, 'endTime': endtime};
    addLsEntry('status', 'current', current);
    startTimer();
    ent.innerHTML = quiz;
  }
}

function leftCheck () {
  if(localStorage.getItem('status')){
    var t = JSON.parse(localStorage.getItem('status'));
    var finishTime = t.current.endTime;
    var timeLeft = (finishTime - new Date());
    var timeLeft = Math.round(timeLeft/1000,0);
    if (timeLeft < 0 ){
      localStorage.removeItem('status');
      return 600;
    }
    else {
      return timeLeft;
    }
  }
  else {
    return 600;
  }
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function questionCheck () {
  if(localStorage.getItem('status')){
    var s = JSON.parse(localStorage.getItem('status'));
    var quest = s.current.question;
    return quest;
  }
  else {
    var quest = pickRandomQuestion();
    return quest;
  }
}

function checkAnswer () {
  var guess = document.getElementById("guess").value; 
  var hash = CryptoJS.MD5(guess).toString();
  var actual = getKeyByValue(dict, question);
  if (hash == actual){
    res.innerHTML = "CORRECT!";
    clearInterval(timerInterval);
    var record = JSON.parse(localStorage.getItem('record'));
    if (record == null){
      var num = 1;
    }
    else {
      var num = Object.keys(record).length + 1;
    }
    saveCorrectGuess(num, question, timePassed);
    sleep(2000).then(() => {
      localStorage.removeItem('status');
      window.location.reload(false);
    });
  }
  else {
    res.innerHTML = `${guess} is not the correct answer`;
  }
}

function pickRandomQuestion () {
  var keys = Object.keys(dict);
  var quest = dict[keys[ keys.length * Math.random() << 0]];
  return quest;
}

function addLsEntry (name, key, value) {
  var old = localStorage.getItem(name);
	old = old ? JSON.parse(old) : {};
  old[key] = value;
  localStorage.setItem(name, JSON.stringify(old));
}

function saveCorrectGuess (num, question, timePassed) {
  var correct = {'question': question, 'time': timePassed};
  addLsEntry('record', num, correct);
}

function onTimesUp() {
  clearInterval(timerInterval);
  localStorage.removeItem('myTime');
  localStorage.removeItem('myQuiz');
  window.location.reload(false); 
}


////////////////////////////////////////////////////////////////////////////////////////////

var dict = {
  'e8315caa4eb8c2a2625d4e97dbba100a': "Who is the greatest martial artist ever?",
  '8fb744b51a1f14e5e8cda4e4aec68e2f': "Who is the greatest jiu-jitsu player now?",
  '39b6046c0b155cb9ee7451b926d6bd7c': "Who is the greatest jiu-jitsu coach?"
};


var sta = document.getElementById("start");
var ent = document.getElementById("enter");
var res = document.getElementById("result");
var dis = document.getElementById("display");



TIME_LIMIT = 600;
TIME_LEFT = leftCheck();
TIME_PASSED = TIME_LIMIT - TIME_LEFT;
CURRENT_QUESTION = questionCheck();

let timeLeft = TIME_LEFT;
let timePassed = TIME_PASSED;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
let question = CURRENT_QUESTION

var panel = `<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
</div>
`;

var quiz = `
<p><b>${question}</b></p>
<input type="text" id="guess" value="" />
<button type="submit" onclick="checkAnswer('guess', 'status')" id="guessbtn">Submit</button>
`;


dis.innerHTML = panel;

if (timeLeft > 0 && timeLeft < 600){
  startTimer();
  ent.innerHTML = quiz;
}
else {
  ent.innerHTML = '';
}
