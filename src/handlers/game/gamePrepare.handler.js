import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProto.js';
import { games, rooms } from '../../session/session.js';
import { fyShuffle } from '../../utils/fisherYatesShuffle.js';
import { multiCast } from '../../utils/response/createResponse.js';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const gamePrepare = async (socket) => {
  const protoMessages = getProtoMessages();
  let gamePrepareResponse;
  const failCode = getFailCode();
  const roomId = socket.roomId; // socket.roomId로 통일
  const room = rooms.get(roomId); // 클라이언트가 들어가 있는 방정보를 가져옴
  try {
    room.state = protoMessages.enum.RoomStateType.values['PREPARE'];
    const usersInRoom = [...room.users]; // 방 안에 있는 모든 유저들의 정보를 가져옴
    const userCount = usersInRoom.length;
    if (userCount < 2 || userCount > 7) {
      throw new Error(`지원하지 않는 인원 수: ${userCount}`);
    }

    const characterTypes = Object.values(
      // 값들만 뽑아서 characterType에 할당
      protoMessages.enum.CharacterType.values,
    );

    characterTypes.shift();

    // 캐릭터를 셔플
    const shuffledCharacters = await fyShuffle([...characterTypes]);

    // 역할과 캐릭터를 유저에게 랜덤으로 할당
    usersInRoom.forEach((user, index) => {
      user.character.roleType =
        protoMessages.enum.RoleType.values['PSYCHOPATH'];
      user.character.characterType = shuffledCharacters[index];
    });

    // 방 유저들에게 초기 카드를 분배
    // room.distributeCards();

    const gamePrepareNotification = { room: room };

    const Notification = {
      gamePrepareNotification,
    };

    gamePrepareResponse = {
      success: true,
      failcode: failCode.NONE_FAILCODE,
    };
    multiCast(usersInRoom, PACKET_TYPE.GAME_PREPARE_NOTIFICATION, Notification);

    // 방 정보를 게임세션으로 이전 후 방을 삭제
  } catch (err) {
    gamePrepareResponse = {
      success: false,
      failcode: failCode.UNKNOWN_ERROR,
    };
    console.error(err);
  }
  sendResponsePacket(socket, PACKET_TYPE.GAME_PREPARE_RESPONSE, {
    gamePrepareResponse,
  });
};
