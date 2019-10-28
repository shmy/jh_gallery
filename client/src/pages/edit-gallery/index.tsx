import Taro, {Component, Config} from '@tarojs/taro'
import {AtInput, AtTextarea, AtButton, AtForm} from "taro-ui";
import {deleteGallery, editGallery, getGalleryDetail} from "../../services/gallery.service";
import {Button, View} from "@tarojs/components";
import EventBus from "../../defs/event_bus";

interface IProps {

}

interface IState {
  title: string;
  description: string;
  isLoading: boolean;
  isLoadingError: boolean;
}

class EditGallery extends Component<IProps, IState> {
  readonly state: IState = {
    title: '',
    description: '',
    isLoading: true,
    isLoadingError: false,
  };
  config: Config = {
    navigationBarTitleText: '编辑相册',
    enablePullDownRefresh: true,
  };
  onPullDownRefresh(): void {
    this.fetch();
  }

  componentWillMount(): void {
    Taro.startPullDownRefresh();
  }
  fetch = async () => {
    this.setState({
      isLoadingError: false,
      isLoading: true,
    });
    const data = await getGalleryDetail(this.$router.params.id);
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
    const {title, description} = data.data;
    this.setState({title, description});
  };
  handleTitleChange = (title: string) => {
    this.setState({title})
  };
  handleDescriptionChange = (event) => {
    this.setState({description: event.target.value})
  };
  handleRetry=() => {
    Taro.startPullDownRefresh();
  };
  handleSubmit = async () => {
    const {title, description} = this.state;
    if (title === '') {
      Taro.showToast({title: '相册名称不能为空', icon: 'none'});
      return;
    }
    Taro.showLoading({title: '请稍后', mask: true});
    const data = await editGallery(this.$router.params.id, title, description);
    Taro.hideLoading();
    if (data.code === 0) {
      Taro.showToast({title: '编辑成功', mask: true, icon: 'success'});
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 }).then(() => {
          EventBus.emit('gallery_refresh');
          EventBus.emit('index_refresh');
        });
      }, 1500);
    }
  };
  handleDeleteClick = async () => {
    Taro.showModal({
      title: '提示',
      content: '确认删除吗?',
      success: (result) => {
        if (result.confirm) {
          this.doDelete();
        }
      }
    });

  };
  doDelete = async () => {
    Taro.showLoading({title: '请稍后', mask: true});
    const data = await deleteGallery(this.$router.params.id);
    Taro.hideLoading();
    if (data.code === 0) {
      Taro.showToast({title: '删除成功', mask: true, icon: 'success'});
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' }).then(() => {
          EventBus.emit('index_refresh');
        });
      }, 1500);
    }
  };
  render() {
    const {title, description} = this.state;
    return (
      <View>
        <Button hidden={!this.state.isLoadingError} onClick={this.handleRetry}>加载失败, 点击重试</Button>
        {(!this.state.isLoading && !this.state.isLoadingError) ? <AtForm onSubmit={this.handleSubmit} customStyle='padding: 30rpx'>
          <AtInput
            customStyle='margin-top: 30rpx; margin-left:0'
            name='value'
            title='相册名称'
            type='text'
            placeholder='请输入相册名称'
            value={title}
            autoFocus
            maxLength={64}
            onChange={this.handleTitleChange}/>

          <AtTextarea
            customStyle='margin-top: 30rpx'
            value={description}
            maxLength={1024}
            onChange={this.handleDescriptionChange}
            placeholder='请输入相册描述'
          />
          <AtButton customStyle='margin-top: 30rpx' formType='submit' type='primary'>确定</AtButton>
          <AtButton onClick={this.handleDeleteClick} customStyle='margin-top: 30rpx; background-color: red; border-color: red'
                    type='primary'>删除相册</AtButton>
        </AtForm> : null}
      </View>
    );
  }
}

export default EditGallery;
