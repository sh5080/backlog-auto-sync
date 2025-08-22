---
id: task-010
title: 백로그 태스크 번호 충돌 방지
status: 'In Progress'
assignee:
  - '@seunghwan'
created_date: '2025-08-22 13:00'
updated_date: '2025-08-22 13:37'
labels: []
dependencies: []
priority: medium
---

## 설명

백로그를 git에 푸시하다보면 여러 사람들이 사용하기 때문에 task-number 의 number가 겹칠 수 있습니다. 이를 보정해서 task-number가 1씩 더해지도록 하는 기능이 필요합니다.

## 작업 내용

- [ ] 여러 사용자가 동시에 태스크를 추가할 때 태스크 번호가 겹치지 않도록 하는 스크립트 또는 기능 구현
- [ ] 태스크 생성 시 현재 `backlog/tasks` 디렉토리의 파일 목록을 읽어 가장 높은 번호를 찾고, 1을 더한 번호를 새 태스크 번호로 할당
- [ ] 충돌 발생 시 사용자에게 알림 및 해결 방안 제시 (선택 사항)