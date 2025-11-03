import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, EmbedBuilder, MessageFlags, type APIActionRowComponent, type APIComponentInMessageActionRow } from "discord.js";
import type { Command, CommandHandlerResponse } from "./index.js";
import Colors from "../colors.js";
import { debug } from "../log.js";

const KOFI_URL = "https://ko-fi.com/racooder";
const PAYPAL_URL = "https://paypal.me/racooder";
const THUMBNAIL_URL = "https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png?_gl=1*1vvq19e*_ga*NjQ5OTU3ODE0LjE2OTAyMDY1NjY.*_ga_M13FZ7VQ2C*MTY5MTQyNDc2Mi45LjEuMTY5MTQyNjA4NC41Ni4wLjA.";

export const Donate: Command = {
    data: {
        name: "donate",
        description: "Support the development of this bot",
        type: ApplicationCommandType.ChatInput,
    },
    handler: async function execute(_client: Client, interaction: ChatInputCommandInteraction): Promise<CommandHandlerResponse> {
        debug("Handling 'donate' command");

        const embed = createDonationEmbed();
        const actionRow = createDonationActionRow();

        debug("Sending reply");
        await interaction.reply({
            embeds: [embed],
            components: [actionRow],
            flags: [MessageFlags.Ephemeral],
        });

        return [true];
    }
}

function createDonationEmbed(): EmbedBuilder {
    debug("Creating embed");
    return new EmbedBuilder()
        .setColor(Colors.DONATE_EMBED)
        .setTitle("Donate on Ko-fi or directly per PayPal!")
        .setDescription("Consider supporting the developement and hosting of the bot by donating via Ko-fi or PayPal!")
        .setThumbnail(THUMBNAIL_URL);
}

function createDonationActionRow(): APIActionRowComponent<APIComponentInMessageActionRow> {
    debug("Creating action row");
    const kofiButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Ko-fi")
        .setURL(KOFI_URL);

    const paypalButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("PayPal")
        .setURL(PAYPAL_URL);

    const actionRow = new ActionRowBuilder()
        .addComponents(kofiButton)
        .addComponents(paypalButton);

    return actionRow.toJSON() as APIActionRowComponent<APIComponentInMessageActionRow>;
}
