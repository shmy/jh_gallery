import Taro, {Component, Config} from '@tarojs/taro'
import {Button, View} from "@tarojs/components";
import {IUserInfo} from "../../defs";
import {loginUser} from "../../services/user.service";



interface IProps {

}

interface IState {
}

export default class Login extends Component<IProps, IState> {
  state: IState = {};
  handleGetUserInfo = ({detail}) => {
    if (detail.errMsg !== 'getUserInfo:ok') {
      Taro.showToast({title: '请允许权限才能继续', icon: 'none'});
      return;
    }
    const userInfo = {
      nickName: detail.userInfo.nickName,
      avatarUrl: detail.userInfo.avatarUrl,
      country: detail.userInfo.country,
      province: detail.userInfo.province,
      city: detail.userInfo.city,
      gender: detail.userInfo.gender,
    };
     this.doLogin(userInfo);
  };
  doLogin = async (userInfo: IUserInfo) => {
    Taro.showLoading({title: '登陆中', mask: true});
    const data = await loginUser(userInfo);
    Taro.hideLoading();
    if (data.code !== 0) {
      Taro.showModal({content: data.data, showCancel: false});
      return;
    }
    Taro.showToast({title: '登录成功', icon: 'success', mask: true,});
    Taro.setStorage({ key: 'open_id', data: data.data.open_id });
    setTimeout(() => {
      Taro.reLaunch({url: '/pages/index/index'});
    }, 1500);
  };
  render() {
    return (
      <View style='padding: 10px'>
        <View style='text-align: center; margin: 20px 0'>登陆后即可继续操作</View>
        <Button open-type='getUserInfo' onGetUserInfo={this.handleGetUserInfo} type='primary'>授权微信登录</Button>
      </View>
    );
  }
}
