const cloud = require('wx-server-sdk');

cloud.init();
exports.main = async (meta = {id: '', photos: []}) => {
  const db = cloud.database();
  const _ = db.command;
  const gallery = db.collection('gallery');
  const {OPENID} = cloud.getWXContext();
  try {
    const result = await gallery.doc(meta.id).update({
      data: {
        photos: _.unshift(meta.photos),
        cover_photo: meta.photos[0],
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
