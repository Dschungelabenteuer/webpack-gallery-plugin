# webpack-gallery-plugin

A webpack plugin to provide a global object representing a detailed gallery tree view.

## Getting started

You first need to install `webpack-gallery-plugin` as a development dependency by running the following command:
```console
npm install copy-webpack-plugin --save-dev
```

You can then add the plugin to your `webpack` config. For example:

```js
// webpack.config.js
const GalleryPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new GalleryPlugin({
      source: '/assets',
    }),
  ],
};
```

## Options

| **Name**             | **Type**    | **Required** | **Default** | **Description**                                                 |
|----------------------|-------------|--------------|-------------|-----------------------------------------------------------------|
| **`source`**         | `{String}`  | `true`       | `undefined` | Path to the target folder, relative to the webpack config file. |
| **`publicPath`**     | `{String}`  | `false`      | `"/"`       | Public path of the target folder.                               |
| **`outputName`**     | `{String}`  | `false`      | `"default"` | Output name, generated constant will be `GALLERY_{outputName}`. |
| **`ignoreTypes`**    | `{Array}`   | `false`      | `undefined` | Ignored file types.                                             |
| **`ignorePatterns`** | `{Array}`   | `false`      | `[".*/"]`   | Ignore patterns.                                                |
| **`extensions`**     | `{Object}`  | `false`      | `undefined` | Custom extensions map.                                          |
| **`verbose`**        | `{Boolean}` | `false`      | `false`     | Verbose mode.                                                   |

## Supported file types

| **`Image`** | **`Audio`** | **`Video`** |
|-------------|-------------|-------------|
| `.bmp`      | `.mp3`      | `.mp4`      |
| `.cur`      | `.ogg`      | `.mov`      |
| `.dds`      | `.m4a`      | `.wmv`      |
| `.gif`      | `.flac`     | `.flv`      |
| `.ktx`      | `.wav`      | `.avi`      |
| `.png`      | `.wma`      | `.mkv`      |
| `.pnm`      | `.aac`      |             |
| `.pam`      |             |             |
| `.pbm`      |             |             |
| `.pfm`      |             |             |
| `.pgm`      |             |             |
| `.ppm`      |             |             |
| `.psd`      |             |             |
| `.svg`      |             |             |
| `.icon`     |             |             |
| `.jpg`      |             |             |
| `.jpeg`     |             |             |
| `.icns`     |             |             |
| `.tiff`     |             |             |
| `.webp`     |             |             |


## Custom extensions map

You can extend the default supported file typed by adding your own `extension: type` entries into
the option's `extensions` parameter.

**exemple**
```js
// webpack.config.js
const GalleryPlugin = require("copy-webpack-plugin");

module.exports = {
  plugins: [
    new GalleryPlugin({
      source: '/assets',
      extensions: {
        tiff: 'image',
        mp4: 'audio',
        txt: 'poetry',
      },
    }),
  ],
};
```

> ⚠️ If you respecify any of the default supported file types through the `extensions` parameter, the
> default type (image/audio/video) will be overwritten.


> ⚠️ `type`s other than `image`, `audio`, `video` will be preserved but wont provide any relevant data
> but the `path `and an `id`.