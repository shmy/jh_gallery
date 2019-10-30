const cloud = require('wx-server-sdk');

cloud.init();
const duration = 24 * 3600 * 1000; // 1小时
exports.main = async (meta = {userInfo: {}}) => {
  const db = cloud.database();
  const user = db.collection('user');
  const {OPENID} = cloud.getWXContext();
  try {
    const now = Date.now();
    const expireTime = now + duration;

    const result = await user.where({open_id: OPENID}).get();
    if (result.data.length === 0) {
      // 还未注册 添加一条
      await user.add({
        data: {
          open_id: OPENID,
          ...meta.userInfo,
          created_at: now,
          updated_at: now,
          expire_time: expireTime, // 到期时间
          locked: false,
          locked_reason: '',
        }
      });
    } else {
      // TODO: 处理锁定问题
      if (result.data[0].locked) {
        return {
          code: 2,
          data: '用户已被锁定' + result.data[0].locked_reason,
          meta
        }
      }
      await user.where({open_id: OPENID}).update({
        data: {
          ...meta.userInfo,
          expire_time: expireTime, // 到期时间
          updated_at: now,
        }
      });
    }
    return {
      code: 0,
      data: result.data[0],
      meta
    }
  } catch (err) {
    return {
      code: 1,
      data: err.message,
      meta,
    };
  }
};
