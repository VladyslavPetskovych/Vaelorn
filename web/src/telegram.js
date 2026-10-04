export const tg = window.Telegram?.WebApp;

// initData is empty when the page is opened outside Telegram.
export const isInTelegram = Boolean(tg?.initData);
