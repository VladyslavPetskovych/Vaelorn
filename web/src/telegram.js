export const tg = window.Telegram?.WebApp;

// initData is empty when the page is opened outside Telegram.
export const isInTelegram = Boolean(tg?.initData);

export function haptic(style = "light") {
  tg?.HapticFeedback?.impactOccurred(style);
}

// Match Telegram's chrome to the game and stop swipe-down from closing it mid-play.
// Each call is optional: older Telegram clients don't support them.
export function setupTelegram() {
  if (!isInTelegram) return;
  tg.ready();
  tg.expand();
  for (const call of [
    () => tg.setHeaderColor("#1a1c2c"),
    () => tg.setBackgroundColor("#1a1c2c"),
    () => tg.disableVerticalSwipes(),
  ]) {
    try {
      call();
    } catch {
      /* unsupported Telegram version */
    }
  }
}
