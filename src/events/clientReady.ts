import { ActivityType, Events, type Client } from "discord.js";
import type { EventListener } from "./index.js";
import { getCommandsData } from "../commands/index.js";
import { deployCommands } from "../deployCommands.js";
import { config } from "../config.js";
import { debug, info, success } from "../log.js";
import { ClientApplication } from 'discord.js';

export const ClientReady: EventListener = {
    start: (client: Client) => {
        debug("Starting 'clientReady' event listener");
        client.once(Events.ClientReady, async () => {
            info("client is ready");
            if (client.user === null || client.application === null) {
                throw new Error("Client user or application is null on ready event");
            }

            registerApplicationCommands(client.application);

            info("Setting activity")
            client.user.setActivity({
                name: "/ping",
                type: ActivityType.Playing,
            });

            success(`Logged in as ${client.user?.tag}!`);
        });
    }
}

function registerApplicationCommands(application: ClientApplication): void {
    info("Registering application (/) commands");

    deployToTestGuild();

    const commandData = getCommandsData();
    application.commands.set(commandData);
}

function deployToTestGuild(): void {
    debug(`Deploying commands to test guild ${config.testing_guild_id}`);

    if (config.testing_guild_id === "")
        return debug("Testing guild ID is not set, skipping deployment to testing guild");

    deployCommands({ guildId: config.testing_guild_id }); // Deploy to testing guild (for faster updates)
}
