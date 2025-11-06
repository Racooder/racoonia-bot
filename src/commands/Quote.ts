import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, LabelBuilder, ModalBuilder, UserSelectMenuBuilder } from "discord.js";
import type { Command } from "./index.js";
import { debug } from "../log.js";
import { Ok, type Result } from "../result.js";
import { createBasicTextInput, createLabel } from "../util/modal.js";

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
                name: "conversation",
                description: "Add a conversation quote",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "length",
                        description: "Number of lines in the conversation (max 10)",
                        type: ApplicationCommandOptionType.Integer,
                        required: true,
                        minValue: 2,
                        maxValue: 10,
                    }
                ],
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
        add: {
            handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
                debug("Handling 'quote add' command");

                const modal = createAddQuoteModal();
                await interaction.showModal(modal);

                return Ok();
            }
        },
        conversation: {
            handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
                debug("Handling 'quote conversation' command");

                const conversationLength = interaction.options.getInteger("length", true);


            }
        },
        remove: {
            handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {

            }
        },
        edit: {
            handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {

            }
        },
        list: {
            handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {

            }
        }
    }
}

function createAddQuoteModal(): ModalBuilder {
    const quoteText = createBasicTextInput(quoteModalFields.add.quoteText, "The text of the quote");
    const quoteAuthor = createQuoteAuthorInput();
    const quoteContext = createBasicTextInput(quoteModalFields.add.quoteContext, "The context of the quote", false);

    return new ModalBuilder()
        .setCustomId("quote;add")
        .setTitle("Add a Quote")
        .addLabelComponents(quoteText, quoteAuthor, quoteContext);
}

function createQuoteAuthorInput(): LabelBuilder {
    const input = new UserSelectMenuBuilder()
        .setCustomId(quoteModalFields.add.quoteAuthor)
        .setRequired(true);

    return createLabel("Author of the quote")
        .setUserSelectMenuComponent(input);
}

export const quoteModalFields = {
    add: {
        quoteText: "quote_text",
        quoteAuthor: "quote_author",
        quoteContext: "quote_context",
    }
};
