import Taro, {Component, Config} from '@tarojs/taro'
import {View, Button, Image, Canvas} from "@tarojs/components";
import './index.scss'
import {shareGallery} from "../../services/gallery.service";

export default class ShareQRCode extends Component {
  config: Config = {
    navigationBarTitleText: '分享相册',
    enablePullDownRefresh: true,
  };
  state = {
    isLoading: true,
    isLoadingError: false,
    canvasSize: 0,
  };
  qrImageUrl = '';
  title = '';
  tempFilePath = '';
  onShareAppMessage() {
    // const r = await Taro.canvasToTempFilePath({canvasId: 'canvas'})
    // console.log(r)
    return {
      title: this.title,
      path: `/pages/share/index?id=${this.$router.params.id}&title=${this.title}`,
      imageUrl: this.tempFilePath,
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
  handleDownload = async () => {
    Taro.saveImageToPhotosAlbum({filePath: this.tempFilePath})
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
    const ctx = Taro.createCanvasContext('canvas', null);
    // ctx.beginPath();
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // ctx.closePath();
    ctx.fillStyle = '#00B269';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.setFontSize(18);
    ctx.setFillStyle("#ffffff");
    ctx.fillText('分享给你一个相册', (canvasSize - 18*8) / 2, 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(paddingSize, paddingSize, canvasSize - paddingSize * 2, canvasSize - paddingSize * 2);
    ctx.drawImage(data.path, (canvasSize - qrCodeSize) / 2, (canvasSize - qrCodeSize) / 2, qrCodeSize, qrCodeSize);
    ctx.draw();
    setTimeout(async () => {
      const data = await Taro.canvasToTempFilePath({canvasId: 'canvas'});
      this.tempFilePath = data.tempFilePath;
    }, 300)
  };

  render() {
    const _canvasSize = this.state.canvasSize + 'px';
    return (
      <View>
        <Button hidden={!this.state.isLoadingError} onClick={this.handleRetry}>加载失败, 点击重试</Button>

        <View style='display: flex; justify-content: center; align-items: center'>
          <Canvas style={{width: _canvasSize, height: _canvasSize}} canvasId='canvas'/>
        </View>
        {(!this.state.isLoading && !this.state.isLoadingError) ? <View>
          {/*<View className='qrcode-wrapper'>*/}
          {/*  <Image mode='aspectFill' lazyLoad className='qrcode-image' src={this.state.qrCode}/>*/}
          {/*</View>*/}
          <View style='margin-top:10rpx; padding: 10rpx'>
            <Button open-type='share' type='warn'>发送给好友</Button>
            <Button onClick={this.handleDownload} style='margin-top:20rpx' type='primary'>分享到朋友圈</Button>
            {/*<Button onClick={this.handleDownload} style='margin-top:20rpx' type='warn'>保存二维码到手机</Button>*/}
          </View>
        </View> : null}
      </View>
    );
  }
}
