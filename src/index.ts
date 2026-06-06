import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("getProjectInfo", async ({ context }) => {
  return {
    projectId: context.extension?.project?.id,
    projectKey: context.extension?.project?.key,
  };
});

export const handler = resolver.getDefinitions();
