import type { ChatInputApplicationCommandData, ChatInputCommandInteraction, Client } from "discord.js";
import type { Exception } from "../exception.js";

import { Ping } from "./ping.js";
import { Donate } from "./donate.js";
import { debug } from "../log.js";

export type CommandHandlerResponse = [true] | [false, Exception];

export type CommandHandler = (client: Client, interaction: ChatInputCommandInteraction) => Promise<CommandHandlerResponse>;

export type Subcommand = {
    handler: CommandHandler
}

export type Command = {
    data: ChatInputApplicationCommandData;
    handler?: CommandHandler;
    subcommands?: Record<string, Subcommand>;
}

// Commands registry

export const COMMANDS = [
    Ping,
    Donate,
]

export function getCommandsData(): ChatInputApplicationCommandData[] {
    debug("Getting data from all commands");
    return COMMANDS.map(cmd => cmd.data);
}

export function mapCommandData<T>(callbackFunction: (data: ChatInputApplicationCommandData) => T): T[] {
    debug("Mapping commands data");
    return COMMANDS.map(cmd => callbackFunction(cmd.data));
}
