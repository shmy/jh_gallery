const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (meta = {id: '', title: '', description: ''}) => {
  const db = cloud.database();
  const gallery = db.collection('gallery');
  const {OPENID} = cloud.getWXContext();
  try {
    const result = await gallery.doc(meta.id).update({
      data: {
        title: meta.title,
        description: meta.description,
        updated_at: Date.now(),
      }
    });
    return {
      code: 0,
      data: result.data,
      meta,
    }
  } catch (err) {
    return {
      code: 1,
      data: err.message,
      meta,
    };
  }
};
