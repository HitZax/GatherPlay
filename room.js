let currentRoomListener = null, currentRoomId = null;

// --- Listen for changes to the current user's state ---
function listenUserState() {
    db.ref('users/' + userId).on('value', function(snapshot) {
        const user = snapshot.val();
        if (!user || !user.username) {
            showSection('games');
            updateSidebar(null, null, null);
            showGameUIElements(false);
            document.getElementById('create-room').style.display = 'none';
            document.getElementById('start-game').style.display = 'none';
            return;
        }
        if (!user.roomId) {
            showSection('games');
            updateSidebar(user.username, null, null);
            removeRoomListener();
            showGameUIElements(false);
            document.getElementById('create-room').style.display = 'inline-block';
            document.getElementById('create-room').disabled = false;
            document.getElementById('start-game').style.display = 'none';
        } else {
            showSection('room');
            document.getElementById('generated-room-id').textContent = user.roomId;
            listenRoom(user.roomId, user.username);
            showGameUIElements(true);
            document.getElementById('create-room').style.display = 'none';
        }
    });
}

// --- Listen for changes to the room and game state ---
function listenRoom(roomId, username) {
    if (currentRoomListener && currentRoomId !== roomId) removeRoomListener();
    currentRoomId = roomId;

    db.ref('rooms/' + roomId + '/players').on('value', function(snapshot) {
        const playerList = document.getElementById('player-list');
        playerList.innerHTML = '';
        snapshot.forEach(function(child) {
            const li = document.createElement('li');
            li.textContent = child.val().name;
            playerList.appendChild(li);
        });
    });

    currentRoomListener = db.ref('rooms/' + roomId).on('value', function(snapshot) {
        const data = snapshot.val();
        if (!data) {
            db.ref('users/' + userId + '/roomId').remove();
            showSection('games');
            updateSidebar(username, null, null);
            showGameUIElements(false);
            document.getElementById('create-room').style.display = 'inline-block';
            document.getElementById('create-room').disabled = false;
            document.getElementById('start-game').style.display = 'none';
            // Hide all boards when room is deleted
            document.getElementById('ftk-board').style.display = 'none';
            document.getElementById('insider-board').style.display = 'none';
            document.getElementById('werewords-board').style.display = 'none';
            // Hide the room section as well
            document.getElementById('room-section').style.display = 'none';
            // Optionally, hide settings/rules panels if open
            document.getElementById('game-settings-panel').style.display = 'none';
            document.getElementById('game-rules-modal').style.display = 'none';
            removeRoomListener();
            return;
        }
        document.getElementById('selected-game-title').textContent = `Game Room: ${data.game || ''}`;
        document.getElementById('sidebar-gameinfo').innerHTML =
            `<strong>Game:</strong> ${data.game || ''}<br><strong>Room:</strong> ${roomId}`;
        document.getElementById('generated-room-id').textContent = roomId;

        const isHost = (data.host === userId);

        document.getElementById('delete-room-btn').style.display = isHost ? 'block' : 'none';
        document.getElementById('delete-room-btn-main').style.display = isHost ? 'inline-block' : 'none';
        document.getElementById('start-game').style.display = isHost ? 'inline-block' : 'none';
        document.getElementById('open-settings-btn').style.display = isHost ? 'inline-block' : 'none';

        document.getElementById('leave-room-btn').style.display = !isHost ? 'block' : 'none';
        document.getElementById('leave-room-btn-main').style.display = !isHost ? 'inline-block' : 'none';

        document.getElementById('copy-room-id-btn').style.display = 'inline-block';
        document.getElementById('show-rules-btn').style.display = 'inline-block';
        document.getElementById('create-room').style.display = 'none';

        if (!window.currentGame || window.currentGame.name !== data.game) {
            loadGameModule(data.game, () => {
                showGameUIElements(true);
                callGameOnRoomLoaded(roomId, username);
            });
        } else {
            showGameUIElements(true);
            callGameOnRoomLoaded(roomId, username);
        }

        if (data && data.settings && window.currentGame && window.currentGame.settings) {
            window.currentGame.settings.forEach(setting => {
                const el = document.getElementById('setting-' + setting.key);
                if (el && data.settings.hasOwnProperty(setting.key)) {
                    if (setting.type === "checkbox") {
                        el.checked = !!data.settings[setting.key];
                    } else {
                        el.value = data.settings[setting.key];
                    }
                }
            });
        }
        updateSidebar(username, roomId, data.game);
    });
}

function callGameOnRoomLoaded(roomId, username) {
    if (window.currentGame && typeof window.currentGame.onRoomLoaded === "function") {
        window.currentGame.onRoomLoaded(roomId, username);
    }
}

function removeRoomListener() {
    if (currentRoomId) {
        db.ref('rooms/' + currentRoomId + '/players').off();
        db.ref('rooms/' + currentRoomId).off();
        currentRoomListener = null;
        currentRoomId = null;
    }
}

// --- Room actions ---
document.getElementById('create-room').onclick = function() {
    requireUsernameOrAlert(function(username) {
        db.ref('users/' + userId).once('value', function(snapshot) {
            const user = snapshot.val();
            if (user && user.roomId) {
                alert('You are already in a room. Please leave your current room before creating a new one.');
                return;
            }
            const roomId = document.getElementById('generated-room-id').textContent;
            const gameName = document.getElementById('selected-game-title').textContent.replace('Game Room: ', '');
            db.ref('rooms/' + roomId).set({
                host: userId,
                createdAt: Date.now(),
                game: gameName
            }).then(() => {
                db.ref('rooms/' + roomId + '/players/' + userId).set({ name: username });
                db.ref('users/' + userId).update({
                    roomId,
                    lastActive: Date.now()
                });
                document.getElementById('create-room').style.display = 'none';
                // alert('Room created! Room ID: ' + roomId); // <-- HIDDEN
            });
        });
    });
};

document.getElementById('join-room').onclick = function() {
    requireUsernameOrAlert(function(username) {
        const roomId = document.getElementById('room-id').value.trim();
        db.ref('users/' + userId).once('value', function(snapshot) {
            const user = snapshot.val();
            if (user && user.roomId) {
                alert('You are already in a room. Please leave your current room before joining another.');
                return;
            }
            if (!roomId) return alert('Please enter a Room ID to join.');
            db.ref('rooms/' + roomId).once('value', function(roomSnap) {
                if (!roomSnap.exists()) return alert('Room does not exist.');
                db.ref('rooms/' + roomId + '/players/' + userId).set({ name: username });
                db.ref('users/' + userId).update({
                    roomId,
                    lastActive: Date.now()
                });
                // alert('Joined room: ' + roomId); // <-- HIDDEN
            });
        });
    });
};

function leaveRoom() {
    db.ref('users/' + userId).once('value', function(snapshot) {
        const user = snapshot.val();
        if (!user || !user.roomId) return;
        const roomId = user.roomId;
        db.ref('rooms/' + roomId + '/players/' + userId).remove();
        db.ref('users/' + userId).update({
            roomId: null,
            lastActive: Date.now()
        });
        db.ref('users/' + userId + '/roomId').remove();
    });
}
document.getElementById('leave-room-btn').onclick = leaveRoom;
document.getElementById('leave-room-btn-main').onclick = leaveRoom;

function deleteRoom() {
    db.ref('users/' + userId).once('value', function(snapshot) {
        const user = snapshot.val();
        if (!user || !user.roomId) return;
        const roomId = user.roomId;
        db.ref('rooms/' + roomId).once('value', function(roomSnap) {
            const roomData = roomSnap.val();
            const isHost = (roomData.host === userId);
            if (!isHost) return;
            if (confirm('Are you sure you want to delete this room?')) {
                // Remove all users' roomId
                db.ref('rooms/' + roomId + '/players').once('value', function(playersSnap) {
                    playersSnap.forEach(function(child) {
                        db.ref('users/' + child.key + '/roomId').remove();
                    });
                    // Set reloadAll flag for all clients
                    db.ref('rooms/' + roomId + '/reloadAll').set(true).then(() => {
                        setTimeout(() => {
                            db.ref('rooms/' + roomId).remove();
                        }, 500); // Give clients time to see the flag
                    });
                });
            }
        });
    });
}
document.getElementById('delete-room-btn').onclick = deleteRoom;
document.getElementById('delete-room-btn-main').onclick = deleteRoom;

// --- Room reload listener ---
function listenForRoomReload(roomId) {
    db.ref('rooms/' + roomId + '/reloadAll').on('value', function(snap) {
        if (snap.exists()) {
            window.location.reload();
        }
    });
}

// --- Game selection (room creation flow) ---
function selectGame(gameName) {
    requireUsernameOrAlert(function(username) {
        db.ref('users/' + userId).once('value', function(snapshot) {
            const user = snapshot.val();
            if (user && user.roomId) {
                alert('You are already in a room. Please leave your current room before creating a new one.');
                return;
            }
            showSection('room');
            document.getElementById('selected-game-title').textContent = `Game Room: ${gameName}`;
            const roomId = Math.random().toString(36).substr(2, 6).toUpperCase();
            document.getElementById('generated-room-id').textContent = roomId;
            document.getElementById('create-room').style.display = 'inline-block';
            document.getElementById('create-room').disabled = false;
            document.getElementById('leave-room-btn-main').style.display = 'none';
            document.getElementById('delete-room-btn-main').style.display = 'none';
            document.getElementById('sidebar-gameinfo').innerHTML =
                `<strong>Game:</strong> ${gameName}<br><strong>Room:</strong> ${roomId}`;
            loadGameModule(gameName, () => {
                showGameUIElements(true);
                callGameOnRoomLoaded(roomId, username);
            });
        });
    });
}

// --- Start listening for user state on page load ---
window.onload = listenUserState;