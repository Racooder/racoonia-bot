import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, ModalBuilder } from "discord.js";
import type { Command } from "./index.js";
import { debug } from "../log.js";
import { Err, Ok, type Result } from "../result.js";
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
    handler: async function execute(interaction: ChatInputCommandInteraction): Promise<Result> {
        debug(`Handling '${this.data.name}' command`);

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
                return Err("An unknown feedback type was selected in the feedback command.");
        }

        await interaction.showModal(modal);

        return Ok();
    }
}

function createBugReportModal(): ModalBuilder {
    const expectedBehavior = createBasicTextInput(feedbackModalFields.bugReport.expectedBehavior, "Explain what you expected to happen");
    const actualBehavior = createBasicTextInput(feedbackModalFields.bugReport.actualBehavior, "Explain what actually happened");
    const stepsToReproduce = createBasicTextInput(feedbackModalFields.bugReport.stepsToReproduce, "Steps to reproduce the issue", false);

    return new ModalBuilder()
        .setCustomId("feedback;bug_report")
        .setTitle("Bug Report")
        .addLabelComponents(expectedBehavior, actualBehavior, stepsToReproduce);
}

function createFeatureRequestModal(): ModalBuilder {
    const description = createBasicTextInput(feedbackModalFields.featureRequest.description, "Describe your suggested feature");
    const otherDetails = createBasicTextInput(feedbackModalFields.featureRequest.otherDetails, "Additional details (i.e. image links)", false);

    return new ModalBuilder()
        .setCustomId("feedback;feature_request")
        .setTitle("Feature Request")
        .addLabelComponents(description, otherDetails);
}

function createGeneralFeedbackModal(): ModalBuilder {
    const description = createBasicTextInput(feedbackModalFields.generalFeedback.description, "Write your feedback here");

    return new ModalBuilder()
        .setCustomId("feedback;general_feedback")
        .setTitle("General Feedback")
        .addLabelComponents(description);
}

export const feedbackModalFields = {
    bugReport: {
        expectedBehavior: "expected_behavior",
        actualBehavior: "actual_behavior",
        stepsToReproduce: "steps_to_reproduce",
    },
    featureRequest: {
        description: "description",
        otherDetails: "other_details",
    },
    generalFeedback: {
        description: "description",
    },
} as const;
