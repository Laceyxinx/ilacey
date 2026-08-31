const folders = [...document.querySelectorAll('[data-page]')];
const pages = [...document.querySelectorAll('[data-content]')];

function showPage(name) {
  pages.forEach(page => page.classList.toggle('active', page.dataset.content === name));
  document.querySelectorAll('.folders .folder').forEach(folder => {
    folder.classList.toggle('active', folder.dataset.page === name);
  });
}

folders.forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));

const tracks = [
  {
    title: 'Thank U, Next',
    artist: 'Ariana Grande',
    src: 'assets/thank_u_next.mp3',
    cover: 'assets/thank_u_next_cover.jpg'
  },
  {
    title: 'The Cure',
    artist: 'Olivia Rodrigo',
    src: 'assets/olivia_rodrigo_the_cure.mp3',
    cover: 'assets/olivia_rodrigo_the_cure_cover.png'
  }
];

const audio = document.getElementById('bg-music');
const player = document.querySelector('.player');
const play = document.getElementById('play');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const progress = document.getElementById('progress');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackCover = document.getElementById('track-cover');
const trackCount = document.getElementById('track-count');
let currentTrack = 0;
let userPaused = false;

function setPlayIcon() {
  play.textContent = audio.paused ? '▶' : 'Ⅱ';
}

function loadTrack(index, shouldPlay = !audio.paused) {
  audio.pause();
  currentTrack = (index + tracks.length) % tracks.length;
  const track = tracks[currentTrack];
  audio.src = track.src;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackCover.src = track.cover;
  trackCover.alt = `${track.title} 封面`;
  trackCount.textContent = `${currentTrack + 1} / ${tracks.length}`;
  progress.style.setProperty('--progress', '0%');
  player.classList.remove('switching');
  void player.offsetWidth;
  player.classList.add('switching');
  if (shouldPlay) audio.play().catch(setPlayIcon);
  else setPlayIcon();
}

function tryPlay() {
  if (!userPaused && audio.paused) audio.play().catch(() => {});
}

play.addEventListener('click', () => {
  if (audio.paused) {
    userPaused = false;
    audio.play().catch(setPlayIcon);
  } else {
    userPaused = true;
    audio.pause();
  }
});

previous.addEventListener('click', () => loadTrack(currentTrack - 1, true));
next.addEventListener('click', () => loadTrack(currentTrack + 1, true));
audio.addEventListener('play', setPlayIcon);
audio.addEventListener('pause', setPlayIcon);
audio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));

tryPlay();
['pointerdown', 'keydown'].forEach(eventName => addEventListener(eventName, event => {
  if (event.target?.closest?.('.player-controls')) return;
  tryPlay();
}, { capture: true }));

if (progress) {
  const setPercent = percent => progress.style.setProperty('--progress', `${percent}%`);
  const seekFromPointer = event => {
    const rect = progress.getBoundingClientRect();
    const percent = Math.min(100, Math.max(0, (event.clientX - rect.left) / rect.width * 100));
    setPercent(percent);
    if (audio.duration) audio.currentTime = percent / 100 * audio.duration;
  };
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) setPercent(audio.currentTime / audio.duration * 100);
  });
  let wasPlaying = false;
  let dragging = false;
  progress.addEventListener('pointerdown', event => {
    dragging = true;
    wasPlaying = !audio.paused;
    progress.classList.add('dragging');
    seekFromPointer(event);
    progress.setPointerCapture?.(event.pointerId);
  });
  progress.addEventListener('pointermove', event => {
    if (!dragging) return;
    seekFromPointer(event);
    if (wasPlaying) audio.pause();
  });
  progress.addEventListener('pointerup', event => {
    if (!dragging) return;
    dragging = false;
    progress.classList.remove('dragging');
    seekFromPointer(event);
    if (wasPlaying && !userPaused) audio.play();
  });
  progress.addEventListener('pointercancel', () => {
    dragging = false;
    progress.classList.remove('dragging');
    if (wasPlaying && !userPaused) audio.play();
  });
}

const cursor = document.querySelector('.cursor');
addEventListener('pointermove', event => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});
document.querySelectorAll('button, a').forEach(element => {
  element.addEventListener('pointerenter', () => cursor.classList.add('hover'));
  element.addEventListener('pointerleave', () => cursor.classList.remove('hover'));
});
