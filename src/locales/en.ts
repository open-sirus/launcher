export const en = {
  sidebar: {
    news: 'News',
    settings: 'Settings',
    accounts: 'Accounts',
  },
  settings: {
    choose_lang: 'Choose language',
    choose_client_directory: 'Select game client directory',
    errors: {
      wrong_client_directory: 'Please, select correct directory',
    },
  },
  start_on_system_startup: 'Start app on system startup',
  start_in_minimized_mode: 'Start in minimized mode',
  accounts: {
    add_account: 'Add account',
    remove_account: 'Remove account',
    re_login: 'Re-login',
    modal: {
      title: 'Add account',
      enter_login: 'Enter login',
      enter_pass: 'Enter password',
      enter_tfa_code: 'Enter 2FA code',
      close_modal: 'Close modal',
      req_fields: '* - indicates required field',
      tfaError: {
        minLength: '2FA token must be at least 6 characters long',
        required: '2FA token is required',
      },
      authError: {
        loginMinLength: 'Login must be at least 3 characters long',
        loginRequired: 'Login is required',
        passMinLength: 'Password must be at least 6 characters long',
        passRequired: 'Password is required',
      },
    },
  },
  feeds: {
    to_forum: 'Learn More',
  },
  statusBar: {
    minimize: 'Minimize',
    close: 'Close',
    online: '0 players | {n} player | {n} players',
  },
  notification: {
    feeds_loading_error: 'Cannot load news',
    send_auth_request:
      'Cannot authorize you. Try again later or contact support',
    token_has_expired:
      'Account password has been changed or auth token has expired, re-login please',
    account_duplicate: 'Account already exist in account list',
  },
  steps: {
    select_folder: {
      select_existed: 'Select folder',
      download: 'Download game',
    },
    login: {
      title: 'Login',
      username: 'Enter login',
      password: 'Enter password',
      tfa_code: 'Enter 2FA code',
      req_fields: '* - indicates required field',
      login: 'Login',
      loggined: 'You loggined by {username}',
    },
    'next-step': 'Next',
    'prev-step': 'Back',
    skip: 'Skip',
  },
} as const
