// Cuddly Memory - script.js
const EMOJIS = ["🐻","🐼","🦊","🐰","🦁","🦄","🐨","🐶"];
const PAIR_COUNT = EMOJIS.length;
const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const timerEl = document.getElementById("timer");
const restartBtn = document.getElementById("restart");

let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matches = 0;
let timer = null;
let seconds = 0;

function formatTime(s){
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${mm}:${ss}`;
}

function startTimer(){
  stopTimer();
  seconds = 0;
  timerEl.textContent = formatTime(seconds);
  timer = setInterval(()=>{
    seconds++;
    timerEl.textContent = formatTime(seconds);
  },1000);
}

function stopTimer(){
  if(timer) clearInterval(timer);
  timer = null;
}

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i],array[j]] = [array[j],array[i]];
  }
  return array;
}

function buildDeck(){
  const pairArray = [...EMOJIS, ...EMOJIS];
  deck = shuffle(pairArray);
}

function createCard(emoji, idx){
  const card = document.createElement("button");
  card.className = "card";
  card.setAttribute("aria-label", "kart");
  card.setAttribute("data-emoji", emoji);
  card.setAttribute("data-index", idx);
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-face card-front">${emoji}</div>
      <div class="card-face card-back">💜</div>
    </div>
  `;
  card.addEventListener("click", onCardClick);
  return card;
}

function renderBoard(){
  boardEl.innerHTML = "";
  deck.forEach((emoji, i) => {
    boardEl.appendChild(createCard(emoji, i));
  });
}

function lockClicks(){
  lockBoard = true;
  setTimeout(()=> lockBoard = false, 400);
}

function onCardClick(e){
  if(lockBoard) return;
  const card = e.currentTarget;
  if(card === firstCard) return;
  if(moves === 0 && matches === 0 && !timer) startTimer();

  card.classList.add("flipped");

  if(!firstCard){
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves++;
  movesEl.textContent = moves;

  const a = firstCard.dataset.emoji;
  const b = secondCard.dataset.emoji;

  if(a === b){
    // Match
    firstCard.disabled = true;
    secondCard.disabled = true;
    matches++;
    matchesEl.textContent = matches;
    resetTurn();
    if(matches === PAIR_COUNT){
      stopTimer();
      setTimeout(()=> {
        const msg = `Tebrikler! Tüm kartları eşleştirdiniz.\nSüre: ${formatTime(seconds)} - Hamleler: ${moves}`;
        alert(msg);
      },350);
    }
  } else {
    // Not match
    setTimeout(()=>{
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    },700);
  }
}

function resetTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function initGame(){
  stopTimer();
  moves = 0;
  matches = 0;
  movesEl.textContent = moves;
  matchesEl.textContent = matches;
  timerEl.textContent = "00:00";
  buildDeck();
  renderBoard();
  // small delay so CSS transitions don't glitch on immediate start
  setTimeout(()=> boardEl.querySelectorAll(".card").forEach(c => c.classList.remove("flipped")), 50);
}

restartBtn.addEventListener("click", initGame);

// Initialize on load
initGame();
