export const en = {
  sidebar: {
    news: 'News',
    settings: 'Settings',
    accounts: 'Accounts',
    profile: 'Profile',
  },
  settings: {
    choose_lang: 'Choose language',
    choose_client_directory: 'Select game client directory',
    start_on_system_startup: 'Start app on system startup',
    start_in_minimized_mode: 'Start in minimized mode',
    folder: {
      existed: 'Select existed',
      new: 'Download new',
    },
    errors: {
      wrong_client_directory: 'Please, select correct directory',
    },
  },
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
    system_not_supported: 'Your system is not supported for download game',
    download_game_error: 'An error occurred while downloading',
    download_game_started: 'Game downloading was started',
    download_game_done: 'Game downloading is done',
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
      req_fields: '* - indicates a required field',
      login: 'Login',
      logged_in: 'You logged in by {username}',
    },
    'next-step': 'Next',
    'prev-step': 'Back',
    skip: 'Skip',
  },
  torrent: {
    status: {
      checking: 'File checking',
      in_progress: 'Downloading',
    },
    stop: 'Stop download',
    checked_count: 'Checked {count} Mb',
    downloaded_count: 'Downloaded {count} Mb {speed} Mb/s',
  },
} as const
