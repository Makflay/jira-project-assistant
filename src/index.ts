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

resolver.define("getProjectAssignableUsers", async ({ payload }) => {
  const { projectKey } = payload as { projectKey: string };

  if (!/^[A-Z][A-Z0-9_]+$/.test(projectKey)) {
    throw new Error("Invalid project key");
  }

  const res = await api
    .asUser()
    .requestJira(
      route`/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${projectKey}&maxResults=50`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

  if (!res.ok) {
    throw new Error(`Failed to load assignable users: ${res.status}`);
  }

  return res.json();
});

resolver.define("assignIssue", async ({ payload }) => {
  const { issueKey, accountId } = payload as {
    issueKey: string;
    accountId: string;
  };

  if (!/^[A-Z][A-Z0-9_]+-\d+$/.test(issueKey)) {
    throw new Error("Invalid issue key");
  }

  if (!accountId) {
    throw new Error("Invalid account id");
  }

  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}/assignee`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId,
      }),
    });

  if (!res.ok) {
    throw new Error(`Failed to assign issue: ${res.status}`);
  }

  return { success: true };
});

resolver.define("updateIssuePriority", async ({ payload }) => {
  const { issueKey, priorityId } = payload as {
    issueKey: string;
    priorityId: string;
  };

  if (!issueKey || !priorityId) {
    throw new Error("Issue key and priority id are required");
  }

  const res = await api
    .asUser()
    .requestJira(route`/rest/api/3/issue/${issueKey}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          priority: {
            id: priorityId,
          },
        },
      }),
    });

  if (!res.ok) {
    throw new Error(`Failed to update issue priority: ${res.status}`);
  }
});

export const handler = resolver.getDefinitions();
