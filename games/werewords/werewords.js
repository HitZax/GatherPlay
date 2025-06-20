const wordLists = (typeof window.werewordsWordLists !== "undefined") ? window.werewordsWordLists : {
    easy: [], medium: [], hard: [], insane: []
};

window.currentGame = {
    name: "Werewords",
    settings: werewordsSettingsSchema,
    onRoomLoaded(roomId, username) {
        setupLobbyResetListener(roomId);
        setupPhaseListener(roomId);
        setupRoomDeleteListener(roomId);
    },
    startGame() { assignRolesAndWord(); }
};

// --- Centralized UI Management ---
function getGameBoard() {
    return document.getElementById('werewords-board');
}

function showRoomSection() {
    const roomSection = document.getElementById('room-section');
    if (roomSection) roomSection.style.display = 'block';
}

function hideRoomSection() {
    const roomSection = document.getElementById('room-section');
    if (roomSection) roomSection.style.display = 'none';
}

function showLobbyState(roomId) {
    const board = getGameBoard();
    if (board) {
        board.style.display = 'none';
        board.innerHTML = '';
    }
    showRoomSection();
    renderLobby(roomId, board);
}

function showGameState(roomId, phase, player, allPlayers, settings, secretWord) {
    const board = getGameBoard();
    if (board) {
        board.style.display = 'block';
        board.innerHTML = '';
    }
    hideRoomSection();

    let roleDisplay = `<h2>Your role: <b>${player.role === "Mayor" ? "Mayor (" + player.mayorRole + ")" : player.role}</b></h2>`;
    if (["Mayor", "Seer", "Werewolf"].includes(player.role) && secretWord)
        roleDisplay += `<p>Magic word: <b>${secretWord}</b></p>`;
    if (player.role === "Werewolf") {
        const wwNames = Object.values(allPlayers).filter(p => p.role === "Werewolf" && p.name !== player.name).map(p => p.name).join(", ");
        if (wwNames) roleDisplay += `<p>Fellow Werewolves: <b>${wwNames}</b></p>`;
    }
    roleDisplay += `<div style="margin-top:10px;"><b>Timer:</b> ${settings.timerSeconds || 240} seconds<br><b>Yes/No Tokens:</b> ${settings.yesNoTokens || 36}</div>`;

    // Phase rendering
    switch (phase) {
        case 'mayor-choose':
            if (player.role === 'Mayor') renderMayorChoose(board, roleDisplay, roomId);
            else board.innerHTML = roleDisplay + `<h3>Waiting for Mayor...</h3><p>The Mayor is choosing a word.</p>`;
            break;
        case 'guessing':
            renderGuessingPhase(board, roleDisplay, player, allPlayers, roomId, settings);
            break;
        case 'find-werewolf':
            renderFindWerewolfPhase(board, roleDisplay, player, allPlayers, roomId);
            break;
        case 'find-seer':
            renderFindSeerPhase(board, roleDisplay, player, allPlayers, roomId);
            break;
        case 'game-over':
            board.innerHTML = roleDisplay + `<h3>Game Over</h3>`;
            db.ref('rooms/' + roomId).once('value', roomSnap => {
                const room = roomSnap.val();
                if (room && room.host === userId) {
                    const btn = document.createElement('button');
                    btn.textContent = "Back to Lobby";
                    btn.style.marginTop = "20px";
                    btn.onclick = function() {
                        db.ref('rooms/' + roomId + '/backToLobby').set(Date.now());
                    };
                    board.appendChild(btn);
                }
            });
            break;
        default:
            board.innerHTML = roleDisplay;
    }
}

// --- Listeners ---
function setupLobbyResetListener(roomId) {
    if (window._werewordsBackToLobbyListener) window._werewordsBackToLobbyListener.off();
    window._werewordsBackToLobbyListener = db.ref('rooms/' + roomId + '/backToLobby');
    window._werewordsBackToLobbyListener.on('value', snap => {
        if (snap.val()) resetToLobby(roomId);
    });
}

function setupRoomDeleteListener(roomId) {
    if (window._werewordsRoomListener) window._werewordsRoomListener.off();
    window._werewordsRoomListener = db.ref('rooms/' + roomId);
    window._werewordsRoomListener.on('value', snap => {
        if (!snap.exists()) clearBoard();
    });
}

function setupPhaseListener(roomId) {
    db.ref('rooms/' + roomId + '/phase').on('value', snap => {
        const phase = snap.val();
        const board = getGameBoard();
        if (!phase) {
            showLobbyState(roomId);
            return;
        }
        // Hide lobby, show game board
        db.ref('rooms/' + roomId + '/players/' + userId).once('value', playerSnap => {
            const player = playerSnap.val();
            if (!player) return;
            player.id = userId;
            db.ref('rooms/' + roomId + '/secretWord').once('value', wordSnap => {
                const secretWord = wordSnap.val();
                db.ref('rooms/' + roomId + '/players').once('value', playersSnap => {
                    const allPlayers = playersSnap.val() || {};
                    db.ref('rooms/' + roomId + '/gameSettings').once('value', settingsSnap => {
                        const settings = settingsSnap.val() || {};
                        showGameState(roomId, phase, player, allPlayers, settings, secretWord);
                    });
                });
            });
        });
    });
}

// --- Render lobby UI with player list and start button ---
function renderLobby(roomId, board) {
    if (!board) return;
    board.style.display = 'block';
    db.ref('rooms/' + roomId + '/players').once('value', snap => {
        const players = snap.val() || {};
        let html = `<h2>Lobby</h2><ul>`;
        Object.values(players).forEach(p => {
            html += `<li>${p.name || 'Unknown'}</li>`;
        });
        html += `</ul>`;
        // Show start button only to host
        db.ref('rooms/' + roomId).once('value', roomSnap => {
            const room = roomSnap.val();
            if (room && room.host === userId) {
                html += `<button id="start-werewords-btn">Start Game</button>`;
            }
            board.innerHTML = html;
            if (room && room.host === userId) {
                document.getElementById('start-werewords-btn').onclick = () => window.currentGame.startGame();
            }
        });
    });
}

// --- Mayor chooses word ---
function renderMayorChoose(board, roleDisplay, roomId) {
    db.ref('rooms/' + roomId + '/wordChoices').once('value', wordsSnap => {
        const choices = wordsSnap.val() || [];
        board.innerHTML = roleDisplay + `<p>Choose the magic word:</p><div id="mayor-choices"></div>`;
        const choicesDiv = document.getElementById('mayor-choices');
        choicesDiv.innerHTML = choices.length ? "" : "<i>Waiting for word choices...</i>";
        choices.forEach(word => {
            const btn = document.createElement('button');
            btn.textContent = word;
            btn.onclick = () => mayorPickWord(roomId, word);
            choicesDiv.appendChild(btn);
        });
    });
}

// --- Guessing phase ---
function renderGuessingPhase(board, roleDisplay, player, allPlayers, roomId, settings) {
    board.innerHTML = roleDisplay + `<h3>Guessing Phase</h3>
        <div id="timer"></div>
        <div id="token-count"></div>
        <p>Ask Yes/No/Maybe questions to the Mayor!</p>
        <div id="custom-player-list"></div>`;
    const customPlayerListDiv = document.getElementById('custom-player-list');
    db.ref('rooms/' + roomId + '/guessingState/playerTokens').on('value', tokensSnap => {
        let playerTokens = tokensSnap.val() || {};
        customPlayerListDiv.innerHTML = "";
        Object.keys(allPlayers).forEach(pid => {
            const p = allPlayers[pid]; if (!p) return;
            const row = document.createElement('div');
            row.style.margin = "6px 0"; row.style.display = "flex"; row.style.alignItems = "center";
            const nameSpan = document.createElement('span'); nameSpan.textContent = p.name; nameSpan.style.width = "120px"; row.appendChild(nameSpan);
            const tokens = playerTokens[pid] || {};
            const counterSpan = document.createElement('span');
            counterSpan.innerHTML = `Yes: ${tokens.yes || 0} &nbsp; No: ${tokens.no || 0} &nbsp; Maybe: ${tokens.maybe || 0}`;
            counterSpan.style.margin = "0 10px"; row.appendChild(counterSpan);
            if (player.role === "Mayor") renderMayorGuessingButtons(row, roomId, pid);
            customPlayerListDiv.appendChild(row);
        });
    });
    db.ref('rooms/' + roomId + '/guessingState').on('value', stateSnap => {
        let state = stateSnap.val() || {};
        let yesNoTokens = state.yesNoTokens ?? settings.yesNoTokens ?? 36;
        let maybeTokens = state.maybeTokens ?? settings.maybeTokens ?? 12;
        document.getElementById('token-count').innerHTML =
            `<b>Yes/No Tokens:</b> ${yesNoTokens} &nbsp; <b>Maybe Tokens:</b> ${maybeTokens}`;
        if (yesNoTokens <= 0 && player.role === "Mayor") {
            db.ref('rooms/' + roomId + '/phase').set('find-werewolf');
            db.ref('rooms/' + roomId + '/phaseStart').set(Date.now());
            db.ref('rooms/' + roomId + '/phaseDuration').set(60);
        }
    });
    db.ref('rooms/' + roomId + '/guessingStart').once('value', function(startSnap) {
        let startTime = startSnap.val();
        if (!startTime) {
            startTime = Date.now();
            db.ref('rooms/' + roomId + '/guessingStart').set(startTime);
        }
        const duration = settings.timerSeconds || 240;
        function updateTimer() {
            if (!document.getElementById('timer')) return;
            const now = Date.now();
            const elapsed = Math.floor((now - startTime) / 1000);
            const left = Math.max(0, duration - elapsed);
            document.getElementById('timer').innerHTML = `<b>Time Left:</b> ${left}s`;
            if (left <= 0 && player.role === "Mayor") {
                db.ref('rooms/' + roomId + '/phase').set('find-werewolf');
                db.ref('rooms/' + roomId + '/phaseStart').set(Date.now());
                db.ref('rooms/' + roomId + '/phaseDuration').set(60);
            }
        }
        updateTimer();
        window.werewordsTimer = setInterval(updateTimer, 1000);
    });
    if (player.role === "Mayor") {
        const guessedBtn = document.createElement('button');
        guessedBtn.textContent = "Word Guessed!";
        guessedBtn.style.marginTop = "15px";
        guessedBtn.onclick = function() {
            db.ref('rooms/' + roomId + '/phase').set('find-seer');
            db.ref('rooms/' + roomId + '/phaseStart').set(Date.now());
            db.ref('rooms/' + roomId + '/phaseDuration').set(30);
        };
        board.appendChild(guessedBtn);
    }
}

// --- Mayor's answer buttons ---
function renderMayorGuessingButtons(row, roomId, pid) {
    ["Yes", "No", "Maybe"].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.onclick = function() {
            handleMayorAnswer(roomId, pid, type === "Maybe" ? "maybeTokens" : "yesNoTokens", type.toLowerCase());
        };
        row.appendChild(btn);
    });
}

// --- Voting phase: All players can vote for the Werewolf ---
function renderFindWerewolfPhase(board, roleDisplay, player, allPlayers, roomId) {
    board.innerHTML = roleDisplay + `<h3>Find the Werewolf!</h3>
        <div id="werewolf-timer"></div>
        <div id="werewolf-vote-list"></div>`;
    const voteListDiv = document.getElementById('werewolf-vote-list');
    const playerIds = Object.keys(allPlayers);

    // Sync timer
    db.ref('rooms/' + roomId).once('value', function(roomSnap) {
        const room = roomSnap.val() || {};
        const phaseStart = room.phaseStart || Date.now();
        const phaseDuration = room.phaseDuration || 60;

        let finished = false;
        function updateTimer() {
            const now = Date.now();
            const elapsed = Math.floor((now - phaseStart) / 1000);
            const left = Math.max(0, phaseDuration - elapsed);
            document.getElementById('werewolf-timer').innerHTML = `<b>Time Left:</b> ${left}s`;
            if (left <= 0 && !finished) {
                finished = true;
                if (room.host === userId) finishVoting();
                clearInterval(timerInterval);
            }
        }
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        function finishVoting() {
            db.ref('rooms/' + roomId + '/werewolfVotes').once('value', function(votesSnap) {
                const votes = votesSnap.val() || {};
                const tally = {};
                Object.values(votes).forEach(v => { tally[v] = (tally[v] || 0) + 1; });

                // Find the highest vote count and who got them
                let maxVotes = 0;
                let topVoted = [];
                for (const [targetId, count] of Object.entries(tally)) {
                    if (count > maxVotes) {
                        maxVotes = count;
                        topVoted = [targetId];
                    } else if (count === maxVotes) {
                        topVoted.push(targetId);
                    }
                }

                let resultHtml;
                if (topVoted.length === 1) {
                    // Only one player has the highest votes
                    const accusedId = topVoted[0];
                    if (allPlayers[accusedId] && allPlayers[accusedId].role === "Werewolf") {
                        resultHtml = `<div><b>${allPlayers[accusedId].name} was accused and is the Werewolf! Villagers win.</b></div>`;
                    } else {
                        resultHtml = `<div><b>${allPlayers[accusedId].name} was accused but is NOT the Werewolf. Werewolves win!</b></div>`;
                    }
                } else {
                    // Tie: Werewolves win
                    resultHtml = `<div><b>There was a tie. Werewolves win!</b></div>`;
                }

                voteListDiv.innerHTML += resultHtml;
                // Move to game-over after result
                db.ref('rooms/' + roomId + '/phase').set('game-over');
            });
        }

        db.ref('rooms/' + roomId + '/werewolfVotes').on('value', function(votesSnap) {
            const votes = votesSnap.val() || {};
            voteListDiv.innerHTML = "";
            playerIds.forEach(pid => {
                const p = allPlayers[pid]; if (!p) return;
                const row = document.createElement('div');
                row.textContent = `${p.name} `;
                if (player.id === pid && !votes[pid]) {
                    Object.entries(allPlayers).forEach(([targetId, targetPlayer]) => {
                        if (targetId !== pid) { // Don't allow voting for yourself
                            const btn = document.createElement('button');
                            btn.textContent = `Vote ${targetPlayer.name}`;
                            btn.onclick = function() {
                                db.ref('rooms/' + roomId + '/werewolfVotes/' + pid).set(targetId);
                            };
                            row.appendChild(btn);
                        }
                    });
                } else if (votes[pid]) {
                    row.textContent += `→ ${allPlayers[votes[pid]].name}`;
                }
                voteListDiv.appendChild(row);
            });
            const allVoted = playerIds.every(pid => votes[pid]);
            if (allVoted && room.host === userId) {
                clearInterval(timerInterval);
                finishVoting();
            }
        });
    });
}

// --- Voting phase: Find the Seer (after word guessed) ---
function renderFindSeerPhase(board, roleDisplay, player, allPlayers, roomId) {
    board.innerHTML = roleDisplay + `<h3>Werewolf, find the Seer!</h3>
        <div id="seer-timer"></div>
        <div id="seer-vote-list"></div>`;
    const voteListDiv = document.getElementById('seer-vote-list');
    const werewolfIds = Object.keys(allPlayers).filter(pid => allPlayers[pid].role === "Werewolf");
    const seerCandidates = Object.keys(allPlayers).filter(pid => allPlayers[pid].role !== "Werewolf");

    db.ref('rooms/' + roomId).once('value', function(roomSnap) {
        const room = roomSnap.val() || {};
        const phaseStart = room.phaseStart || Date.now();
        const phaseDuration = room.phaseDuration || 30;

        let finished = false;
        function updateTimer() {
            const now = Date.now();
            const elapsed = Math.floor((now - phaseStart) / 1000);
            const left = Math.max(0, phaseDuration - elapsed);
            document.getElementById('seer-timer').innerHTML = `<b>Time Left:</b> ${left}s`;
            if (left <= 0 && !finished) {
                finished = true;
                if (room.host === userId) finishVoting();
                clearInterval(timerInterval);
            }
        }
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);

        function finishVoting() {
            db.ref('rooms/' + roomId + '/seerVotes').once('value', function(votesSnap) {
                const votes = votesSnap.val() || {};
                let found = false;
                for (const pid of werewolfIds) {
                    if (allPlayers[votes[pid]] && allPlayers[votes[pid]].role === "Seer") {
                        found = true; break;
                    }
                }
                voteListDiv.innerHTML += found
                    ? `<div><b>The Seer has been found! Werewolves win!</b></div>`
                    : `<div><b>The Seer was not found. Villagers win!</b></div>`;
                // Move to game-over after result
                db.ref('rooms/' + roomId + '/phase').set('game-over');
            });
        }

        db.ref('rooms/' + roomId + '/seerVotes').on('value', function(votesSnap) {
            const votes = votesSnap.val() || {};
            voteListDiv.innerHTML = "";
            let anyVote = Object.values(votes).some(v => v);
            if (werewolfIds.includes(player.id) && !votes[player.id] && !anyVote) {
                seerCandidates.forEach(seerId => {
                    const btn = document.createElement('button');
                    btn.textContent = `Vote ${allPlayers[seerId].name}`;
                    btn.onclick = function() {
                        db.ref('rooms/' + roomId + '/seerVotes/' + player.id).set(seerId);
                    };
                    voteListDiv.appendChild(btn);
                });
            }
            if (anyVote) {
                Object.values(votes).forEach(votedId => {
                    if (allPlayers[votedId] && allPlayers[votedId].role !== "Werewolf") {
                        const row = document.createElement('div');
                        row.textContent = `${allPlayers[votedId].name} was chosen as the Seer.`;
                        voteListDiv.appendChild(row);
                    }
                });
            }
            if (anyVote && room.host === userId) {
                clearInterval(timerInterval);
                finishVoting();
            }
        });
    });
}

// --- Game logic: Assign roles and word ---
function assignRolesAndWord() {
    db.ref('users/' + userId).once('value', function(userSnap) {
        const user = userSnap.val();
        if (!user || !user.roomId) return;
        const roomId = user.roomId;
        db.ref('rooms/' + roomId).once('value', function(roomSnap) {
            const room = roomSnap.val();
            if (!room || !room.players) return;
            const playerIds = Object.keys(room.players);
            const baseRoles = ["Werewolf", "Seer"];
            while (baseRoles.length < playerIds.length) baseRoles.push("Villager");
            for (let i = baseRoles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [baseRoles[i], baseRoles[j]] = [baseRoles[j], baseRoles[i]];
            }
            const mayorIdx = Math.floor(Math.random() * playerIds.length);
            const mayorId = playerIds[mayorIdx];
            const mayorBaseRole = baseRoles[mayorIdx];
            playerIds.forEach((pid, idx) => {
                if (pid === mayorId) {
                    db.ref('rooms/' + roomId + '/players/' + pid).update({ role: "Mayor", mayorRole: mayorBaseRole });
                } else {
                    db.ref('rooms/' + roomId + '/players/' + pid).update({ role: baseRoles[idx] });
                }
            });
            const settings = room.settings || {};
            db.ref('rooms/' + roomId + '/gameSettings').set(settings);
            db.ref('rooms/' + roomId + '/guessingState').set({
                yesNoTokens: settings.yesNoTokens ?? 36,
                maybeTokens: settings.maybeTokens ?? 12,
                playerTokens: {}
            });
            db.ref('rooms/' + roomId + '/phase').set('mayor-choose');
            startWordSelection(roomId, settings.difficulty || "easy", mayorId);
        });
    });
}

// --- Game logic: Mayor word selection ---
function startWordSelection(roomId, difficulty, mayorId) {
    db.ref('rooms/' + roomId + '/players/' + mayorId).once('value', function(mayorSnap) {
        const mayor = mayorSnap.val();
        let mainList = wordLists[difficulty] ? [...wordLists[difficulty]] : [...wordLists.easy];
        let mixList = [];
        if (mayor && mayor.mayorRole === "Seer") {
            if (difficulty === "hard") mixList = wordLists["medium"];
            else if (difficulty === "medium") mixList = wordLists["easy"];
            else if (difficulty === "insane") mixList = wordLists["hard"];
        } else if (mayor && mayor.mayorRole === "Werewolf") {
            if (difficulty === "easy") mixList = wordLists["medium"];
            else if (difficulty === "medium") mixList = wordLists["hard"];
            else if (difficulty === "hard") mixList = wordLists["insane"];
        }
        let combined = mainList.concat(mixList || []);
        combined = [...new Set(combined)];
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        const choices = combined.slice(0, 5);
        db.ref('rooms/' + roomId + '/wordChoices').set(choices);
        db.ref('rooms/' + roomId + '/wordChoosing').set(true);
        db.ref('rooms/' + roomId + '/mayorId').set(mayorId);
    });
}

// --- Game logic: Mayor picks word ---
function mayorPickWord(roomId, chosenWord) {
    db.ref('rooms/' + roomId + '/secretWord').set(chosenWord);
    db.ref('rooms/' + roomId + '/wordChoosing').set(false);
    db.ref('rooms/' + roomId + '/phase').set('guessing');
}

// --- Token helpers ---
function handleMayorAnswer(roomId, targetPid, tokenType, answerType) {
    const settingsRef = db.ref('rooms/' + roomId + '/gameSettings');
    settingsRef.once('value', function(settingsSnap) {
        const settings = settingsSnap.val() || {};
        const defaultValue = tokenType === "yesNoTokens"
            ? (settings.yesNoTokens ?? 36)
            : (settings.maybeTokens ?? 12);
        const tokenRef = db.ref('rooms/' + roomId + '/guessingState/' + tokenType);
        tokenRef.transaction(current => {
            if (typeof current === "number" && current > 0) return current - 1;
            else if (typeof current === "undefined" || current === null) return defaultValue - 1;
            else return 0;
        });
        const playerTokenRef = db.ref('rooms/' + roomId + '/guessingState/playerTokens/' + targetPid + '/' + answerType);
        playerTokenRef.transaction(current => (current || 0) + 1);
    });
}

// --- Reset game data and UI for everyone (Insider-style) ---
function resetGame(roomId) {
    db.ref('rooms/' + roomId + '/phase').set(null);
    db.ref('rooms/' + roomId + '/secretWord').set(null);
    db.ref('rooms/' + roomId + '/wordChoices').set(null);
    db.ref('rooms/' + roomId + '/wordChoosing').set(null);
    db.ref('rooms/' + roomId + '/mayorId').set(null);
    db.ref('rooms/' + roomId + '/guessingState').set(null);
    db.ref('rooms/' + roomId + '/guessingStart').set(null);
    db.ref('rooms/' + roomId + '/werewolfVotes').set(null);
    db.ref('rooms/' + roomId + '/seerVotes').set(null);
    db.ref('rooms/' + roomId + '/backToLobby').set(Date.now());
    db.ref('rooms/' + roomId + '/phaseStart').set(null);
    db.ref('rooms/' + roomId + '/phaseDuration').set(null);
}

// --- Helper: Clear UI for everyone and show lobby ---
function clearBoard() {
    const board = getGameBoard();
    if (board) {
        board.style.display = 'none';
        board.innerHTML = '';
    }
}

// --- Helper: Reset to lobby when backToLobby is triggered ---
function resetToLobby(roomId) {
    if (window.werewordsTimer) {
        clearInterval(window.werewordsTimer);
        window.werewordsTimer = null;
    }
    clearBoard();
    showRoomSection();
    db.ref('rooms/' + roomId + '/backToLobby').set(null);
}