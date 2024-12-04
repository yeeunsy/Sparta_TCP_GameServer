import { PACKET_TYPE } from '../../constants/header.js';
import { createUser, findUserByUserEmail } from '../../db/user/user.db.js';
import bcrypt from 'bcrypt';
import { sendResponsePacket } from '../../utils/response/createResponse.js';
import schema from '../../utils/validation/validation.js';
import { getFailCode } from '../../utils/response/failCode.js';

export const registerHandler = async (socket, payload) => {
    try {
        const failCode = getFailCode();
        const { password, nickname, email } = payload;

        // 패킷 데이터 전송 객체
        let registerResponse;

        // 이메일 유효성 검사
        const validation = schema.validate({ email });
        const validationError = validation.error;
        if (validationError) {
            console.log('이메일을 정확하게 입력해주세요.');
            registerResponse = {
                success: false,
                message: '이메일을 정확하게 입력해주세요.',
                failCode: failCode.REGISTER_FAILED,
            }
        };

        // 중복 계정 확인 : 해당 email을 가진 유저가 존재한다면
        const joinedUser = await findUserByUserEmail(email);
        if (joinedUser) {
            console.log('이미 아이디가 존재합니다.');
            registerResponse = {
                success: false,
                message: '이미 아이디가 존재합니다.',
                failCode: failCode.REGISTER_FAILED,
            };
        } else if (!validationError) {
            // 계정 생성하기
            registerResponse = {
                success: true,
                message: 'register success',
                failCode: failCode.NONE_FAILCODE,
            };

            // 비밀번호 암호화
            const bcryptPassword = await bcrypt.hash(password, 10);
            await createUser(nickname, bcryptPassword, email);
        }

        sendResponsePacket(socket, PACKET_TYPE.REGISTER_RESPONSE, { registerResponse, });
    } catch (err) {
        console.error(`검증오류: ${err}`);
    }
};
