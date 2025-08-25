import { WebhookConfig, TaskInfo, TeamsMessage } from './types';
import { Config } from './config';

export class Webhook {
  private configs: Map<string, WebhookConfig> = new Map();
  private configLoader: Config;

  constructor() {
    this.configLoader = new Config();
    this.loadConfigs();
  }

  private loadConfigs(): void {
    console.log('🔧 웹훅 설정 로드 시작...');
    
    // 먼저 설정 파일 로드
    const config = this.configLoader.loadConfig();
    if (!config) {
      console.warn('⚠️ 설정 파일을 로드할 수 없습니다.');
      return;
    }
    
    const webhookConfigs = this.configLoader.getWebhookConfigs();
    console.log(`📋 웹훅 설정 개수: ${webhookConfigs.size}`);
    
    if (webhookConfigs.size === 0) {
      console.warn('⚠️ 웹훅 설정을 찾을 수 없습니다. config.yml을 확인해주세요.');
      return;
    }

    for (const [assignee, config] of webhookConfigs) {
      this.configs.set(assignee, config as WebhookConfig);
      const type = config.type || 'channel';
      console.log(`✅ 웹훅 설정 로드: ${assignee} (${type}) -> ${config.url}`);
    }
  }

  reloadConfigs(): void {
    console.log('🔄 웹훅 설정 재로드 중...');
    this.configs.clear();
    this.loadConfigs();
  }

  async sendWebhook(assignee: string, event: string, task: TaskInfo): Promise<boolean> {
    console.log(`🔍 웹훅 설정 검색: assignee="${assignee}"`);
    const config = this.configs.get(assignee);
    
    if (!config) {
      console.log(`❌ 웹훅 설정을 찾을 수 없음: ${assignee}`);
      console.log(`📋 사용 가능한 assignee:`, Array.from(this.configs.keys()));
      return false;
    }
    
    if (!config.events.includes(event)) {
      console.log(`❌ 이벤트가 지원되지 않음: ${event}`);
      console.log(`📋 지원 이벤트:`, config.events);
      return false;
    }

    try {
      console.log(`✅ 웹훅 설정 확인 완료: ${assignee} -> ${config.url}`);
      
      // 각 담당자별로 개별 메시지 생성
      const payload = this.createPayload(event, assignee, task);
      
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log(`✅ 웹훅 발송 성공: ${assignee} - ${event}`);
        return true;
      } else {
        console.error(`❌ 웹훅 발송 실패: ${assignee} - ${event} (${response.status})`);
        return false;
      }
    } catch (error) {
      console.error(`❌ 웹훅 발송 오류: ${assignee} - ${event}`, error);
      return false;
    }
  }

  private createPayload(event: string, assignee: string, task: TaskInfo): TeamsMessage {
    const emoji = this.getEventEmoji(event);
    const statusEmoji = this.getStatusEmoji(task.status);
    
    let text = `${emoji} **Backlog.md ${this.getEventText(event)}**\n\n`;
    
    // 각 담당자별로 개별 메시지 (해당 담당자만 멘션)
    text += `**담당자:** ${assignee}\n`;
    text += `**태스크:** ${task.id} - ${task.title}\n`;
    text += `**상태:** ${statusEmoji} ${task.status}\n`;
    text += `**파일:** ${task.filePath}\n`;
    text += `**시간:** ${task.lastModified.toLocaleString('ko-KR')}\n\n`;
    
    // 변경사항 표시
    if (task.changes && task.changes.length > 0) {
      text += `**📝 변경사항:**\n`;
      task.changes.forEach(change => {
        text += `• ${change}\n`;
      });
      text += `\n`;
    }
    
    text += `파일이 저장되었습니다! 🎯`;

    // MS Teams는 attachments 배열을 기대함
    return {
      text,
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            type: "AdaptiveCard",
            version: "1.0",
            body: [
              {
                type: "TextBlock",
                text: text
              }
            ]
          }
        }
      ]
    };
  }

  private getEventEmoji(event: string): string {
    switch (event) {
      case 'task_created': return '🆕';
      case 'task_updated': return '🔄';
      case 'task_status_changed': return '📊';
      default: return '📝';
    }
  }

  private getStatusEmoji(status: string): string {
    switch (status.toLowerCase()) {
      case 'to do': return '📋';
      case 'in progress': return '🔄';
      case 'done': return '✅';
      default: return '📌';
    }
  }

  private getEventText(event: string): string {
    switch (event) {
      case 'task_created': return '새 태스크 생성';
      case 'task_updated': return '태스크 업데이트';
      case 'task_status_changed': return '태스크 상태 변경';
      default: return '태스크 변경';
    }
  }
}
