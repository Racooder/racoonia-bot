import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client, ModalBuilder } from "discord.js";
import type { Command, CommandHandlerResponse } from "./index.js";
import { debug } from "../log.js";
import { Exception } from "../exception.js";
import { createBasicTextInput } from "../util.js";

export const Template: Command = {
    data: {
        name: "template",
        description: "A template command!",
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
    handler: async function execute(_client: Client, interaction: ChatInputCommandInteraction): Promise<CommandHandlerResponse> {
        debug("Handling 'template' command");

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
                return [false, new Exception("Invalid feedback type selected", "An unknown feedback type was selected in the feedback command. This should never happen. Please report this to the developers.")];
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
        .setCustomId("bugReportModal")
        .setTitle("Bug Report")
        .addLabelComponents(expected, actualLabel, steps);
}

function createFeatureRequestModal(): ModalBuilder {
    const description = createBasicTextInput("description", "Describe your suggested feature");
    const otherDetails = createBasicTextInput("otherDetails", "Additional details (i.e. image links)", false);

    return new ModalBuilder()
        .setCustomId("featureRequestModal")
        .setTitle("Feature Request")
        .addLabelComponents(description, otherDetails);
}

function createGeneralFeedbackModal(): ModalBuilder {
    const description = createBasicTextInput("description", "Write your feedback here");

    return new ModalBuilder()
        .setCustomId("generalFeedbackModal")
        .setTitle("General Feedback")
        .addLabelComponents(description);
}
