export interface TaskInfo {
  id: string;
  title: string;
  status: string;
  assignee: string | string[];  // 단일 또는 여러 담당자
  filePath: string;
  lastModified: Date;
  previousStatus?: string;  // 이전 상태
  changes?: string[];       // 변경사항 목록
}

export interface WebhookConfig {
  assignee: string;
  url: string;
  events: string[];
  format: 'teams';
  type: 'channel' 
}

export interface BacklogConfig {
  port: number;
  webhooks: {
    enabled: boolean;
    assignees: {
      [key: string]: {
        url: string;
        events: string[];
        format: string;
      };
    };
  };
}

export interface TeamsMessage {
  text: string;
  attachments?: Array<{
    contentType: string;
    content: {
      type: string;
      version: string;
      body: Array<{
        type: string;
        text: string;
        size?: string;
        weight?: string;
      }>;
      msteams?: {
        entities: Array<{
          type: string;
          text: string;
          mentioned: {
            id: string;
            name: string;
          };
        }>;
      };
    };
  }>;
}

export interface WebhookPayload {
  event: string;
  assignee: string;
  task: TaskInfo;
  timestamp: string;
}
