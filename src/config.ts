import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { BacklogConfig } from './types';

export class Config {
  private configPath: string;
  private config: BacklogConfig | null = null;

  constructor(configPath: string = 'backlog/config.yml') {
    this.configPath = path.resolve(process.cwd(), configPath);
  }

  loadConfig(): BacklogConfig | null {
    try {
      console.log(`🔍 설정 파일 경로: ${this.configPath}`);
      console.log(`🔍 현재 작업 디렉토리: ${process.cwd()}`);
      
      if (!fs.existsSync(this.configPath)) {
        console.warn(`⚠️ 설정 파일을 찾을 수 없습니다: ${this.configPath}`);
        
        // 상대 경로로도 시도
        const relativePath = 'backlog/config.yml';
        console.log(`🔍 상대 경로 시도: ${relativePath}`);
        if (fs.existsSync(relativePath)) {
          console.log(`✅ 상대 경로로 설정 파일 발견: ${relativePath}`);
          this.configPath = relativePath;
        } else {
          return null;
        }
      }

      const fileContent = fs.readFileSync(this.configPath, 'utf-8');
      console.log(`📄 파일 내용 읽기 완료, 크기: ${fileContent.length} bytes`);
      
      this.config = yaml.load(fileContent) as BacklogConfig;
      console.log(`✅ 설정 파일 로드 완료: ${this.configPath}`);
      console.log(`📋 웹훅 설정:`, this.config?.webhooks);
      
      return this.config;
    } catch (error) {
      console.error(`❌ 설정 파일 로드 오류: ${this.configPath}`, error);
      return null;
    }
  }

  getWebhookConfigs(): Map<string, any> {
    if (!this.config || !this.config.webhooks.enabled) {
      return new Map();
    }

    const configs = new Map();
    for (const [assignee, config] of Object.entries(this.config.webhooks.assignees)) {
      configs.set(assignee, {
        assignee,
        ...config
      });
    }

    return configs;
  }

  isWebhooksEnabled(): boolean {
    return this.config?.webhooks?.enabled ?? false;
  }

  reloadConfig(): BacklogConfig | null {
    this.config = null;
    return this.loadConfig();
  }
}
