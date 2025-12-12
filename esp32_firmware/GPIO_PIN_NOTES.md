# ESP32-C3 GPIO 핀 매핑 참고사항

## ⚠️ 중요

현재 코드에서 사용하는 GPIO 핀 번호가 ESP32-C3에 맞는지 확인이 필요합니다.

## 현재 코드 설정

```cpp
#define SERVO_PIN 9   // G9 (PWM 가능 GPIO)
#define LED_PIN 20    // G20 (WS2812B 데이터)
```

## ESP32-C3 GPIO 제약사항

### 사용 불가능한 GPIO
- **GPIO 19, 20, 21**: 존재하지 않음
- **GPIO 0**: 부트 모드 (부팅 시 LOW = 다운로드 모드)
- **GPIO 9**: USB D- (USB 기능 사용 시 제한)

### 권장 GPIO 핀
- **GPIO 2, 3, 4, 5**: 가장 안전한 GPIO (부트 모드 영향 없음)
- **GPIO 6, 7**: SPI 기능 있으나 GPIO로 사용 가능
- **GPIO 8**: 사용 가능

## MinArq 보드 확인 필요

MinArq HC-SR04 ESP32 확장보드의 실제 GPIO 매핑을 확인해야 합니다:
- 보드 문서 확인
- 물리적 핀 번호 확인
- G9, G20이 ESP32-C3의 어떤 GPIO에 매핑되는지 확인

## 수정 예시

만약 GPIO 20이 사용 불가능하다면:

```cpp
// 옵션 1: 안전한 GPIO 사용
#define SERVO_PIN 2   // GPIO 2
#define LED_PIN 3     // GPIO 3

// 옵션 2: 보드의 실제 매핑에 맞게 수정
#define SERVO_PIN 9   // 보드 G9가 실제로 매핑된 GPIO
#define LED_PIN 8     // 보드 G20이 실제로 매핑된 GPIO (예시)
```

## 테스트 방법

1. 각 GPIO 핀을 개별적으로 테스트
2. 서보 동작 확인
3. LED 동작 확인
4. Web Serial 통신 확인

