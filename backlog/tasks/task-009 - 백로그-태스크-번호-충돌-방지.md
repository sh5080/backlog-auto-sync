---
id: task-009
title: 백로그 태스크 번호 충돌 방지
status: 'Done'
assignee:
  - '@seunghwan'
created_date: '2025-08-22 13:00'
updated_date: '2025-08-22 14:00'
labels: []
dependencies: []
priority: medium
---

## 설명

백로그 태스크 번호의 충돌을 방지하기 위해 GitHub Workflow를 구성하여 CI/CD 파이프라인에서 자동으로 태스크 번호를 관리합니다.

## 작업 내용

- [x] 태스크 번호 자동 조정을 위한 GitHub Workflow 스크립트 구성
- [x] 파일 수정 시간을 기준으로 1차 정렬하고, 시간이 동일할 경우 파일명을 기준으로 2차 정렬하여 순서 결정
