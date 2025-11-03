import type { Client } from "discord.js";
import { InteractionCreate } from "./interactionCreate.js";
import { ClientReady } from "./clientReady.js";

export type EventListener = {
    start: (client: Client) => void;
}

// Event Listener Registry

export const EVENT_LISTENERS: EventListener[] = [
    InteractionCreate,
    ClientReady,
];
