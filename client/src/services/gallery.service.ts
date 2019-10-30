import Taro from '@tarojs/taro'
import {checkIsAuthenticated} from "../defs/tool";

const noAuthenticationResponse = {code: 2, data: null};
export interface IGallery {
  _id: string;
  cover_photo: string;
  title: string;
  description: string;
  photos: string[];
  created_at: Date;
  updated_at: Date;
  // count: number;
}

export const getGalleryList = async (page = 1, pageSize = 20) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-index",
    data: {page, pageSize}
  });
  console.log('getGalleryList', data.result);
  return data.result;
};

export const getGalleryDetail = async (id: string) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-detail",
    data: {id}
  });
  console.log('getGalleryDetail', data.result);
  return data.result;
};

export const addGallery = async (title: string, description: string) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-create",
    data: {title, description}
  });
  console.log('addGallery', data.result);
  return data.result;
};

export const editGallery = async (id: string, title: string, description: string) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-update",
    data: {id, title, description}
  });
  console.log('editGallery', data.result);
  return data.result;
};

export const deleteGallery = async (id: number | string) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-delete",
    data: {id}
  });
  console.log('deleteGallery', data.result);
  return data.result;
};

export const shareGallery = async (id: string) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-share",
    data: {id}
  });
  console.log('shareGallery', data.result);
  return data.result;
};

export const addPhotoToGallery = async (id: string, photos: string[]) => {
  if (await checkIsAuthenticated() === false) {
    return noAuthenticationResponse;
  }
  const data = await Taro.cloud.callFunction({
    name: "gallery-add-photo",
    data: {id, photos}
  });
  console.log('addPhotoToGallery', data.result);
  return data.result;
};

