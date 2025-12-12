# ESP32 펌웨어 업로드 스크립트
# PlatformIO를 사용하여 빌드 및 업로드

param(
    [string]$Port = "COM5",
    [switch]$Monitor = $false
)

Write-Host "ESP32 피지컬 트윈 펌웨어 업로드" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# PlatformIO 설치 확인
$pioInstalled = Get-Command pio -ErrorAction SilentlyContinue
if (-not $pioInstalled) {
    Write-Host "PlatformIO가 설치되지 않았습니다." -ForegroundColor Red
    Write-Host "설치 방법: pip install platformio" -ForegroundColor Yellow
    exit 1
}

# 포트 확인
Write-Host "`n포트 확인 중..." -ForegroundColor Yellow
$ports = Get-CimInstance Win32_SerialPort | Select-Object DeviceID, Description
$portFound = $ports | Where-Object { $_.DeviceID -eq $Port }

if (-not $portFound) {
    Write-Host "경고: $Port 포트를 찾을 수 없습니다." -ForegroundColor Yellow
    Write-Host "사용 가능한 포트:" -ForegroundColor Yellow
    $ports | ForEach-Object { Write-Host "  - $($_.DeviceID): $($_.Description)" }
    Write-Host "`n계속 진행하시겠습니까? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "Y" -and $response -ne "y") {
        exit 1
    }
}

# platformio.ini 포트 업데이트
$platformioIni = "esp32_firmware/platformio.ini"
if (Test-Path $platformioIni) {
    $content = Get-Content $platformioIni -Raw
    $content = $content -replace 'upload_port\s*=\s*COM\d+', "upload_port = $Port"
    Set-Content $platformioIni -Value $content -NoNewline
    Write-Host "포트 설정 업데이트: $Port" -ForegroundColor Green
}

# 디렉토리 이동
Push-Location esp32_firmware

try {
    # 빌드
    Write-Host "`n빌드 중..." -ForegroundColor Yellow
    pio run
    if ($LASTEXITCODE -ne 0) {
        Write-Host "빌드 실패!" -ForegroundColor Red
        exit 1
    }
    
    # 업로드
    Write-Host "`n업로드 중... (포트: $Port)" -ForegroundColor Yellow
    Write-Host "ESP32 보드의 BOOT 버튼을 누르고 있을 필요가 있을 수 있습니다." -ForegroundColor Cyan
    pio run --target upload
    if ($LASTEXITCODE -ne 0) {
        Write-Host "업로드 실패!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`n업로드 완료!" -ForegroundColor Green
    
    # 시리얼 모니터 실행
    if ($Monitor) {
        Write-Host "`n시리얼 모니터 시작..." -ForegroundColor Yellow
        Write-Host "종료하려면 Ctrl+C를 누르세요." -ForegroundColor Cyan
        pio device monitor
    }
} finally {
    Pop-Location
}

