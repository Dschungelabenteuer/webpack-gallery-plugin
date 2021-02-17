import { getMediaType, prepareMedia } from '../src/media';

describe('Media - getMediaType', () => {

  it('should return correct type', () => {
    const assert = getMediaType('test.avi');
    expect(assert).toStrictEqual('video');
  });

  it('should return custom type', () => {
    const assert = getMediaType('test.docx', { docx: 'poetry' } as any);
    expect(assert).toStrictEqual('poetry');
  });

  it('should return overwritten type', () => {
    const assert = getMediaType('test.webp', { webp: 'web' } as any);
    expect(assert).toStrictEqual('web');
  });

});

describe('Media - prepareMedia', () => {

  it('should return false if file type is ignored', async () => {
    const target = '/assets/whatever.log';
    const assert = await prepareMedia(__dirname + target, target, false);
    expect(assert).toStrictEqual(false);
  });

  it('should return basic details if file type is unknown', async () => {
    const target = '/assets/subfolder-2/another-subfolder/example_TXT.txt';
    const assert = await prepareMedia(__dirname + target, target, false, { txt: 'notes' } as any);
    expect(assert).toHaveProperty('path');
    expect(assert).toHaveProperty('id');
  });

  it('should prepare correct media details for image files', async () => {
    const target = '/assets/example_256_128_JPG.jpg';
    const assert = await prepareMedia(__dirname + target, target, false);
    expect(assert).toHaveProperty('path');
    expect(assert).toHaveProperty('id');
    expect(assert).toHaveProperty('width');
    expect(assert).toHaveProperty('height');
  });

  it('should prepare correct media details for audio files', async () => {
    const target = '/assets/subfolder-2/another-subfolder/example_MP3.mp3';
    const assert = await prepareMedia(__dirname + target, target, false);
    expect(assert).toHaveProperty('path');
    expect(assert).toHaveProperty('id');
    expect(assert).toHaveProperty('duration');
  });

  it('should prepare correct media details for video files', async () => {
    const target = '/assets/subfolder-2/another-subfolder/example_560_320_MP4.mp4';
    const assert = await prepareMedia(__dirname + target, target, false);
    expect(assert).toHaveProperty('path');
    expect(assert).toHaveProperty('id');
    expect(assert).toHaveProperty('duration');
    expect(assert).toHaveProperty('width');
    expect(assert).toHaveProperty('height');
  });

});