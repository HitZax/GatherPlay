window.deceptionSettings = {
    cardsPerPlayer: 4, // Default, can be set 4-8
    cardsPerPlayerMin: 4,
    cardsPerPlayerMax: 8,

    roundTimerMinutes: 2.5, // Time for each investigation round (adjustable)
    finalGuessTimerMinutes: 2, // After round 3, time for final guesses before Murderer wins (adjustable)

    accomplice: {
        enabled: false, // Set true if host enables, or auto-enable if player count >= 6
        recommendedMinPlayers: 6,
        note: "Recommended for 6+ players"
    },
    witness: {
        enabled: false, // Set true if host enables, or auto-enable if player count >= 6
        recommendedMinPlayers: 6,
        note: "Recommended for 6+ players"
    }
    // No minPlayers/maxPlayers here; detect from room player list
};