import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Image, Canvas} from "@tarojs/components";
import './index.scss'
import {shareGallery} from "../../services/gallery.service";
import {AtActivityIndicator, AtModal, AtModalAction, AtModalContent, AtModalHeader} from "taro-ui";

export default class ShareQRCode extends Component {
  config: Config = {
    navigationBarTitleText: '分享相册',
    enablePullDownRefresh: true,
  };
  state = {
    isLoading: true,
    isLoadingError: false,
    canvasSize: 0,
    showShareModal: false,
    tempFilePath: '',
  };
  qrImageUrl = '';
  title = '';

  // tempFilePath = '';

  onShareAppMessage() {
    // const r = await Taro.canvasToTempFilePath({canvasId: 'canvas'})
    // console.log(r)
    return {
      title: this.title,
      path: `/pages/share/index?id=${this.$router.params.id}&title=${this.title}`,
      imageUrl: this.state.tempFilePath,
    };
  }

  onPullDownRefresh(): void {
    this.fetch();
  }

  componentWillMount() {
    Taro.startPullDownRefresh();
  }

  componentDidMount() {
    Taro.getSystemInfo({})
      .then((systemInfo) => {
        this.setState({
          canvasSize: systemInfo.windowWidth - 20,
        });
      })
  }

  fetch = async () => {
    this.setState({
      isLoadingError: false,
      isLoading: true,
    });
    const data = await shareGallery(this.$router.params.id);
    Taro.stopPullDownRefresh();
    this.setState({
      isLoading: false,
    });
    if (data.code !== 0) {
      this.setState({
        isLoadingError: true,
      });
      return;
    }
    this.qrImageUrl = data.data.shared_qr_code;
    this.title = data.data.title;
    this.setPoster(this.qrImageUrl);
  };
  handleRetry = () => {
    Taro.startPullDownRefresh();
  };
  handleShare = async () => {
    this.setState({ showShareModal: true})
  };
  handleDownload = async () => {
    Taro.saveImageToPhotosAlbum({filePath: this.state.tempFilePath})
      .then(() => {
        Taro.showToast({title: '保存图片成功, 请去朋友圈分享', icon: 'none'});
      }).catch(() => {
      Taro.showToast({title: '保存图片失败, 请检查权限或稍后再试', icon: 'none'});
    });
  };
  setPoster = async (qrCodeUrl: string) => {
    const {canvasSize} = this.state;
    const data = await Taro.getImageInfo({
      src: qrCodeUrl
    });
    const qrCodeSize = 160;
    const paddingSize = 60;
    const text = '我分享给你一个相册';
    const ctx = Taro.createCanvasContext('canvas', null);
    // ctx.beginPath();
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // ctx.closePath();
    ctx.fillStyle = '#00B269';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.setFontSize(18);
    ctx.setFillStyle("#ffffff");
    ctx.fillText(text, (canvasSize - 18 * text.length) / 2, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(paddingSize, paddingSize, canvasSize - paddingSize * 2, canvasSize - paddingSize * 2);
    ctx.drawImage(data.path, (canvasSize - qrCodeSize) / 2, (canvasSize - qrCodeSize) / 2, qrCodeSize, qrCodeSize);
    ctx.draw(false, async () => {
      const data = await Taro.canvasToTempFilePath({canvasId: 'canvas'});
      this.setState({tempFilePath: data.tempFilePath})
    });


  };

  render() {
    const _canvasSize = this.state.canvasSize + 'px';
    return (
      <View>
        <Button hidden={!this.state.isLoadingError} onClick={this.handleRetry}>加载失败, 点击重试</Button>

        <View style='display: flex; justify-content: center; align-items: center'>
          {this.state.tempFilePath === '' ?
            <Canvas style={{width: _canvasSize, height: _canvasSize}} canvasId='canvas'/>:
            <Image style={{width: _canvasSize, height: _canvasSize}} src={this.state.tempFilePath}/>}
        </View>
        {(!this.state.isLoading && !this.state.isLoadingError && this.state.tempFilePath !== '') ? <View>
          <View style='margin-top:10rpx; padding: 10rpx'>
            <Button onClick={this.handleShare} type='warn'>发送给好友</Button>
            <Button onClick={this.handleDownload} style='margin-top:20rpx' type='primary'>分享到朋友圈</Button>
          </View>
        </View> : null}
        {!this.state.isLoading && !this.state.isLoadingError && this.state.tempFilePath === '' ? <AtActivityIndicator mode='center'/> : null}
        <AtModal onClose={() => {
          this.setState({showShareModal: false})
        }} isOpened={this.state.showShareModal}>
          <AtModalHeader>{this.title}</AtModalHeader>
          <AtModalContent>
            <View style='text-align: center'>
              <Image style='height: 200px; width: 200px' mode='aspectFill' src={this.state.tempFilePath}/>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button open-type='share'>分享给好友</Button>
          </AtModalAction>
        </AtModal>
      </View>
    );
  }
}
