import * as yup from 'yup';

// Устанавливаем коды ошибок вместо текстов
yup.setLocale({
  mixed: {
    required: 'errors.validation.required',
  },
  string: {
    url: 'errors.validation.url',
  },
});

const createSchema = (existingUrls) => yup.object({
  url: yup
    .string()
    .required()
    .url()
    .notOneOf(existingUrls, 'errors.validation.duplicate'),
});

const validate = (fields, existingUrls) => {
  const schema = createSchema(existingUrls);
  return schema.validate(fields, { abortEarly: false });
};

export default validate;
