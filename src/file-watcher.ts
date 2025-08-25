import * as chokidar from 'chokidar';
import * as path from 'path';
import { TaskParser } from './task-parser';
import { Webhook } from './webhook';
import { TaskInfo } from './types';

export class FileWatcher {
  private watcher!: chokidar.FSWatcher;
  private taskParser: TaskParser;
  private webhookManager: Webhook;
  private tasksDir: string;
  private fileStates: Map<string, TaskInfo> = new Map();

  constructor(tasksDir: string = 'backlog/tasks') {
    this.tasksDir = tasksDir;
    this.taskParser = new TaskParser(tasksDir);
    this.webhookManager = new Webhook();
    
    // 초기 파일 상태 로드
    this.loadInitialStates();
    
    // 파일 감시 시작
    this.startWatching();
  }

  private loadInitialStates(): void {
    const taskFiles = this.taskParser.getTaskFiles();
    for (const file of taskFiles) {
      const task = this.taskParser.parseTaskFile(file);
      if (task) {
        this.fileStates.set(file, task);
      }
    }
    console.log(`📁 초기 태스크 파일 ${taskFiles.length}개 로드 완료`);
  }

  private startWatching(): void {
    console.log(`👀 ${this.tasksDir} 폴더 감시 시작...`);
    
    // 태스크 파일 감시
    this.watcher = chokidar.watch(this.tasksDir, {
      ignored: /(^|[\/\\])\../, // 숨김 파일 무시
      persistent: true,
      ignoreInitial: true, // 초기 로드 시 이벤트 무시
      awaitWriteFinish: {
        stabilityThreshold: 1000, // 1초 후 안정화
        pollInterval: 100
      }
    });

    // 설정 파일 감시
    const configWatcher = chokidar.watch('backlog/config.yml', {
      persistent: true,
      ignoreInitial: true
    });

    configWatcher.on('change', () => {
      console.log('⚙️ 설정 파일 변경 감지, 웹훅 설정 재로드...');
      this.webhookManager.reloadConfigs();
    });

    // 파일 변경 이벤트
    this.watcher.on('change', (filePath) => {
      this.handleFileChange(filePath);
    });

    // 파일 생성 이벤트
    this.watcher.on('add', (filePath) => {
      this.handleFileAdd(filePath);
    });

    // 파일 삭제 이벤트
    this.watcher.on('unlink', (filePath) => {
      this.handleFileDelete(filePath);
    });

    // 에러 처리
    this.watcher.on('error', (error) => {
      console.error('❌ 파일 감시 오류:', error);
    });
  }

  private async handleFileChange(filePath: string): Promise<void> {
    if (!this.isTaskFile(filePath)) return;

    console.log(`🔄 파일 변경 감지: ${path.basename(filePath)}`);
    
    const currentTask = this.taskParser.parseTaskFile(filePath);
    if (!currentTask) return;

    const previousTask = this.fileStates.get(filePath);
    
    if (previousTask) {
      // 변경사항 분석
      const changes = this.analyzeChanges(previousTask, currentTask);
      
      // 변경사항이 있는 경우에만 웹훅 발송
      if (changes.length > 0) {
        currentTask.previousStatus = previousTask.status;
        currentTask.changes = changes;
        
        this.fileStates.set(filePath, currentTask);
        
        // 상태 변경 확인
        if (previousTask.status !== currentTask.status) {
          await this.sendWebhook(currentTask.assignee, 'task_status_changed', currentTask);
        } else {
          await this.sendWebhook(currentTask.assignee, 'task_updated', currentTask);
        }
      }
    } else {
      // 새 태스크
      this.fileStates.set(filePath, currentTask);
      await this.sendWebhook(currentTask.assignee, 'task_created', currentTask);
    }
  }

  private analyzeChanges(previous: TaskInfo, current: TaskInfo): string[] {
    const changes: string[] = [];
    
    // 제목 변경
    if (previous.title !== current.title) {
      changes.push(`제목: "${previous.title}" → "${current.title}"`);
    }
    
    // 상태 변경
    if (previous.status !== current.status) {
      changes.push(`상태: "${previous.status}" → "${current.status}"`);
    }
    
    // 담당자 변경
    if (previous.assignee !== current.assignee) {
      changes.push(`담당자: "${previous.assignee}" → "${current.assignee}"`);
    }
    
    return changes;
  }

  private async handleFileAdd(filePath: string): Promise<void> {
    if (!this.isTaskFile(filePath)) return;

    console.log(`🆕 새 파일 감지: ${path.basename(filePath)}`);
    
    const task = this.taskParser.parseTaskFile(filePath);
    if (task) {
      this.fileStates.set(filePath, task);
      await this.sendWebhook(task.assignee, 'task_created', task);
    }
  }

  private async handleFileDelete(filePath: string): Promise<void> {
    if (!this.isTaskFile(filePath)) return;

    console.log(`🗑️ 파일 삭제 감지: ${path.basename(filePath)}`);
    
    const previousTask = this.fileStates.get(filePath);
    if (previousTask) {
      this.fileStates.delete(filePath);
      // 삭제 이벤트는 웹훅 발송하지 않음 (선택사항)
    }
  }

  private isTaskFile(filePath: string): boolean {
    return filePath.endsWith('.md') && path.basename(filePath).startsWith('task-');
  }

  private async sendWebhook(assignee: string | string[], event: string, task: TaskInfo): Promise<void> {
    if (assignee === 'unknown') {
      console.log(`ℹ️ 담당자가 없는 태스크: ${task.id}`);
      return;
    }

    // 여러 담당자 처리
    if (Array.isArray(assignee)) {
      console.log(`📤 여러 담당자에게 웹훅 발송: [${assignee.join(', ')}] - ${event} - ${task.id}`);
      for (const person of assignee) {
        await this.webhookManager.sendWebhook(person, event, task);
      }
    } else {
      console.log(`📤 웹훅 발송: ${assignee} - ${event} - ${task.id}`);
      await this.webhookManager.sendWebhook(assignee, event, task);
    }
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      console.log('🛑 파일 감시 중지');
    }
  }

  getStatus(): { watching: boolean; fileCount: number } {
    return {
      watching: this.watcher !== undefined,
      fileCount: this.fileStates.size
    };
  }

  async testWebhook(assignee: string, event: string, message: string): Promise<void> {
    console.log(`🧪 테스트 웹훅 발송: ${assignee} - ${event}`);
    
    const testTask: TaskInfo = {
      id: 'test-task',
      title: message,
      status: 'Test',
      assignee,
      filePath: 'test.md',
      lastModified: new Date()
    };

    await this.webhookManager.sendWebhook(assignee, event, testTask);
  }
}
