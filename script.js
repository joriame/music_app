const playBtn = document.querySelector(".play-track");
const pauseBtn = document.querySelector(".pause-track");
const audio = new Audio("audio/saypink_-_Tipa_ya_i_tipa_ty_72664526.mp3");
const progressBar = document.querySelector(".slider-progress");
const thumb = document.querySelector(".slider-thumb");
const currentTimeEl = document.querySelector(".slider-start-text");
const durationEl = document.querySelector(".slider-end-text");
pauseBtn.style.display = "none";

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "block";
  } else {
    audio.pause();
    playBtn.style.display = "block";
    pauseBtn.style.display = "none";
  }
}

playBtn.addEventListener("click", togglePlay);
pauseBtn.addEventListener("click", togglePlay);

audio.addEventListener("timeupdate", () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = `${percent}%`;
  thumb.style.left = `${percent}%`;
});

document.querySelector(".slider-track").addEventListener("click", (e) => {
  const track = e.currentTarget;
  const clickPosition = e.clientX - track.getBoundingClientRect().left;
  const percentClicked = (clickPosition / track.offsetWidth) * 100;
  audio.currentTime = (percentClicked / 100) * audio.duration;
});

audio.addEventListener("ended", () => {
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
  audio.currentTime = 0;
});
function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
}


audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
