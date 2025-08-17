# LG 멤버십 통합 태스크 매니징 시스템

## 프로젝트 개요

- **프로젝트명**: LG 멤버십
- **관리 도구**: backlog.md CLI
- **목적**: 통합 태스크 매니징 및 프로젝트 관리

## 디렉토리 구조

```
backlog-lg/                  # 태스크 매니징 루트
├── CLAUDE.md               # 이 파일 (프로젝트 가이드)
├── projs/                  # 심볼릭 링크로 연결된 실제 프로젝트들
│   ├── EMAPP-LGE-Repo      → ../../EMAPP-LGE-Repo (메인 애플리케이션)
│   └── EMAPP-LGE-Admin-Repo → ../../EMAPP-LGE-Admin-Repo (관리자 포털)
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

### 주요 기능

- **쿠폰 시스템**: 멤버십 등급별 혜택 관리
- **예약 시스템**: 프리미엄 라운지, 아트센터 예약
- **추첨 시스템**: 공정한 경품 추첨 및 당첨자 관리

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
