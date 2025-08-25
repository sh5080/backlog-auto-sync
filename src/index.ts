import { FileWatcher } from './file-watcher';

console.log('🚀 Backlog.md 웹훅 시스템 시작...');

// 파일 감시기 시작
const fileWatcher = new FileWatcher();

// 프로세스 종료 시 정리
process.on('SIGINT', () => {
  console.log('\n🛑 종료 신호 수신...');
  fileWatcher.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 종료 신호 수신...');
  fileWatcher.stop();
  process.exit(0);
});


console.log('✅ 웹훅 시스템이 실행 중입니다. Ctrl+C로 종료하세요.');
console.log('👀 backlog/tasks 폴더의 변경사항을 실시간으로 감시합니다...');
console.log('🌐 Backlog UI는 별도로 "backlog browser" 명령어를 사용하세요.');
