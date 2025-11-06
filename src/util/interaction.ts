import { MessageFlags, type ChatInputCommandInteraction, type ModalSubmitInteraction } from "discord.js";

export type ReplyableInteraction = ChatInputCommandInteraction | ModalSubmitInteraction;

export function replyHowever(message: string, interaction: ReplyableInteraction): void {
    if (interaction.replied) {
        interaction.followUp({
            content: message,
            flags: [MessageFlags.Ephemeral],
        });
        return;
    }

    if (interaction.deferred) {
        interaction.editReply({
            content: message,
        });
        return;
    }

    interaction.reply({
        content: message,
        flags: [MessageFlags.Ephemeral],
    });
    return;
}
