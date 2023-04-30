import webpack from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { OakleighFunctionEndpoint } from "../../common/oakleigh-component";
import { OakleighHandlers } from "../../common/types";
import { FileContents } from "../../common/file-contents";

export function mapFunctionEndpoint(
  fileContents: FileContents
): OakleighFunctionEndpoint {
  return {
    filename: fileContents.filename,
    type: "endpoint",
    details: {
      path: fileContents.comments?.["path"] ?? "",
      handlerName: fileContents.key,
      exportName: "handler",
    },
  };
}

export function compileFunctionEndpoint(
  outputPath: string,
  oakleighHandlers: Record<string, OakleighFunctionEndpoint>
) {
  webpack(
    {
      entry: Object.keys(oakleighHandlers).reduce<webpack.EntryObject>(
        (entry, handlerName) => {
          oakleighHandlers[handlerName].details.compiledPath = outputPath;

          return {
            ...entry,
            [handlerName]: oakleighHandlers[handlerName].filename,
          };
        },
        {}
      ),
      output: {
        path: outputPath,
        libraryTarget: "commonjs2",
      },
      target: "node",
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: [{ loader: "ts-loader" }],
          },
        ],
      },
      plugins: [new CleanWebpackPlugin()],
    },
    (err, stats) => {
      const errors = err || stats?.hasErrors();
      if (errors) {
        console.log(
          stats?.toString({
            colors: true,
          })
        );
        process.exitCode = 1;
      }
    }
  );
}
