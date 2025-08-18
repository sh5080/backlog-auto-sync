---
id: task-005
title: 추첨 시스템 추가 개선 작업
status: To Do
assignee:
  - '@seok'
created_date: '2025-08-18 03:32'
updated_date: '2025-08-18 03:45'
labels:
  - backend
  - database
  - lottery
  - data-integrity
  - prisma
dependencies: []
priority: high
---

## Description

추첨 시스템의 데이터 무결성 강화 및 기능 개선 작업

## Tasks

- [ ] 추첨 이력/결과가 있으면 추첨 삭제 불가하도록 변경
  - Prisma 스키마에서 onDelete cascade 관계 제거/변경
  - Lottery와 LotteryResult 간의 관계 설정 수정
  - Lottery와 LotteryHistory 간의 관계 설정 수정
  - 참조 무결성을 통한 자동 삭제 방지 (API 로직 변경 없음)
