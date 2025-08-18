# LG 멤버십 통합 태스크 매니징 시스템

## 프로젝트 개요

- **프로젝트명**: LG 멤버십
- **관리 도구**: backlog.md CLI
- **목적**: 통합 태스크 매니징 및 프로젝트 관리

## 주요 기능

### 쿠폰 시스템
- 멤버십 등급별 차별화된 혜택 제공 (VIP, Premium, Basic)
- 쿠폰 발급/사용 이력 관리 및 통계
- 유효기간 및 사용 조건 자동 관리
- 프로모션 연계 쿠폰 발행 및 타겟팅
- 실시간 쿠폰 상태 추적 및 알림

### 예약 시스템
- LG 프리미엄 라운지 예약 관리 (강남, 광화문, 부산)
- LG 아트센터 공연/전시 예약 서비스
- 실시간 예약 가능 시간 조회 및 자동 배정
- 예약 변경/취소 및 푸시 알림 기능
- QR 코드 기반 체크인 지원
- 노쇼(No-show) 방지 및 패널티 시스템

### 추첨 시스템
- 공정한 랜덤 추첨 알고리즘 적용 (Mersenne Twister)
- 이벤트별 당첨 확률 설정 및 가중치 적용
- 중복 당첨 방지 로직 및 블랙리스트 관리
- 당첨자 선정 및 자동 알림 발송
- 추첨 결과 검증 및 감사 로그
- 실시간 추첨 진행 상황 모니터링

### 메시징 시스템
- Push, Email, SMS, 카카오톡 멀티채널 통합 발송
- 대량 메시지 발송 지원 (초당 10만 건 처리)
- 개인화 메시지 및 템플릿 관리
- 발송 이력 추적 및 통계 분석
- 실패 메시지 자동 재발송 및 폴백 처리
- A/B 테스트 및 발송 최적화

## 디렉토리 구조

```
backlog-lg/                  # 태스크 매니징 루트
├── CLAUDE.md               # 이 파일 (프로젝트 가이드)
├── projs/                  # 심볼릭 링크로 연결된 실제 프로젝트들
│   ├── EMAPP-LGE-Repo      → ../../EMAPP-LGE-Repo (메인 애플리케이션)
│   ├── EMAPP-LGE-Admin-Repo → ../../EMAPP-LGE-Admin-Repo (관리자 포털)
│   ├── automata_signal     → ../../automata_signal (멀티채널 메시징 플랫폼)
│   ├── tf-monorepo         → ../../tf-monorepo (이커머스 플랫폼)
│   └── harmony-mono        → ../../harmony-mono (하모니 모노레포)
├── backlog/                # backlog.md 태스크 관리
│   ├── config.yml          # 백로그 설정
│   ├── tasks/              # 활성 태스크
│   ├── drafts/             # 초안 태스크
│   ├── completed/          # 완료된 태스크
│   ├── archive/            # 보관된 태스크
│   ├── decisions/          # 의사결정 기록
│   └── docs/               # 팀 정보 및 프로젝트 문서
└── docs/                   # Mintlify 기술 문서
    ├── guides/             # 시스템 가이드
    │   ├── emapp-system.mdx
    │   └── emapp-api-guidelines.mdx
    ├── lottery-system/     # 추첨 시스템 문서
    │   ├── lottery-erd.mdx
    │   └── lottery-api-reference.mdx
    └── docs.json           # Mintlify 네비게이션 설정
```

## Backlog.md CLI 명령어

- `backlog tasks create <title>` - 새 태스크 생성
- `backlog tasks list` - 태스크 목록 조회
- `backlog tasks edit <id>` - 태스크 수정
- `backlog tasks view <id>` - 태스크 상세 보기
- `backlog board` - 칸반 보드 보기
- `backlog browser` - 웹 인터페이스 실행 (포트: 6420)
- `backlog overview` - 프로젝트 통계 및 현황
- `backlog draft <title>` - 초안 생성

## 태스크 관리 워크플로우

1. **Draft** → **Task** → **In Progress** → **Done** → **Completed**
2. 태스크 파일 형식: `task-XXX - 태스크명.md`
3. 태스크 상태: To Do, In Progress, Done
4. ID 형식: 3자리 zero-padded (001, 002, ...)

## 팀 구성

- @josh: PM
- @liz: 기획
- @seunghwan: 개발
- @minq: 개발
- @be: 디자인
- @seok: 개발
- @jeyon: 개발

## 프로젝트 정보

### EMAPP-LGE-Repo (메인 애플리케이션)

- Node.js + TypeScript
- tRPC + Fastify
- PostgreSQL + Prisma
- 모바일 앱 백엔드 API

### EMAPP-LGE-Admin-Repo (관리자 포털)

- React + TypeScript
- 관리자 웹 인터페이스
- 쿠폰, 예약, 추첨 관리

### automata_signal (멀티채널 메시징 플랫폼)

- Elixir + Phoenix LiveView
- Push, Email, SMS, 카카오톡 통합 메시징 API 서버
- 초당 10만 건 대량 메시지 처리
- 멀티테넌시 지원 (프로젝트별 완전한 데이터 격리)

### tf-monorepo/signal (Signal 관리 UI)

- Next.js + React + TypeScript
- automata_signal의 프론트엔드 관리 인터페이스
- 메시지 발송, 템플릿 관리, 통계 대시보드
- Proxy API를 통한 automata_signal SDK Server 연동

### harmony-mono (하모니 모노레포)

- 모노레포 프로젝트
- 상세 기술 스택 및 기능 (추가 조사 필요)

## 프로젝트 간 관계

### Signal 시스템 아키텍처

**automata_signal**과 **tf-monorepo/signal**은 백엔드-프론트엔드 관계로 통합된 메시징 시스템을 구성합니다:

- **automata_signal (백엔드)**

  - 멀티채널 메시지 발송 엔진 (Push/Email/SMS/카카오톡)
  - SDK Server API 제공 (API Key 인증)
  - 실시간 대량 메시지 처리 (초당 10만 건)
  - 멀티테넌시 및 프로젝트별 데이터 격리

- **tf-monorepo/signal (프론트엔드)**
  - automata_signal의 웹 관리 인터페이스
  - 통신 구조: Signal UI → Proxy API (JWT) → SDK Server API (API Key)
  - 메시지 작성/발송, 템플릿 관리, 통계 대시보드 제공

## 문서 관리

- **backlog/docs/**: 팀 정보, 의사결정 기록
- **docs/**: Mintlify 기반 기술 문서 (MDX 형식)
- **docs.json**: Mintlify 네비게이션 구성

## 개발 가이드라인

1. 모든 태스크는 backlog CLI로 생성 및 관리
2. 코드 작업은 projs/ 하위의 심볼릭 링크된 프로젝트에서 진행
3. 기술 문서는 docs/ 디렉토리에서 Mintlify 형식으로 작성
4. 커밋 메시지에 태스크 ID 참조 (예: `task-001: 추첨 시스템 개선`)
5. 태스크 완료 시 backlog CLI로 상태 업데이트

## 백로그 설정 (config.yml)

- 프로젝트명: LG 멤버십
- 기본 상태: To Do
- Git 훅 바이패스: true
- 자동 커밋: false
- 브라우저 포트: 6420
