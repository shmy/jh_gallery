import {View} from "@tarojs/components";
import Taro, {Component, Config} from '@tarojs/taro'
import './index.scss'

interface IProps {

}

interface IState {
}

export default class About extends Component<IProps, IState> {
  config: Config = {
    navigationBarTitleText: '关于我们'
  };
  render() {
    return (
      <View style='padding: 20rpx;'>todo</View>
    );
  }
}
