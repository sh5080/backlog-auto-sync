---
id: task-005
title: 추첨 시스템 추가 개선 작업
status: Done
assignee:
  - '@seok'
created_date: '2025-08-18 03:32'
updated_date: '2025-08-18 17:30'
labels:
  - backend
  - database
  - lottery
  - data-integrity
  - prisma
  - performance
  - gdpr
dependencies: []
priority: high
---

## Description

추첨 시스템의 데이터 무결성 강화 및 기능 개선 작업

## Tasks

### 완료된 작업

- [x] 데이터베이스 스키마 변경 (`schema.prisma`)
  - LotteryHist: `totalCandidates` → `totalEntries`로 필드명 변경
  - LotteryHist: `allowsDuplicateEntry` 필드 추가 (추첨 실행별 중복 참여 허용 설정)
  - LotteryHistParticipant: `isWinner`, `isBanned` 필드 제거
  - LotteryHistParticipant: `status` (LotteryParticipantStatus enum) 필드 추가
  - LotteryHistParticipant: `entryCount` 필드 추가 (참여 횟수 기록)
  - 새로운 enum 추가: LotteryParticipantStatus (WINNER, NOT_WINNER, EXCLUDED_PREV_WINNER, EXCLUDED_BLACKLIST)

- [x] 추첨 실행 로직 개선 (`utils-lottery.ts`)
  - filterParticipants: 참여자별 entryCount 집계 로직 추가
  - filterParticipants: Map 자료구조 사용으로 O(n²) → O(n) 성능 개선
  - saveLotteryResults: 각 memNo당 하나의 레코드만 생성하도록 정규화
  - saveLotteryResults: entryCount로 중복 참여 횟수 표현
  - performLottery: 중복 당첨 방지 로직 최적화 (Map 사용)
  - excludedCount 계산 방식 변경: 회원 수 → 참여 횟수

- [x] 타입 및 스키마 업데이트
  - types-lottery.ts: ILotteryExecutionResult의 `totalCandidates` → `totalEntries`
  - schemas-lottery.ts: 모든 관련 Zod 스키마 업데이트
  - schemas-lottery.ts: status 필드 추가, isWinner 제거
  - schemas-lottery.ts: entryCount 필드 추가

- [x] API 엔드포인트 수정 (`externalAdmin-lottery.ts`)
  - 쿼리 조건: `isWinner` → `status`로 변경
  - LotteryHistParticipant 조회 로직 업데이트

- [x] 엑셀 내보내기 기능 수정 (`bullmq-excel.ts`)
  - LotteryParticipantStatus import 추가
  - 헤더 변경: "당첨 여부" → "상태", "참여 횟수" 컬럼 추가
  - 필터 조건: `isWinner` → `status`로 변경
  - i18next.t() 사용하여 status 라벨 국제화
  - entryCount 필드 추가

- [x] 추첨 참여자 자동 삭제 Cron Job 추가 (`bullmq.ts`)
  - cronLotteryCleanup: 매일 KST 00:45 실행
  - openEndAt + retentionDays 지난 참여자 데이터 자동 삭제
  - PostgreSQL INTERVAL 연산 활용한 Raw Query 최적화
  - spacetime 라이브러리 사용으로 타임존 안전 처리
  - 개인정보만 삭제, 통계 데이터(LotteryHist)는 유지
  - GDPR 등 개인정보보호 규정 준수

- [x] 추첨 삭제 방지 기능 구현 (`schema.prisma`)
  - LotteryHist의 `onDelete: Cascade` 제거 → 기본값 Restrict 적용
  - LotteryResult의 `onDelete: Cascade` 제거 → 기본값 Restrict 적용
  - LotteryHistParticipant의 `onDelete: Cascade` 제거 → 기본값 Restrict 적용
  - 마이그레이션 생성 및 적용: `remove-cascade-on-lottery-relations`
  - 이제 추첨에 이력이나 결과가 있으면 DB 레벨에서 삭제 차단

## 주요 개선 효과

1. **성능 최적화**
   - Map 자료구조 사용으로 O(n²) → O(n) 개선
   - 중복 데이터 구조 제거
   - Raw Query로 데이터베이스 레벨 필터링

2. **데이터 구조 개선**
   - 참여자당 하나의 레코드로 정규화
   - 상태 관리를 enum으로 명확화
   - 중복 참여 횟수 추적 가능

3. **유연성 증가**
   - 추첨 실행별로 중복 참여 허용 여부 설정 가능
   - 다양한 제외 사유 추적 가능

4. **개인정보 보호**
   - 자동 데이터 삭제로 GDPR 등 규정 준수
   - 통계 데이터는 유지하면서 개인정보만 삭제
