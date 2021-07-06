import * as yup from 'yup';
import { setLocale } from 'yup';

const validate = (url, state) => {
  setLocale({
    string: {
      url: 'errors.notValidLink',
    },
    mixed: {
      notOneOf: 'errors.alreadyAddedLink',
    },
  });

  const schema = yup.object().shape({
    url: yup.string().required().url().notOneOf(state.rssForm.alreadyAddedRsss),
  });

  try {
    schema.validateSync(url, { abortEarly: false });
    return [];
  } catch (e) {
    return e.message;
  }
};

export default validate;
