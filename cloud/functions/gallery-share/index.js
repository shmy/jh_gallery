const cloud = require('wx-server-sdk');
const {
  WXMINIUser,
  WXMINIQR
} = require('wx-js-utils');
const secret = 'df7cb4d046014f6df9b3dbbc723be890'; // 小程序 secret

cloud.init();

exports.main = async (meta = {id: ''}) => {
  const db = cloud.database();
  const gallery = db.collection('gallery');
  const {OPENID, APPID} = cloud.getWXContext();
  try {
    const result = await gallery.where({_id: meta.id}).get();
    const data = result.data;
    if (data.length === 0) {
      return {
        code: 1,
        data: '相册不存在',
      };
    }
    let shared_qr_code = data[0].shared_qr_code;
    // 如果没有二维码
    if (!shared_qr_code) {
      //获取access_token
      const wXMINIUser = new WXMINIUser({
        appId: APPID,
        secret
      });
      const access_token = await wXMINIUser.getAccessToken();
      const wXMINIQR = new WXMINIQR();
      const qrResult = await wXMINIQR.getMiniQRLimit({
        access_token,
        path: `/pages/share/index?id=${meta.id}`,
        is_hyaline: true
      });
      //上传云存储，返回结果是供小程序使用的fileID
      const file = await cloud.uploadFile({
        cloudPath: meta.id + '/shared_qr_code.png',
        fileContent: qrResult
      });
      // 更新二维码
      await gallery.doc(meta.id).update({
        data: {
          shared: true,
          shared_qr_code: file.fileID,
        }
      });
      shared_qr_code = file.fileID;
    }
    return {
      code: 0,
      data: {
        shared: true,
        shared_qr_code,
        title: data[0].title,
      },
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
