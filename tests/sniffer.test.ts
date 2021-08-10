import { IGalleryOptions } from '../src/types';
import Sniffer from '../src/sniffer';

describe('Sniffer - sniffFolder (images)', () => {

  const defaultOptions: IGalleryOptions = {
    source: './assets',
    publicPath: '/images',
    outputName: 'custom',
    ignorePatterns: [],
    verbose: false,
    extensions: {},
  };

  it('should return expected object', async () => {
    const sniffer = new Sniffer(defaultOptions, __dirname);
    const assert = await sniffer.start();
    const expectedOutput = {
      "_media": [
        {
          "details": {
            "title": "My great sample image",
            "description": "It is used to provide a sample image, yay!"
          },
          "height": 256,
          "id": "-images-example-128-256-png-png",
          "path": "/images/example_128_256_PNG.png",
          "width": 128,
        },
        {
          "details": {
            "random": "You can set whatever property you want",
            "property": "All you need is valid JSON data"
          },
          "height": 128,
          "id": "-images-example-256-128-jpg-jpg",
          "path": "/images/example_256_128_JPG.jpg",
          "width": 256,
        },
      ],
      "subfolder-1": {
        "_media": [],
      },
      "subfolder-2": {
        "_media": [
          {
            "height": 64,
            "id": "-images-subfolder-2-example-64-64-gif-gif",
            "path": "/images/subfolder-2/example_64_64_GIF.gif",
            "width": 64,
          },
        ],
        "another-subfolder": {
          "_media": [
            {
              "height": 320,
              "id": "-images-subfolder-2-another-subfolder-example-560-320-mp4-mp4",
              "path": "/images/subfolder-2/another-subfolder/example_560_320_MP4.mp4",
              "width": 560,
              "duration": 5,
            },
            {
              "id": "-images-subfolder-2-another-subfolder-example-mp3-mp3",
              "path": "/images/subfolder-2/another-subfolder/example_MP3.mp3",
              "duration": 27,
            }
          ],
        },
      },
    };

    expect(assert).toEqual(expectedOutput);
  });

  it('should apply ignorePatterns', async () => {
    const sniffer = new Sniffer({ ...defaultOptions, ignorePatterns: ['**/another-subfolder/**'] }, __dirname);
    const assert = await sniffer.start();
    const expectedOutput = {
      "_media": [
        {
          "details": {
            "title": "My great sample image",
            "description": "It is used to provide a sample image, yay!"
          },
          "height": 256,
          "id": "-images-example-128-256-png-png",
          "path": "/images/example_128_256_PNG.png",
          "width": 128,
        },
        {
          "details": {
            "random": "You can set whatever property you want",
            "property": "All you need is valid JSON data"
          },
          "height": 128,
          "id": "-images-example-256-128-jpg-jpg",
          "path": "/images/example_256_128_JPG.jpg",
          "width": 256,
        },
      ],
      "subfolder-1": {
        "_media": [],
      },
      "subfolder-2": {
        "_media": [
          {
            "height": 64,
            "id": "-images-subfolder-2-example-64-64-gif-gif",
            "path": "/images/subfolder-2/example_64_64_GIF.gif",
            "width": 64,
          },
        ],
      },
    };

    expect(assert).toEqual(expectedOutput);
  });

  it('should apply ignoreTypes', async () => {
    const sniffer = new Sniffer({ ...defaultOptions, ignoreTypes: ['image', 'audio'] }, __dirname);
    const assert = await sniffer.start();
    const expectedOutput = {
      "_media": [],
      "subfolder-1": {
        "_media": [],
      },
      "subfolder-2": {
        "_media": [],
        "another-subfolder": {
          "_media": [
            {
              "height": 320,
              "id": "-images-subfolder-2-another-subfolder-example-560-320-mp4-mp4",
              "path": "/images/subfolder-2/another-subfolder/example_560_320_MP4.mp4",
              "width": 560,
              "duration": 5,
            },
          ],
        },
      },
    };

    expect(assert).toEqual(expectedOutput);
  });

  it('should not throw an error if the error is just not found', async () => {
    const sniffer = new Sniffer(defaultOptions, '/inexistant');
    expect(async () => await sniffer.start()).not.toThrow();
  });
});