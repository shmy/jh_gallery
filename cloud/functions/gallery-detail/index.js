const cloud = require('wx-server-sdk');

cloud.init();


exports.main = async (meta = {id: ''}) => {
  const db = cloud.database();
  const gallery = db.collection('gallery');
  // const {OPENID} = cloud.getWXContext();
  try {
    const result = await gallery
      .where({_id: meta.id})
      .limit(1)
      .get();
    if (result.data.length === 0) {
      return {
        code: 1,
        data: '相册不存在',
        meta,
      };
    }
    return {
      code: 0,
      data: result.data[0],
      meta,
    };
  } catch (err) {
    return {
      code: 1,
      data: err.message,
      meta,
    };
  }
};
