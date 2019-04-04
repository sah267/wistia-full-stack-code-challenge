'use strict';

var Dashboard = {
  renderTag: function(mediaEl, tag) {
    var template = document.getElementById('tag-template');
    var clone = template.content.cloneNode(true);
    var tagEl = clone.children[0];

    tagEl.innerText = tag;
    mediaEl.querySelector('.tags').append(tagEl);
  },

  renderTags: function(mediaEl, tags) {
    tags.forEach(function(tag) {
      Dashboard.renderTag(mediaEl, tag);
    });
  },

  renderMedia: function(media, setting) {
    var template = document.getElementById('media-template');
    var clone = template.content.cloneNode(true);
    var el = clone.children[0];

    el.querySelector('.thumbnail').setAttribute('src', media.thumbnail.url);
    el.querySelector('.title').innerText = media.name;
    el.querySelector('.duration').innerText = Utils.formatTime(media.duration);
    el.querySelector('.count').innerText = '?';
    el.setAttribute('data-hashed-id', media.hashed_id);
    el.querySelector('.visibility-toggle').setAttribute('data-video-id', media.id);
    el.querySelector('.visibility-toggle').setAttribute('data-visible', setting && setting.visible);

    if (setting && !setting.visible) {
      el.querySelector('.media--visible').style.display = 'none';
      el.querySelector('.media--hidden').style.display = 'block';
    }

    this.renderTags(el, ['tag-1', 'tag-2']);

    document.getElementById('medias').appendChild(el);
  },

  openModal: function() {
    document.querySelector('.modal').classList.add('modal--open');
  },

  closeModal: function() {
    document.querySelector('.modal').classList.remove('modal--open');
  },

  addTag: function() {
    var el = document.createElement('li');
    el.querySelector('.tags').appendChild(el);
  }
};

(function() {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      Utils.getMedias().then((medias) => {
        var videoIds = medias.data.map((media) => (media.id));

        Utils.getSettings(videoIds).then((settings) => {
          medias.data.map(function(media) {
            var setting = settings.data.find((setting) => (setting.video_id == media.id));
            Dashboard.renderMedia(media, setting);
          });
        });
      });
    },
    { useCapture: false }
  );

  document.addEventListener(
    'click',
    function(event) {
      if (event && event.target.matches('.visibility-toggle')) {
        var toggleBtn = event.target;
        var videoId = toggleBtn.getAttribute('data-video-id');
        var newVisibility = !toggleBtn.getAttribute('data-visible');
        return axios.put(
          '/video_settings/'+ videoId, 
          { visible: newVisibility }, 
          { headers: { 'X-CSRF-Token': document.querySelector("meta[name=csrf-token]").content } 
        }).then(function(_) {
          toggleBtn.setAttribute('data-visible', newVisibility);
          if (!newVisibility) {
            toggleBtn.querySelector('.media--visible').style.display = 'none';
            toggleBtn.querySelector('.media--hidden').style.display = 'block';
          } else {
            toggleBtn.querySelector('.media--visible').style.display = 'block';
            toggleBtn.querySelector('.media--hidden').style.display = 'none';
          }
        });
      }

      if (event && event.target.matches('.tag-button')) {
        Dashboard.openModal();
      }

      if (event && event.target.matches('.modal__button--close')) {
        Dashboard.closeModal();
      }
    },
    { useCapture: true }
  );
})();
