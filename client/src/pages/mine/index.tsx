import Taro, {Component, Config} from '@tarojs/taro'
import {OpenData, View} from '@tarojs/components'
import {AtList, AtListItem} from "taro-ui"
import './index.scss'

export default class Mine extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的'
  }

  componentWillMount() {
    Taro.login({
      success(res) {
        if (res.code) {
          // //发起网络请求
          // Taro.request({
          //   url: 'https://test.com/onLogin',
          //   data: {
          //     code: res.code
          //   }
          // })
          console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
      <View>
        <View className='mine'>
          <OpenData style='height: 100rpx; width: 100rpx' type='userAvatarUrl' />
          <OpenData style='margin-left: 20rpx; font-size: 32rpx' type='userNickName' />
        </View>
        <View style='height: 40rpx' />
        <AtList>
          {/*<AtListItem iconInfo={{ size:*/}
          {/*    22, color: '#78A4FA', value: 'share', }} title='我的分享' arrow='right'/>*/}
          <AtListItem iconInfo={{ size:
              22, color: '#78A4FA', value: 'alert-circle', }} title='关于我们' arrow='right' onClick={() => {
            Taro.navigateTo({
              url: '/pages/about/index'
            });
          }}/>
        </AtList>
      </View>
    )
  }
}
