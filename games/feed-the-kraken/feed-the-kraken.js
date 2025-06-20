// Load CSS for Feed the Kraken
(function loadFTKCSS() {
    const gameCSS = document.createElement('link');
    gameCSS.rel = 'stylesheet';
    gameCSS.href = 'games/feed-the-kraken/feed-the-kraken.css';
    document.head.appendChild(gameCSS);
})();

window.currentGame = {
    name: "Feed the Kraken",
    settings: [
        {
            key: "journeyType",
            label: "Journey Type",
            type: "select",
            options: [
                { value: "short", label: "Short Journey (Recommended: 5-6 players)" },
                { value: "long", label: "Long Journey (Recommended: 7-11 players)" }
            ],
            default: "short"
        },
        {
            key: "cultistConversion",
            label: "Enable Cultist Conversion",
            type: "checkbox",
            default: true,
            description: "Allow the Cult Leader to convert Sailors into Cultists during the game (standard rule)."
        },
        {
            key: "openCaptainLog",
            label: "Open Captain's Log",
            type: "checkbox",
            default: false,
            description: "Make the Captain's Log visible to all players (variant rule)."
        }
    ],
    rulesHtml: `
        <h3>Feed the Kraken</h3>
        <p>Feed the Kraken is a social deduction game with sailors, pirates, and a cult leader.</p>
    `,
    // Use image-based board for clarity and maintainability
    showBoard: function(journeyType = "short", shipPosition = {x: 50, y: 85}) {
        const container = document.getElementById('ftk-board');
        if (!container) return;
        container.innerHTML = `
            <div class="board-container">
                <img src="games/feed-the-kraken/board-${journeyType}.png" 
                     class="board-image" 
                     alt="Feed the Kraken ${journeyType} journey board">
                <div class="ship" style="left: ${shipPosition.x}%; top: ${shipPosition.y}%;">
                    🚢
                </div>
            </div>
        `;
    },
    startGame: function() {
        let journeyType = "short";
        const journeyTypeSelect = document.getElementById('setting-journeyType');
        if (journeyTypeSelect) {
            journeyType = journeyTypeSelect.value;
        }
        // Start ship at bottom island (center bottom)
        this.showBoard(journeyType, {x: 50, y: 85});
        document.getElementById('ftk-board').style.display = 'block';
    }
};

// Update board when journey type changes
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'setting-journeyType') {
        window.currentGame.showBoard(e.target.value, {x: 50, y: 85});
    }
});