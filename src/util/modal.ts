import { TextInputBuilder } from "@discordjs/builders";
import { LabelBuilder, TextInputStyle } from "discord.js";
import { debug } from "../log.js";

/**
 * @param required (default = true)
 */
export function createBasicTextInput(id: string, labelText: string, required = true): LabelBuilder {
    debug(`Creating basic text input: id='${id}', label='${labelText}', required=${required}`);

    const input = new TextInputBuilder()
        .setCustomId(id)
        .setRequired(required)
        .setStyle(TextInputStyle.Paragraph);

    return new LabelBuilder()
        .setLabel(labelText)
        .setTextInputComponent(input);
}
