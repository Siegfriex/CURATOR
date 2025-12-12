# ESP32 피지컬 트윈 설정 가이드

## 하드웨어 구성

### 보드 및 전원
- **메인보드**: MinArq HC‑SR04 ESP32 기반 확장보드
- **전원**: AA × 4 배터리 팩 (약 6V) → 온보드 레귤레이터를 통해 5V / 3.3V 분배
- **5V 레일**: WS2812B 8×8 매트릭스, 서보모터 구동용
- **3.3V 레일**: ESP32 모듈, MPU‑6050 (Phase 1에서는 미사용)

### 센서/액추에이터 배선

#### 1. 서보모터 (BITBRICK)
- **신호선**: G9 (ESP32 PWM 출력)
- **전원**: 5V 레일
- **GND**: 공통 GND
- **각도 범위**: 60° (왼쪽) ~ 90° (중립) ~ 120° (오른쪽)

#### 2. WS2812B 8×8 RGB LED 매트릭스
- **데이터선**: G20
- **전원**: 5V 레일
- **GND**: 공통 GND
- **밝기 범위**: 50-100 (실제 운영 시 70-80 권장)

#### 3. MPU‑6050 (Phase 1 비활성화)
- **하드웨어**: VCC=3.3V, GND, SDA=G5, SCL=G6에 연결 유지
- **펌웨어**: Phase 1에서는 사용하지 않음 (reserved for Phase 2)

## Windows COM 포트 확인

### 1. 현재 COM 포트 목록 확인

```powershell
# PowerShell
Get-CimInstance Win32_SerialPort | Select Name, DeviceID, Description
```

또는:

```powershell
mode
```

**예상 결과**: `COM5` (USB 직렬 장치)

### 2. COM5 세부 정보 확인

```powershell
mode COM5
```

**참고**: Windows `mode` 명령은 현재 설정만 표시합니다. Web Serial API는 연결 시 자동으로 다음 설정으로 변경합니다:
- **Baud**: 115200 (펌웨어와 일치)
- **Parity**: None
- **Data bits**: 8
- **Stop bits**: 1

**수동 설정 (선택사항)**:
```powershell
mode COM5 BAUD=115200 PARITY=N DATA=8 STOP=1
```

### 3. 시리얼 통신 테스트

펌웨어 업로드 후 PowerShell에서:

```powershell
# PowerShell 7 이상
$port = new-Object System.IO.Ports.SerialPort COM5,115200,None,8,one
$port.Open()
$port.ReadLine()  # "ESP32 Physical Twin Ready" 메시지 확인
$port.Close()
```

## 펌웨어 업로드

### 1. Arduino IDE 설정

1. **보드 매니저 URL 추가**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```

2. **ESP32 보드 설치**:
   - Tools → Board → Boards Manager
   - "ESP32" 검색 → "esp32 by Espressif Systems" 설치

3. **보드 선택**:
   - Tools → Board → ESP32 Arduino → "ESP32 Dev Module"

4. **포트 선택**:
   - Tools → Port → COM5 (또는 실제 포트 번호)

5. **라이브러리 설치**:
   - Sketch → Include Library → Manage Libraries
   - "Adafruit NeoPixel" 검색 → 설치

### 2. 펌웨어 업로드

1. `esp32_physical_twin.ino` 파일 열기
2. Upload 버튼 클릭
3. 업로드 완료 후 시리얼 모니터 열기 (115200 baud)
4. "ESP32 Physical Twin Ready" 메시지 확인

## 웹 연결 테스트

### 1. Chrome/Edge에서 게임 실행

1. 게임 페이지 로드
2. HandController HUD 표시 확인
3. "CONNECT ESP32" 버튼 클릭
4. 포트 선택 다이얼로그에서 COM5 선택
5. "PHYSICAL TWIN [ACTIVE]" 표시 확인

### 2. 핸드포즈 테스트

1. 웹캠 앞에서 손을 왼쪽으로 이동
   - 웹 배: 왼쪽으로 이동
   - 물리 배: 서보가 왼쪽(60도)으로 기울어짐
   - LED: 파란색 표시

2. 손을 오른쪽으로 이동
   - 웹 배: 오른쪽으로 이동
   - 물리 배: 서보가 오른쪽(120도)으로 기울어짐
   - LED: 주황/적색 표시

3. 손을 중앙으로 이동
   - 웹 배: 중앙으로 이동
   - 물리 배: 서보가 중립(90도) 위치
   - LED: 녹색 표시

4. 손을 치움
   - 웹 배: 중립 위치
   - 물리 배: 서보가 중립으로 복귀
   - LED: 꺼짐

## 통신 프로토콜

### 웹 → ESP32 메시지 형식

```json
{"x":-0.42,"active":1}\n
```

- `x`: 정규화된 입력값 (-1.0 ~ 1.0)
- `active`: 손 감지 여부 (0 또는 1)
- 전송 주기: 최대 30fps (33ms 간격)
- 값 차이 0.01 미만이면 전송 생략

### 시리얼 설정

- **Baud Rate**: 115200
- **Data Bits**: 8
- **Parity**: None
- **Stop Bits**: 1

## 문제 해결

### 포트가 보이지 않는 경우

1. USB 케이블 확인
2. ESP32 드라이버 설치 확인
3. 장치 관리자에서 "USB 직렬 장치" 확인

### 연결 실패 시

1. **포트 점유 오류**: Arduino IDE 시리얼 모니터 닫기
2. **권한 거부**: Chrome에서 포트 접근 권한 확인
3. **브라우저 호환성**: Chrome/Edge만 지원 (Firefox/Safari 미지원)

### 서보가 움직이지 않는 경우

1. 서보 각도 범위 확인 (60-90-120도)
2. 실제 기구 구조에 맞게 SERVO_MIN/MAX 조정
3. 전원 공급 확인 (5V 레일)

### LED가 켜지지 않는 경우

1. 데이터선(G20) 연결 확인
2. 전원(5V) 및 GND 확인
3. LED 밝기 설정 확인 (50-100 범위)

## Phase 2 확장 계획

- MPU-6050 활성화
- 양방향 통신 (ESP32 → 웹)
- 실제 배 흔들림 기반 연출
- 센서 피드백 통합

