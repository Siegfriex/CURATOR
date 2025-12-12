# ESP32 로컬 빌드 및 업로드 가이드 (Arduino IDE 없이)

**버전**: 1.0  
**작성일**: 2024-12-11  
**대상**: Windows 환경

---

## 개요

Arduino IDE 없이 로컬에서 ESP32 펌웨어를 빌드하고 업로드하는 방법입니다. PlatformIO CLI를 사용합니다.

---

## 1. 사전 준비

### 1.1 Python 설치 확인

```powershell
python --version
```

**요구사항**: Python 3.7 이상

Python이 없으면 [python.org](https://www.python.org/downloads/)에서 다운로드

### 1.2 PlatformIO CLI 설치

```powershell
# pip로 설치 (권장)
pip install platformio

# 또는 pipx로 설치 (격리된 환경)
pipx install platformio
```

### 1.3 설치 확인

```powershell
pio --version
```

**예상 출력**: `PlatformIO Core, version 6.x.x`

---

## 2. 프로젝트 구조

```
esp32_firmware/
├── platformio.ini      # PlatformIO 설정 파일
├── src/
│   └── main.cpp       # 펌웨어 소스 코드
├── .gitignore
└── README.md
```

---

## 3. COM 포트 확인

### 3.1 포트 목록 확인

```powershell
Get-CimInstance Win32_SerialPort | Select Name, DeviceID, Description
```

**예상 결과**: `COM5` (USB 직렬 장치)

### 3.2 포트 설정 확인

```powershell
mode COM5
```

---

## 4. 빌드 및 업로드

### 방법 1: 스크립트 사용 (권장)

#### 빌드만 수행

```powershell
.\scripts\build-esp32.ps1
```

#### 빌드 + 업로드

```powershell
.\scripts\upload-esp32.ps1 -Port COM5
```

#### 업로드 + 시리얼 모니터

```powershell
.\scripts\upload-esp32.ps1 -Port COM5 -Monitor
```

### 방법 2: PlatformIO CLI 직접 사용

#### 1. 디렉토리 이동

```powershell
cd esp32_firmware
```

#### 2. 포트 설정 (platformio.ini 수정)

```ini
upload_port = COM5  ; 실제 포트로 변경
```

#### 3. 빌드

```powershell
pio run
```

#### 4. 업로드

```powershell
pio run --target upload
```

#### 5. 시리얼 모니터 (선택사항)

```powershell
pio device monitor
```

또는:

```powershell
pio run --target monitor
```

---

## 5. 전체 워크플로우 예시

```powershell
# 1. COM 포트 확인
Get-CimInstance Win32_SerialPort | Select DeviceID, Description

# 2. 빌드 및 업로드 (스크립트 사용)
.\scripts\upload-esp32.ps1 -Port COM5

# 3. 시리얼 모니터로 확인 (별도 터미널)
cd esp32_firmware
pio device monitor
```

**예상 출력**:
```
ESP32 Physical Twin Ready
Phase 1: IMU unused, reserved for Phase 2
Serial: 115200 8-N-1
Waiting for Web Serial connection...
```

---

## 6. 문제 해결

### PlatformIO가 설치되지 않은 경우

```powershell
pip install --upgrade pip
pip install platformio
```

### 포트를 찾을 수 없는 경우

```powershell
# 사용 가능한 포트 확인
pio device list

# 또는
Get-CimInstance Win32_SerialPort | Select DeviceID, Description
```

### 업로드 실패 시

1. **ESP32 보드 확인**
   - USB 케이블 연결 확인
   - 드라이버 설치 확인

2. **BOOT 모드 진입**
   - 일부 ESP32 보드는 업로드 시 BOOT 버튼을 눌러야 함
   - 업로드 시작 직전에 BOOT 버튼을 누르고 있기

3. **포트 점유 확인**
   - 다른 프로그램(Arduino IDE, 시리얼 모니터 등)이 포트를 사용 중인지 확인
   - 모두 닫고 다시 시도

### 빌드 에러: 라이브러리를 찾을 수 없음

```powershell
cd esp32_firmware
pio lib install "Adafruit NeoPixel"
pio run
```

### 시리얼 모니터가 작동하지 않는 경우

```powershell
# 포트 직접 확인
pio device monitor --port COM5 --baud 115200
```

---

## 7. 고급 사용법

### 펌웨어 파일만 생성 (업로드 없이)

```powershell
cd esp32_firmware
pio run
```

**출력 위치**: `.pio/build/esp32dev/firmware.bin`

### 펌웨어 지우기 (전체 삭제)

```powershell
cd esp32_firmware
pio run --target erase
```

### 환경 정리

```powershell
cd esp32_firmware
pio run --target clean
```

---

## 8. 스크립트 사용법 상세

### upload-esp32.ps1

```powershell
# 기본 사용 (COM5)
.\scripts\upload-esp32.ps1

# 포트 지정
.\scripts\upload-esp32.ps1 -Port COM3

# 업로드 후 시리얼 모니터 실행
.\scripts\upload-esp32.ps1 -Port COM5 -Monitor
```

### build-esp32.ps1

```powershell
# 빌드만 수행
.\scripts\build-esp32.ps1
```

---

## 9. 웹 연결 테스트

펌웨어 업로드 완료 후:

1. Chrome/Edge에서 게임 실행
2. HandController HUD에서 "CONNECT ESP32" 버튼 클릭
3. COM5 포트 선택
4. "PHYSICAL TWIN [ACTIVE]" 표시 확인
5. 핸드포즈 입력 테스트

---

## 10. 참고 문서

- [ESP32_PHYSICAL_TWIN_SETUP.md](./ESP32_PHYSICAL_TWIN_SETUP.md) - 하드웨어 설정 가이드
- [ESP32_PHYSICAL_TWIN_SPEC.md](./ESP32_PHYSICAL_TWIN_SPEC.md) - 최종 명세서
- [PlatformIO 공식 문서](https://docs.platformio.org/)

---

**문서 종료**

