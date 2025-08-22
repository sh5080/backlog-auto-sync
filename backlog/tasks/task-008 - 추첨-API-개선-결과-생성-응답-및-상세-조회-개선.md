---
id: task-008
title: 추첨 API 개선 - 결과 생성 응답 및 상세 조회 개선
status: Done
assignee:
  - '@seok'
created_date: '2025-08-20 15:44'
updated_date: '2025-08-20 15:46'
labels:
  - api
  - lottery
  - enhancement
dependencies: []
priority: high
---

## Description
추첨 시스템 API에 대한 두 가지 개선 사항:
1. 추첨 결과 생성 시 응답에 생성된 결과의 ID를 포함하여 딥링크 복사 기능 지원
2. 추첨 상세 조회 API의 results 필드에 등록자(admin) 정보 추가하여 UI 표시 지원

## Tasks
- [x] 추첨 결과 생성 API (`lotteryResultCreate`) 응답 스키마 수정
- [x] 생성된 추첨 결과의 ID를 반환하도록 구현
- [x] 추첨 상세 조회 API (`lotteryGet`)의 results 필드에 admin 정보 include
- [x] 스키마 정의 확인 및 타입 일치 검증

## Acceptance Criteria
- [x] 추첨 결과 생성 후 응답에 `{ id: string }` 형태로 결과 ID 반환
- [x] 추첨 상세 조회 시 각 result 항목에 admin (id, email, name) 정보 포함
- [x] 기존 API 호환성 유지
- [x] 타입 안정성 보장

## Changes Made
### 1. `/apps/emapp/src/router/externalAdmin-lottery.ts`
- Line 642: output 스키마를 `z.void()`에서 `z.object({ id: z.string().uuid() })`로 변경
- Lines 672-693: 생성된 lotteryResult의 id를 반환하도록 수정
- Lines 150-152: results 조회 시 admin 정보를 include하도록 변경

### 2. `/apps/emapp/src/router/ai/schemas-lottery.ts`
- `adminLotteryDetailOutputSchema`의 results 배열에 admin 필드 이미 정의됨 (확인 완료)

## Notes
- 딥링크 복사 기능 구현을 위해 결과 생성 직후 ID가 필요했음
- UI에서 추첨 결과 등록자 정보 표시를 위한 요구사항
- 모든 변경사항은 기존 API와 하위 호환성 유지
- 완료일: 2025-08-20
