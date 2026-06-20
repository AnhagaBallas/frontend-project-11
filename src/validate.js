import * as yup from 'yup';

const createSchema = (existingUrls) => yup.object({
  url: yup
    .string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(existingUrls, 'RSS уже существует'),
});

const validate = (fields, existingUrls) => {
  const schema = createSchema(existingUrls);
  return schema.validate(fields, { abortEarly: false });
};

export default validate;
