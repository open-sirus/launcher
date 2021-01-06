export const ru = {
  sidebar: {
    news: 'Новости',
    settings: 'Настройки',
    accounts: 'Аккаунты',
    updates: 'Обновления',
  },
  settings: {
    choose_lang: 'Выберите язык',
    choose_client_directory: 'Выберите папку с игрой',
    start_on_system_startup: 'Запускать вместе с операционной системой',
    start_in_minimized_mode: 'Запускать в свернутом виде',
    folder: {
      existed: 'Выбрать клиент',
      new: 'Загрузить клиент',
    },
    set_up_client_directory:
      'Пожалуйста укажите в настройках деррикторию с клиентом игры',
    errors: {
      wrong_client_directory: 'Пожалуйста, выберите папку с клиентом',
    },
  },
  accounts: {
    add_account: 'Добавить аккаунт',
    remove_account: 'Удалить аккаунт',
    re_login: 'Перезайти',
    modal: {
      title: 'Добавить аккаунт',
      enter_login: 'Введите логин',
      enter_pass: 'Введите пароль',
      enter_tfa_code: 'Введите 2FA код',
      close_modal: 'Закрыть',
      req_fields: '* - обязательные поля',
      tfaError: {
        minLength: '2FA токен должен состоять из 6 символов',
        required: '2FA токен обязателен',
      },
      authError: {
        loginMinLength: 'Логин должен содержать минимум 3 символа',
        loginRequired: 'Логин обязателен',
        passMinLength: 'Пароль должен содержать минимум 6 символов',
        passRequired: 'Пароль обязателен',
      },
    },
  },
  feeds: {
    to_forum: 'Подробнее',
  },
  statusBar: {
    minimize: 'Свернуть',
    close: 'Закрыть',
    online: '{n} человек | {n} человека | {n} человек',
  },
  notification: {
    feeds_loading_error: 'Не можем загрузить новости. Попробуйте позже',
    send_auth_request:
      'Не можем авторизовать вас. Попробуйте позже или обратитесь в поддержку',
    token_has_expired:
      'Пароль был сменен или токен устарел, авторизуйтесь повторно',
    account_duplicate: 'Аккаунт уже внесен в список',
    system_not_supported:
      'Загрузка игры поддерживатеся только для Windows и Linux',
    download_game_error: 'Во время загрузки произошла ошибка',
    download_game_started: 'Началась загрузка игры',
    download_game_done: 'Загрузка игры завершена',
  },
  steps: {
    select_folder: {
      select_existed: 'Выбрать папку с игрой',
      download: 'Загрузить игру',
    },
    login: {
      title: 'Вход',
      username: 'Введите логин',
      password: 'Введите пароль',
      tfa_code: 'Введите 2FA код',
      req_fields: '* - обязательные поля',
      login: 'Войти',
      logged_in: 'Вы вошли под {username}',
    },
    'next-step': 'Далее',
    'prev-step': 'Назад',
    skip: 'Пропустить',
  },
  torrent: {
    status: {
      checking: 'Проверка файлов',
      in_progress: 'Загрузка',
    },
    stop: 'Остановить загрузку',
    checked_count: 'Проверенно {count} Мб',
    downloaded_count: 'Загруженно {count} Мб {speed} Мб/с',
  },
  update: {
    'no-updates': 'Новых обновлений нет.',
    validation_in_progress: 'Валидация файлов...',
    client: {
      'force-check': 'Проверить клиент',
    },
  },
} as const
