import { Events, ModalSubmitInteraction, type ChatInputCommandInteraction, type Client } from "discord.js";
import type { EventListener } from "./index.js";
import { COMMANDS, type CommandHandler } from "../commands/index.js";
import { debug, error } from "../log.js";
import { replyHowever } from "../util.js";

export const InteractionCreate: EventListener = {
    start: (client: Client) => {
        debug("Starting 'interactionCreate' event listener");
        client.on(Events.InteractionCreate, async (interaction) => {
            debug("'interactionCreate' event triggered");
            if (interaction.isChatInputCommand()) handleSlashCommand(interaction);
            if (interaction.isModalSubmit()) handleModalSubmit(interaction);
        });
    }
}

function handleSlashCommand(interaction: ChatInputCommandInteraction): void {
    const { commandName } = interaction;
    debug(`Handling slash command '${commandName}'`);

    const command = COMMANDS.find(cmd => cmd.data.name === commandName);

    if (!command)
        return error(`No handler found for command: ${commandName}`, interaction.client);

    if (command.handler) runCommandHandler(interaction, command.handler);

    if (command.subcommands) {
        const subcommandName = interaction.options.getSubcommand(false);
        if (subcommandName) {
            debug(`Getting subcommand handler for '${commandName}.${subcommandName}'`);

            if (!command.subcommands[subcommandName])
                return error(`Subcommand interaction '${commandName}.${subcommandName}' received but can't find a handler for it.`, interaction.client);

            const subcommand = command.subcommands[subcommandName];
            runSubcommandHandler(interaction, subcommand.handler);
        }
    }
}

async function runCommandHandler(interaction: ChatInputCommandInteraction, handler: CommandHandler): Promise<void> {
    debug('Running command handler');
    try {
        const [success, exception] = await handler(interaction.client, interaction);
        if (!success) {
            exception.log();
            exception.reply(interaction);
        }
    } catch (e) {
        if (typeof e === "string" || e instanceof Error) {
            error(e, interaction.client);
        } else {
            error("Command handling failed for an unknown reason");
        }
        return replyHowever("The command execution failed", interaction);
    }
}

async function runSubcommandHandler(interaction: ChatInputCommandInteraction, handler: CommandHandler): Promise<void> {
    debug("Running subcommand handler");
    try {
        const [success, exception] = await handler(interaction.client, interaction);
        if (!success) {
            exception.log();
            exception.reply(interaction);
        }
    } catch (e) {
        if (typeof e === "string" || e instanceof Error) {
            error(e, interaction.client);
        } else {
            error("Subcommand handling failed for an unknown reason");
        }
        return replyHowever("The subcommand execution failed", interaction);
    }
}

function handleModalSubmit(interaction: ModalSubmitInteraction): void {
    const { customId } = interaction;
    debug(`Handling modal submit with custom ID '${customId}'`);

    const modalHandler = COMMANDS
}
