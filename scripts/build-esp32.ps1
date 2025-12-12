# ESP32 펌웨어 빌드 스크립트 (업로드 없이)

Write-Host "ESP32 피지컬 트윈 펌웨어 빌드" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# PlatformIO 설치 확인
$pioInstalled = Get-Command pio -ErrorAction SilentlyContinue
if (-not $pioInstalled) {
    Write-Host "PlatformIO가 설치되지 않았습니다." -ForegroundColor Red
    Write-Host "설치 방법: pip install platformio" -ForegroundColor Yellow
    exit 1
}

# 디렉토리 이동
Push-Location esp32_firmware

try {
    Write-Host "`n빌드 중..." -ForegroundColor Yellow
    pio run
    if ($LASTEXITCODE -ne 0) {
        Write-Host "빌드 실패!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "`n빌드 완료!" -ForegroundColor Green
    Write-Host "펌웨어 파일 위치: esp32_firmware/.pio/build/esp32dev/firmware.bin" -ForegroundColor Cyan
} finally {
    Pop-Location
}

