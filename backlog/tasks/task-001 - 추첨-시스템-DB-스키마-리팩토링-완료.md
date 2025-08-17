---
id: task-001
title: 추첨 시스템 DB 스키마 리팩토링 완료
status: Done
assignee: ['@seok']
created_date: '2025-08-17 13:23'
labels:
  - lottery
  - database
  - completed
dependencies: []
priority: high
---

## Description

추첨 시스템 DB 스키마를 개선하여 데이터 정합성과 관리 효율성을 향상시켰습니다.

### 주요 변경사항

1. **응모 기간 필드 이동**
   - `openStartAt`, `openEndAt` 필드를 `LotteryResult` 테이블에서 `Lottery` 테이블로 이동
   - 추첨 자체의 응모 기간을 명확히 정의

2. **CASCADE 삭제 옵션 추가**
   - `lotteryHist` → `lottery` 관계에 CASCADE 삭제 추가
   - `lotteryHistParticipant` → `lotteryHist` 관계에 CASCADE 삭제 추가
   - `lotteryResult` → `lottery` 관계에 CASCADE 삭제 추가
   - 데이터 정합성 보장 및 고아 레코드 방지

3. **마이그레이션 파일 생성**
   - 파일: `20250817095443_lottery/migration.sql`
   - 기존 데이터 보존하면서 스키마 변경 적용

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 응모 기간 필드를 Lottery 테이블로 이동 완료
- [x] #2 CASCADE 삭제 옵션을 모든 관련 FK에 적용 완료
- [x] #3 마이그레이션 파일 생성 및 적용 완료
- [x] #4 schema.prisma 파일 업데이트 완료
- [x] #5 schema.dbml 파일 동기화 완료
<!-- AC:END -->

## Notes

- 커밋: d91c076 (feat: 추첨 시스템 기획 정렬)
- 커밋: c3e8d2e (feat: 추첨 시스템 개선)
- 변경 파일:
  - packages/prisma/prisma/schema.prisma
  - packages/prisma/prisma/schema.dbml
  - packages/prisma/prisma/migrations/20250817095443_lottery/migration.sql