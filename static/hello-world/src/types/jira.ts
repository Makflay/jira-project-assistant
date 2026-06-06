export interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey?: string;
  avatarUrls?: Record<string, string>;
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  avatarUrls?: Record<string, string>;
  active?: boolean;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory?: {
    id: number;
    key: string;
    name: string;
    colorName?: string;
  };
}

export interface JiraIssueFields {
  summary: string;
  status: JiraStatus;
  priority?: JiraPriority;
  duedate?: string | null;
  assignee?: JiraUser | null;
  reporter?: JiraUser | null;
  createdAt: string;
  updatedAt: string;
}
export interface JiraIssue {
  id: string;
  key: string;
  fields: JiraIssueFields;
}

export interface JiraApiPaginatedResponse<T> {
  startAt: number;
  maxResults: number;
  total?: number;
  isLast?: boolean;
  values?: T[];
  issues?: T[];
}
