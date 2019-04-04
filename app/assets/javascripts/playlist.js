'use strict';

var Playlist = {
  renderMedia: (media) => {
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    // Add data-hash-id to be able to easily select this element for adding the thumbnail overlay
    el.querySelector('.thumbnail-overlay').setAttribute('data-hash-id', media.hashed_id);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.media-content').setAttribute(
      'href',
      '#wistia_' + media.hashed_id
    );

    document.getElementById('medias').appendChild(el);
  }
};

class VideoOverlay {
  constructor (video) {
    this.video = video;
  }

  createOverlay () {
    const overlay = document.createElement('div');
    const topText = document.createElement('p');
    const bottomText = document.createElement('p');
    const countdownText = document.createElement('p');

    countdownText.innerHTML = '5';
    countdownText.classList.add('countdown');

    topText.innerHTML = 'Up next';
    topText.classList.add('overlay-text');
    topText.classList.add('top-text');

    bottomText.innerHTML = this.video.name();
    bottomText.classList.add('overlay-text');
    bottomText.classList.add('bottom-text');

    overlay.classList.add('overlay');
    overlay.appendChild(topText);
    overlay.appendChild(countdownText);
    overlay.appendChild(bottomText);

    return overlay;
  }

  mount (rootElem) {
    this.video.pause(); // pause video while we add the overlay

    var overlay = this.createOverlay();
    rootElem.appendChild(overlay);

    this.overlay = overlay;

    this.video.bind("play", this.addThumbnailOverlay.bind(this));
    this.video.bind("beforereplace", this.removeThumbnailOverlay.bind(this));

    const countdownInterval = setInterval(this.updateCountdown, 1000);
    setTimeout(this.close.bind(this, countdownInterval), 5000);
  }

  updateCountdown () {
    const countdownDiv = document.querySelector('.countdown');
    const countdownNumber = countdownDiv.innerHTML;
    const newNumber = Number(countdownNumber) - 1;
    countdownDiv.innerHTML = newNumber;
  }

  addThumbnailOverlay () {
    const thumbnailOverlay = document.querySelector('[data-hash-id="' + this.video.hashedId() + '"]');
    thumbnailOverlay.style.display = 'block';
    return this.video.unbind;
  }

  removeThumbnailOverlay () {
    // remove thumbnail overlay
    const thumbnailOverlay = document.querySelector('[data-hash-id="' + this.video.hashedId() + '"]');
    thumbnailOverlay.style.display = 'none';

    // move thumbnail to bottom of list
    const mediaItem = thumbnailOverlay.closest('.media');
    document.querySelector('#medias').appendChild(mediaItem);
  }

  close (countdownInterval) {
    this.overlay.style.display = 'none';
    clearInterval(countdownInterval);
    this.video.play();
  }
}

window.wistiaInitQueue = window.wistiaInitQueue || [];
window.wistiaInitQueue.push(function(W) {
  VideoOverlay.type = 'foreground';
  VideoOverlay.handle = 'VideoOverlay';
  W.defineControl(VideoOverlay);
});

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      Utils.getMedias().then((medias) => {
        if (!medias) {
          return;
        }

        var videoIds = medias.data.map((media) => (media.id));
        Utils.getSettings(videoIds).then((settings) => {
          var visibleMedias = medias.data.filter((media) => {
            var setting = settings.data.find((setting) => (setting.video_id == media.id));
            return !setting ? true : setting.visible;
          });

          document
            .querySelector('.wistia_embed')
            .classList.add('wistia_async_' + visibleMedias[0].hashed_id);

            visibleMedias.forEach(function(media) {
            Playlist.renderMedia(media);
          });
        });
      });
    },
    false
  );
})();
