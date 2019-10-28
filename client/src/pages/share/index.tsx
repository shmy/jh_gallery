import './index.scss'
import Taro, {Component, Config} from '@tarojs/taro'
import {View, Image, Button} from "@tarojs/components";
import {getGalleryDetail} from "../../services/gallery.service";
import {AtButton} from "taro-ui";

interface IProps {

}

interface IState {
  photos: string[];
  isLoadingError: boolean;
}

class Gallery extends Component<IProps, IState> {
  readonly state: IState = {
    photos: [],
    isLoadingError: false,
  };
  config: Config = {
    navigationBarTitleText: '',
    enablePullDownRefresh: true,
  };

  onPullDownRefresh() {
    this.fetch();
  }

  componentWillMount() {
    Taro.setNavigationBarTitle({
      title: this.$router.params.title,
    });
    Taro.startPullDownRefresh();
  }

  handleRetry = () => {
    Taro.startPullDownRefresh();
  };

  async fetch() {
    this.setState({
      isLoadingError: false,
    });
    const data = await getGalleryDetail(this.$router.params.id);
    Taro.stopPullDownRefresh();
    if (data.code !== 0) {
      this.setState({
        isLoadingError: true,
      });
      return;
    }
    this.setState({photos: data.data.photos})
  }

  handlePreview = (index: number) => {
    Taro.previewImage({
      current: this.state.photos[index],     //当前图片地址
      urls: this.state.photos,               //所有要预览的图片的地址集合 数组形式
    });
  };
  handleShowActionSheet = () => {
    Taro.showActionSheet({
      itemList: ['分享这个相册', '编辑相册信息', '上传新的图片']
    }).then((result) => {
      switch (result.tapIndex) {
        case 0: {
          this.handleShare();
          break;
        }
        case 1: {
          this.handleEdit();
          break;
        }
        case 2: {
          this.handleUpload();
          break;
        }
        default:
          break;
      }
    })
      .catch(() => {
      });
  };
  handleShare = () => {
    Taro.navigateTo({
      url: `/pages/share-gallery/index?id=${this.$router.params.id}`
    });
  };
  handleEdit = () => {
    Taro.navigateTo({
      url: `/pages/edit-gallery/index?id=${this.$router.params.id}`
    });
  };
  handleUpload = () => {
    const {id, title} = this.$router.params;
    Taro.navigateTo({
      url: `/pages/upload/index?id=${id}&title=${title}`
    });
  };

  render() {
    return (
      <View className='gallery-page'>
        <View>
          <Button hidden={!this.state.isLoadingError} onClick={this.handleRetry}>加载失败, 点击重试</Button>
        </View>
        {/*<View onClick={this.handleShowActionSheet}*/}
        {/*      className='fab-fixed'>*/}
        {/*  <View className='at-icon at-icon-menu'/>*/}
        {/*</View>*/}
        {/*<ScrollView style='display: 1'>*/}
        <View className='gallery-scroll-view'>
          <View className='gallery-scroll-view-inner'>

            {this.state.photos.map((photo, index) => {
              return (
                <View onClick={() => this.handlePreview(index)} key={photo} className='gallery-item'>
                  <View className='gallery-inner'>
                    <Image mode='aspectFill' lazyLoad className='gallery-image' src={photo}/>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <AtButton onClick={() => {
          Taro.switchTab({
            url: '/pages/index/index',
          });
        }} customStyle='width: 100%' type='primary'>上传我的图片</AtButton>
      </View>
    );
  }
}

export default Gallery;
