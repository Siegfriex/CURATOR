# ESP32 피지컬 트윈 펌웨어 (PlatformIO)

Arduino IDE 없이 로컬에서 ESP32 펌웨어를 빌드하고 업로드하는 가이드입니다.

## 사전 요구사항

### 1. Python 설치 확인

```powershell
python --version
```

Python 3.7 이상이 필요합니다.

### 2. PlatformIO CLI 설치

```powershell
# pip로 설치
pip install platformio

# 또는 pipx로 설치 (권장)
pipx install platformio
```

### 3. 설치 확인

```powershell
pio --version
```

## 빌드 및 업로드

### 1. COM 포트 확인

```powershell
Get-CimInstance Win32_SerialPort | Select Name, DeviceID, Description
```

예상 결과: `COM5` (USB 직렬 장치)

### 2. platformio.ini 포트 설정

`esp32_firmware/platformio.ini` 파일에서 `upload_port`를 실제 포트로 수정:

```ini
upload_port = COM5  ; 실제 포트 번호로 변경
```

### 3. 빌드

```powershell
cd esp32_firmware
pio run
```

### 4. 업로드

```powershell
pio run --target upload
```

### 5. 시리얼 모니터 (선택사항)

```powershell
pio device monitor
```

또는:

```powershell
pio run --target monitor
```

## 전체 워크플로우

```powershell
# 1. 프로젝트 디렉토리로 이동
cd esp32_firmware

# 2. 빌드
pio run

# 3. 업로드
pio run --target upload

# 4. 시리얼 모니터 (별도 터미널에서)
pio device monitor
```

## 문제 해결

### 포트를 찾을 수 없는 경우

```powershell
# 사용 가능한 포트 확인
pio device list
```

### 업로드 실패 시

1. ESP32 보드의 BOOT 버튼 확인
2. USB 케이블 확인
3. 드라이버 설치 확인

### 라이브러리 설치 문제

```powershell
# 라이브러리 수동 설치
pio lib install "Adafruit NeoPixel"
```

## 스크립트 자동화 (선택사항)

빌드 및 업로드를 자동화하는 스크립트를 만들 수 있습니다:

```powershell
# build-and-upload.ps1
cd esp32_firmware
pio run --target upload
pio device monitor
```

