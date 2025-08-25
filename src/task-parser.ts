import { TaskInfo } from './types';
import * as fs from 'fs';
import * as path from 'path';

export class TaskParser {
  private tasksDir: string;

  constructor(tasksDir: string = 'backlog/tasks') {
    this.tasksDir = tasksDir;
  }

  parseTaskFile(filePath: string): TaskInfo | null {
    try {
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const content = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath, '.md');
      
      // 태스크 ID 추출
      const idMatch = fileName.match(/task-(\d+)/);
      if (!idMatch) {
        return null;
      }

      const taskId = idMatch[1];
      
      // 제목 추출 (첫 번째 # 제목)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : fileName.replace(/^task-\d+\s*-\s*/, '');
      
      // 상태 추출
      const statusMatch = content.match(/^status:\s*(.+)$/m);
      const status = statusMatch ? statusMatch[1].trim() : 'Unknown';
      
      // 담당자 추출 - 더 강력한 정규식 사용
      const assigneeMatch = content.match(/^assignee:\s*([\s\S]*?)(?=\n(?:[a-zA-Z_][a-zA-Z0-9_]*:|$))/m);
      let assignee: string | string[] = 'unknown';
      
              if (assigneeMatch) {
          const assigneeValue = assigneeMatch[1].trim();
          console.log(`🔍 원본 assignee 값: "${assigneeValue}"`);
          console.log(`🔍 원본 assignee 길이: ${assigneeValue.length}`);
          console.log(`🔍 원본 assignee 라인 수: ${assigneeValue.split('\n').length}`);
        
        // 여러 줄의 담당자 처리
        if (assigneeValue.includes('-')) {
          // 배열 형태: - '@seunghwan' - '@minq'
          console.log(`🔍 배열 형태 담당자 감지, 파싱 시작...`);
          
          const lines = assigneeValue.split('\n');
          console.log(`🔍 분리된 라인들:`, lines);
          
          const assignees = lines
            .map(line => line.trim())
            .filter(line => line.startsWith('-'))
            .filter(line => line.length > 1)  // 빈 라인 제거
            .map(line => {
              console.log(`🔍 처리 중인 라인: "${line}"`);
              const cleaned = line
                .replace(/^-\s*/, '')  // - 제거
                .replace(/^'(.+)'$/, '$1')  // '내용' 제거
                .replace(/^"(.+)"$/, '$1')  // "내용" 제거
                .replace(/^@(.+)$/, '$1');  // @ 제거
              console.log(`🔍 정리된 라인: "${cleaned}"`);
              return cleaned;
            })
            .filter(name => name.length > 0);
          
          assignee = assignees;
          console.log(`✅ 정리된 assignees: [${assignees.join(', ')}]`);
        } else {
          // 단일 담당자
          assignee = assigneeValue
            .replace(/^@/, '')
            .replace(/^\[(.+)\]$/, '$1')
            .replace(/^'(.+)'$/, '$1')
            .replace(/^"(.+)"$/, '$1');
          
          console.log(`✅ 정리된 assignee: "${assignee}"`);
        }
      }

      // 파일 정보
      const stats = fs.statSync(filePath);
      
      return {
        id: `task-${taskId}`,
        title,
        status,
        assignee,
        filePath: path.relative(process.cwd(), filePath),
        lastModified: stats.mtime
      };
    } catch (error) {
      console.error(`❌ 태스크 파일 파싱 오류: ${filePath}`, error);
      return null;
    }
  }

  getTaskFiles(): string[] {
    try {
      if (!fs.existsSync(this.tasksDir)) {
        return [];
      }

      return fs.readdirSync(this.tasksDir)
        .filter(file => file.endsWith('.md') && file.startsWith('task-'))
        .map(file => path.join(this.tasksDir, file));
    } catch (error) {
      console.error(`❌ 태스크 파일 목록 읽기 오류:`, error);
      return [];
    }
  }

  getTaskByAssignee(assignee: string): TaskInfo[] {
    const taskFiles = this.getTaskFiles();
    const tasks: TaskInfo[] = [];

    for (const file of taskFiles) {
      const task = this.parseTaskFile(file);
      if (task && task.assignee === assignee) {
        tasks.push(task);
      }
    }

    return tasks;
  }
}
