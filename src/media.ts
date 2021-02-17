import path from 'path';
import sizeOf from 'image-size';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';

import {
  TMedia,
  IMediaTypeMap,
  IImageDetails,
  IAudioDetails,
  IVideoDetails,
  IMediaDetails,
  TMediaType,
} from './types';

import { sanitizePath } from './utils';

const ffprobeConfig = { path: ffprobeStatic.path };

const getMediaData = async (mediaPath: string) => {
  const result = await ffprobe(mediaPath, ffprobeConfig);
  const data = result.streams[0];
  return {
    duration: Math.floor(data.duration),
    width: Math.floor(data.width),
    height: Math.floor(data.height),
  };
};

export const extensionsMap: IMediaTypeMap = {
  bmp: 'image',
  cur: 'image',
  dds: 'image',
  gif: 'image',
  ktx: 'image',
  png: 'image',
  pnm: 'image',
  pam: 'image',
  pbm: 'image',
  pfm: 'image',
  pgm: 'image',
  ppm: 'image',
  psd: 'image',
  svg: 'image',
  ico: 'image',
  jpg: 'image',
  icns: 'image',
  jpeg: 'image',
  tiff: 'image',
  webp: 'image',

  mp3: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  flac: 'audio',
  wav: 'audio',
  wma: 'audio',
  aac: 'audio',

  mp4: 'video',
  mov: 'video',
  wmv: 'video',
  flv: 'video',
  avi: 'video',
  mkv: 'video',
};

export const prepareMedia = async (
  absolutePath: string,
  relativePath: string,
  verbose: boolean,
  extensions?: IMediaTypeMap,
): Promise<TMedia | false | undefined> => {
  const type = getMediaType(absolutePath, extensions);

  if (!type) {
    return false;
  }

  if (verbose) {
    console.log(`i Adding media "${absolutePath}" of type "${type}"`);
  }

  const meta: IMediaDetails = { path: relativePath, id: sanitizePath(relativePath) };

  switch (type) {
    case 'image':
      return prepareImageMedia(absolutePath, meta);
    case 'audio':
      return prepareAudioMedia(absolutePath, meta);
    case 'video':
      return prepareVideoMedia(absolutePath, meta);
    default:
      return meta;
  }
};

export const getMediaType = (
  absolutePath: string,
  extensions?: IMediaTypeMap,
): TMediaType | string | undefined => {
  const extension = path.extname(absolutePath).substring(1);
  const finalExtensionsMap = { ...extensionsMap, ...extensions };
  return finalExtensionsMap[extension];
};

const prepareImageMedia = (
  absolutePath: string,
  meta: IMediaDetails,
): IImageDetails => {
  const { width, height } = sizeOf(absolutePath);
  return {
    ...meta,
    width: width || 0,
    height: height || 0,
  };
};

const prepareAudioMedia = async (
  absolutePath: string,
  meta: IMediaDetails,
): Promise<IAudioDetails> => {
  const { duration } = await getMediaData(absolutePath);
  return { ...meta, duration };
};

const prepareVideoMedia = async (
  absolutePath: string,
  meta: IMediaDetails,
): Promise<IVideoDetails> => {
  const { duration, width, height } = await getMediaData(absolutePath);
  return {
    ...meta, duration, width, height,
  };
};
