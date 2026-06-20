import { subscribe } from 'valtio/vanilla';

const elements = {
  form: document.querySelector('#rss-form'),
  input: document.querySelector('#rss-input'),
  feedback: document.querySelector('#feedback'),
  button: document.querySelector('[type="submit"]'),
};

const renderError = (error) => {
  const { input, feedback } = elements;

  if (error) {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = error;
  } else {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
  }
};

const renderSuccess = () => {
  const { input, feedback, form } = elements;

  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = 'RSS успешно загружен';

  form.reset();
  input.focus();
};

const renderForm = (state) => {
  const { input, button } = elements;

  switch (state.form.status) {
    case 'loading':
      input.setAttribute('readonly', true);
      button.setAttribute('disabled', true);
      break;

    case 'idle':
    default:
      input.removeAttribute('readonly');
      button.removeAttribute('disabled');
      break;
  }
};

const initView = (state) => {
  subscribe(state, () => {
    renderForm(state);

    if (state.form.error) {
      renderError(state.form.error);
      return;
    }

    if (state.form.status === 'idle' && state.feeds.length > 0) {
      renderSuccess();
    }
  });
};

export default initView;
