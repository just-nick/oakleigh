import { LocalWorkspace } from "@pulumi/pulumi/automation";
import { Region } from "@pulumi/aws-native";
import { buildProgram } from "../program";
import { OakleighInfraDescriptionSet } from "../infra/oakleigh-infra";

export async function getStack(handlers: OakleighInfraDescriptionSet) {
  const stackName = "dev";
  const projectName = "lastTime";
  const program = buildProgram(handlers);

  const stack = await LocalWorkspace.createOrSelectStack({
    projectName,
    stackName,
    program,
  });

  await stack.setAllConfig({
    "aws-native:region": { value: Region.APSoutheast2 },
    "aws:region": { value: Region.APSoutheast2 },
    "aws:profile": { value: "nick" },
  });

  const workspace = stack.workspace;

  console.info("successfully initialized stack");
  console.info("installing plugins...");
  await workspace.installPlugin("aws", "v5.2.0");
  await workspace.installPlugin("aws-native", "v0.15.0");
  console.info("plugins installed");

  return {
    stack,
    workspace,
  };
}
