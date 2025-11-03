import { Client } from "discord.js";
import { config } from "./config.js";
import { EVENT_LISTENERS } from "./events/index.js";
import { info } from "./log.js";

info("Creating client");
const client = new Client({
    intents: ["Guilds"],
});

info("Starting event listeners")
for (const listener of EVENT_LISTENERS) {
    listener.start(client);
}

info("Logging in")
client.login(config.discord_token);
