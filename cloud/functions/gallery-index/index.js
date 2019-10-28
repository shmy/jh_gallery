const cloud = require('wx-server-sdk');

cloud.init();


exports.main = async (meta = {page: 1, pageSize: 20}) => {
  const db = cloud.database();
  const gallery = db.collection('gallery');
  const {OPENID} = cloud.getWXContext();
  const skip = (meta.page - 1) * meta.pageSize;
  try {
    const result = await gallery
      .where({open_id: OPENID})
      .orderBy('created_at', 'desc')
      .orderBy('updated_at', 'desc')
      .skip(skip)
      .limit(meta.pageSize)
      .get();
    return {
      code: 0,
      data: {
        total: 200,
        data: result.data,
        meta,
      },
    };
  } catch (err) {
    return {
      code: 1,
      data: err.message,
      meta,
    };
  }
};
