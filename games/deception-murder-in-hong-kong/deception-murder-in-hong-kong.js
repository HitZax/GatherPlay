(function () {
    'use strict';

    // === UTILITIES ===
    function getGameBoard() { return document.getElementById('dmhk-board'); }
    function showRoomSection() { const r = document.getElementById('room-section'); if (r) r.style.display = 'block'; }
    function hideRoomSection() { const r = document.getElementById('room-section'); if (r) r.style.display = 'none'; }
    function resetToLobby(roomId) {
        clearTimer();
        const board = getGameBoard();
        if (board) { board.innerHTML = "<h2>Waiting for host to start the game...</h2>"; board.style.display = 'none'; }
        removeTimerDisplay(); showRoomSection();
        if (typeof showSection === "function") showSection('room');
        if (typeof showGameUIElements === "function") showGameUIElements(true);
        // Reset game state in DB
        if (roomId) {
            db.ref('rooms/' + roomId + '/gameState').remove();
            db.ref('rooms/' + roomId + '/backToLobby').set(false);
        }
    }

    // === ROOM LOADED LOGIC ===
    function onRoomLoaded(roomId, username) {
        db.ref('rooms/' + roomId + '/backToLobby').on('value', snap => { if (snap.val()) resetToLobby(roomId); });
        db.ref('rooms/' + roomId + '/gameState').on('value', snap => {
            const state = snap.val();
            if (!state || !state.started) showLobbyState();
            else showGameState(state, roomId);
        });
    }
    function showLobbyState() {
        const board = getGameBoard();
        board.innerHTML = "<h2>Waiting for host to start the game...</h2>";
        board.style.display = 'none';
        showRoomSection();
    }
    function showGameState(state, roomId) {
        const board = getGameBoard();
        board.style.display = 'block';
        hideRoomSection();
        if (renderGameTimeout) clearTimeout(renderGameTimeout);
        renderGameTimeout = setTimeout(() => {
            getPlayerMap(roomId).then(userMap => renderGame(state, roomId, userMap));
        }, 50); // 50ms debounce
    }
    function getPlayerMap(roomId) {
        return new Promise(resolve => {
            db.ref('rooms/' + roomId + '/players').once('value', snap => {
                const userMap = {};
                snap.forEach(child => { userMap[child.key] = child.val().name; });
                resolve(userMap);
            });
        });
    }

    // === GAME RENDERING ===
    let renderGameTimeout = null;
    function renderGame(state, roomId, userMap) {
        clearTimeout(renderGameTimeout);
        renderGameTimeout = setTimeout(() => {
            const container = getGameBoard();
            container.innerHTML = '';
            const phase = state.phase || "unknown";
            const round = state.round || 1;
            const myRole = state.playerRoles && state.playerRoles[userId];

            // --- Header ---
            container.innerHTML += `<h2>Deception: Murder in Hong Kong</h2>`;
            container.innerHTML += `<div><strong>Phase:</strong> ${phase}</div>`;
            container.innerHTML += `<div><strong>Round:</strong> ${round}</div>`;
            if (myRole) container.innerHTML += `<div><strong>Your Role:</strong> ${myRole}</div>`;
            if (state.forensicId && userMap[state.forensicId]) container.innerHTML += `<div><strong>Forensic Scientist:</strong> ${userMap[state.forensicId]}</div>`;

            // --- Silent Phase ---
            if (phase === "silent") {
                if (myRole === "Murderer" && !state.solution && state.playerCards && state.playerCards[userId]) {
                    const cards = state.playerCards[userId];
                    container.innerHTML += `
                        <div id="murderer-select" style="margin:20px 0; padding:10px; border:1px solid #ccc;">
                            <strong>Select your Key Evidence and Means of Murder:</strong><br>
                            <label>Clue:
                                <select id="murderer-clue">
                                    ${cards.clue.map(c => `<option value="${c}">${c}</option>`).join("")}
                            </select>
                            </label>
                            <label style="margin-left:10px;">Means:
                                <select id="murderer-means">
                                    ${cards.means.map(c => `<option value="${c}">${c}</option>`).join("")}
                            </select>
                            </label>
                            <button id="murderer-submit" style="margin-left:10px;">Submit</button>
                        </div>
                    `;
                    setTimeout(() => {
                        document.getElementById('murderer-submit').onclick = function () {
                            const clue = document.getElementById('murderer-clue').value;
                            const means = document.getElementById('murderer-means').value;
                            db.ref('rooms/' + roomId + '/gameState/solution').set({
                                murdererId: userId, clue, means
                            });
                            db.ref('rooms/' + roomId + '/gameState/phase').set("investigation");
                        };
                    }, 0);
                }
                // Show solution to Forensic Scientist and Accomplice (if chosen)
                if (
                    state.solution &&
                    (
                        myRole === "Forensic Scientist" ||
                        (myRole === "Accomplice" && state.playerRoles)
                    )
                ) {
                    // Only show to Accomplice if they exist and are not the murderer
                    let showToAccomplice = myRole === "Accomplice" &&
                        state.playerRoles &&
                        state.solution &&
                        userId !== state.solution.murdererId;

                    if (myRole === "Forensic Scientist" || showToAccomplice) {
                        const murdererName = userMap[state.solution.murdererId] || "Unknown";
                        container.innerHTML += `<div style="margin:10px 0; padding:8px; background:#e7f3ff; border:1px solid #b3d7ff;">
                            <strong>Murderer:</strong> ${murdererName}<br>
                            <strong>Key Evidence:</strong> ${state.solution.clue}<br>
                            <strong>Means of Murder:</strong> ${state.solution.means}
                        </div>`;
                    }
                }
            }

            // --- Show solution to relevant roles if available ---
            if (state.solution) {
                // Forensic Scientist, Accomplice (not murderer), and Murderer see full solution in ALL phases
                const isForensic = myRole === "Forensic Scientist";
                const isAccomplice = myRole === "Accomplice" && userId !== state.solution.murdererId;
                const isMurderer = myRole === "Murderer" && userId === state.solution.murdererId;
                if (isForensic || isAccomplice || isMurderer) {
                    const murdererName = userMap[state.solution.murdererId] || "Unknown";
                    container.innerHTML += `<div style="margin:10px 0; padding:8px; background:#e7f3ff; border:1px solid #b3d7ff;">
                        <strong>Murderer:</strong> ${murdererName}<br>
                        <strong>Key Evidence:</strong> ${state.solution.clue}<br>
                        <strong>Means of Murder:</strong> ${state.solution.means}
                    </div>`;
                }
                // Witness only sees who the murderer is, not the cards
                if (myRole === "Witness") {
                    const murdererName = userMap[state.solution.murdererId] || "Unknown";
                    container.innerHTML += `<div style="margin:10px 0; padding:8px; background:#fffbe6; border:1px solid #ffe58f;">
                        <strong>Witness Info:</strong> The murderer is <strong>${murdererName}</strong>.
                    </div>`;
                }
            }

            // === INVESTIGATION PHASE FLOW ===
            if (phase === "investigation") {
                let maxTiles = 6 + (round > 1 ? 1 : 0) + (round > 2 ? 1 : 0);

                // --- Show all players' cards except Forensic Scientist ---
                if (phase === "investigation" && state.playerCards) {
                    container.innerHTML += `<hr><div><strong>Players & Cards:</strong><ul style="list-style:none; padding-left:0;">`;
                    for (const pid in userMap) {
                        // Skip Forensic Scientist
                        if (state.playerRoles && state.playerRoles[pid] === "Forensic Scientist") continue;
                        const cards = state.playerCards[pid];
                        container.innerHTML += `<li style="margin-bottom:10px;"><strong>${userMap[pid]}</strong>`;
                        if (cards) {
                            container.innerHTML += `<div style="margin-left:10px;">
                                <span style="font-weight:bold;">Clues:</span> ${cards.clue.map(c => `<span style="margin-right:6px;">${c}</span>`).join("")}<br>
                                <span style="font-weight:bold;">Means:</span> ${cards.means.map(c => `<span style="margin-right:6px;">${c}</span>`).join("")}
                            </div>`;
                        }
                        container.innerHTML += `</li>`;
                    }
                    container.innerHTML += `</ul></div>`;
                }

                // Mark Scene Tiles
                container.innerHTML += `<hr><div><strong>Mark Scene Tiles:</strong><ul>`;
                state.sceneTiles.slice(0, maxTiles).forEach((tile, idx) => {
                    container.innerHTML += `<li><strong>${tile.name}:</strong> `;
                    if (Array.isArray(tile.options)) {
                        container.innerHTML += tile.options.map((opt, i) =>
                            (typeof tile.marked === "number" && tile.marked === i)
                                ? `<span style="font-weight:bold; text-decoration:underline;">${opt}</span>`
                                : `<span>${opt}</span>`
                        ).join(" | ");
                        if (myRole === "Forensic Scientist") {
                            container.innerHTML += `
                                <br>
                                <select id="scene-mark-${idx}">
                                    ${tile.options.map((opt, i) =>
                                        `<option value="${i}"${tile.marked === i ? " selected" : ""}>${opt}</option>`
                                    ).join("")}
                                </select>
                                <button id="scene-submit-${idx}">${(typeof tile.marked === "number") ? "Change" : "Mark"}</button>
                            `;
                        }
                    }
                    container.innerHTML += `</li>`;
                });
                container.innerHTML += `</ul></div>`;

                // Forensic can mark tiles
                if (myRole === "Forensic Scientist") {
                    setTimeout(() => {
                        state.sceneTiles.slice(0, maxTiles).forEach((tile, idx) => {
                            const btn = document.getElementById(`scene-submit-${idx}`);
                            if (btn) {
                                btn.onclick = function () {
                                    const val = parseInt(document.getElementById(`scene-mark-${idx}`).value, 10);
                                    db.ref(`rooms/${roomId}/gameState/sceneTiles/${idx}/marked`).set(val);
                            };
                            }
                        });
                    }, 0);
                }

                // --- Timer Start Logic (Forensic only, only once) ---
                const markedCount = state.sceneTiles.slice(0, maxTiles).filter(tile => typeof tile.marked === "number").length;
                if (
                    markedCount === maxTiles &&
                    !state.timerStarted &&
                    myRole === "Forensic Scientist"
                ) {
                    db.ref(`rooms/${roomId}/gameState/timerStarted`).set(Date.now());
                }

                // --- Add New Tile UI (Forensic only, after tiles are marked, before timer runs out) ---
                if (
                    phase === "investigation" &&
                    myRole === "Forensic Scientist" &&
                    markedCount === maxTiles &&
                    round < 3 &&
                    (!state.timerStarted || (state.timerStarted && Date.now() - state.timerStarted < window.deceptionSettings.roundTimerMinutes * 60 * 1000))
                ) {
                    container.innerHTML += `
                        <div style="margin:16px 0; padding:10px; background:#fffbe6; border:1px solid #ffe58f; border-radius:5px;">
                            <strong>Warning:</strong> Adding a new scene tile will reset the timer and move to the next round. If you do not add a tile before the timer runs out, the evil team wins!
                        </div>
                        <button id="add-scene-tile" style="margin:8px 0;">Add Scene Tile & Next Round</button>
                    `;
                    setTimeout(() => {
                        const btn = document.getElementById('add-scene-tile');
                        if (btn) {
                            btn.onclick = function() {
                                const usedIds = state.sceneTiles.map(t => t.id);
                                const allTiles = window.deceptionComponents.sceneTiles.filter(t =>
                                    t.type === "scene" && !usedIds.includes(t.id)
                                );
                                if (allTiles.length > 0) {
                                    const newTile = allTiles[Math.floor(Math.random() * allTiles.length)];
                                    const newTiles = state.sceneTiles.concat([{
                                        id: newTile.id,
                                        name: newTile.name,
                                        options: newTile.options,
                                        marked: null
                                    }]);
                                    db.ref(`rooms/${roomId}/gameState/sceneTiles`).set(newTiles);
                                }
                                db.ref(`rooms/${roomId}/gameState/round`).set(round + 1);
                                db.ref(`rooms/${roomId}/gameState/timerStarted`).set(null);
                            };
                        }
                    }, 0);
                }

                // --- Timer Expiry: Evil wins if Forensic doesn't add tile in time (except round 3) ---
                if (
                    state.timerStarted &&
                    typeof state.timerStarted === "number" &&
                    Date.now() - state.timerStarted >= window.deceptionSettings.roundTimerMinutes * 60 * 1000
                ) {
                    if (round < 3 && !state.finalGuessTimerStarted && phase === "investigation") {
                        // Evil wins if forensic didn't add a tile in time
                        db.ref(`rooms/${roomId}/gameState/phase`).set("end");
                        db.ref(`rooms/${roomId}/gameState/winner`).set({ type: "murderer" });
                    }
                    // For round 3, start final guess timer
                    if (round === 3 && !state.finalGuessTimerStarted && myRole === "Forensic Scientist") {
                        db.ref(`rooms/${roomId}/gameState/finalGuessTimerStarted`).set(Date.now());
                    }
                }

                // --- FINAL GUESS TIMER (Round 3) ---
                if (state.finalGuessTimerStarted && round === 3) {
                    startTimer(state.finalGuessTimerStarted, window.deceptionSettings.finalGuessTimerMinutes, () => {
                        db.ref(`rooms/${roomId}/gameState/phase`).set("end");
                        db.ref(`rooms/${roomId}/gameState/winner`).set({ type: "murderer" });
                    });
                }

                // --- ROUND TIMER (only if not in round 3) ---
                if (state.timerStarted && round < 3) {
                    startTimer(state.timerStarted, window.deceptionSettings.roundTimerMinutes, () => { });
                }
            }

            // --- Solving the Crime (any time except Forensic Scientist) ---
            if (
                phase === "investigation" &&
                myRole !== "Forensic Scientist" &&
                (!state.solveAttempts || !state.solveAttempts[userId])
            ) {
                container.innerHTML += `<hr><div><strong>Solve the Crime:</strong><ul>`;
                for (const pid in userMap) {
                    if (pid === state.forensicId || pid === userId) continue;
                    const cards = state.playerCards && state.playerCards[pid];
                    container.innerHTML += `<li><strong>${userMap[pid]}</strong>`;
                    if (cards) {
                        container.innerHTML += `
                            <button id="solve-btn-${pid}">Solve</button>
                            <div id="solve-modal-${pid}" style="display:none; margin-top:5px;">
                                <label>Clue:
                                    <select id="solve-clue-${pid}">
                                        ${cards.clue.map(c => `<option value="${c}">${c}</option>`).join("")}
                                    </select>
                                </label>
                                <label style="margin-left:10px;">Means:
                                    <select id="solve-means-${pid}">
                                        ${cards.means.map(c => `<option value="${c}">${c}</option>`).join("")}
                                    </select>
                                </label>
                                <button id="solve-submit-${pid}">Submit Guess</button>
                                <button id="solve-cancel-${pid}" style="margin-left:10px;">Cancel</button>
                            </div>
                        `;
                    }
                    container.innerHTML += `</li>`;
                }
                container.innerHTML += `</ul></div>`;

                setTimeout(() => {
                    for (const pid in userMap) {
                        if (pid === state.forensicId || pid === userId) continue;
                        const btn = document.getElementById(`solve-btn-${pid}`);
                        const modal = document.getElementById(`solve-modal-${pid}`);
                        if (btn && modal) {
                            btn.onclick = () => { modal.style.display = 'block'; };
                            const submit = document.getElementById(`solve-submit-${pid}`);
                            const cancel = document.getElementById(`solve-cancel-${pid}`);
                            if (cancel) cancel.onclick = () => { modal.style.display = 'none'; };
                            if (submit) {
                                submit.onclick = () => {
                                    const clue = document.getElementById(`solve-clue-${pid}`).value;
                                    const means = document.getElementById(`solve-means-${pid}`).value;
                                    db.ref(`rooms/${roomId}/gameState`).once('value', function (snap) {
                                        const gameState = snap.val();
                                        const solution = gameState && gameState.solution;
                                        if (
                                            solution &&
                                            solution.murdererId === pid &&
                                            solution.clue === clue &&
                                            solution.means === means
                                        ) {
                                            db.ref(`rooms/${roomId}/gameState/phase`).set("end");
                                            db.ref(`rooms/${roomId}/gameState/winner`).set({
                                                type: "investigators",
                                                solver: userMap[userId],
                                                murderer: userMap[solution.murdererId]
                                            });
                                        } else {
                                            db.ref(`rooms/${roomId}/gameState/solveAttempts/${userId}`).set({
                                                suspectId: pid,
                                                clue,
                                                means,
                                                correct: false
                                            });
                                        }
                                    });
                                    modal.style.display = 'none';
                                };
                            }
                        }
                    }
                }, 0);
            }

            // --- End Phase ---
            if (phase === "end" && state.winner) {
                let msg = "";
                if (state.winner.type === "investigators") {
                    msg = `<div style="padding:16px; background:#e7ffe7; border:1px solid #b3ffb3;">
                        <h2>Investigators Win!</h2>
                        <div><strong>${state.winner.solver}</strong> correctly solved the crime!</div>
                        <div><strong>Murderer:</strong> ${state.winner.murderer}</div>
                    </div>`;
                } else {
                    msg = `<div style="padding:16px; background:#ffe7e7; border:1px solid #ffb3b3;">
                        <h2>Murderer Wins!</h2>
                    </div>`;
                }
                container.innerHTML = msg + `<button id="return-lobby" style="margin-top:20px;">Return to Lobby</button>`;
                setTimeout(() => {
                    const btn = document.getElementById('return-lobby');
                    if (btn) btn.onclick = () => {
                        db.ref(`rooms/${roomId}/backToLobby`).set(true);
                    };
                }, 0);
            }

            // --- Forensic Scientist: Start Final Guess Timer (round 3) ---
            if (
                phase === "investigation" &&
                myRole === "Forensic Scientist" &&
                round === 3 &&
                !state.finalGuessTimerStarted
            ) {
                const maxTiles = 6 + (round > 1 ? 1 : 0) + (round > 2 ? 1 : 0);
                const markedCount = state.sceneTiles.slice(0, maxTiles).filter(tile => typeof tile.marked === "number").length;
                if (markedCount === maxTiles) {
                    db.ref(`rooms/${roomId}/gameState/finalGuessTimerStarted`).set(Date.now());
                }
            }
        });
    }

    // === TIMER MANAGEMENT ===
    let timerInterval = null;
    function startTimer(timerStart, timerMinutes, onExpire) {
        clearTimer();
        let timerDiv = document.getElementById('dmhk-timer');
        if (!timerDiv) {
            const board = getGameBoard();
            timerDiv = document.createElement('div');
            timerDiv.id = 'dmhk-timer';
            timerDiv.style.cssText = 'margin: 15px 0; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; text-align: center; font-weight: bold;';
            board.insertBefore(timerDiv, board.firstChild);
        }
        const updateTimer = () => {
            const elapsed = Math.floor((Date.now() - timerStart) / 1000);
            const total = Math.floor(timerMinutes * 60);
            const left = Math.max(0, total - elapsed);
            const min = Math.floor(left / 60);
            const sec = left % 60;
            timerDiv.innerHTML = `⏱️ Time Remaining: ${min}:${sec.toString().padStart(2, '0')}`;
            if (left <= 30) {
                timerDiv.style.background = '#f8d7da';
                timerDiv.style.borderColor = '#f5c6cb';
                timerDiv.style.color = '#721c24';
            }
            if (left <= 0) {
                clearTimer();
                if (typeof onExpire === "function") onExpire();
            }
        };
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }
    function clearTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
    function removeTimerDisplay() {
        const timerDiv = document.getElementById('dmhk-timer');
        if (timerDiv) timerDiv.remove();
    }

    // === GAME START SCAFFOLD ===
    function startGame(roomId, settings) {
        if (!roomId || !settings) {
            db.ref('users/' + userId).once('value', function (userSnap) {
                const user = userSnap.val();
                if (!user || !user.roomId) { alert("You must be in a room to start the game."); return; }
                db.ref('rooms/' + user.roomId + '/settings').once('value', function (settingsSnap) {
                    startGame(user.roomId, settingsSnap.val() || window.deceptionSettings);
                });
            });
            return;
        }
        db.ref('rooms/' + roomId + '/players').once('value', function (snap) {
            const players = [];
            snap.forEach(child => { players.push({ id: child.key, name: child.val().name }); });
            const roles = assignRoles(players.length);
            const playerRoles = {};
            players.forEach((p, i) => playerRoles[p.id] = roles[i]);
            const clueDeck = shuffleArray([...window.deceptionComponents.clueCards]);
            const meansDeck = shuffleArray([...window.deceptionComponents.meansCards]);
            const cardsPerPlayer = settings.cardsPerPlayer || 4;
            const playerCards = {};
            players.forEach(p => {
                if (playerRoles[p.id] !== "Forensic Scientist") {
                    playerCards[p.id] = {
                        clue: clueDeck.splice(0, cardsPerPlayer),
                        means: meansDeck.splice(0, cardsPerPlayer)
                    };
                }
            });
            const forensicId = players.find(p => playerRoles[p.id] === "Forensic Scientist").id;
            const sceneTiles = [];
            const allTiles = [...window.deceptionComponents.sceneTiles];
            sceneTiles.push(allTiles.find(t => t.type === "location"));
            sceneTiles.push(allTiles.find(t => t.type === "cause"));
            const otherTiles = allTiles.filter(t => t.type === "scene");
            shuffleArray(otherTiles);
            sceneTiles.push(...otherTiles.slice(0, 6)); // Start with 6 scene tiles
            const gameState = {
                started: true,
                phase: "silent",
                round: 1,
                forensicId,
                playerRoles,
                playerCards,
                sceneTiles: sceneTiles.map(t => ({
                    id: t.id,
                    name: t.name,
                    options: t.options,
                    marked: null
                })),
                solution: null,
                presentations: [],
                solveAttempts: {},
                timer: null,
                timerStarted: null,
                finalGuessTimerStarted: null
            };
            db.ref('rooms/' + roomId + '/gameState').set(gameState);
        });
    }

    function assignRoles(playerCount) {
        const roles = ["Forensic Scientist", "Murderer"];
        if (playerCount >= 6 && window.deceptionSettings.accomplice.enabled) roles.push("Accomplice");
        if (playerCount >= 6 && window.deceptionSettings.witness.enabled) roles.push("Witness");
        while (roles.length < playerCount) roles.push("Investigator");
        return shuffleArray(roles);
    }
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Expose onRoomLoaded for integration
    window.deceptionOnRoomLoaded = onRoomLoaded;
    window.currentGame = {
        name: "Deception Murder in Hong Kong",
        onRoomLoaded: onRoomLoaded,
        startGame: startGame,
        rulesHtml: window.deceptionRulesHtml,
        settings: window.deceptionSettings,
        components: window.deceptionComponents
    };
})();