import './index.scss'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {getGalleryList, IGallery} from "../../services/gallery.service";
import JhActivityIndicator from "../../components/jh-activity-indicator";
import {EStatus} from "../../defs";
import EventBus from "../../defs/event_bus";

interface IProps {
}

interface IState {
  galleries: IGallery[];
  status: EStatus;
  noData: boolean;
}

export default class Index extends Component<IProps, IState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '相册',
    enablePullDownRefresh: true,
  };
  readonly state: IState = {
    galleries: [],
    status: EStatus.more,
    noData: false,
  };

  page = 1;
  pageSize = 20;
  total = 1;

  onPullDownRefresh() {
    this.page = 1;
    this.fetch();
  }

  onReachBottom() {
    if (this.state.status !== EStatus.more) {
      return;
    }
    this.page++;
    this.fetch();
  }

  async fetch() {
    this.showLoading();
    const data = await getGalleryList(this.page, this.pageSize);
    this.hideLoading();
    if (data.code !== 0) {
      this.setState({status: EStatus.loadError});
      return;
    }

    if (this.page * this.pageSize >= data.data.total) {
      this.setState({status: EStatus.noMore});
      // return;
    }
    let galleries: IGallery[] = [...this.state.galleries];
    if (this.page === 1) {
      galleries = [];
      if (data.data.data.length === 0) {
        this.setState({noData: true});
      }
    }
    galleries.push(...data.data.data);
    this.setState({galleries})
  }

  showLoading() {
    this.setState({status: this.page !== 1 ? EStatus.loading : EStatus.more, noData: false});
  }

  hideLoading() {
    Taro.stopPullDownRefresh();
    this.setState({status: EStatus.more});
  }

  handleRetry = () => {
    if (this.page === 1) {
      Taro.startPullDownRefresh();
      return;
    }
    this.fetch();
  };

  componentWillMount() {
    Taro.startPullDownRefresh();
    EventBus.on('index_refresh', () => {
      this.page = 1;
      this.fetch();
    });
  }

  handleAddClick = () => {
    Taro.navigateTo({
      url: '/pages/add-gallery/index'
    })
  };
  handleItemClick = (gallery: IGallery) => {
    Taro.navigateTo({
      url: `/pages/gallery/index?id=${gallery._id}&title=${gallery.title}`
    })
  };

  render() {
    const {galleries} = this.state;
    return (
      <View>
        <View className='gallery-wrapper'>
          <View onClick={this.handleAddClick} className='fab-fixed'>
            <View className='at-icon at-icon-add'/>
          </View>
          {galleries.map((gallery) => {
            return (
              <View onClick={() => this.handleItemClick(gallery)} key={gallery._id} className='gallery-item'>
                <View className='gallery-inner'>
                  <Image mode='aspectFill' lazyLoad className='gallery-image' src={gallery.cover_photo}/>
                  <View className='gallery-description'>
                    <View className='gallery-description-title'>{gallery.title}</View>
                    <View className='gallery-description-count'>{gallery.photos.length}P</View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <JhActivityIndicator onRetry={this.handleRetry} status={this.state.status}/>
        {this.state.noData ? <View style='text-align: center'>
          暂无数据
        </View> : null}
      </View>
    )
  }
}
