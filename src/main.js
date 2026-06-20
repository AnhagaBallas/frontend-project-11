import i18next from 'i18next';
import { proxy } from 'valtio/vanilla';
import './styles.css';
import ru from './locales/ru.js';
import validate from './validate.js';
import initView from './view.js';
import fetchFeed from './api.js';
import parse from './parse.js';

const REFRESH_INTERVAL = 5000;

// ─── Утилиты ────────────────────────────────────────────────

let nextId = 1;
const generateId = () => {
  nextId += 1;
  return nextId;
};

// ─── Состояние ──────────────────────────────────────────────

const state = proxy({
  feeds: [],
  posts: [],
  ui: {
    readPostIds: new Set(),  // id прочитанных постов
  },
  form: {
    status: 'idle',
    error: null,
  },
});

// ─── Загрузка фида ──────────────────────────────────────────

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
      description: item.description,
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

// ─── Обновление фидов ───────────────────────────────────────

const updateFeeds = () => {
  const promises = state.feeds.map((feed) => fetchFeed(feed.url)
    .then((xml) => parse(xml))
    .then(({ items }) => {
      const existingLinks = new Set(
        state.posts
          .filter((post) => post.feedId === feed.id)
          .map((post) => post.link),
      );

      const newPosts = items
        .filter((item) => !existingLinks.has(item.link))
        .map((item) => ({
          id: generateId(),
          feedId: feed.id,
          title: item.title,
          link: item.link,
          description: item.description,
        }));

      if (newPosts.length > 0) {
        state.posts.unshift(...newPosts);
      }
    })
    .catch(() => {}));

  Promise.allSettled(promises).then(() => {
    setTimeout(updateFeeds, REFRESH_INTERVAL);
  });
};

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

    setTimeout(updateFeeds, REFRESH_INTERVAL);
  });
