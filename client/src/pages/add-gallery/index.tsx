import Taro, {Component, Config} from '@tarojs/taro'
import {AtInput, AtTextarea, AtButton, AtForm} from "taro-ui";
import {addGallery} from "../../services/gallery.service";
import EventBus from "../../defs/event_bus";

interface IProps {

}

interface IState {
  title: string;
  description: string;
}

class AddGallery extends Component<IProps, IState> {
  readonly state: IState = {
    title: '',
    description: '',
  };
  config: Config = {
    navigationBarTitleText: '新建相册',
    // enablePullDownRefresh: true,
  };
  handleTitleChange = (title: string) => {
    this.setState({title})
  };
  handleDescriptionChange = (event) => {
    this.setState({description: event.target.value})
  };
  handleSubmit = async () => {
    const {title, description} = this.state;
    if (title === '') {
      Taro.showToast({title: '相册名称不能为空', icon: 'none'});
      return;
    }
    Taro.showLoading({title: '请稍后', mask: true});
    const data = await addGallery(title, description);
    Taro.hideLoading();
    if(data.code === 0) {
      Taro.showToast({title: '创建成功', mask: true, icon: 'success'});
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/upload/index?id=${data.data._id}&title=${data.meta.title}`
        }).then(() => {
          EventBus.emit('index_refresh');
        });
      }, 1500);

    }
  };
  render() {
    const {title, description} = this.state;
    return (
      <AtForm onSubmit={this.handleSubmit} customStyle='padding: 30rpx'>
        <AtInput
          customStyle='margin-top: 30rpx; margin-left:0'
          name='value'
          title='相册名称'
          type='text'
          placeholder='请输入相册名称'
          value={title}
          autoFocus
          maxLength={64}
          onChange={this.handleTitleChange} />

        <AtTextarea
          customStyle='margin-top: 30rpx'
          value={description}
          maxLength={1024}
          onChange={this.handleDescriptionChange}
          placeholder='请输入相册描述'
        />
        <AtButton customStyle='margin-top: 30rpx' formType='submit' type='primary'>确定</AtButton>
      </AtForm>
    );
  }
}

export default AddGallery;
