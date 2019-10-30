import Taro from '@tarojs/taro'

const db = Taro.cloud.database();

export const randomString = () => {
  return Math.random().toString(36).slice(-8) + '_' + Date.now() + '_' + Math.random().toString(36).slice(-8);
};
export const checkIsAuthenticated = async () => {
  try {
    const open_id = await Taro.getStorage({ key: 'open_id' });
    console.log(open_id.data);
    const user = db.collection('user');
    const result = await user.where({open_id: open_id.data}).get();
    if (result.data.length === 0) {
      throw new Error('你还没有登录/注册');
    }
    const current = result.data[0];
    if (Date.now() >= current.expire_time) {
      throw new Error('你的登录已过期');
    }
    return true;
  } catch (err) {
    Taro.showToast({title: err.message || '请先登录', mask: true, icon: 'none'});
    setTimeout(() => {
      Taro.reLaunch({url: '/pages/login/index'});
    }, 1500);
    return false;
  }

};
