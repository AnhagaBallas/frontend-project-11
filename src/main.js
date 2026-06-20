import { proxy } from 'valtio/vanilla';
import './styles.css';
import validate from './validate.js';
import initView from './view.js';

// Начальное состояние приложения
const state = proxy({
  feeds: [],       // список добавленных URL
  form: {
    status: 'idle',  // idle | loading
    error: null,
  },
});

// Инициализируем слой отображения
initView(state);

// Обработчик формы
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
      // Валидация прошла успешно
      state.feeds.push({ url });
      state.form.status = 'idle';
      state.form.error = null;
    })
    .catch((err) => {
      // Ошибка валидации
      state.form.status = 'idle';
      state.form.error = err.errors[0];
    });
});
