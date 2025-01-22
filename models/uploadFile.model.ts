export interface IUploadFile {
  url: string;
  name?: string;
  contentType?: string;
}
export interface IUploadBlobResponse {
  pathname: string;
  contentType: string;
  contentDisposition: string;
  url: string;
  downloadUrl: string;
}

export interface IBlobMetadataResponse {
  size: number;
  uploadedAt: Date;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  url: string;
  downloadUrl: string;
  cacheControl: string;
}

export interface IBlobFromList {
  size: number;
  uploadedAt: Date;
  pathname: string;
  url: string;
  downloadUrl: string;
}

export interface IBlobListResponse {
  blobs: IBlobFromList[];
  cursor?: string;
  hasMore: boolean;
  folders?: string[];
}
