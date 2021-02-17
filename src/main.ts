import { Compiler } from 'webpack';
import { validate } from 'schema-utils';
import { toConstantDependency } from 'webpack/lib/javascript/JavascriptParserHelpers';
import ConstDependency from 'webpack/lib/dependencies/ConstDependency';
import chalk from 'chalk';

import { IGalleryOptions, IDirectory } from './types';
import jsonSchema from './options.json';
import Sniffer from './sniffer';

class WebpackGalleryPlugin {
  /** Plugin options. */
  private readonly options: IGalleryOptions;

  /** Default `outputName` option value. */
  private readonly defaultOutputName: string = 'default';

  constructor(options: IGalleryOptions) {
    const configuration = { name: 'WebpackGalleryPlugin' };
    const schema = jsonSchema as any;
    validate(schema, options, configuration);
    this.options = { outputName: this.defaultOutputName, ...options };
  }

  apply(compiler: Compiler) {
    const pluginName = this.constructor.name;

    // Final output.
    let content: IDirectory;

    compiler.hooks.beforeCompile.tapAsync(pluginName, async (params, callback) => {
      if (this.options.verbose) {
        console.log(chalk.cyan(`i Preparing folder analysis at ${compiler.context}`));
      }

      const sniffer = new Sniffer(this.options, compiler.context);
      content = await sniffer.start();
      callback();
    });

    compiler.hooks.compilation.tap(pluginName, (compilation, { normalModuleFactory }) => {
      if (this.options.verbose) {
        console.log(chalk.green(`√ Applying value to "GALLERY_${this.options.outputName}"`));
      }

      compilation.dependencyTemplates.set(ConstDependency, new ConstDependency.Template());

      const handler = (parser: any): void => {
        parser.hooks.expression
          .for(`GALLERY_${this.options.outputName}`)
          .tap(pluginName, (expr: any) => toConstantDependency(
            parser,
            JSON.stringify(content),
          )(expr));
      };

      normalModuleFactory.hooks.parser
        .for('javascript/auto')
        .tap('DefinePlugin', handler);
      normalModuleFactory.hooks.parser
        .for('javascript/dynamic')
        .tap('DefinePlugin', handler);
      normalModuleFactory.hooks.parser
        .for('javascript/esm')
        .tap('DefinePlugin', handler);
    });
  }
}

module.exports = WebpackGalleryPlugin;
