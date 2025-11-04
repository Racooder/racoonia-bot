import { BaseInteraction, Events, ModalSubmitInteraction, type ChatInputCommandInteraction, type Client } from "discord.js";
import type { EventListener } from "./index.js";
import { COMMANDS, type CommandHandler } from "../commands/index.js";
import { debug, error } from "../log.js";
import { replyHowever } from "../util.js";
import { MODALS } from "../modals/index.js";
import { Exception } from "../exception.js";

const COMMAND_NOT_RECOGNIZED_MESSAGE = "This command is not recognized by the bot.";

export const InteractionCreate: EventListener = {
    start: (client: Client) => {
        debug("Starting 'interactionCreate' event listener");
        client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
            debug("'interactionCreate' event triggered");
            if (interaction.isChatInputCommand()) handleSlashCommand(interaction);
            if (interaction.isModalSubmit()) handleModalSubmit(interaction);
        });
    }
}

function handleSlashCommand(interaction: ChatInputCommandInteraction): void {
    const { commandName } = interaction;
    const subcommandGroup = interaction.options.getSubcommandGroup(false) ?? undefined;
    const subcommand = interaction.options.getSubcommand(false) ?? undefined;
    debug(`Handling slash command '${generateCommandString(commandName, subcommandGroup, subcommand)}'`);

    if (subcommandGroup && !subcommand) {
        new Exception(`Received subcommand group '${subcommandGroup}' without a subcommand in command '${commandName}'`)
            .log()
            .reply(interaction);
        return;
    }

    debug("Getting command definition");
    const command = COMMANDS.find(cmd => cmd.data.name === commandName);

    if (!command) {
        new Exception(`No definition found for command: ${commandName}`, COMMAND_NOT_RECOGNIZED_MESSAGE)
            .log()
            .reply(interaction);
        return;
    }

    let handlers: CommandHandler[] = [];
    if (command.handler) handlers.push(command.handler);

    if (subcommand) {
        debug("Getting subcommand definition");
        let key = subcommandGroup ?? subcommand; // There is either a group and a subcommand, or just a subcommand

        if (!command.subcommands || !command.subcommands[key]) {
            new Exception(`Subcommand interaction '${commandName}.${key}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE)
                .log()
                .reply(interaction);
            return;
        }

        const subcommandDefinition = command.subcommands[key];
        if (!subcommandGroup) {
            debug("No subcommand group, using subcommand handler directly");
            if (!subcommandDefinition.handler) {
                new Exception(`Subcommand interaction '${commandName}.${key}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE)
                    .log()
                    .reply(interaction);
                return;
            }
            handlers.push(subcommandDefinition.handler);
        } else {
            debug("Subcommand group detected, getting subcommand handler");
            if (!subcommandDefinition.subcommands || !subcommandDefinition.subcommands[subcommand]) {
                new Exception(`Subcommand interaction '${commandName}.${key}.${subcommand}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE)
                    .log()
                    .reply(interaction);
                return;
            }
            const subcommandHandler = subcommandDefinition.subcommands[subcommandGroup];
            if (subcommandHandler) handlers.push(subcommandHandler);
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
        return replyHowever("The command execution failed. (This should never happen. Please report this to the developers using '/feedback'.)", interaction);
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
        return replyHowever("The subcommand execution failed.  (This should never happen. Please report this to the developers using '/feedback'.)", interaction);
    }
}

function handleModalSubmit(interaction: ModalSubmitInteraction): void {
    const { customId } = interaction;
    debug(`Handling modal submit with custom ID '${customId}'`);

    const args = customId.split(";");
    const modalId = args[0];

    const modal = MODALS.find(modal => modal.id === modalId);

    if (!modal) {
        error(`No handler found for modal with ID: ${modalId}`, interaction.client);
        interaction.reply({ content: "This modal is not recognized by the bot. (This should never happen. Please report this to the developers using '/feedback'.)", ephemeral: true });
        return;
    }

    if (modal.handler) {
        // TODO: runModalHandler(interaction, modal.handler, args.slice(1));
        modal.handler(interaction.client, interaction, args.slice(1));
    }
}

export function generateCommandString(name: string, subcommandGroup?: string, subcommand?: string): string {
    if (subcommand && subcommandGroup) return `${name}.${subcommandGroup}.${subcommand}`;
    if (subcommand) return `${name}.${subcommand}`;
    return name;
}
