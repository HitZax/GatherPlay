import { InsiderGameState, InsiderPhase, InsiderRole, InsiderSettings, INSIDER_WORDS } from '@shared';

export class InsiderGame {
  private gameState: InsiderGameState | null = null;
  
  constructor(
    private roomId: string,
    private playerIds: string[],
    private settings: InsiderSettings,
    private emitToRoom: (event: string, data: any) => void
  ) {}

  start(): InsiderGameState {
    // Validate player count
    if (this.playerIds.length < 4) {
      throw new Error('Insider requires at least 4 players');
    }

    // Assign roles
    const shuffled = [...this.playerIds].sort(() => Math.random() - 0.5);
    const masterId = shuffled[0];
    const insiderId = shuffled[1];
    
    const roles: Record<string, InsiderRole> = {};
    roles[masterId] = 'Master';
    roles[insiderId] = 'Insider';
    for (let i = 2; i < shuffled.length; i++) {
      roles[shuffled[i]] = 'Common';
    }

    // Select secret word
    const secretWord = this.selectWord(this.settings.wordDifficulty);

    // Create game state
    this.gameState = {
      phase: InsiderPhase.ROLE_REVEAL,
      roles,
      secretWord,
      masterId,
      insiderId,
      timerStart: Date.now(),
      timerDuration: this.settings.timerMinutes * 60, // convert to seconds
      wordGuessed: false,
      wordDifficulty: this.settings.wordDifficulty,
    };

    // Auto-transition to questioning phase after 5 seconds
    setTimeout(() => {
      this.transitionToQuestioning();
    }, 5000);

    return this.gameState;
  }

  private selectWord(difficulty: string): string {
    let words: string[] = [];
    
    if (difficulty === 'mixed') {
      words = [
        ...INSIDER_WORDS.easy,
        ...INSIDER_WORDS.medium,
        ...INSIDER_WORDS.hard,
      ];
    } else if (difficulty in INSIDER_WORDS) {
      words = INSIDER_WORDS[difficulty as keyof typeof INSIDER_WORDS];
    } else {
      words = INSIDER_WORDS.easy;
    }

    return words[Math.floor(Math.random() * words.length)];
  }

  private transitionToQuestioning() {
    if (!this.gameState) return;
    
    this.gameState.phase = InsiderPhase.QUESTIONING;
    this.gameState.timerStart = Date.now();
    
    this.emitToRoom('game:updated', this.gameState);

    // Auto-transition when timer expires
    setTimeout(() => {
      this.transitionToVoting();
    }, this.gameState.timerDuration * 1000);
  }

  private transitionToVoting() {
    if (!this.gameState) return;
    if (this.gameState.phase !== InsiderPhase.QUESTIONING) return;
    
    this.gameState.phase = InsiderPhase.VOTING;
    this.emitToRoom('game:updated', this.gameState);
  }

  markWordGuessed() {
    if (!this.gameState) return;
    if (this.gameState.phase !== InsiderPhase.QUESTIONING) return;
    
    this.gameState.wordGuessed = true;
    this.transitionToVoting();
  }

  submitAccusation(accusedPlayerId: string) {
    if (!this.gameState) return;
    if (this.gameState.phase !== InsiderPhase.VOTING) return;
    
    this.gameState.accusedPlayerId = accusedPlayerId;
    this.endGame();
  }

  private endGame() {
    if (!this.gameState) return;
    
    this.gameState.phase = InsiderPhase.GAME_OVER;
    
    // Determine result
    if (!this.gameState.wordGuessed) {
      this.gameState.result = "⏰ Time's up! Nobody wins - the word was not guessed.";
    } else if (this.gameState.accusedPlayerId === this.gameState.insiderId) {
      this.gameState.result = "🎉 Master & Commons Win! The Insider was caught!";
    } else {
      this.gameState.result = "🎭 Insider Wins! The Master's accusation was wrong!";
    }
    
    this.emitToRoom('game:updated', this.gameState);
    this.emitToRoom('game:ended', { result: this.gameState.result });
  }

  getState(): InsiderGameState | null {
    return this.gameState;
  }

  getStateForPlayer(playerId: string): Partial<InsiderGameState> | null {
    if (!this.gameState) return null;

    const playerRole = this.gameState.roles[playerId];
    
    // Base state everyone can see
    const baseState: Partial<InsiderGameState> = {
      phase: this.gameState.phase,
      masterId: this.gameState.masterId,
      timerStart: this.gameState.timerStart,
      timerDuration: this.gameState.timerDuration,
      wordGuessed: this.gameState.wordGuessed,
    };

    // Role revelation based on phase
    if (this.gameState.phase === InsiderPhase.ROLE_REVEAL) {
      baseState.roles = { [playerId]: playerRole };
    } else if (this.gameState.phase === InsiderPhase.GAME_OVER) {
      baseState.roles = this.gameState.roles;
      baseState.accusedPlayerId = this.gameState.accusedPlayerId;
      baseState.result = this.gameState.result;
      baseState.secretWord = this.gameState.secretWord;
    }

    // Master and Insider see the secret word
    if (playerRole === 'Master' || playerRole === 'Insider') {
      baseState.secretWord = this.gameState.secretWord;
    }

    return baseState;
  }
}
