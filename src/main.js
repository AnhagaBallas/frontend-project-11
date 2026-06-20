import i18next from 'i18next';
import { proxy } from 'valtio/vanilla';
import './styles.css';
import ru from './locales/ru.js';
import validate from './validate.js';
import initView from './view.js';

const state = proxy({
  feeds: [],
  form: {
    status: 'idle',
    error: null,
  },
});

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
        .then(() => {
          state.feeds.push({ url });
          state.form.status = 'idle';
          state.form.error = null;
        })
        .catch((err) => {
          state.form.status = 'idle';
          state.form.error = err.errors[0];
        });
    });
  });
