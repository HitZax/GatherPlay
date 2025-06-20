function showMainSections() {
    document.getElementById('username-section').style.display = 'none';
    document.getElementById('game-list').style.display = 'block';
    document.getElementById('room-section').style.display = 'none';

    // Hide create room button if a room already exists in localStorage
    const roomId = localStorage.getItem('roomId');
    if (roomId) {
        document.getElementById('create-room').style.display = 'none';
    } else {
        document.getElementById('create-room').style.display = 'inline-block';
        document.getElementById('create-room').disabled = false;
    }
}

// --- User ID management ---
function getOrCreateUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}
window.userId = getOrCreateUserId();

// --- UI helpers ---
function showSection(section) {
    document.getElementById('game-list').style.display = 'none';
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('insider-board').style.display = 'none';
    document.getElementById('ftk-board').style.display = 'none';
    document.getElementById('werewords-board').style.display = 'none'; // Add this line
    if (section === 'games') {
        document.getElementById('game-list').style.display = 'block';
    } else if (section === 'room') {
        document.getElementById('room-section').style.display = 'block';
    }
}

// --- Username edit ---
function showUsernameEdit(show) {
    document.getElementById('sidebar-username-edit').style.display = show ? 'block' : 'none';
    document.getElementById('change-username-btn').style.display = show ? 'none' : 'block';
}
document.getElementById('change-username-btn').onclick = function() {
    showUsernameEdit(true);
    document.getElementById('sidebar-username-input').value = '';
};
document.getElementById('sidebar-username-save').onclick = function() {
    const newName = document.getElementById('sidebar-username-input').value.trim();
    if (!newName) return alert('Please enter your name!');
    db.ref('users/' + userId).once('value', function(snapshot) {
        const user = snapshot.val();
        const oldName = user && user.username;
        db.ref('users/' + userId).update({
            username: newName,
            lastActive: Date.now()
        });
        // Update player name in room if needed
        if (user && user.roomId && oldName) {
            db.ref('rooms/' + user.roomId + '/players').orderByChild('name').equalTo(oldName).once('value', function(snap) {
                snap.forEach(function(child) { child.ref.update({ name: newName }); });
            });
        }
        showUsernameEdit(false);
    });
};

// --- Sidebar info update ---
function updateSidebar(username, roomId, gameName) {
    document.getElementById('sidebar-username').textContent = username ? 'User: ' + username : 'No username set';
    document.getElementById('sidebar-gameinfo').innerHTML = (roomId && gameName)
        ? `<strong>Game:</strong> ${gameName}<br><strong>Room:</strong> ${roomId}` : '';
    document.getElementById('return-room-btn').style.display = roomId ? 'block' : 'none';
    showUsernameEdit(!username);
}

// --- Username required for actions ---
function requireUsernameOrAlert(cb) {
    db.ref('users/' + userId + '/username').once('value', function(snap) {
        const username = snap.val();
        if (!username) {
            alert('Please enter your name first (use the sidebar).');
            showUsernameEdit(true);
            return;
        }
        cb(username);
    });
}

// --- Dynamic Game Script Loader ---
function loadGameModule(gameName, cb) {
    // Remove previous game scripts
    if (window.currentGameScript) {
        document.body.removeChild(window.currentGameScript);
        window.currentGameScript = null;
        window.currentGame = null;
    }
    if (window.currentGameDeps) {
        window.currentGameDeps.forEach(dep => document.body.removeChild(dep));
        window.currentGameDeps = [];
    }

    const safeName = gameName.toLowerCase().replace(/\s+/g, '-');
    const deps = [];
    if (safeName === 'insider') {
        deps.push('games/insider/words.js');
    } else if (safeName === 'werewords') {
        deps.push('games/werewords/settings.js');
        deps.push('games/werewords/words.js'); // Add this line
    } else if (safeName === 'deception-murder-in-hong-kong' || safeName === 'deception-murder-in-hong-kong') {
        deps.push('games/deception-murder-in-hong-kong/rules.js');
        deps.push('games/deception-murder-in-hong-kong/settings.js');
        deps.push('games/deception-murder-in-hong-kong/components.js');
    }
    // Add more dependencies as needed

    // Load dependencies first, then main game script
    let loaded = 0;
    window.currentGameDeps = [];
    function loadNextDep() {
        if (loaded < deps.length) {
            const depScript = document.createElement('script');
            depScript.src = deps[loaded];
            depScript.onload = function() {
                window.currentGameDeps.push(depScript);
                loaded++;
                loadNextDep();
            };
            depScript.onerror = function() {
                alert('Failed to load dependency: ' + deps[loaded]);
            };
            document.body.appendChild(depScript);
        } else {
            // Now load the main game script
            const scriptPath = `games/${safeName}/${safeName}.js`;
            const script = document.createElement('script');
            script.src = scriptPath;
            script.onload = function() {
                db.ref('users/' + userId).once('value', function(snapshot) {
                    const user = snapshot.val();
                    if (user && user.roomId && user.username && window.currentGame && window.currentGame.onRoomLoaded) {
                        window.currentGame.onRoomLoaded(user.roomId, user.username);
                    }
                    if (cb) cb();
                });
            };
            script.onerror = function() {
                alert("Failed to load game script for " + gameName);
            };
            window.currentGameScript = script;
            document.body.appendChild(script);
        }
    }
    loadNextDep();
}

// --- Game Selection Handler (delegated to room.js) ---

// --- Start Game Button Handler ---
document.getElementById('start-game').onclick = function() {
    console.log('Start game clicked'); // Debug log
    console.log('window.currentGame:', window.currentGame); // Debug log
    
    if (!window.currentGame) {
        alert("No game loaded! Please select a game first.");
        return;
    }
    
    if (typeof window.currentGame.startGame !== "function") {
        alert("Game startGame function not found!");
        console.error('window.currentGame.startGame is not a function:', typeof window.currentGame.startGame);
        return;
    }
    
    window.currentGame.startGame();
};

// --- Game settings/rules UI ---
function renderGameSettings() {
    const panel = document.getElementById('game-settings-panel');
    const content = document.getElementById('game-settings-content');
    if (!window.currentGame || !window.currentGame.settings) {
        panel.style.display = 'none';
        return;
    }
    content.innerHTML = '';
    window.currentGame.settings.forEach(setting => {
        let value = setting.default;
        let html = '';
        if (setting.type === "checkbox") {
            html = `<label><input type="checkbox" id="setting-${setting.key}" ${value ? "checked" : ""}> ${setting.label}</label><br>`;
        } else if (setting.type === "select") {
            html = `<label>${setting.label}: <select id="setting-${setting.key}">`;
            (setting.options || []).forEach(opt => {
                html += `<option value="${opt.value}"${opt.value === value ? " selected" : ""}>${opt.label}</option>`;
            });
            html += `</select></label><br>`;
        } else if (setting.type === "number") {
            html = `<label>${setting.label}: <input type="number" id="setting-${setting.key}" value="${value}" min="${setting.min||''}" max="${setting.max||''}"></label><br>`;
        } else {
            html = `<label>${setting.label}: <input type="text" id="setting-${setting.key}" value="${value}"></label><br>`;
        }
        if (setting.description) {
            html += `<small style="color:#555;">${setting.description}</small><br>`;
        }
        content.innerHTML += html;
    });

    // Add Save and Close buttons
    content.innerHTML += `
        <button id="save-settings-btn">Save</button>
        <button id="close-settings-btn" style="margin-left:8px;">Close</button>
    `;
    panel.style.display = 'block';

    document.getElementById('save-settings-btn').onclick = function() {
        const saveBtn = this;
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        const settings = {};
        window.currentGame.settings.forEach(setting => {
            let val;
            const el = document.getElementById('setting-' + setting.key);
            if (!el) return;
            if (setting.type === "checkbox") {
                val = el.checked;
            } else if (setting.type === "number") {
                val = Number(el.value);
            } else {
                val = el.value;
            }
            settings[setting.key] = val;
        });
        db.ref('users/' + userId).once('value', function(snapshot) {
            const user = snapshot.val();
            if (user && user.roomId) {
                db.ref('rooms/' + user.roomId + '/settings').set(settings)
                    .then(() => {
                        saveBtn.textContent = 'Saved!';
                        saveBtn.style.backgroundColor = '#27ae60';
                        saveBtn.style.color = '#fff';
                        setTimeout(() => {
                            saveBtn.textContent = originalText;
                            saveBtn.style.backgroundColor = '';
                            saveBtn.style.color = '';
                            saveBtn.disabled = false;
                        }, 2000);
                        setTimeout(() => {
                            panel.style.display = 'none';
                        }, 1500);
                    })
                    .catch((error) => {
                        saveBtn.textContent = 'Error!';
                        saveBtn.style.backgroundColor = '#e74c3c';
                        saveBtn.style.color = '#fff';
                        setTimeout(() => {
                            saveBtn.textContent = originalText;
                            saveBtn.style.backgroundColor = '';
                            saveBtn.style.color = '';
                            saveBtn.disabled = false;
                        }, 2000);
                        console.error('Error saving settings:', error);
                    });
            } else {
                saveBtn.textContent = 'No Room!';
                saveBtn.style.backgroundColor = '#f39c12';
                saveBtn.style.color = '#fff';
                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.backgroundColor = '';
                    saveBtn.style.color = '';
                    saveBtn.disabled = false;
                }, 2000);
            }
        });
    };

    document.getElementById('close-settings-btn').onclick = function() {
        panel.style.display = 'none';
    };
}
function renderGameRules() {
    if (!window.currentGame || !window.currentGame.rulesHtml) return;
    document.getElementById('game-rules-content').innerHTML = window.currentGame.rulesHtml;
    document.getElementById('game-rules-modal').style.display = 'block';
}
function showGameUIElements(show) {
    document.getElementById('show-rules-btn').style.display = show ? 'inline-block' : 'none';
    document.getElementById('game-settings-panel').style.display = 'none';
}

// --- Misc UI ---
document.getElementById('copy-room-id-btn').onclick = function() {
    const roomId = document.getElementById('generated-room-id').textContent;
    if (roomId) {
        navigator.clipboard.writeText(roomId);
        this.textContent = 'Copied!';
        setTimeout(() => { this.textContent = 'Copy'; }, 1200);
    }
};
document.getElementById('open-settings-btn').onclick = renderGameSettings;
document.getElementById('show-rules-btn').onclick = renderGameRules;
document.getElementById('sidebar-toggle').onclick = function() {
    document.getElementById('sidebar').classList.toggle('open');
};
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    if (sidebar && !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
    }
});

// --- Board focus logic ---
function focusOnGameBoard(gameName) {
    document.getElementById('game-list').style.display = 'none';
    document.getElementById('room-section').style.display = 'none';
    document.getElementById('game-settings-panel').style.display = 'none';
    document.getElementById('game-rules-modal').style.display = 'none';
    document.getElementById('ftk-board').style.display = 'none';
    document.getElementById('insider-board').style.display = 'none';
    document.getElementById('werewords-board').style.display = 'none';
    if (gameName === "Insider") {
        document.getElementById('insider-board').style.display = 'block';
    } else if (gameName === "FTK") {
        document.getElementById('ftk-board').style.display = 'block';
    } else if (gameName === 'Werewords') {
        document.getElementById('werewords-board').style.display = 'block';
    }
}