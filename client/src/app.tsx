import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    cloud: true,
    pages: [
      'pages/index/index',
      'pages/upload/index',
      'pages/add-gallery/index',
      'pages/share/index',
      'pages/share-gallery/index',
      'pages/edit-gallery/index',
      'pages/gallery/index',
      'pages/mine/index',
      'pages/about/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      backgroundTextStyle: 'dark',

      // navigationStyle: 'custom'
    },
    tabBar: {
      selectedColor: '#6190e8',
      list: [
        {
          pagePath: 'pages/index/index',
          text: '相册',
          iconPath: './images/tabBar/index.png',
          selectedIconPath: './images/tabBar/index-selected.png',
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './images/tabBar/mine.png',
          selectedIconPath: './images/tabBar/mine-selected.png',
        }
      ]
    }
  };

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
