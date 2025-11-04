import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client, ModalBuilder } from "discord.js";
import type { Command } from "./index.js";
import { debug } from "../log.js";
import { Exception, type Result } from "../exception.js";
import { createBasicTextInput } from "../util.js";

export const Feedback: Command = {
    data: {
        name: "feedback",
        description: "Provide feedback on the bot",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "type",
                description: "Type of feedback",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: "Bug Report", value: "bug" },
                    { name: "Feature Request", value: "feature" },
                    { name: "General Feedback", value: "general" },
                ]
            }
        ],
    },
    handler: async function execute(_client: Client, interaction: ChatInputCommandInteraction): Promise<Result> {
        debug("Handling 'feedback' command");

        const feedbackType = interaction.options.getString("type", true);

        let modal;
        switch (feedbackType) {
            case "bug":
                modal = createBugReportModal();
                break;
            case "feature":
                modal = createFeatureRequestModal();
                break;
            case "general":
                modal = createGeneralFeedbackModal();
                break;
            default:
                return [false, new Exception("An unknown feedback type was selected in the feedback command.")];
        }

        await interaction.showModal(modal);

        return [true];
    }
}

function createBugReportModal(): ModalBuilder {
    const expected = createBasicTextInput("expectedBehavior", "Explain what you expected to happen");
    const actualLabel = createBasicTextInput("actualBehavior", "Explain what actually happened");
    const steps = createBasicTextInput("stepsToReproduce", "Steps to reproduce the issue");

    return new ModalBuilder()
        .setCustomId("feedback;bug_report")
        .setTitle("Bug Report")
        .addLabelComponents(expected, actualLabel, steps);
}

function createFeatureRequestModal(): ModalBuilder {
    const description = createBasicTextInput("description", "Describe your suggested feature");
    const otherDetails = createBasicTextInput("otherDetails", "Additional details (i.e. image links)", false);

    return new ModalBuilder()
        .setCustomId("feedback;feature_request")
        .setTitle("Feature Request")
        .addLabelComponents(description, otherDetails);
}

function createGeneralFeedbackModal(): ModalBuilder {
    const description = createBasicTextInput("description", "Write your feedback here");

    return new ModalBuilder()
        .setCustomId("feedback;general_feedback")
        .setTitle("General Feedback")
        .addLabelComponents(description);
}
