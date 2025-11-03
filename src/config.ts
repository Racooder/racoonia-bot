import { copyFileSync, existsSync } from 'fs';
import { debug, info } from './log.js';
import dotenv from 'dotenv';

function loadDotenv(): void {
    debug("Loading untyped config")
    if (existsSync("meta/.env")) {
        debug("Loading .env")
        dotenv.config();
        return;
    }

    if (!existsSync("meta/.env.template")) {
        throw new Error("Config template not found");
    }

    copyFileSync("meta/.env.template", "meta/.env");
    throw new Error("Config file created from template. Please fill in the required values.");
}

type Config = {
    testing_guild_id: string;
    log_channel: string;
    log_role: string;

    discord_token: string;
    client_id: string;
    database_url: string;
}

function loadConfig(): Config {
    info("Loading config")
    loadDotenv();
    return {
        testing_guild_id: process.env['TESTING_GUILD_ID'] as string,
        log_channel: process.env['LOG_CHANNEL'] as string,
        log_role: process.env['LOG_ROLE'] as string,

        discord_token: process.env['DISCORD_TOKEN'] as string,
        client_id: process.env['CLIENT_ID'] as string,
        database_url: process.env['DATABASE_URL'] as string,
    };
}

export const config = loadConfig();
