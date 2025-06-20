// --- Werewords Game Settings ---
const werewordsSettings = {
    yesNoTokens: 36,
    maybeTokens: 12,
    correctToken: 1,
    soCloseToken: 1,
    wayWayOffToken: 1,
    timerSeconds: 240,
    deluxeRolesEnabled: false
};

const werewordsSettingsSchema = [
    {
        key: "yesNoTokens",
        label: "Yes/No Tokens",
        type: "number",
        default: 36,
        min: 10,
        max: 99,
        description: "Number of Yes/No tokens available to the Mayor."
    },
    {
        key: "timerSeconds",
        label: "Timer (seconds)",
        type: "number",
        default: 240,
        min: 60,
        max: 600,
        description: "Time limit for guessing (in seconds)."
    },
    {
        key: "deluxeRolesEnabled",
        label: "Enable Deluxe Roles",
        type: "checkbox",
        default: false,
        description: "Enable extra roles like Beholder and Minion."
    },
    {
        key: "difficulty",
        label: "Word Difficulty",
        type: "select",
        default: "easy",
        options: [
            { value: "easy", label: "Easy" },
            { value: "medium", label: "Medium" },
            { value: "hard", label: "Hard" },
            { value: "insane", label: "Insane" }
        ],
        description: "Choose the difficulty for the secret word."
    }
];

function updateWerewordsSetting(key, value) {
    if (werewordsSettings.hasOwnProperty(key)) {
        werewordsSettings[key] = value;
        return true;
    }
    return false;
}