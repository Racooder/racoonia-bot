import { TextInputBuilder } from "@discordjs/builders";
import { LabelBuilder, TextInputStyle } from "discord.js";

export function createLabel(text: string): LabelBuilder {
    return new LabelBuilder().setLabel(text);
}

/**
 * @param required (default = true)
 */
export function createBasicTextInput(id: string, labelText: string, required = true): LabelBuilder {
    const input = new TextInputBuilder()
        .setCustomId(id)
        .setRequired(required)
        .setStyle(TextInputStyle.Paragraph);

    return createLabel(labelText)
        .setTextInputComponent(input);
}
