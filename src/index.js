import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
const resolver = new Resolver();

resolver.define("getProjectInfo", async (req) => {
  console.log("Forge context:", req.context);

  return {
    context: req.context,
  };
});

export const handler = resolver.getDefinitions();
