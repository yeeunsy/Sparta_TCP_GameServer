import { INIT_DECK } from '../../constants/cardTypes.js';
import { makeCardDeck } from '../../handlers/card/index.js';
import BuffManager from '../managers/buff.manage.js';
import CardManager from '../managers/card.manager.js';
import CharacterState from './character.state.class.js';

class Character {
  constructor() {
    this.characterType = 0;
    this.roleType = 0;
    this.hp = 50;
    this.mp = 10;
    this.stateInfo = new CharacterState();
    this._weapon = null;
    this._equips = [];
    this._debuffs = [];
    this.bbangCount = 0;
    this.handCardsCount = 0;
    this.cards = new CardManager(makeCardDeck(INIT_DECK));
    this.buffStack = new BuffManager();
    this.eveningList = [];
    this.isEveningDraw = false;
  }
  activeData() {
    this.handCardsCount = this.cards.handCardsCount;
    this.handCards = this.cards.getHands();
    this.buffs = this.buffStack.getBuffList();
  }

  hideData() {
    try {
      delete this.handCards;
      delete this.buffs;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Character;
