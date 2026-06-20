import i18next from 'i18next';
import { proxy } from 'valtio/vanilla';
import './styles.css';
import ru from './locales/ru.js';
import validate from './validate.js';
import initView from './view.js';
import fetchFeed from './api.js';
import parse from './parse.js';

// ─── Утилиты ────────────────────────────────────────────────

let nextId = 1;
const generateId = () => {
  nextId += 1;
  return nextId;
};

// ─── Состояние ──────────────────────────────────────────────

const state = proxy({
  feeds: [],   // [{ id, url, title, description }]
  posts: [],   // [{ id, feedId, title, link }]
  form: {
    status: 'idle',  // idle | loading
    error: null,
  },
});

// ─── Обработка загрузки фида ────────────────────────────────

const loadFeed = (url) => fetchFeed(url)
  .then((xml) => parse(xml))
  .then(({ title, description, items }) => {
    const feedId = generateId();

    state.feeds.unshift({ id: feedId, url, title, description });

    const newPosts = items.map((item) => ({
      id: generateId(),
      feedId,
      title: item.title,
      link: item.link,
    }));

    state.posts.unshift(...newPosts);
    state.form.status = 'idle';
    state.form.error = null;
  })
  .catch((err) => {
    state.form.status = 'idle';

    if (err.isParseError) {
      state.form.error = 'errors.parse';
      return;
    }

    if (err.isAxiosError) {
      state.form.error = 'errors.network';
      return;
    }

    state.form.error = 'errors.unknown';
  });

// ─── Инициализация ──────────────────────────────────────────

i18next
  .init({
    lng: 'ru',
    debug: false,
    resources: { ru },
  })
  .then(() => {
    initView(state, i18next);

    const form = document.querySelector('#rss-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const url = formData.get('url').trim();
      const existingUrls = state.feeds.map((feed) => feed.url);

      state.form.status = 'loading';
      state.form.error = null;

      validate({ url }, existingUrls)
        .then(() => loadFeed(url))
        .catch((err) => {
          state.form.status = 'idle';
          state.form.error = err.errors[0];
        });
    });
  });
