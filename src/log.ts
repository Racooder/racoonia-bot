import { EmbedBuilder } from "discord.js";
import { Client } from 'discord.js';
import { config } from "./config.js";

const format = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
};

export function debug(message: string): void {
    console.debug(`${format.FgGray}${message}${format.Reset}`);
}

export function info(message: string): void {
    console.log(message);
}

export function success(message: string): void {
    console.log(`${format.FgGreen}${message}${format.Reset}`);
}

export function warn(message: string): void {
    console.warn(`${format.FgYellow}${message}${format.Reset}`);
}

export function error(message: string | Error, client?: Client): void {
    if (message instanceof Error) {
        console.error(`${format.FgRed}${message.name}: ${message.message}${format.Reset}\n${message.stack}`);
    } else {
        console.error(`${format.FgRed}${message}${format.Reset}`);
    }

    if (client) {
        errorToDiscord(client, message);
    }
}

export async function errorToDiscord(client: Client, message: string | Error): Promise<void> {
    debug("Logging error to discord");
    if (config.log_channel === "") return debug("Discord logging is disabled by config");

    debug("Creating embed");
    const embed = new EmbedBuilder();

    if (typeof message === "string") {
        embed.setDescription(`\`\`\`${message}\`\`\``);
    } else {
        embed
            .setTitle(`${message.name}: ${message.message}`)
            .setDescription(`\`\`\`${message.stack}\`\`\``)
    }

    debug("Fetching channel")
    const channel = await client.channels.fetch(config.log_channel);

    if (!channel) return error("Can't access the log channel");
    if (!channel.isSendable()) return error("Can't send messages in the log channel");

    debug("Sending error message")
    channel.send({
        content: `<@&${config.log_role}>`,
        embeds: [embed],
    });
}
