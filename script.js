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

const travelBooks = [
  { id: 'paris', number: '01', title: 'PARIS', year: '2025', pages: [
    { intro: '巴黎旅行日志正在等待你的照片与故事。', caption: 'A MOMENT WORTH KEEPING ♡' },
    { intro: '第二篇内页将记录街道、展览与偶然遇见的风景。', caption: 'WALKING WITHOUT A MAP' },
    { intro: '最后一篇内页留给旅程结束后仍然记得的细节。', caption: 'POSTCARDS FROM PARIS' }
  ]},
  { id: 'iceland', number: '02', title: 'ICELAND', year: '2025', pages: [
    { intro: '冰岛旅行日志正在等待你的照片与故事。', caption: 'LAND OF WIND & WATER' },
    { intro: '这一页将记录公路、天气和沿途停下来的理由。', caption: 'SOMEWHERE ON THE ROAD' },
    { intro: '这一页留给冰岛旅程中最难忘的一天。', caption: 'A DAY TO REMEMBER' }
  ]},
  { id: 'europe', number: '03', title: 'EUROPE', year: '2025', pages: [
    { intro: '欧洲旅行日志正在等待你的照片与故事。', caption: 'NOTES ACROSS EUROPE' },
    { intro: '这一页将收录城市之间的火车、车票和短暂停留。', caption: 'BETWEEN TWO CITIES' },
    { intro: '这一页留给没有出现在计划里的惊喜。', caption: 'THE UNPLANNED PART' }
  ]},
  { id: 'asia', number: '04', title: 'ASIA', year: 'SOON', pages: [
    { intro: '这本旅行日志还没有开始书写。', caption: 'A NEW CHAPTER SOON' },
    { intro: '未来的路线、照片和故事会放在这里。', caption: 'PLACES ON MY LIST' }
  ]},
  { id: 'moments', number: '05', title: 'LITTLE MOMENTS', year: 'SOON', pages: [
    { intro: '这里将收藏路途中不起眼但舍不得忘记的瞬间。', caption: 'SMALL THINGS I KEPT' },
    { intro: '可能是一顿饭、一张车票，或某个刚好经过的人。', caption: 'FOUND ALONG THE WAY' }
  ]}
];
const bookOverlay = document.getElementById('book-overlay');
const bookTitle = document.getElementById('book-title');
const bookNumber = document.getElementById('book-number');
const bookYear = document.getElementById('book-year');
const bookIntro = document.getElementById('book-intro');
const photoCaption = document.getElementById('photo-caption');
const leftPageNumber = document.getElementById('left-page-number');
const rightPageNumber = document.getElementById('right-page-number');
const spreadStatus = document.getElementById('spread-status');
const flipSheet = document.querySelector('.flip-sheet');
const previousPageButton = document.querySelector('.prev-page');
const nextPageButton = document.querySelector('.next-page');
let currentBook = travelBooks[0];
let currentSpread = 0;
let pageIsTurning = false;

function renderSpread(index) {
  currentSpread = Math.max(0, Math.min(index, currentBook.pages.length - 1));
  const page = currentBook.pages[currentSpread];
  const leftNumber = currentSpread * 2 + 1;
  bookTitle.textContent = currentBook.title;
  bookNumber.textContent = currentBook.number;
  bookYear.textContent = currentBook.year;
  bookIntro.textContent = page.intro;
  photoCaption.textContent = page.caption;
  leftPageNumber.textContent = String(leftNumber).padStart(2, '0');
  rightPageNumber.textContent = String(leftNumber + 1).padStart(2, '0');
  spreadStatus.textContent = `PAGE ${currentSpread + 1} / ${currentBook.pages.length}`;
  previousPageButton.disabled = currentSpread === 0;
  nextPageButton.disabled = currentSpread === currentBook.pages.length - 1;
  document.querySelectorAll('.paper').forEach(pageElement => {
    pageElement.classList.remove('page-changing');
    void pageElement.offsetWidth;
    pageElement.classList.add('page-changing');
  });
}

function turnPage(direction) {
  if (pageIsTurning) return;
  const target = currentSpread + direction;
  if (target < 0 || target >= currentBook.pages.length) return;
  pageIsTurning = true;
  flipSheet.classList.remove('turn-next', 'turn-prev');
  void flipSheet.offsetWidth;
  flipSheet.classList.add(direction > 0 ? 'turn-next' : 'turn-prev');
  setTimeout(() => renderSpread(target), 520);
  setTimeout(() => {
    flipSheet.classList.remove('turn-next', 'turn-prev');
    pageIsTurning = false;
  }, 1080);
}

async function flyBookToCenter(sourceBook) {
  const sourceRect = sourceBook.getBoundingClientRect();
  const openBookRect = document.querySelector('.open-book').getBoundingClientRect();
  const closedWidth = (openBookRect.width - 34) / 2;
  const closedLeft = openBookRect.left + openBookRect.width / 2 + 17;
  const color = getComputedStyle(sourceBook).getPropertyValue('--book').trim() || '#efa0c8';
  const volume = document.createElement('div');
  volume.className = 'flight-volume';
  volume.style.setProperty('--flight-color', color);
  volume.style.left = `${sourceRect.left}px`;
  volume.style.top = `${sourceRect.top}px`;
  volume.style.width = `${sourceRect.width}px`;
  volume.style.height = `${sourceRect.height}px`;
  volume.innerHTML = `<div class="flight-page-block"></div><div class="flight-cover"><span>${currentBook.title}</span></div><div class="flight-spine"></div>`;
  document.body.appendChild(volume);
  sourceBook.style.opacity = '0';

  const extraction = volume.animate([
    { left: `${sourceRect.left}px`, top: `${sourceRect.top}px`, width: `${sourceRect.width}px`, height: `${sourceRect.height}px`, transform: 'translateZ(0) rotateY(0) rotateZ(0)', offset: 0 },
    { left: `${sourceRect.left + 18}px`, top: `${sourceRect.top - 24}px`, width: `${sourceRect.width * 1.08}px`, height: `${sourceRect.height * 1.08}px`, transform: 'translateZ(55px) rotateY(-22deg) rotateZ(-2deg)', offset: .24 },
    { left: `${closedLeft}px`, top: `${openBookRect.top}px`, width: `${closedWidth}px`, height: `${openBookRect.height}px`, transform: 'translateZ(130px) rotateY(-8deg) rotateZ(0)', offset: .78 },
    { left: `${closedLeft}px`, top: `${openBookRect.top}px`, width: `${closedWidth}px`, height: `${openBookRect.height}px`, transform: 'translateZ(0) rotateY(0) rotateZ(0)', offset: 1 }
  ], { duration: 920, easing: 'cubic-bezier(.18,.75,.18,1)', fill: 'forwards' });
  await extraction.finished;

  bookOverlay.classList.add('revealing');
  volume.classList.add('opening');
  await new Promise(resolve => setTimeout(resolve, 940));
  volume.remove();
  sourceBook.style.opacity = '';
}

async function openTravelBook(id, sourceBook) {
  currentBook = travelBooks.find(book => book.id === id) || travelBooks[0];
  currentSpread = 0;
  renderSpread(0);
  bookOverlay.classList.add('preparing');
  bookOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('book-is-open');
  await flyBookToCenter(sourceBook);
  bookOverlay.classList.remove('preparing', 'revealing');
  bookOverlay.classList.add('open');
  document.querySelector('.book-close').focus();
}

function closeTravelBook() {
  bookOverlay.classList.remove('open', 'preparing', 'revealing');
  bookOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('book-is-open');
}

document.querySelectorAll('[data-book]').forEach(book => {
  book.addEventListener('click', () => openTravelBook(book.dataset.book, book));
});
document.querySelector('.book-close').addEventListener('click', closeTravelBook);
previousPageButton.addEventListener('click', () => turnPage(-1));
nextPageButton.addEventListener('click', () => turnPage(1));
bookOverlay.addEventListener('click', event => {
  if (event.target === bookOverlay) closeTravelBook();
});
addEventListener('keydown', event => {
  if (!bookOverlay.classList.contains('open')) return;
  if (event.key === 'Escape') closeTravelBook();
  if (event.key === 'ArrowLeft') turnPage(-1);
  if (event.key === 'ArrowRight') turnPage(1);
});
