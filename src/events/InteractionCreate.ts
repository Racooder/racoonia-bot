import { BaseInteraction, Events, ModalSubmitInteraction, type ChatInputCommandInteraction } from "discord.js";
import type { EventListener } from "./index.js";
import { COMMANDS, type Command, type CommandHandler } from "../commands/index.js";
import { debug, error } from "../log.js";
import { replyHowever } from "../util/interaction.js";
import { MODALS, type Modal, type ModalHandler, type SubModal } from "../modals/index.js";
import { Exception } from "../exception.js";
import client from "../client.js";
import { Err, isErr, Ok, type Result } from "../result.js";

const COMMAND_NOT_RECOGNIZED_MESSAGE = "This command is not recognized by the bot.";
const MODAL_NOT_RECOGNIZED_MESSAGE = "This modal is not recognized by the bot.";

export const InteractionCreate: EventListener = {
    start: () => {
        debug("Starting 'interactionCreate' event listener");
        client.on(Events.InteractionCreate, async (interaction: BaseInteraction) => {
            debug("'interactionCreate' event triggered");
            if (interaction.isChatInputCommand()) handleSlashCommand(interaction);
            if (interaction.isModalSubmit()) handleModalSubmit(interaction);
        });
    }
}

async function handleSlashCommand(interaction: ChatInputCommandInteraction): Promise<void> {
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
    if (!COMMANDS[commandName]) {
        new Exception(`No definition found for command: ${commandName}`, COMMAND_NOT_RECOGNIZED_MESSAGE)
            .log()
            .reply(interaction);
        return;
    }
    const command = COMMANDS[commandName];

    let result = getCommandHandlers(command, subcommand, subcommandGroup);
    if (isErr(result)) {
        const [, exception] = result;
        exception.log();
        exception.reply(interaction);
        return;
    } else {
        const [, handlers] = result;
        for (const handler of handlers) {
            await runCommandHandler(interaction, handler);
        }
    }
}

function getCommandHandlers(command: Command, subcommand?: string, subcommandGroup?: string): Result<CommandHandler[]> {
    const commandName = command.data.name;

    let handlers: CommandHandler[] = [];
    if (command.handler) handlers.push(command.handler);

    if (subcommand) {
        debug("Getting subcommand definition");
        let key = subcommandGroup ?? subcommand; // There is either a group and a subcommand, or just a subcommand

        if (!command.subcommands || !command.subcommands[key]) {
            return Err(`Subcommand interaction '${commandName}.${key}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE);
        }

        const subcommandGroupDefinition = command.subcommands[key];
        if (!subcommandGroup) {
            debug("No subcommand group, using subcommand handler directly");
            if (!subcommandGroupDefinition.handler) {
                return Err(`Subcommand interaction '${commandName}.${key}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE);
            }
            handlers.push(subcommandGroupDefinition.handler);
        } else {
            debug("Subcommand group detected, getting subcommand handler");
            if (!subcommandGroupDefinition.subcommands || !subcommandGroupDefinition.subcommands[subcommand]) {
                return Err(`Subcommand interaction '${commandName}.${key}.${subcommand}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE);
            }
            const subcommandDefinition = subcommandGroupDefinition.subcommands[subcommandGroup];
            if (subcommandDefinition) {
                if (!subcommandDefinition.handler) {
                    return Err(`Subcommand interaction '${commandName}.${key}.${subcommand}' received but can't find a handler for it.`, COMMAND_NOT_RECOGNIZED_MESSAGE);
                }
                handlers.push(subcommandDefinition.handler);
            }
        }
    }

    return Ok(handlers);
}

async function runCommandHandler(interaction: ChatInputCommandInteraction, handler: CommandHandler): Promise<void> {
    debug('Running command handler');
    try {
        const result = await handler(interaction);
        if (isErr(result)) {
            const [, exception] = result;
            exception.log();
            exception.reply(interaction);
        }
    } catch (e) {
        if (typeof e === "string" || e instanceof Error) {
            error(e);
        } else {
            error("Command handling failed for an unknown reason");
        }
        return replyHowever("The command execution failed. (This should never happen. Please report this to the developers using '/feedback'.)", interaction);
    }
}

export function generateCommandString(name: string, subcommandGroup?: string, subcommand?: string): string {
    if (subcommand && subcommandGroup) return `${name}.${subcommandGroup}.${subcommand}`;
    if (subcommand) return `${name}.${subcommand}`;
    return name;
}

async function handleModalSubmit(interaction: ModalSubmitInteraction): Promise<Result<void>> {
    const { customId } = interaction;
    debug(`Handling modal submit with custom ID '${customId}'`);

    const args = customId.split(";");
    const modalId = args.shift();

    if (!modalId) {
        return Err("No modal ID found in custom ID", MODAL_NOT_RECOGNIZED_MESSAGE);
    }

    debug("Getting modal definition");
    if (!MODALS[modalId]) {
        return Err(`No definition found for modal: ${modalId}`, MODAL_NOT_RECOGNIZED_MESSAGE);
    }
    const modal = MODALS[modalId];

    let result = getModalHandler(modal, args, customId);
    if (isErr(result)) {
        return result;
    }

    const [_, [handler, remainingArgs]] = result;
    await runModalHandler(interaction, handler, remainingArgs);
    return Ok();
}

function getModalHandler(modal: Modal, args: string[], customId: string): Result<[ModalHandler, string[]]> {
    debug(`Searching for handler for modal ID '${modal.id}' with args: ${customId}`);
    let modalString = modal.id;
    let currentModal: SubModal = modal;

    while (true) {
        const submodalId = args.shift();

        if (submodalId === undefined) {
            if (!currentModal.handler) {
                return Err(`No handler found for modal with ID: ${modalString}`, "This modal is not recognized by the bot.");
            }
            return Ok([currentModal.handler, []]);
        }

        if (currentModal.submodals && currentModal.submodals[submodalId]) {
            currentModal = currentModal.submodals[submodalId];
        } else {
            if (!currentModal.handler) {
                return Err(`No handler found for modal with ID: ${modalString}`, "This modal is not recognized by the bot.");
            }
            args.unshift(submodalId);
            return Ok([currentModal.handler!, args]);
        }
    }
}

async function runModalHandler(interaction: ModalSubmitInteraction, handler: ModalHandler, args: string[]): Promise<void> {
    debug('Running modal handler');
    try {
        await handler(interaction, args);
    } catch (e) {
        if (typeof e === "string" || e instanceof Error) {
            error(e);
        } else {
            error("Modal handling failed for an unknown reason");
        }
        replyHowever("The modal submission handling failed. (This should never happen. Please report this to the developers using '/feedback'.)", interaction);
    }
}
