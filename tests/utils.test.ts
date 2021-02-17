import { normalizePath, normalizePaths, sanitizePath } from '../src/utils';

describe('utils - sanitizePath', () => {

  it('should trim the input', () => {
    const input = ' ohmygod ';
    const assert = sanitizePath(input);
    expect(assert).toStrictEqual('ohmygod');
  });

  it('should lowercase the input', () => {
    const input = 'OhMyGoD';
    const assert = sanitizePath(input);
    expect(assert).toStrictEqual('ohmygod');
  });

  it('should replace non alphanumeric characters', () => {
    const input = 'Path/To/Image File_VERSION4.ext';
    const assert = sanitizePath(input);
    expect(assert).toStrictEqual('path-to-image-file-version4-ext');
  });

});

describe('utils - normalizePath', () => {

  it('should replace all backslashes with slashes', () => {
    const input = 'this\\is\\a\\test \\o/';
    const assert = normalizePath(input);
    expect(assert).toStrictEqual('this/is/a/test /o/');
  });

});

describe('utils - normalizePaths', () => {

  it('should replace all backslashes with slashes', () => {
    const assert = normalizePaths([
      'this\\is\\a\\test',
      'this\\is\\another\\test \\o/',
    ]);
    expect(assert).toStrictEqual([
      'this/is/a/test',
      'this/is/another/test /o/',
    ]);
  });

});