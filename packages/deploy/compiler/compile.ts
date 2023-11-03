import webpack from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import {
  OakleighInfraDescription,
  OakleighInfraDescriptionSet,
} from "../infra/oakleigh-infra";
import { compilableTypes } from "../common/constants";

type CompilableInfra = OakleighInfraDescription & {
  filename: string;
  details: { compiledPath: string };
};

export function compileFunctions(
  outputPath: string,
  oakleighHandlers: OakleighInfraDescriptionSet
) {
  const functions = Object.entries(oakleighHandlers).filter(
    (output): output is [string, CompilableInfra] =>
      compilableTypes.includes(output[1].type)
  );

  if (functions.length === 0) {
    console.log("Nothing to compile.");
    return;
  }

  webpack(
    {
      entry: functions.reduce<webpack.EntryObject>((entry, [key, handler]) => {
        handler.details.compiledPath = outputPath;

        return {
          ...entry,
          [key]: handler.filename,
        };
      }, {}),
      output: {
        path: outputPath,
        libraryTarget: "commonjs2",
      },
      target: "node",
      resolve: {
        extensions: ["", ".js", ".ts"],
      },
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
