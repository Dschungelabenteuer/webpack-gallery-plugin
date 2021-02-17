export interface IMediaDetails {
  id: string;
  path: string;
}

export interface IImageDetails extends IMediaDetails {
  height: number;
  width: number;
}

export interface IAudioDetails extends IMediaDetails {
  duration: number;
}

export interface IVideoDetails extends IMediaDetails {
  height: number;
  width: number;
  duration: number;
}

export interface ITextDetails extends IMediaDetails {
  words: number;
  characters: number;
}

export interface IMediaTypeMap {
  [key: string]: TMediaType;
}

export type TMediaType =
  | 'image'
  | 'audio'
  | 'video';

export type TMedia =
  | IMediaDetails
  | IImageDetails
  | IAudioDetails
  | IVideoDetails;

export interface IFolder {
  [key: string]: IDirectory;
}

export type IDirectory = IFolder & {
  _media?: TMedia[];
}

export interface IGalleryOptions {
  source: string;
  publicPath: string;
  outputName?: string;
  ignoreTypes?: TMediaType[];
  ignorePatterns?: string[];
  extensions?: IMediaTypeMap;
  verbose?: boolean;
}
