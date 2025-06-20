(function() {
    'use strict';
    
    // === CONSTANTS ===
    const MIN_PLAYERS = 4;
    const DEFAULT_TIMER_MINUTES = 3;
    const DEFAULT_DIFFICULTY = 'easy';
    
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
    let timerInterval = null;
    
    // === GAME DEFINITION ===
    window.currentGame = {
        name: "Insider",
        settings: [
            {
                key: "timerMinutes",
                label: "Timer (minutes)",
                type: "number",
                default: DEFAULT_TIMER_MINUTES,
                min: 1,
                max: 10,
                description: "How many minutes for the questioning phase."
            },
            {
                key: "wordDifficulty",
                label: "Word Difficulty",
                type: "select",
                default: DEFAULT_DIFFICULTY,
                options: [
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                    { value: "mixed", label: "Mixed (All difficulties)" }
                ],
                description: "Choose the difficulty level of secret words."
            }
        ],
        rulesHtml: `
            <h3>Insider Game Rules</h3>
            <p><strong>Insider</strong> is a social deduction game where players try to guess a secret word while one player secretly helps them.</p>
            
            <h4>Roles:</h4>
            <ul>
                <li><strong>Master:</strong> Knows the word, answers yes/no questions (revealed to all)</li>
                <li><strong>Insider:</strong> Knows the word, secretly guides the group (hidden role)</li>
                <li><strong>Commons:</strong> Don't know the word, ask questions to guess it</li>
            </ul>
            
            <h4>How to Play:</h4>
            <ol>
                <li>Roles are assigned randomly (Master is revealed, Insider is secret)</li>
                <li>Master and Insider both see the secret word</li>
                <li>Timer starts - Commons ask yes/no questions to guess the word</li>
                <li>When word is guessed or timer runs out, Master votes for who they think is the Insider</li>
                <li>All roles are revealed and winners are announced</li>
            </ol>
            
            <h4>Victory Conditions:</h4>
            <ul>
                <li><strong>Master & Commons win:</strong> If Master correctly identifies the Insider</li>
                <li><strong>Insider wins:</strong> If Master fails to identify them</li>
            </ul>
            
            <p><em>Minimum 4 players required to play.</em></p>
        `,
        startGame: startGame,
        onRoomLoaded: onRoomLoaded
    };
    
    // === GAME START LOGIC ===
    function startGame() {
        getUserRoomData()
            .then(({ user, roomId }) => getPlayersData(roomId))
            .then(({ players, roomId }) => {
                if (!validatePlayerCount(players)) {
                    return; // Page will reload, no need to continue
                }
                return createGameState(players, roomId);
            })
            .catch(handleError);
    }
    
    function getUserRoomData() {
        return new Promise((resolve, reject) => {
            db.ref('users/' + userId).once('value', function(snapshot) {
                const user = snapshot.val();
                if (!user || !user.roomId) {
                    reject(new Error("You must be in a room to start the game."));
                    return;
                }
                resolve({ user, roomId: user.roomId });
            });
        });
    }
    
    function getPlayersData(roomId) {
        return new Promise((resolve) => {
            db.ref('rooms/' + roomId + '/players').once('value', function(playersSnap) {
                const players = [];
                playersSnap.forEach(child => {
                    players.push({ userId: child.key, name: child.val().name });
                });
                resolve({ players, roomId });
            });
        });
    }
    
    function validatePlayerCount(players) {
        if (players.length < MIN_PLAYERS) {
            alert(`At least ${MIN_PLAYERS} players are required to play Insider.`);
            // Force page reload to reset state cleanly
            setTimeout(() => {
                window.location.reload();
            }, 1);
            return false;
        }
        return true;
    }
    
    function createGameState(players, roomId) {
        const roles = assignRoles(players);
        
        return getGameSettings(roomId)
            .then(settings => {
                const word = selectRandomWord(settings.wordDifficulty);
                return saveGameState(roomId, roles, word, settings);
            });
    }
    
    function assignRoles(players) {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        const roles = {};
        
        roles[shuffled[0].userId] = "Master";
        roles[shuffled[1].userId] = "Insider";
        
        for (let i = 2; i < shuffled.length; i++) {
            roles[shuffled[i].userId] = "Common";
        }
        
        return roles;
    }
    
    function getGameSettings(roomId) {
        return new Promise((resolve) => {
            db.ref('rooms/' + roomId + '/settings').once('value', function(settingsSnap) {
                const settings = settingsSnap.val() || {};
                resolve({
                    timerMinutes: settings.timerMinutes || DEFAULT_TIMER_MINUTES,
                    wordDifficulty: settings.wordDifficulty || DEFAULT_DIFFICULTY
                });
            });
        });
    }
    
    function selectRandomWord(difficulty) {
        let words = ["Test"]; // Fallback
        
        if (window.insiderWords) {
            if (difficulty === "mixed") {
                words = [
                    ...window.insiderWords.easy,
                    ...window.insiderWords.medium,
                    ...window.insiderWords.hard
                ];
            } else {
                words = window.insiderWords[difficulty] || window.insiderWords.easy;
            }
        }
        
        return words[Math.floor(Math.random() * words.length)];
    }
    
    function saveGameState(roomId, roles, word, settings) {
        return db.ref('rooms/' + roomId + '/gameState').set({
            phase: 1,
            roles: roles,
            word: word,
            started: true,
            timerStart: Date.now(),
            timerMinutes: settings.timerMinutes,
            wordDifficulty: settings.wordDifficulty
        });
    }
    
    function handleError(error) {
        console.error('Game start error:', error);
        alert(error.message || "An error occurred while starting the game.");
    }
    
    // === ROOM LOADED LOGIC ===
    function onRoomLoaded(roomId, username) {
        setupLobbyResetListener(roomId);
        setupGameStateListener(roomId);
    }
    
    function setupLobbyResetListener(roomId) {
        db.ref('rooms/' + roomId + '/backToLobby').on('value', function(snap) {
            if (snap.val()) {
                resetToLobby();
            }
        });
    }
    
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
    
    // === UI HELPERS ===
    function getGameBoard() {
        return document.getElementById('insider-board');
    }
    
    function showRoomSection() {
        const roomSection = document.getElementById('room-section');
        if (roomSection) {
            roomSection.style.display = 'block';
        }
    }
    
    function hideRoomSection() {
        const roomSection = document.getElementById('room-section');
        if (roomSection) {
            roomSection.style.display = 'none';
        }
    }
    
    function resetToLobby() {
        clearTimer();
        
        const board = getGameBoard();
        if (board) {
            board.innerHTML = "<h2>Waiting for host to start the game...</h2>";
            board.style.display = 'none';
        }
        
        removeTimerDisplay();
        showRoomSection();
        
        if (typeof showSection === "function") {
            showSection('room');
        }
        
        if (typeof showGameUIElements === "function") {
            showGameUIElements(true);
        }
        
        hideOtherGameBoards();
    }
    
    function hideOtherGameBoards() {
        const ftkBoard = document.getElementById('ftk-board');
        if (ftkBoard) {
            ftkBoard.style.display = 'none';
        }
    }
    
    // === GAME RENDERING ===
    function renderGame(state, roomId, userMap) {
        const container = getGameBoard();
        container.innerHTML = '';
        
        renderGameHeader(container, state, userMap);
        renderGamePhase(container, state, roomId, userMap);
    }
    
    function renderGameHeader(container, state, userMap) {
        const masterId = Object.keys(state.roles).find(pid => state.roles[pid] === "Master");
        const userRole = state.roles[userId];
        
        const header = document.createElement('div');
        header.innerHTML = `
            <div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
                <div><strong>Master:</strong> ${userMap[masterId] || masterId}</div>
                <div><strong>Your Role:</strong> <span style="color: ${getRoleColor(userRole)}">${userRole || "Unknown"}</span></div>
                ${(userRole === "Master" || userRole === "Insider") ? 
                    `<div><strong>Secret Word:</strong> <span style="color: #e74c3c; font-size: 1.2em;">${state.word}</span></div>` : 
                    ''
                }
            </div>
        `;
        container.appendChild(header);
    }
    
    function getRoleColor(role) {
        switch(role) {
            case "Master": return "#3498db";
            case "Insider": return "#e74c3c";
            case "Common": return "#27ae60";
            default: return "#7f8c8d";
        }
    }
    
    function renderGamePhase(container, state, roomId, userMap) {
        switch(state.phase) {
            case 1:
                renderQuestioningPhase(container, state, roomId);
                break;
            case 2:
                renderVotingPhase(container, state, roomId, userMap);
                break;
            case 3:
                renderGameOver(container, state, roomId, userMap);
                break;
        }
    }
    
    function renderQuestioningPhase(container, state, roomId) {
        const masterId = Object.keys(state.roles).find(pid => state.roles[pid] === "Master");
        
        const section = document.createElement('div');
        section.innerHTML = `
            <h3>Phase 1: Guess the Word</h3>
            <p>Ask Yes/No questions to the Master to figure out the secret word!</p>
        `;
        
        if (userId === masterId) {
            const btn = document.createElement('button');
            btn.textContent = 'Proceed to Accusation Phase';
            btn.style.cssText = 'margin-top: 10px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;';
            btn.onclick = () => {
                db.ref('rooms/' + roomId + '/gameState').update({ phase: 2 });
            };
            section.appendChild(btn);
        } else {
            const info = document.createElement('p');
            info.innerHTML = '<em>Ask questions to the Master. Only the Master can proceed to the next phase.</em>';
            info.style.fontStyle = 'italic';
            section.appendChild(info);
        }
        
        container.appendChild(section);
        startTimer(state.timerStart, state.timerMinutes, () => {
            db.ref('rooms/' + roomId + '/gameState').update({
                phase: 3,
                result: "⏰ Time's up! Nobody wins this round."
            });
        });
    }
    
    function renderVotingPhase(container, state, roomId, userMap) {
        const masterId = Object.keys(state.roles).find(pid => state.roles[pid] === "Master");
        
        const section = document.createElement('div');
        section.innerHTML = `
            <h3>Phase 2: Master's Accusation</h3>
            <p>The Master must vote for who they think is the Insider. All roles will be revealed after the vote.</p>
        `;
        
        if (userId === masterId) {
            const selectContainer = document.createElement('div');
            selectContainer.style.margin = '15px 0';
            
            const select = document.createElement('select');
            select.style.cssText = 'padding: 8px; margin-right: 10px; border-radius: 3px; border: 1px solid #ddd;';
            select.innerHTML = '<option value="">Select player to accuse</option>';
            
            for (const pid in state.roles) {
                if (pid !== masterId) {
                    select.innerHTML += `<option value="${pid}">${userMap[pid] || pid}</option>`;
                }
            }
            
            const btn = document.createElement('button');
            btn.textContent = 'Make Accusation';
            btn.style.cssText = 'padding: 8px 16px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;';
            btn.onclick = () => {
                const votedId = select.value;
                if (!votedId) {
                    alert('Please select a player to accuse!');
                    return;
                }
                
                const insiderId = Object.keys(state.roles).find(pid => state.roles[pid] === "Insider");
                const result = votedId === insiderId 
                    ? "🎉 Victory: Master & Commons! The Insider was caught!"
                    : "🎭 Victory: Insider! The Master's accusation was wrong!";
                
                db.ref('rooms/' + roomId + '/gameState').update({
                    phase: 3,
                    result: result,
                    accusedPlayer: votedId
                });
            };
            
            selectContainer.appendChild(select);
            selectContainer.appendChild(btn);
            section.appendChild(selectContainer);
        } else {
            const info = document.createElement('p');
            info.innerHTML = '<em>Wait for the Master to make their accusation...</em>';
            info.style.fontStyle = 'italic';
            section.appendChild(info);
        }
        
        container.appendChild(section);
    }
    
    function renderGameOver(container, state, roomId, userMap) {
        const section = document.createElement('div');
        section.innerHTML = `
            <h3>🎮 Game Over</h3>
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <p style="font-size: 1.2em; margin: 0;"><strong>${state.result || "Game completed!"}</strong></p>
            </div>
            <h4>👥 Final Roles:</h4>
            <ul style="list-style: none; padding: 0;">
                ${Object.entries(state.roles).map(([pid, role]) =>
                    `<li style="margin: 8px 0; padding: 8px; background: ${getRoleBackgroundColor(role)}; border-radius: 4px;">
                        <strong>${userMap[pid] || pid}:</strong> 
                        <span style="color: ${getRoleColor(role)}; font-weight: bold;">${role}</span>
                        ${state.accusedPlayer === pid ? ' <span style="color: #e74c3c;">← Accused</span>' : ''}
                    </li>`
                ).join('')}
            </ul>
        `;
        container.appendChild(section);
        
        renderBackToLobbyButton(section, roomId);
    }
    
    function getRoleBackgroundColor(role) {
        switch(role) {
            case "Master": return "#e3f2fd";
            case "Insider": return "#ffebee";
            case "Common": return "#e8f5e8";
            default: return "#f5f5f5";
        }
    }
    
    function renderBackToLobbyButton(container, roomId) {
        db.ref('rooms/' + roomId + '/host').once('value', function(snap) {
            const hostUserId = snap.val();
            
            if (hostUserId === userId) {
                const btn = document.createElement('button');
                btn.textContent = '🏠 Back to Lobby';
                btn.style.cssText = 'margin-top: 20px; padding: 12px 24px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1em;';
                btn.onclick = () => {
                    db.ref('rooms/' + roomId + '/gameState').remove();
                    db.ref('rooms/' + roomId + '/backToLobby').set(Date.now());
                    
                    setTimeout(() => {
                        db.ref('rooms/' + roomId + '/backToLobby').remove();
                    }, 1000);
                };
                container.appendChild(btn);
            }
        });
    }
    
    // === TIMER MANAGEMENT ===
    function startTimer(timerStart, timerMinutes, onExpire) {
        clearTimer();
        
        let timerDiv = document.getElementById('insider-timer');
        if (!timerDiv) {
            const board = getGameBoard();
            timerDiv = document.createElement('div');
            timerDiv.id = 'insider-timer';
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
            
            // Change color when time is running out
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
    
    function clearTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    function removeTimerDisplay() {
        const timerDiv = document.getElementById('insider-timer');
        if (timerDiv) {
            timerDiv.remove();
        }
    }
    
})();