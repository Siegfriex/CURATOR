# ESP32 피지컬 트윈 빠른 시작 가이드

## 1분 요약

```powershell
# 1. PlatformIO 설치 (최초 1회)
pip install platformio

# 2. COM 포트 확인
Get-CimInstance Win32_SerialPort | Select DeviceID, Description

# 3. 펌웨어 업로드
npm run esp32:upload

# 4. 웹 게임에서 연결
# Chrome → 게임 실행 → "CONNECT ESP32" → COM5 선택
```

---

## 상세 단계

### 1. PlatformIO 설치 (최초 1회)

```powershell
pip install platformio
pio --version  # 설치 확인
```

### 2. COM 포트 확인

```powershell
Get-CimInstance Win32_SerialPort | Select DeviceID, Description
```

**예상 결과**: `COM5` (USB 직렬 장치)

### 3. 펌웨어 업로드

#### 방법 A: npm 스크립트 사용 (권장)

```powershell
npm run esp32:upload
```

스크립트가 자동으로:
- 포트 확인
- 빌드 수행
- 업로드 실행

#### 방법 B: PowerShell 스크립트 직접 실행

```powershell
.\scripts\upload-esp32.ps1 -Port COM5
```

#### 방법 C: PlatformIO CLI 직접 사용

```powershell
cd esp32_firmware
# platformio.ini에서 upload_port = COM5 설정
pio run --target upload
```

### 4. 웹 게임 연결 테스트

1. Chrome/Edge에서 게임 실행
2. HandController HUD에서 "CONNECT ESP32" 버튼 클릭
3. 포트 선택 다이얼로그에서 COM5 선택
4. "PHYSICAL TWIN [ACTIVE]" 표시 확인
5. 핸드포즈 입력 테스트

---

## 문제 해결

### PlatformIO가 설치되지 않은 경우

```powershell
python --version  # Python 3.7+ 필요
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

1. USB 케이블 확인
2. ESP32 드라이버 확인
3. 다른 프로그램(Arduino IDE 등)이 포트를 사용 중인지 확인

---

## 다음 단계

- [ESP32_LOCAL_BUILD_GUIDE.md](./ESP32_LOCAL_BUILD_GUIDE.md) - 상세 빌드 가이드
- [ESP32_PHYSICAL_TWIN_SETUP.md](./ESP32_PHYSICAL_TWIN_SETUP.md) - 하드웨어 설정
- [ESP32_PHYSICAL_TWIN_SPEC.md](./ESP32_PHYSICAL_TWIN_SPEC.md) - 기술 명세

