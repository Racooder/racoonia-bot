import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import type { Command } from "./index.js";
import { debug } from "../log.js";
import { Ok, type Result } from "../result.js";
import { createBasicTextInput } from "../util.js";

export const Quote: Command = {
    data: {
        name: "quote",
        description: "Add, remove, edit, or view quotes",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "add",
                description: "Add a new quote",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "remove",
                description: "Remove a quote",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "edit",
                description: "Edit an existing quote",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "list",
                description: "List all quotes",
                type: ApplicationCommandOptionType.Subcommand,
            },
        ],
    },
    subcommands: {
        add: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
            const quote = createBasicTextInput("");
        },
        remove: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
            
        },
        edit: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
            
        },
        list: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
            
        }
    }
}

export const quoteModalFields = {
    add: {
        quoteText: "quote",
    }
};
