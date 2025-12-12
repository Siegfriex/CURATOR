# ESP32 피지컬 트윈 최종 명세서

**버전**: 1.0  
**작성일**: 2024-12-11  
**상태**: Phase 1 완료

---

## 1. 시스템 개요

### 1.1 목표
웹 게임의 핸드포즈 입력을 물리 레고 배에 실시간 동기화하여 피지컬 트윈 구현

### 1.2 아키텍처
```
MediaPipe 핸드 트래킹
    ↓ normalizedInput (-1.0 ~ 1.0)
    ├─→ Three.js 게임 (웹 배 움직임)
    └─→ ESP32 (물리 배 움직임)
        ├─→ 서보모터 (G9): 배 기수 제어
        └─→ WS2812B LED (G20): 시각적 피드백
```

---

## 2. 하드웨어 명세

### 2.1 보드 구성
- **메인보드**: MinArq HC‑SR04 ESP32 기반 확장보드
- **전원**: AA × 4 배터리 팩 (약 6V)
  - 5V 레일: WS2812B + 서보모터
  - 3.3V 레일: ESP32 + MPU-6050 (Phase 1 미사용)

### 2.2 핀 매핑

| 하드웨어 | GPIO | 용도 | 전원 |
|---------|------|------|------|
| 서보 신호 | G9 | PWM 서보 제어 | 5V 레일 |
| WS2812B 데이터 | G20 | LED 매트릭스 제어 | 5V 레일 |
| MPU-6050 SDA | G5 | I2C 데이터 (Phase 1 미사용) | 3.3V |
| MPU-6050 SCL | G6 | I2C 클럭 (Phase 1 미사용) | 3.3V |

### 2.3 서보 제어 명세
- **각도 범위**: 60° (왼쪽) ~ 90° (중립) ~ 120° (오른쪽)
- **이동 속도**: 루프당 2도씩 점진적 이동 (전류 피크 완화)
- **PWM 주기**: 약 50Hz (서보 라이브러리 기본값)

### 2.4 LED 매트릭스 명세
- **패널**: WS2812B 8×8 (64개 픽셀)
- **밝기 범위**: 50-100 (실제 운영 시 70-80 권장)
- **패턴**: 중앙에서 퍼지는 원형 파동
- **색상 매핑**:
  - 왼쪽 (x < -0.1): 파란 계열 (0, 100, 255)
  - 중립 (-0.1 ≤ x ≤ 0.1): 녹색 (0, 255, 100)
  - 오른쪽 (x > 0.1): 주황/적 계열 (255, 100, 0)

---

## 3. 통신 프로토콜

### 3.1 시리얼 설정
- **Baud Rate**: 115200
- **Data Bits**: 8
- **Parity**: None
- **Stop Bits**: 1
- **프로토콜**: 텍스트 기반 JSON (한 줄 단위)

### 3.2 메시지 형식

**웹 → ESP32**:
```json
{"x":-0.42,"active":1}\n
```

- `x`: 정규화된 입력값 (-1.0 ~ 1.0)
- `active`: 손 감지 여부 (0 또는 1)
- 전송 주기: 최대 30fps (33ms 간격)
- 값 차이 0.01 미만이면 전송 생략

### 3.3 통신 플로우

```
HandController.tsx
    ↓ onResults() → normalizedInput 계산
    ↓ syncShipPosition(x, active) 호출
    ↓
esp32PhysicalTwin.ts
    ↓ Web Serial API write()
    ↓
ESP32 펌웨어
    ↓ Serial.readStringUntil('\n')
    ↓ parseInput() → 서보/LED 업데이트
```

---

## 4. 소프트웨어 명세

### 4.1 프론트엔드 파일 구조

```
curatorgame/
├── services/
│   └── esp32PhysicalTwin.ts    # ESP32 브리지 서비스
└── HandController.tsx           # 핸드 트래킹 + ESP32 통합
```

### 4.2 주요 함수

#### ESP32PhysicalTwin 클래스
- `connect()`: Web Serial API로 ESP32 연결
- `disconnect()`: 연결 해제
- `syncShipPosition(x, active)`: 핸드포즈 입력 동기화 (Fire-and-forget)
- `connected`: 연결 상태 (readonly)
- `lastError`: 마지막 에러 정보 (readonly)

#### HandController 컴포넌트
- `handleESP32Connect()`: ESP32 연결 핸들러
- `handleESP32Disconnect()`: ESP32 해제 핸들러
- `onResults()`: MediaPipe 결과 처리 + ESP32 동기화

### 4.3 ESP32 펌웨어 함수

- `setup()`: 하드웨어 초기화
- `loop()`: 메인 루프 (시리얼 읽기, 서보/LED 업데이트)
- `parseInput()`: JSON 파싱 및 입력값 추출
- `updateServo()`: 서보 각도 업데이트 (부드러운 움직임)
- `updateLED()`: LED 패턴 업데이트
- `startupAnimation()`: 시작 애니메이션

---

## 5. 에러 처리

### 5.1 연결 에러 타입

| 타입 | 원인 | 메시지 |
|------|------|--------|
| `NOT_SUPPORTED` | 브라우저 미지원 | "Web Serial API를 지원하지 않는 브라우저입니다..." |
| `PORT_OCCUPIED` | 포트 점유 | "포트가 다른 프로그램에서 사용 중입니다..." |
| `PERMISSION_DENIED` | 권한 거부 | "포트 접근 권한이 거부되었습니다." |
| `DEVICE_DISCONNECTED` | 장치 분리 | "ESP32가 연결되지 않았습니다..." |
| `UNKNOWN` | 기타 | "연결 실패: [에러 메시지]" |

### 5.2 에러 표시
- 에러 발생 시 HandController HUD에 빨간색 토스트 메시지 표시
- 3초 후 자동 사라짐

---

## 6. 성능 최적화

### 6.1 전송 최적화
- 전송 주기 제한: 33ms (30fps)
- 값 차이 임계값: 0.01 미만이면 전송 생략
- Fire-and-forget 패턴: 게임 플레이 블로킹 방지

### 6.2 전원 최적화
- LED 밝기 제한: 50-100 범위
- 서보 이동 속도 제한: 루프당 2도씩 이동
- 손 미감지 시 LED 끄기

---

## 7. 테스트 체크리스트

### 7.1 하드웨어 테스트
- [ ] COM 포트 확인 (PowerShell: `Get-CimInstance Win32_SerialPort`)
- [ ] 서보 각도 범위 테스트 (60-90-120도)
- [ ] LED 매트릭스 동작 테스트
- [ ] 전원 안정성 테스트 (서보+LED 동시 구동)

### 7.2 소프트웨어 테스트
- [ ] ESP32 미연결 상태에서 게임 정상 동작
- [ ] ESP32 연결 후 핸드포즈 동기화 확인
- [ ] 빠른 좌우 제스처 시 안정성 확인
- [ ] 연결 끊김 시 에러 처리 확인
- [ ] 브라우저 호환성 확인 (Chrome/Edge)

---

## 8. Phase 2 확장 계획

### 8.1 MPU-6050 활성화
- I2C 통신 초기화 (`Wire.begin()`)
- 가속도계/자이로스코프 데이터 읽기
- 실제 배 흔들림 측정

### 8.2 양방향 통신
- ESP32 → 웹: 센서 데이터 전송
- 웹 게임에 물리 배 상태 반영

### 8.3 고급 연출
- 실제 배 흔들림 기반 파티클 효과
- 센서 피드백 기반 게임 난이도 조절

---

## 9. 참고 문서

- [ESP32_PHYSICAL_TWIN_SETUP.md](./ESP32_PHYSICAL_TWIN_SETUP.md) - 설정 가이드
- [1211psd.md](./1211psd.md) - 프로젝트 시스템 설계서

---

**문서 종료**

