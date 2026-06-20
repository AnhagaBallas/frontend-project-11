import * as yup from 'yup';

const validate = ({ url }, existingUrls) => {
  const schema = yup.object({
    url: yup
      .string()
      .trim()
      .required('errors.validation.required')
      .url('errors.validation.url')
      .notOneOf(existingUrls, 'errors.validation.duplicate'),
  });

  return schema.validate({ url }, { abortEarly: true });
};

export default validate;
