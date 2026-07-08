// 共享类型定义

export type Brand = {
  slug: string;
  name: string;
  /** 当地语言名称（如韩文 / 中文） */
  nameLocal: string;
  country: string;
  logo: string;
  tagline: string;
  descriptionZh: string;
  descriptionEn: string;
  url: string;
  popular?: boolean;
};

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};
