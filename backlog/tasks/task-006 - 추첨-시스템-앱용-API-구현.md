---
id: task-006
title: 추첨 시스템 앱용 API 구현
status: Done
assignee:
  - '@seok'
created_date: '2025-08-19 08:16'
updated_date: '2025-08-19 08:18'
labels:
  - lottery
  - api
  - app
dependencies: []
priority: high
---

## Description
LG 멤버십 모바일 앱에서 추첨 결과를 조회할 수 있는 API 엔드포인트 구현

## 구현 내용

### 1. 추첨 결과 목록 API
- **엔드포인트**: `POST /external/app/lottery/results`
- **특징**:
  - 인증 불필요 (publicProcedure)
  - 현재 진행 중(IN_PROGRESS) 상태의 추첨 결과만 표시
  - 페이지네이션 지원 (기본 20개)
  - displayStartAt 내림차순 기본 정렬
  - createProgressStatusFilter 함수 활용

### 2. 추첨 결과 상세 API
- **엔드포인트**: `GET /external/app/lottery/result/get`
- **특징**:
  - 인증 불필요 (publicProcedure)
  - 추첨 결과 상세 정보 제공
  - 당첨자 정보를 경품별로 그룹화하여 표시
  - 개인정보 마스킹 처리 (이름 첫글자/마지막글자만, 전화번호 중간 마스킹)
  - 경품명 기준 한글 정렬

## 코드 개선 사항

### OrderBy 상수 수정
- `LotteryHistOrderBy`: totalCandidates → totalEntries (실제 DB 필드명)
- `LotteryResultOrderBy`: openStartAt/openEndAt → displayStartAt/displayEndAt

### 스키마 정리
- 모든 스키마를 `schemas-lottery.ts`로 통합
- 네이밍 규칙 통일:
  - `appLotteryResultOutputItemSchema` (목록 아이템)
  - `appLotteryResultDetailOutputSchema` (상세)
- paginationSchema 활용으로 코드 중복 제거

### 유틸리티 함수 활용
- `createProgressStatusFilter`: 표시 기간 필터링 로직 재사용
- `convertLotteryResultOrderBy`: 정렬 변환 함수
- `createLotteryError`: 에러 처리 통일

## 파일 변경 사항
- 생성: `router/externalApp-lottery.ts`
- 수정: `router/externalApp.ts` (라우터 연결)
- 수정: `router/ai/schemas-lottery.ts` (앱용 스키마 추가)
- 수정: `router/ai/consts-lottery.ts` (OrderBy 상수 수정)

## 테스트 포인트
- [ ] 추첨 결과 목록 조회 (진행 중인 것만 표시되는지)
- [ ] 페이지네이션 동작
- [ ] 정렬 기능 (displayStartAt 기준)
- [ ] 추첨 결과 상세 조회
- [ ] 당첨자 정보 마스킹 확인
- [ ] 경품별 그룹화 정확성
