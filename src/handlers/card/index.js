import {
  CARD_LIMIT,
  CARD_TYPES,
  CARD_TYPES_INDEX,
} from '../../constants/cardTypes.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { fleamarketNotificationHanlder } from '../fleamarket/fleamarketNotification.handler.js';
import { maturedSavingsHandler } from './cardEffects/effect.maturedSavings.handler.js';
import { bbangEffectHandler } from './cardEffects/effect.bang.handler.js';
import { shieldEffectHandler } from './cardEffects/effect.shield.handler.js';
import { laserPointerHandler } from './cardEffects/effect.laserPointer.handler.js';
import { winLotteryHandler } from './cardEffects/effect.winLottery.handler.js';

const handlers = {
  [CARD_TYPES.NONE]: {
    handler: () => {}, // 사용하게될 함수명
    typeName: CARD_TYPES_INDEX[CARD_TYPES.NONE],
  },
  [CARD_TYPES.BBANG]: {
    handler: bbangEffectHandler, // 사용하게될 함수명
    typeName: CARD_TYPES_INDEX[CARD_TYPES.BBANG],
  },
  [CARD_TYPES.SHIELD]: {
    handler: shieldEffectHandler, // 사용하게될 함수명
    typeName: CARD_TYPES_INDEX[CARD_TYPES.BBANG],
  },
  [CARD_TYPES.MATURED_SAVINGS]: {
    handler: maturedSavingsHandler,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.MATURED_SAVINGS],
  },
  [CARD_TYPES.WIN_LOTTERY]: {
    handler : winLotteryHandler,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.WIN_LOTTERY]
  },
  [CARD_TYPES.FLEA_MARKET]: {
    handler: fleamarketNotificationHanlder,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.FLEA_MARKET],
  },
  [CARD_TYPES.LASER_POINTER]: {
    handler: laserPointerHandler,
    typeName: CARD_TYPES_INDEX[CARD_TYPES.LASER_POINTER],
  },
};

export const getHandlerByCardType = (cardType) => {
  if (!handlers[cardType]) {
    throw Error('카드 타입에 해당하는 핸들러가 존재하지 않습니다.');
  }
  return handlers[cardType].handler;
};

// 게임 시작 시 준비되어야 할 카드더미 -> (카드 타입값 * 제한 매수) 한 int 배열을 섞은 것
export const makeCardDeck = (deckInfo) => {
  const gameDeck = [];
  for (const [cardType, count] of Object.entries(deckInfo)) {
    gameDeck.push(...new Array(count).fill(Number(cardType)));
  }
  return fyShuffle(gameDeck);
};
