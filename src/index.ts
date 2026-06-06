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

resolver.define("getIssuesByProject", async ({ payload }) => {
  const { projectKey } = payload as { projectKey: string };

  if (!/^[A-Z][A-Z0-9_]+$/.test(projectKey)) {
    throw new Error("Invalid project key");
  }

  const res = await api.asUser().requestJira(route`/rest/api/3/search/jql`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jql: `project = "${projectKey}" ORDER BY updated DESC`,
      maxResults: 50,
      fields: ["summary", "status", "assignee", "priority", "duedate"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to load Jira issues: ${res.status}`);
  }

  const data = await res.json();

  return data.issues;
});

export const handler = resolver.getDefinitions();
