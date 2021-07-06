import onChange from 'on-change';

const renderData = (state, i18nInstance) => {
  if (state.data.length > 0) {
    const posts = document.querySelector('.posts');
    posts.innerHTML = `<div class="card-body posts-container"><h2 class="card-title h4">${i18nInstance.t('posts')}</h2></div><ul class="list-group border-0 rounded-0 postsList"></ul>`;
    const postsHTML = state.data
      .map((rss) => rss.posts
        .map((post) => `<li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
        <a href="${post.link}" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${post.title}</a></li>`)
        .join(''))
      .join('');
    posts.querySelector('.postsList').innerHTML = postsHTML;

    const feeds = document.querySelector('.feeds');
    feeds.innerHTML = `<div class="card-body feeds-contatiner"><h2 class="card-title h4">${i18nInstance.t('feeds')}</h2></div><ul class="list-group border-0 rounded-0 feedsList"></ul>`;
    const feedsHTML = state.data
      .map((rss) => `<li><h3 class="h6 m-0">${rss.feed.title}</h3><p class="m-0 small text-black-50">${rss.feed.description}</p></li>`)
      .join('');
    feeds.querySelector('.feedsList').innerHTML = feedsHTML;
  }
};

const feedback = document.querySelector('.feedback');
const input = document.querySelector('#url-input');
const form = document.querySelector('form');
const addButton = document.querySelector('.btn-primary');

const renderSuccess = (state, i18nInstance) => {
  addButton.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.innerText = i18nInstance.t(state.rssForm.feedback);
  form.reset();
  input.focus();
};

const renderFail = (state, i18nInstance) => {
  addButton.disabled = false;
  if (feedback.classList.contains('text-success')) {
    feedback.classList.replace('text-success', 'text-danger');
  }
  input.classList.add('is-invalid');
  feedback.innerText = i18nInstance.t(state.rssForm.feedback);
};

const renderPending = () => {
  addButton.disabled = true;
};
const render = (state, i18nInstance) => {
  switch (state.rssForm.state) {
    case 'pending':
      renderPending();
      break;
    case 'failed':
      renderFail(state, i18nInstance);
      break;
    case 'bad responsed':
      renderFail(state, i18nInstance);
      break;
    case 'successfully responsed':
      renderSuccess(state, i18nInstance);
      renderData(state, i18nInstance);
      break;
    default:
  }
};

const visualize = (state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    console.log('RENDERING STATE', '\n', 'PATH:', path, '\n', 'VALUE', value);
    render(state, i18nInstance);
    if (path === 'lang') renderData(state, i18nInstance);
  });
  return watchedState;
};

export default visualize;
