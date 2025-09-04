# Wisdom Whispers - 명언 PWA 애플리케이션

위대한 마음이 당신에게 영감을 주는 일일 명언 애플리케이션입니다.

## 🌟 주요 기능

- **일일 명언**: 매일 새로운 영감을 주는 명언 제공
- **명언 저장**: 마음에 드는 명언 저장 및 관리
- **즐겨찾기**: 중요한 명언을 즐겨찾기로 표시
- **소셜 공유**: Twitter, Facebook, LinkedIn으로 명언 공유
- **다국어 지원**: 한국어/영어 지원
- **PWA 지원**: 오프라인에서도 사용 가능한 Progressive Web App
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **다크 모드**: 사용자 선호도에 따른 다크 모드 지원

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/motivation-quote.git
cd motivation-quote

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
npm start
```

브라우저에서 http://localhost:8080 으로 접속

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 🛠 기술 스택

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Webpack 5
- **Styling**: CSS Modules
- **PWA**: Service Worker & Web Manifest
- **State Management**: React Context API & Hooks
- **Storage**: LocalStorage for offline persistence

## 📱 PWA 기능

이 애플리케이션은 Progressive Web App으로:

- **오프라인 지원**: Service Worker를 통한 오프라인 사용 가능
- **설치 가능**: 홈 화면에 추가하여 네이티브 앱처럼 사용
- **자동 업데이트**: 새 버전 자동 감지 및 업데이트
- **캐싱 전략**: 최적화된 캐싱으로 빠른 로딩 속도

## 📂 프로젝트 구조

```
src/
├── components/      # React 컴포넌트
│   ├── SavedQuotesDrawer/  # 저장된 명언 관리
│   ├── LanguageToggle/     # 언어 전환
│   ├── ConfirmDialog/      # 확인 다이얼로그
│   └── QuoteModal/         # 명언 상세 보기
├── contexts/       # React Context
│   └── I18nContext/        # 다국어 지원
├── hooks/          # Custom Hooks
│   ├── useSavedQuotes/     # 명언 저장 관리
│   └── useCopyToClipboard/ # 클립보드 복사
├── services/       # 비즈니스 로직
│   ├── quote.service/      # 명언 API
│   ├── i18n.service/       # 국제화
│   └── savedQuotes.service/# 저장 관리
├── types/          # TypeScript 타입 정의
└── utils/          # 유틸리티 함수
```

## 🎨 주요 컴포넌트

### App Component
메인 애플리케이션 컴포넌트로 전체 레이아웃과 상태 관리

### SavedQuotesDrawer
저장된 명언을 보여주고 관리하는 슬라이드 패널

### LanguageToggle
한국어/영어 언어 전환 토글

### QuoteModal
명언 상세 보기 모달

## 🌐 다국어 지원

현재 지원 언어:
- 🇰🇷 한국어 (기본값)
- 🇺🇸 영어

## 💾 데이터 저장

모든 데이터는 브라우저의 LocalStorage에 저장되어 오프라인에서도 사용 가능합니다:
- 저장된 명언
- 즐겨찾기
- 언어 설정
- 테마 설정

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👨‍💻 개발자

- GitHub: [@yeongkyo-in](https://github.com/yeongkyo-in)

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움으로 만들어졌습니다:
- React
- TypeScript
- Webpack