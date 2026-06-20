export default {
  translation: {
    ui: {
      title: 'RSS Агрегатор',
      subtitle: 'Начните читать RSS сегодня! Это легко, это красиво.',
      label: 'Ссылка RSS',
      placeholder: 'Ссылка RSS',
      button: 'Добавить',
      example: 'Пример: https://ru.hexlet.io/lessons.rss',
      feeds: 'Фиды',
      posts: 'Посты',
      preview: 'Просмотр',
      modal: {
        close: 'Закрыть',
        read: 'Читать полностью',
      },
    },

    messages: {
      success: 'RSS успешно загружен',
    },

    errors: {
      validation: {
        required: 'Не должно быть пустым',
        url: 'Ссылка должна быть валидным URL',
        duplicate: 'RSS уже существует',
      },
      network: 'Ошибка сети',
      parse: 'Ресурс не содержит валидный RSS',
      unknown: 'Неизвестная ошибка',
    },
  },
};
