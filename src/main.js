import './styles.css';

const form = document.querySelector('#rss-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const url = formData.get('url');
  console.log('RSS URL:', url);
});
