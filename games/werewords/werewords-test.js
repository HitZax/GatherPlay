(function() {
    'use strict';

    // === UTILITIES ===
    function getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }
    const userId = getUserId();

    // === UI HELPERS ===
    function getGameBoard() {
        return document.getElementById('dmhk-board');
    }

    function showRoomSection() {
        const roomSection = document.getElementById('room-section');
        if (roomSection) roomSection.style.display = 'block';
    }

    function hideRoomSection() {
        const roomSection = document.getElementById('room-section');
        if (roomSection) roomSection.style.display = 'none';
    }

    function showLobbyState() {
        const board = getGameBoard();
        if (board) {
            board.innerHTML = "<h2>Waiting for host to start the game...</h2>";
            board.style.display = 'none';
        }
        showRoomSection();
    }

    function showGameState(state, roomId) {
        const board = getGameBoard();
        if (board) {
            board.style.display = 'block';
            board.innerHTML = '';
        }
        hideRoomSection();

        // Fetch player names if needed, then render the game phase
        getPlayerMap(roomId).then(userMap => {
            renderGame(state, roomId, userMap);
        });
    }

    function getPlayerMap(roomId) {
        return new Promise((resolve) => {
            db.ref('rooms/' + roomId + '/players').once('value', function(playersSnap) {
                const userMap = {};
                playersSnap.forEach(child => {
                    userMap[child.key] = child.val().name;
                });
                resolve(userMap);
            });
        });
    }

    // === GAME STATE LISTENER ===
    function setupGameStateListener(roomId) {
        db.ref('rooms/' + roomId + '/gameState').on('value', function(snap) {
            const state = snap.val();
            if (!state || !state.started) {
                showLobbyState();
            } else {
                showGameState(state, roomId);
            }
        });
    }

    // === LOBBY RESET LISTENER ===
    function setupLobbyResetListener(roomId) {
        db.ref('rooms/' + roomId + '/backToLobby').on('value', function(snap) {
            if (snap.val()) {
                resetToLobby();
            }
        });
    }

    function resetToLobby() {
        const board = getGameBoard();
        if (board) {
            board.innerHTML = "<h2>Waiting for host to start the game...</h2>";
            board.style.display = 'none';
        }
        showRoomSection();
    }

    // === MAIN ENTRY POINT ===
    window.currentGame = {
        name: "Deception: Murder in Hong Kong",
        onRoomLoaded(roomId, username) {
            setupLobbyResetListener(roomId);
            setupGameStateListener(roomId);
        },
        // Add your startGame and other logic here
    };

    // === GAME RENDERING ===
    function renderGame(state, roomId, userMap) {
        const container = getGameBoard();
        container.innerHTML = '';

        // Example: render header and phase (replace with your game's logic)
        renderGameHeader(container, state, userMap);
        renderGamePhase(container, state, roomId, userMap);
    }

    function renderGameHeader(container, state, userMap) {
        // Example header (customize for your game)
        const header = document.createElement('div');
        header.innerHTML = `<div style="margin-bottom: 15px;"><strong>Game Phase:</strong> ${state.phase || "?"}</div>`;
        container.appendChild(header);
    }

    function renderGamePhase(container, state, roomId, userMap) {
        // Switch on state.phase and render the correct UI for your game
        switch(state.phase) {
            case 1:
                container.innerHTML += "<h3>Phase 1: Setup</h3>";
                break;
            case 2:
                container.innerHTML += "<h3>Phase 2: Murder!</h3>";
                break;
            // ...add more phases as needed...
            default:
                container.innerHTML += "<h3>Waiting for game to start...</h3>";
        }
    }

})();