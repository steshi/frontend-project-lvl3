import * as yup from 'yup';

const validate = (url, state) => {
  const schema = yup.object().shape({
    url: yup.string().required().url().notOneOf(state.rssForm.added, 'This RSS already added'),
  });

  try {
    schema.validateSync(url, { abortEarly: false });
    return [];
  } catch (e) {
    return e.inner;
  }
};

export default validate;
