import type { ChatInputApplicationCommandData, ChatInputCommandInteraction, Client } from "discord.js";

import { Ping } from "./ping.js";
import { Donate } from "./donate.js";
import { debug } from "../log.js";
import type { Result } from "../exception.js";
import { Feedback } from "./feedback.js";

export type CommandHandler = (client: Client, interaction: ChatInputCommandInteraction) => Promise<Result>;

export interface Subcommand {
    handler?: CommandHandler;
    subcommands?: Record<string, Subcommand>;
}

export interface Command extends Subcommand {
    data: ChatInputApplicationCommandData;
}

// Commands registry

export const COMMANDS = [
    Ping,
    Donate,
    Feedback,
]

export function getCommandsData(): ChatInputApplicationCommandData[] {
    debug("Getting data from all commands");
    return COMMANDS.map(cmd => cmd.data);
}

export function mapCommandData<T>(callbackFunction: (data: ChatInputApplicationCommandData) => T): T[] {
    debug("Mapping commands data");
    return COMMANDS.map(cmd => callbackFunction(cmd.data));
}
