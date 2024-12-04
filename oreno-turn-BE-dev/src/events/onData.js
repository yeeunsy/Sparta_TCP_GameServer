import { config } from '../config/config.js';
import { TOTAL_LENGTH } from '../constants/header.js';
import { getHandlerByPacketType } from '../handlers/index.js';
import { decoder } from '../utils/response/decoder.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  while (socket.buffer.length >= TOTAL_LENGTH) {
    const packetType = socket.buffer.readUInt16BE(0);
    let offset = config.packet.typeLength;
    const versionLength = socket.buffer.readUInt8(offset);
    offset += config.packet.versionLength;
    const version = socket.buffer
      .subarray(offset, offset + versionLength)
      .toString();
    offset += versionLength;
    const sequence = socket.buffer.readUInt32BE(offset);
    offset += config.packet.sequenceLength;
    const payloadLength = socket.buffer.readUInt32BE(offset);
    offset += config.packet.payloadLength;

    // 패킷 전체 길이
    const requiredLength = offset + payloadLength;

    // 전체 패킷 데이터 길이
    if (socket.buffer.length >= requiredLength) {
      // payload를 읽을 곳
      const payload = socket.buffer.subarray(offset, requiredLength);

      // 남은 데이터는 다시 버퍼 데이터에 추가
      socket.buffer = socket.buffer.subarray(requiredLength);

      try {
        // 모든 패킷을 게임패킷으로 처리 가능하다고 한다
        const decodedPacket = decoder(payload);

        // 인자로 받을 패킷 타입 전송
        const handler = getHandlerByPacketType(packetType);
        console.log('클라가 보낸 패킷타입 request', packetType);
        await handler(socket, decodedPacket);
      } catch (err) {
        console.error(err);
        console.error(`패킷처리 에러 : ${err}, packeyType : ${packetType}`);
      }
    } else {
      console.log(
        `들어온 데이터 비교 : ${socket.buffer.length}, ${requiredLength}`,
      );
      break;
    }
  }
};
