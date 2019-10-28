const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (meta = {title: '', description: ''}) => {
  const db = cloud.database();
  const gallery = db.collection('gallery');
  const {OPENID} = cloud.getWXContext();
  try {
    const result = await gallery.add({
      data: {
        open_id: OPENID,
        title: meta.title,
        description: meta.description,
        cover_photo: '',
        photos: [],
        created_at: Date.now(),
        updated_at: Date.now(),
        shared: false,
        shared_qr_code: '',
      }
    });

    return {
      code: 0,
      data: result,
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
