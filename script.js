const playBtn = document.querySelector(".play-track");
const pauseBtn = document.querySelector(".pause-track");
const audio = new Audio("audio/saypink_-_Tipa_ya_i_tipa_ty_72664526.mp3");
const progressBar = document.querySelector(".slider-progress");
const thumb = document.querySelector(".slider-thumb");
const currentTimeEl = document.querySelector(".slider-start-text");
const durationEl = document.querySelector(".slider-end-text");
const volumeBar = document.querySelector(".volume-progress");
const volumeThumb = document.querySelector(".volume-thumb");
const volumeMute = document.querySelector(".volume-icon-0");
const volume60 = document.querySelector(".volume-icon-60");
const volume30 = document.querySelector(".volume-icon-30");
const volume100 = document.querySelector(".volume-icon-100");
const volumeValues = [volumeMute, volume60, volume30, volume100];
pauseBtn.style.display = "none";
audio.volume = 0.5;
updateVolumeBar();
function updateVolumeBar() {
  const percent = audio.volume * 100;
  volumeBar.style.width = `${percent}%`;
  volumeThumb.style.left = `${percent}%`;
}
volumeValues.forEach((element) => {
  element.addEventListener("click", () => {
    element.style.display = "none";
    volumeMute.style.display = "block";
    audio.volume = 0;
    updateVolumeBar();
    if (volumeMute.style.display == "block") {
      
    }
  });
});
document.querySelector(".volume-track").addEventListener("click", (e) => {
  const track = e.currentTarget;
  const clickPosition = e.clientX - track.getBoundingClientRect().left;
  const percentClicked = clickPosition / track.offsetWidth;

  audio.volume = Math.max(0, Math.min(percentClicked, 1));
  updateVolumeBar();
});

let isVolumeDragging = false;

volumeThumb.addEventListener("mousedown", () => {
  isVolumeDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (!isVolumeDragging) return;

  const track = document.querySelector(".volume-track");
  const clickPosition = e.clientX - track.getBoundingClientRect().left;
  const percentClicked = clickPosition / track.offsetWidth;

  audio.volume = Math.max(0, Math.min(percentClicked, 1));
  updateVolumeBar();
  if (audio.volume == 0) {
    volumeMute.style.display = "block";
    volume30.style.display = "none";
    volume60.style.display = "none";
    volume100.style.display = "none";
  } else if (audio.volume > 0 && audio.volume <= 0.3) {
    volume60.style.display = "none";
    volumeMute.style.display = "none";
    volume100.style.display = "none";
    volume30.style.display = "block";
  } else if (audio.volume > 0.3 && audio.volume < 0.6) {
    volume30.style.display = "none";
    volumeMute.style.display = "none";
    volume100.style.display = "none";
    volume60.style.display = "block";
  } else if (audio.volume > 0.6 && audio.volume <= 1) {
    volume30.style.display = "none";
    volume60.style.display = "none";
    volumeMute.style.display = "none";
    volume100.style.display = "block";
  }
});

document.addEventListener("mouseup", () => {
  isVolumeDragging = false;
});

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
