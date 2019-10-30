export enum EStatus {
  more,
  loading,
  noMore,
  loadError,
}

export interface IUserInfo {
  nickName: string;
  avatarUrl: string;
  country: string;
  province: string;
  city: string;
  gender: number;
}
