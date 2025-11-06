import { replyHowever, type ReplyableInteraction } from "./util/interaction.js";
import { debug, warn } from "./log.js";

export class Exception {
    logMessage: string;
    userReply: string;

    constructor(logMessage: string, userReply?: string) {
        this.logMessage = logMessage;
        this.userReply = userReply || logMessage;
    }

    log(): Exception {
        debug("Logging exception");
        warn(this.logMessage);
        return this;
    }

    reply(interaction: ReplyableInteraction): Exception {
        debug("Sending exception message to the user");
        const reply = this.userReply + " (Please report this to the developers using '/feedback'.)";
        replyHowever(reply, interaction);
        return this;
    }
}
