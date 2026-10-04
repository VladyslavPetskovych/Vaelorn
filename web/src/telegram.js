export const tg = window.Telegram?.WebApp;

// initData is empty when the page is opened outside Telegram.
export const isInTelegram = Boolean(tg?.initData);

export function haptic(style = "light") {
  tg?.HapticFeedback?.impactOccurred(style);
}

// Match Telegram's header and background to the app; older clients don't support it.
export function applyTheme() {
  try {
    tg?.setHeaderColor("#0f0b08");
    tg?.setBackgroundColor("#0f0b08");
  } catch {
    /* unsupported Telegram version */
  }
}
