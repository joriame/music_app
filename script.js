// Кнопки управления
const playBtn = document.querySelector(".play-track");
const pauseBtn = document.querySelector(".pause-track");
const nextBtn = document.querySelector(".next-track");
const prevBtn = document.querySelector(".last-track");

// Прогресс-бар
const progressBar = document.querySelector(".slider-progress");
const progressTrack = document.querySelector(".slider-track");
const currentTimeEl = document.querySelector(".slider-start-text");
const durationEl = document.querySelector(".slider-end-text");

// Громкость
const volumeBar = document.querySelector(".volume-progress");
const volumeThumb = document.querySelector(".volume-thumb");
const volumeTrack = document.querySelector(".volume-track");
const volumeMute = document.querySelector(".volume-icon-0");
const volume60 = document.querySelector(".volume-icon-60");
const volume30 = document.querySelector(".volume-icon-30");
const volume100 = document.querySelector(".volume-icon-100");
const volumeValues = [volumeMute, volume60, volume30, volume100];

// Информация о треке
const trackTitleEl = document.querySelector(".track-title");
const trackArtistEl = document.querySelector(".track-artist");
const trackImageEl = document.querySelector(".wrapper-img");

// База треков
const tracks = [
  {
    id: 1,
    title: "Типа я и типа ты",
    artist: "saypink!",
    wrapper: "img/saypink!.jpg",
    audio: "audio/saypink_-_Tipa_ya_i_tipa_ty_72664526.mp3",
  },
  {
    id: 2,
    title: "Не для нас",
    artist: "ЗоХа",
    wrapper: "img/zoha.jpg",
    audio: "audio/ZoKHa_-_Ne_dlya_nas_76304369.mp3",
  },
  {
    id: 3,
    title: "Стенки моего подъезда",
    artist: "CUPSIZE",
    wrapper: "img/cupsize.png",
    audio: "audio/CUPSIZE_-_Stenki_moego_podezda_78545156.mp3",
  },
  {
    id: 4,
    title: "Как ты",
    artist: "Атрава",
    wrapper: "img/atrava.jpg",
    audio: "audio/Атрава - Как ты [audiovk.com].mp3",
  },
];

let currentTrackIndex = 0;
let isVolumeDragging = false;
let isSeeking = false;

// Создаём аудио-объект
const audio = new Audio();
audio.preload = "metadata";

// Инициализация
function initPlayer() {
  pauseBtn.style.display = "none";
  audio.volume = 0.5;
  updateVolumeBar();
  updateVolumeIcons();
  loadTrack(currentTrackIndex);
}

// Загрузка трека
function loadTrack(index) {
  if (index < 0) index = tracks.length - 1;
  if (index >= tracks.length) index = 0;
  currentTrackIndex = index;

  const track = tracks[index];
  audio.src = track.audio;
  audio.load();

  // Обновление UI
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  trackImageEl.src = track.wrapper;

  progressBar.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = formatTime(track.duration || 0);

  pauseBtn.style.display = "none";
  playBtn.style.display = "block";
}

// Переключения треков
function nextTrack() {
  loadTrack(currentTrackIndex + 1);
  playAudio();
}
function prevTrack() {
  loadTrack(currentTrackIndex - 1);
  playAudio();
}

function playAudio() {
  audio.play();
  playBtn.style.display = "none";
  pauseBtn.style.display = "block";
}
function pauseAudio() {
  audio.pause();
  playBtn.style.display = "block";
  pauseBtn.style.display = "none";
}
function togglePlay() {
  if (audio.paused) playAudio();
  else pauseAudio();
}

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  if (!isSeeking) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener("ended", nextTrack);

progressTrack.addEventListener("click", (e) => {
  const rect = progressTrack.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const percent = clickPosition / progressTrack.offsetWidth;
  if (audio.duration) {
    audio.currentTime = percent * audio.duration;
  }
});

progressTrack.addEventListener("mousedown", (e) => {
  isSeeking = true;
  seek(e);
});
document.addEventListener("mousemove", (e) => {
  if (isSeeking) seek(e);
});
document.addEventListener("mouseup", () => {
  if (isSeeking) isSeeking = false;
});
function seek(e) {
  const rect = progressTrack.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.min(Math.max(x / progressTrack.offsetWidth, 0), 1);
  if (audio.duration) {
    audio.currentTime = percent * audio.duration;
    progressBar.style.width = `${percent * 100}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
}

// Громкость
function updateVolumeBar() {
  const percent = audio.volume * 100;
  volumeBar.style.width = `${percent}%`;
  volumeThumb.style.left = `${percent}%`;
}
function updateVolumeIcons() {
  if (audio.volume === 0) {
    volumeMute.style.display = "block";
    volume30.style.display = "none";
    volume60.style.display = "none";
    volume100.style.display = "none";
  } else if (audio.volume > 0 && audio.volume <= 0.3) {
    volumeMute.style.display = "none";
    volume30.style.display = "block";
    volume60.style.display = "none";
    volume100.style.display = "none";
  } else if (audio.volume > 0.3 && audio.volume <= 0.6) {
    volumeMute.style.display = "none";
    volume30.style.display = "none";
    volume60.style.display = "block";
    volume100.style.display = "none";
  } else {
    volumeMute.style.display = "none";
    volume30.style.display = "none";
    volume60.style.display = "none";
    volume100.style.display = "block";
  }
}
volumeValues.forEach((element) => {
  element.addEventListener("click", () => {
    let volumeLevel = 0;
    if (element === volumeMute) volumeLevel = 0;
    else if (element === volume30) volumeLevel = 0.3;
    else if (element === volume60) volumeLevel = 0.6;
    else if (element === volume100) volumeLevel = 1;
    audio.volume = volumeLevel;
    updateVolumeBar();
    updateVolumeIcons();
  });
});
volumeTrack.addEventListener("click", (e) => {
  const rect = volumeTrack.getBoundingClientRect();
  const clickPosition = e.clientX - rect.left;
  const percentClicked = Math.min(
    Math.max(clickPosition / volumeTrack.offsetWidth, 0),
    1
  );
  audio.volume = percentClicked;
  updateVolumeBar();
  updateVolumeIcons();
});
volumeThumb.addEventListener("mousedown", () => {
  isVolumeDragging = true;
});
document.addEventListener("mousemove", (e) => {
  if (!isVolumeDragging) return;
  const rect = volumeTrack.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.min(Math.max(x / volumeTrack.offsetWidth, 0), 1);
  audio.volume = percent;
  updateVolumeBar();
  updateVolumeIcons();
});
document.addEventListener("mouseup", () => {
  isVolumeDragging = false;
});

// Форматирование времени
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const min = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${min}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// События кнопок
playBtn.addEventListener("click", togglePlay);
pauseBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// Инициализация плеера
initPlayer();
