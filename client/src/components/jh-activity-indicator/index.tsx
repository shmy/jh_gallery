import Taro, {Component} from '@tarojs/taro'
import {AtActivityIndicator} from "taro-ui";
import {Button, View, Text} from "@tarojs/components";
import {EStatus} from "../../defs";

interface IProps {
  status: EStatus;
  onRetry: () => void;
}

interface IState {
}

class JhActivityIndicator extends Component<IProps, IState> {
  readonly state: IState = {};

  render() {
    let child;
    switch (this.props.status) {
      case EStatus.loading:
      {
        child = <AtActivityIndicator mode='center'/>;
        break;
      }
      case EStatus.noMore:
      {
        child = <Text>没有更多数据了</Text>;
        break;
      }
      case EStatus.loadError:
      {
        child = <Button onClick={this.props.onRetry} style='text-align: center'>加载失败, 点击重试</Button>;
        break;
      }
      default:
      {
        child = null;
        break;
      }
    }
    return (
      <View style='height: 80rpx; line-height: 80rpx; text-align: center; position: relative'>
        {child}
      </View>
    );
  }
}

export default JhActivityIndicator;
