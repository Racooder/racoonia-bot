import type { ChatInputCommandInteraction } from "discord.js";
import { replyHowever } from "./util.js";
import { debug, warn } from "./log.js";

export class Exception {
    logMessage: string;
    userReply: string;

    constructor(logMessage: string, userReply: string) {
        this.logMessage = logMessage;
        this.userReply = userReply;
    }

    log(): void {
        debug("Logging exception");
        warn(this.logMessage);
    }

    reply(interaction: ChatInputCommandInteraction): void {
        debug("Sending exception message to the user");
        replyHowever(this.userReply,interaction);
    }
}
