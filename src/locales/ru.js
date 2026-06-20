export default {
  translation: {
    // Интерфейс
    ui: {
      title: 'RSS Агрегатор',
      subtitle: 'Начните читать RSS сегодня! Это легко, это красиво.',
      label: 'Ссылка RSS',
      placeholder: 'Ссылка RSS',
      button: 'Добавить',
      example: 'Пример: https://ru.hexlet.io/lessons.rss',
    },

    // Сообщения
    messages: {
      success: 'RSS успешно загружен',
    },

    // Коды ошибок валидации
    errors: {
      validation: {
        required: 'Не должно быть пустым',
        url: 'Ссылка должна быть валидным URL',
        duplicate: 'RSS уже существует',
      },
    },
  },
};
