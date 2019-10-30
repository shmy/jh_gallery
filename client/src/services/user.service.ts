import Taro from "@tarojs/taro";
import {IUserInfo} from '../defs'

export const loginUser = async (userInfo: IUserInfo) => {
  const data = await Taro.cloud.callFunction({
    name: "user-login",
    data: {userInfo}
  });
  console.log('loginUser', data.result);
  return data.result;
};
