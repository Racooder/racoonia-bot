import { ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import type { Command } from "./index.js";
import Colors from "../colors.js";
import { debug } from "../log.js";
import { Ok, type Result } from "../result.js";
import client from "../client.js";

export const Ping: Command = {
    data: {
        name: "ping",
        description: "Check your connection with the bot",
        type: ApplicationCommandType.ChatInput,
    },
    handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
        debug("Handling 'ping' command");
        const latency = Math.abs(Date.now() - interaction.createdTimestamp);
        const apiLatency = client.ws.ping;

        const embed = buildPingEmbed(latency, apiLatency);

        debug("Sending reply");
        await interaction.reply({
            embeds: [embed],
            flags: [MessageFlags.Ephemeral],
        });

        return Ok();
    }
}

function buildPingEmbed(latency: number, apiLatency: number): EmbedBuilder {
    debug("Building ping embed")
    const latencySuffix = getLatencySuffix(latency);
    const apiLatencySuffix = getLatencySuffix(apiLatency);

    return new EmbedBuilder()
        .setColor(Colors.PING_EMBED)
        .addFields(
            {
                name: ":stopwatch: Latency",
                value: `${latency}ms ${latencySuffix}`,
            },
            {
                name: ":heartbeat: API Latency",
                value: apiLatency < 0
                    ? "Couldn't be calculated"
                    : `${apiLatency}ms ${apiLatencySuffix}`,
            }
        );
}

function getLatencySuffix(latency: number): string {
    debug("Getting latency suffix")
    // Special cases:
    switch (latency) {
        case 69:
            return "(Nice)";
        case 420:
            return "(Blaze it)";
        case 0:
            return "(Who's your ISP?)";
    }

    // Ranges:
    if (latency < 0) {
        return "(How?)";
    }
    if (latency > 1000) {
        return "(Is your router on the moon?)";
    }

    // Default:
    return "";
}
