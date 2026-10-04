# Vaelorn

Telegram bot ([@VaelornBot](https://t.me/VaelornBot)) with a Mini App.

- **Bot + API** – Node.js (grammY + Express), runs in Docker on your server
- **Redis** – stores users and their data (Docker volume, not exposed publicly)
- **Mini App** – static site in `webapp/`, hosted on Netlify for a free HTTPS domain

```
Telegram ──opens──▶ Netlify (webapp/)  ──/api/* proxy──▶ server:3000 (app) ──▶ redis
```

Netlify proxies `/api/*` to the server, so the server needs no domain or SSL certificate.

## Redis data

| Key | Type | Contents |
| --- | --- | --- |
| `user:<id>` | hash | name, username, language, premium, `first_seen`, `last_seen`, `visits`, `note` |
| `users` | set | every user id (count = total users) |
| `active:<YYYY-MM-DD>` | set | users active that day (expires after 90 days) |

Users are recorded when they press `/start` in the bot or open the Mini App.
Mini App requests are verified with Telegram's signed `initData`, so users can't impersonate each other.

## Deploy

### 1. Server (Docker)

```sh
git clone https://github.com/VladyslavPetskovych/Vaelorn.git
cd Vaelorn
cp .env.example .env        # fill in BOT_TOKEN and WEBAPP_URL
docker compose up -d --build
curl localhost:3000/api/health
```

Open port `3000` in the server's firewall. Logs: `docker compose logs -f app`.

### 2. Netlify

1. In `netlify.toml`, replace `YOUR_SERVER_IP` with the server's public IP and push.
2. Netlify → **Add new site → Import from Git** → pick this repo. Build settings come from `netlify.toml`.
3. Copy the site URL (e.g. `https://vaelorn.netlify.app`) into `WEBAPP_URL` in the server's `.env`, then
   `docker compose up -d` to restart.

The bot then shows an **Open app** button on `/start` and in the chat menu.

## Local development

```sh
docker compose up -d --build   # app on http://localhost:3000
```

Or without Docker (needs Redis on localhost): `npm install && npm run dev`.

Only one copy of the bot can run per token – stop the local one before starting it on the server.

## Bot commands

- `/start` – greeting + Mini App button
- `/stats` – total users and active today
- `/help`
