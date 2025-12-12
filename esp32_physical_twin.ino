/**
 * ESP32 피지컬 트윈 펌웨어
 * 웹 게임의 핸드포즈 입력을 물리 레고 배에 동기화
 * 
 * 하드웨어 구성:
 * - 서보모터 (G9): 배의 기수(yaw) 제어
 * - WS2812B 8×8 LED 매트릭스 (G20): 시각적 피드백
 * - MPU-6050: Phase 1에서는 비활성화, Phase 2에서 사용 예정
 * 
 * 전원: AA×4 배터리 팩 → 5V 레일 (서보 + LED 공용)
 */

#include <Servo.h>
#include <Adafruit_NeoPixel.h>

// 핀 정의 (MinArq ESP32 보드 기준)
#define SERVO_PIN 9   // G9 (PWM 가능 GPIO)
#define LED_PIN 20    // G20 (WS2812B 데이터)
#define LED_COUNT 64  // 8x8 매트릭스

// 서보 각도 범위 (실제 기구 테스트 후 조정 가능)
const int SERVO_MIN = 60;      // 왼쪽 최대 (기구 테스트 후 조정)
const int SERVO_CENTER = 90;   // 중립
const int SERVO_MAX = 120;     // 오른쪽 최대 (기구 테스트 후 조정)

// LED 밝기 범위 (전원 안정화를 위해 제한)
const int LED_BRIGHTNESS_MIN = 50;
const int LED_BRIGHTNESS_MAX = 100;  // 실제 운영 시 70-80 권장

// 하드웨어 객체
Servo servo;
Adafruit_NeoPixel ledMatrix(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// 상태 변수
float currentInput = 0.0;  // -1.0 ~ 1.0
bool handActive = false;
int currentServoAngle = SERVO_CENTER;
int targetServoAngle = SERVO_CENTER;

// MPU-6050: Phase 1에서는 비활성화 (reserved for Phase 2)
// 하드웨어는 연결되어 있으나 코드에서 사용하지 않음
// 향후 확장: 양방향 피드백, 실제 배 흔들림 기반 연출

void setup() {
  Serial.begin(115200);
  
  // 서보 초기화
  servo.attach(SERVO_PIN);
  servo.write(SERVO_CENTER);
  currentServoAngle = SERVO_CENTER;
  targetServoAngle = SERVO_CENTER;
  
  // LED 매트릭스 초기화
  ledMatrix.begin();
  ledMatrix.setBrightness(LED_BRIGHTNESS_MAX);
  ledMatrix.clear();
  ledMatrix.show();
  
  // 시작 애니메이션
  startupAnimation();
  
  Serial.println("ESP32 Physical Twin Ready");
  Serial.println("Phase 1: IMU unused, reserved for Phase 2");
  Serial.println("Serial: 115200 8-N-1");
  Serial.println("Waiting for Web Serial connection...");
}

void loop() {
  // 시리얼 데이터 읽기 (타임아웃 없이 빠르게)
  while (Serial.available() > 0) {
    static String jsonBuffer = "";
    char c = Serial.read();
    
    if (c == '\n') {
      // 완전한 라인 수신
      jsonBuffer.trim();
      if (jsonBuffer.length() > 0 && jsonBuffer.startsWith("{")) {
        parseInput(jsonBuffer);
      }
      jsonBuffer = "";  // 버퍼 초기화
    } else if (c >= 32 && c <= 126) {
      // 출력 가능한 문자만 버퍼에 추가 (노이즈 필터링)
      jsonBuffer += c;
      
      // 버퍼 오버플로우 방지 (최대 64바이트)
      if (jsonBuffer.length() > 64) {
        jsonBuffer = "";
      }
    }
  }
  
  // 서보 업데이트 (즉시 반응)
  updateServo();
  
  // LED 업데이트
  updateLED();
  
  delay(1);  // 1ms로 단축 (더 민감하게)
}

void parseInput(String json) {
  // JSON 파싱: {"x":-0.42,"active":1}
  int xIndex = json.indexOf("\"x\":");
  int activeIndex = json.indexOf("\"active\":");
  
  // 유효한 JSON 형식인지 확인
  if (xIndex < 0 || activeIndex < 0) {
    return;  // JSON 형식이 아니면 무시
  }
  
  // x 값 추출
  int xStart = xIndex + 4;
  int xEnd = json.indexOf(',', xStart);
  if (xEnd < 0) xEnd = json.indexOf('}', xStart);
  if (xEnd < 0) return;  // 유효하지 않은 형식
  
  String xStr = json.substring(xStart, xEnd);
  float xValue = xStr.toFloat();
  
  // 유효한 범위인지 확인
  if (isnan(xValue) || xValue < -2.0 || xValue > 2.0) {
    return;  // 비정상 값 무시
  }
  
  currentInput = constrain(xValue, -1.0, 1.0);
  
  // active 값 추출
  int activeStart = activeIndex + 9;
  int activeEnd = json.indexOf('}', activeStart);
  if (activeEnd < 0) return;  // 유효하지 않은 형식
  
  String activeStr = json.substring(activeStart, activeEnd);
  handActive = (activeStr.toInt() == 1);
  
  // 목표 서보 각도 계산
  if (handActive) {
    targetServoAngle = map(currentInput * 100, -100, 100, SERVO_MIN, SERVO_MAX);
    targetServoAngle = constrain(targetServoAngle, SERVO_MIN, SERVO_MAX);
  } else {
    targetServoAngle = SERVO_CENTER;
  }
  
  // 디버그: 수신된 데이터 로그 (활성화)
  Serial.print("RX: x=");
  Serial.print(currentInput, 3);
  Serial.print(", active=");
  Serial.print(handActive);
  Serial.print(", servo=");
  Serial.println(targetServoAngle);
}

void updateServo() {
  // 즉시 목표 각도로 이동 (확확 돌아가게)
  if (currentServoAngle != targetServoAngle) {
    currentServoAngle = targetServoAngle;
    servo.write(currentServoAngle);
  }
}

void updateLED() {
  if (!handActive) {
    // 손이 없으면 LED 끄기
    ledMatrix.clear();
    ledMatrix.show();
    return;
  }
  
  // 방향에 따른 색상 결정
  int r, g, b;
  
  if (currentInput < -0.1) {
    // 왼쪽: 파란 계열
    r = 0; g = 100; b = 255;
  } else if (currentInput > 0.1) {
    // 오른쪽: 주황/적 계열
    r = 255; g = 100; b = 0;
  } else {
    // 중립: 녹색
    r = 0; g = 255; b = 100;
  }
  
  // 입력 강도에 따른 밝기 조절 (|x|에 비례, 50-100 범위)
  float intensity = abs(currentInput);
  int brightness = map(intensity * 100, 0, 100, LED_BRIGHTNESS_MIN, LED_BRIGHTNESS_MAX);
  ledMatrix.setBrightness(brightness);
  
  // 패턴: 중앙에서 퍼지는 원형 파동
  float centerX = 3.5;
  float centerY = 3.5;
  
  for (int y = 0; y < 8; y++) {
    for (int x = 0; x < 8; x++) {
      float dist = sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
      float brightnessFactor = 1.0 - (dist / 5.0);
      brightnessFactor = constrain(brightnessFactor, 0, 1);
      
      int pixelIndex = y * 8 + x;
      ledMatrix.setPixelColor(pixelIndex, 
        (int)(r * brightnessFactor),
        (int)(g * brightnessFactor),
        (int)(b * brightnessFactor)
      );
    }
  }
  
  ledMatrix.show();
}

void startupAnimation() {
  // 시작 애니메이션: 중앙에서 확산 (녹색)
  for (int i = 0; i < 5; i++) {
    ledMatrix.clear();
    for (int y = 0; y < 8; y++) {
      for (int x = 0; x < 8; x++) {
        float dist = sqrt((x - 3.5) * (x - 3.5) + (y - 3.5) * (y - 3.5));
        if (dist <= i) {
          int pixelIndex = y * 8 + x;
          ledMatrix.setPixelColor(pixelIndex, 0, 255, 0);
        }
      }
    }
    ledMatrix.show();
    delay(100);
  }
  ledMatrix.clear();
  ledMatrix.show();
}

