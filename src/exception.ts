import type { ChatInputCommandInteraction } from "discord.js";
import { replyHowever } from "./util.js";
import { debug, error } from "./log.js";

export class Exception {
    logMessage: string;
    userReply: string;

    constructor(logMessage: string, userReply?: string) {
        this.logMessage = logMessage;
        this.userReply = userReply || logMessage;
    }

    log(): Exception {
        debug("Logging exception");
        error(this.logMessage);
        return this;
    }

    reply(interaction: ChatInputCommandInteraction): Exception {
        debug("Sending exception message to the user");
        const reply = this.userReply + " (Please report this to the developers using '/feedback'.)";
        replyHowever(reply, interaction);
        return this;
    }
}

export type Result = [true] | [false, Exception];
