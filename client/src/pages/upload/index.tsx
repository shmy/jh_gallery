import Taro, {Component, Config} from '@tarojs/taro'
import {Image, ScrollView, View} from "@tarojs/components";
import './index.scss'
import {AtButton} from "taro-ui";
import {addPhotoToGallery} from "../../services/gallery.service";
import EventBus from '../../defs/event_bus';
import {randomString} from "../../defs/tool";

enum ETaskState {
  default,
  uploading,
  success,
  fail,
}

interface ITask {
  state: ETaskState;
  tempFilePath: string;
  ext: string;
  responseUrl: string;
}

interface IProps {

}

interface IState {
  tasks: ITask[];
}

export default class Upload extends Component<IProps, IState> {
  config: Config = {
    navigationBarTitleText: '上传图片'
  };
  state: IState = {
    tasks: []
  };
  completedCount = 0;

  componentWillMount(): void {
    Taro.setNavigationBarTitle({
      title: '上传到: ' + this.$router.params.title,
    });
    console.log(this.$router.params)
  }

  componentDidMount() {
    Taro.showModal({
      title: '提示',
      content: '请遵守法律法规, 不要上传含有反动, 暴力, 毒品, 色情等图片',
      showCancel: false,
    })
  }

  handleChooseImage = () => {
    Taro.showLoading({title: '处理中', mask: true});
    Taro.chooseImage({
      count: 9, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const tasks = [...this.state.tasks];
        const _tasks = res.tempFiles.map(item => {
          const ext = item.path.split('.').pop() || 'png';
          return {tempFilePath: item.path, state: ETaskState.default, ext, responseUrl: ''};
        });
        tasks.unshift(..._tasks);
        this.setState({tasks});
        Taro.hideLoading();
      },
      fail: () => {
        Taro.hideLoading();
      }
    });
  };
  handlePreviewClick = (index: number) => {
    const urls = this.state.tasks.map(item => item.tempFilePath);
    const current = urls[index];
    Taro.previewImage({
      current,      //当前图片地址
      urls,         //所有要预览的图片的地址集合 数组形式
    });
  };
  handleDeleteClick = (index: number) => {
    const tasks = [...this.state.tasks];
    tasks.splice(index, 1);
    this.setState({tasks})
  };
  handleUpload = async () => {
    this.completedCount = 0;
    Taro.showLoading({title: '上传中, 请稍后', mask: true});
    for (let index = 0; index < this.state.tasks.length; index++) {
      this.doUpload(index);
    }
  };

  doUpload(index: number) {
    const _tasks = this.state.tasks;
    _tasks[index].state = ETaskState.uploading;
    this.setState({tasks: _tasks});
    const task = _tasks[index];
    Taro.cloud.uploadFile({
      cloudPath: this.$router.params.id + '/' + randomString() + '.' + task.ext,
      filePath: task.tempFilePath,
      success: (res) => {
        const tasks = this.state.tasks;
        tasks[index].state = ETaskState.success;
        // todo 设置 url
        tasks[index].responseUrl = res.fileID;
        this.setState({tasks});
        this.checkCompletedCount();
      },
      fail: () => {
        const tasks = this.state.tasks;
        tasks[index].state = ETaskState.fail;
        this.setState({tasks});
        this.checkCompletedCount();
      }
    });
  }

  checkCompletedCount() {
    this.completedCount++;
    if (this.completedCount >= this.state.tasks.length) {
      this.doAddPhotos();
    }
  }

  doAddPhotos = async () => {
    const successResponseUrls = this.state.tasks.filter(item => item.state === ETaskState.success).map(item => item.responseUrl);
    if (successResponseUrls.length === 0) {
      Taro.hideLoading();
      Taro.showModal({title: '提示', content: '上传失败, 请稍后重试', showCancel: false});
      return;
    }
    const data = await addPhotoToGallery(this.$router.params.id, successResponseUrls);
    Taro.hideLoading();
    if (data.code !== 0) {
      return;
    }
    const failTasks = this.state.tasks.filter(item => item.state === ETaskState.fail);
    this.setState({tasks: failTasks});
    if (failTasks.length > 0) {
      Taro.showModal({title: '提示', content: `有 ${failTasks.length} 张图片上传失败, 你可以点击重试`, showCancel: false}).then(() => {
        EventBus.emit('gallery_refresh');
        EventBus.emit('index_refresh');
      });
    } else {
      Taro.navigateBack({delta: 1}).then(() => {
        EventBus.emit('gallery_refresh');
        EventBus.emit('index_refresh');
      });
    }
    // EventBus.emit('gallery_refresh');
  };

  render() {
    return (
      <View className='upload-wrapper'>
        <ScrollView scrollY enable-flex className='upload-scroll-view'>

          <View className='upload-scroll-view-inner'>
            <View onClick={this.handleChooseImage} className='upload-item'>
              <View className='upload-inner upload-button'>
                <View style='color: #ccc; font-size: 90rpx' className='at-icon at-icon-upload'/>
              </View>
            </View>

            {this.state.tasks.map((task, index) => {
              return (
                <View key={task.tempFilePath} className='upload-item'>
                  <View className='upload-inner'>
                    <Image onClick={() => this.handlePreviewClick(index)} mode='aspectFill' lazyLoad
                           className='upload-image'
                           src={task.tempFilePath}/>
                    {task.state !== ETaskState.success ? (
                      <View onClick={() => this.handleDeleteClick(index)} className='upload-action-delete'>
                        <View style='color: #fff' className='at-icon at-icon-close'/>
                      </View>) : null}
                  </View>
                </View>
              );
            })}


          </View>
        </ScrollView>
        {/*<View className='upload-toolbar'>*/}
        <AtButton onClick={this.handleUpload} disabled={this.state.tasks.length === 0}
                  type='primary'>开始上传({this.state.tasks.length} 张)</AtButton>
        {/*</View>*/}

      </View>
    );
  }
}
