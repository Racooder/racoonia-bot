import { ChatInputCommandInteraction, LabelBuilder, MessageFlags, TextInputBuilder, TextInputStyle } from "discord.js";

export function replyHowever(message: string, interaction: ChatInputCommandInteraction): void {
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

export function splitArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
    if (chunkSize <= 0) throw new Error("chunkSize must be greater than 0");
    if (array.length == 0) return [];
    if (array.length == 1 || chunkSize >= array.length) return [array];

    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export function approximateEqual(a: number, b: number, epsilon: number): boolean {
    return Math.abs(a - b) < epsilon;
}

export function randomElement<T>(array: T[]): T {
    if (array.length === 0) throw new Error("Cannot get a random element from an empty array");

    return array[Math.floor(Math.random() * array.length)]!;
}

export function parseDate(dateString: string): Date | undefined {
    if (!new RegExp(/^\d{4}-\d\d?-\d\d?$/).test(dateString)) return undefined;
    return new Date(dateString);
}

export function unixToDate(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

// https://stackoverflow.com/a/2450976
export function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex]!, array[currentIndex]!];
    }

    return array;
}

export function clamp(value: number, min: number, max: number): number {
    if (max < min) throw new Error("'max' must be greater or equal to 'min'");
    return Math.min(Math.max(value, min), max);
}

export function wrap(value: number, min: number, max: number): number {
    const range = max - min;
    if (range <= 0) throw new Error("'max' must be greater than 'min'");

    // Normalize to 0-based range, apply modulo, then shift back
    const normalized = ((value - min) % range + range) % range;
    return normalized + min;
}

export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
    return self.indexOf(value) === index;
}

export function createBasicTextInput(id: string, labelText: string, required = true): LabelBuilder {
    const input = new TextInputBuilder()
        .setCustomId(id)
        .setRequired(required)
        .setStyle(TextInputStyle.Paragraph);

    return new LabelBuilder()
        .setLabel(labelText)
        .setTextInputComponent(input);
}
