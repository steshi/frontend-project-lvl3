const render = (state) => {
  const feedback = document.querySelector('.feedback');
  if (state.rssForm.valid === false) {
    const errMessages = state.rssForm.validationErrors.map((err) => err.message);
    if (feedback.classList.contains('text-success')) {
      feedback.classList.replace('text-success', 'text-danger');
    }
    [feedback.innerText] = errMessages;
  }
  if (state.rssForm.valid === true && state.rssForm.state === 'successfully responsed') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.innerText = 'RSS successfully loaded';
  }
};

export default render;
