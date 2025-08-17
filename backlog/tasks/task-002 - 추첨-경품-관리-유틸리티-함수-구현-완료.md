---
id: task-002
title: 추첨 경품 관리 유틸리티 함수 구현 완료
status: Done
assignee: ['@seok']
created_date: '2025-08-17 13:25'
labels:
  - lottery
  - utility
  - completed
dependencies: []
priority: high
---

## Description

추첨 시스템의 경품 관리를 위한 핵심 유틸리티 함수들을 구현하여 경품 사용 현황 추적, 추첨 가능 여부 확인, 노출 상태 관리 기능을 추가했습니다.

### 구현된 함수

1. **calculatePrizeUsage**
   - 경품별 사용 현황 계산
   - 이전 추첨 이력에서 사용된 경품 수량 집계
   - 남은 경품 수량 및 소진 여부 추적
   - 반환: `IPrizeUsage[]` (경품명, 총수량, 사용수량, 잔여수량, 소진여부)

2. **canExecuteLottery**
   - 추첨 실행 가능 여부 확인
   - 모든 경품이 소진되었는지 검증
   - 최소 1개 이상의 경품이 남아있을 때만 true 반환

3. **getDisplayStatus**
   - 추첨 결과의 노출 상태 계산
   - 반환값: 'UPCOMING' | 'IN_PROGRESS' | 'ENDED'
   - displayStartAt/displayEndAt 기준으로 상태 판단

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 calculatePrizeUsage 함수 구현 완료
- [x] #2 canExecuteLottery 함수 구현 완료
- [x] #3 getDisplayStatus 함수 구현 완료
- [x] #4 IPrizeUsage 타입 정의 완료
- [x] #5 유틸리티 함수 JSDoc 문서화 완료
<!-- AC:END -->

## Notes

- 커밋: d91c076 (feat: 추첨 시스템 기획 정렬)
- 커밋: c3e8d2e (feat: 추첨 시스템 개선)
- 변경 파일: apps/emapp/src/router/ai/utils-lottery.ts
- 추가된 코드: 84줄