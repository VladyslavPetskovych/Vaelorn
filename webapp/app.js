const tg = window.Telegram?.WebApp;
const $ = (id) => document.getElementById(id);

// Relative path: Netlify proxies /api/* to the server; locally the server serves this page itself.
async function api(path, body) {
  const res = await fetch(`/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ initData: tg?.initData, ...body }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`);
  return res.json();
}

function render({ user, stats }) {
  if (user) {
    $("greeting").textContent = `Hi, ${user.first_name || "there"}!`;
    $("subtitle").textContent = user.username ? `@${user.username}` : "Welcome to Vaelorn";
    $("my-visits").textContent = user.visits;
    $("note").value = user.note ?? "";
  }
  if (stats) {
    $("total-users").textContent = stats.totalUsers;
    $("active-today").textContent = stats.activeToday;
  }
}

async function init() {
  if (!tg?.initData) {
    $("subtitle").textContent = "Open this page from the Vaelorn bot in Telegram.";
    return;
  }
  tg.ready();
  tg.expand();

  try {
    render(await api("/session"));
    $("note").disabled = false;
    $("save").disabled = false;
  } catch (err) {
    $("subtitle").textContent = `Couldn't reach the server: ${err.message}`;
  }
}

$("save").addEventListener("click", async () => {
  $("save").disabled = true;
  $("status").textContent = "Saving…";
  try {
    render(await api("/note", { note: $("note").value }));
    $("status").textContent = "Saved";
    tg?.HapticFeedback?.notificationOccurred("success");
  } catch (err) {
    $("status").textContent = `Save failed: ${err.message}`;
  } finally {
    $("save").disabled = false;
  }
});

init();
