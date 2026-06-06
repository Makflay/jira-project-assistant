import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

resolver.define("getProjects", async () => {
  const res = await api.asUser().requestJira(route`/rest/api/3/project/search`);

  if (!res.ok) {
    throw new Error(`Failed to load Jira projects: ${res.status}`);
  }

  const data = await res.json();

  return data.values;
});

export const handler = resolver.getDefinitions();
