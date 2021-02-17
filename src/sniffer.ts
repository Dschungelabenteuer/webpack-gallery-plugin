import fs from 'fs';
import path from 'path';
import glob from 'glob';
import chalk from 'chalk';

import {
  IDirectory,
  IGalleryOptions,
  TMedia,
  TMediaType,
} from './types';

import { extensionsMap, prepareMedia } from './media';
import { sanitizePath, normalizePath, normalizePaths } from './utils';

export default class Sniffer {
  /** Webpack compiler context. */
  private readonly context: string;

  /** Sniffer options. */
  private readonly options: IGalleryOptions;

  /** Default `publicPath` option value. */
  private readonly defaultPublicPath: string = '/';

  /** Default `ignoreTypes` option value. */
  private readonly defaultIgnoreTypes: TMediaType[] = [];

  /** Default `ignorePatterns` option value. */
  private readonly defaultIgnorePatterns: string[] = ['.*/'];

  /** Default `verbose` option value. */
  private readonly defaultVerbose: boolean = false;

  /** List of files and folders not ignored by patterns. */
  private pathList: string[] = [];

  constructor(
    options: IGalleryOptions,
    context: string,
  ) {
    this.context = context;
    this.options = Object.assign({
      publicPath: this.defaultPublicPath,
      ignoreTypes: this.defaultIgnoreTypes,
      ignorePatterns: this.defaultIgnorePatterns,
      verbose: this.defaultVerbose,
    }, options);

    this.processIgnoredTypes();
    return this;
  }

  public async start(): Promise<IDirectory> {
    await this.processMatchingPaths();
    const sniffOutput = await this.sniff(this.options);
    return sniffOutput;
  }

  private processIgnoredTypes(): void {
    const ignoreTypes = this.options.ignoreTypes as TMediaType[];

    if (ignoreTypes.length) {
      const ignoredExtensions: string[] = [];
      Object.keys(extensionsMap).forEach((extension) => {
        if (ignoreTypes.includes(extensionsMap[extension])) {
          ignoredExtensions.push(extension.toLowerCase());
          ignoredExtensions.push(extension.toUpperCase());
        }
      });

      if (ignoredExtensions.length) {
        (this.options.ignorePatterns as string[])
          .push(`**/*.+(${ignoredExtensions.join('|')})`);
      }
    }
  }

  private async processMatchingPaths(): Promise<void> {
    const basePath = `${path.resolve(this.context, this.options.source)}/**/*`;
    this.pathList = normalizePaths(glob.sync(basePath, { ignore: this.options.ignorePatterns }));
  }

  private async sniff(options: IGalleryOptions): Promise<IDirectory> {
    const {
      source, publicPath, extensions, verbose,
    } = options;
    const absolutePath = path.join(this.context, source);
    const gallery: IDirectory = {};
    gallery._media = [];

    if (verbose) {
      console.log(chalk.cyan(`i Sniffing path "${absolutePath}" ...`));
    }

    try {
      // Loop through directory.
      const directory = fs.readdirSync(absolutePath);

      for (const directoryItem of directory) {
        const relativeChildPath = `${source}/${directoryItem}`;
        const absoluteChildPath = path.resolve(this.context, `${source}/${directoryItem}`);

        if (this.pathList.indexOf(normalizePath(absoluteChildPath)) > -1) {
          if (!fs.lstatSync(absoluteChildPath).isDirectory()) {
            const clearedPath = `${publicPath}/${relativeChildPath}`
              .replace(`${this.options.source}/`, '');

            const preparedMedia = await prepareMedia(
              absoluteChildPath,
              clearedPath,
              verbose as boolean,
              extensions,
            );

            if (preparedMedia) {
              (gallery._media as TMedia[]).push(preparedMedia);
            }
          } else {
            // If it is a folder, recursively sniff it too.
            const sanitizedPath = sanitizePath(directoryItem);
            gallery[sanitizedPath] = await this.sniff({
              ...options,
              source: relativeChildPath,
            });
          }
        } else if (verbose) {
          console.log(chalk.yellow(`i Ignoring path "${absoluteChildPath}" as it is part of ignored patterns...`));
        }
      }
    } catch (error) {
      if (error.message.includes('no such file or directory')) {
        console.warn(chalk.yellow(`Tried to sniff "${absolutePath}" directory but it does not exist, ignoring...`));
      } else {
        throw new Error(error);
      }
    }

    return gallery;
  }
}
