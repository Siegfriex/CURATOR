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

#include <Arduino.h>
#include <ESP32Servo.h>
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

// 함수 선언 (forward declaration)
void parseInput(String json);
void updateServo();
void updateLED();
void startupAnimation();

void setup() {
  // 시리얼 포트 초기화 (8-N-1, 115200 baud)
  Serial.begin(115200);
  Serial.setTimeout(100);  // 읽기 타임아웃 100ms
  delay(1000);  // 시리얼 포트 안정화 대기
  
  // 초기화 메시지 (여러 번 출력하여 연결 확인)
  for (int i = 0; i < 3; i++) {
    Serial.println("=== ESP32 Physical Twin Initialization ===");
    Serial.print("Servo pin: GPIO ");
    Serial.println(SERVO_PIN);
    Serial.print("LED pin: GPIO ");
    Serial.println(LED_PIN);
    Serial.print("Serial: 115200 baud, 8-N-1, timeout=");
    Serial.print(Serial.getTimeout());
    Serial.println("ms");
    if (i < 2) delay(500);
  }
  
  // 서보 초기화 및 확인
  if (servo.attach(SERVO_PIN) != -1) {
    Serial.println("✓ Servo attached successfully");
    servo.write(SERVO_CENTER);
    delay(500);
    currentServoAngle = SERVO_CENTER;
    targetServoAngle = SERVO_CENTER;
    Serial.print("✓ Servo initialized to center: ");
    Serial.print(SERVO_CENTER);
    Serial.println(" deg");
  } else {
    Serial.println("✗ ERROR: Servo attach failed!");
  }
  
  // 서보모터 각도 범위 테스트 (시작 시 1회)
  Serial.println("Testing servo range...");
  servo.write(SERVO_MIN);
  delay(500);
  Serial.print("  MIN: ");
  Serial.print(SERVO_MIN);
  Serial.println(" deg");
  
  servo.write(SERVO_CENTER);
  delay(500);
  Serial.print("  CENTER: ");
  Serial.print(SERVO_CENTER);
  Serial.println(" deg");
  
  servo.write(SERVO_MAX);
  delay(500);
  Serial.print("  MAX: ");
  Serial.print(SERVO_MAX);
  Serial.println(" deg");
  
  servo.write(SERVO_CENTER);
  delay(500);
  Serial.println("✓ Servo test complete");
  
  // LED 매트릭스 초기화
  ledMatrix.begin();
  ledMatrix.setBrightness(LED_BRIGHTNESS_MAX);
  ledMatrix.clear();
  ledMatrix.show();
  Serial.println("✓ LED matrix initialized");
  
  // 시작 애니메이션
  startupAnimation();
  
  Serial.println("==========================================");
  Serial.println("ESP32 Physical Twin Ready");
  Serial.println("Phase 1: IMU unused, reserved for Phase 2");
  Serial.println("Serial: 115200 8-N-1");
  Serial.println("Waiting for Web Serial connection...");
  Serial.println("==========================================");
}

void loop() {
  static unsigned long lastHeartbeat = 0;
  static unsigned long lastDataCheck = 0;
  unsigned long now = millis();
  
  // 5초마다 하트비트 출력 (데이터 수신 여부 확인)
  if (now - lastHeartbeat > 5000) {
    Serial.print("HEARTBEAT: available=");
    Serial.print(Serial.available());
    Serial.print(", millis=");
    Serial.println(now);
    lastHeartbeat = now;
  }
  
  // 1초마다 시리얼 버퍼 상태 확인 (데이터가 들어오는지 확인)
  if (now - lastDataCheck > 1000) {
    int availableBytes = Serial.available();
    if (availableBytes > 0) {
      Serial.print("BUFFER_CHECK: available=");
      Serial.print(availableBytes);
      Serial.print(", first_byte=");
      if (availableBytes > 0) {
        int firstByte = Serial.peek();
        Serial.print(firstByte);
        Serial.print(" ('");
        Serial.print((char)firstByte);
        Serial.println("')");
      }
    }
    lastDataCheck = now;
  }
  
  // 시리얼 데이터 읽기 (타임아웃 없이 빠르게)
  int availableBytes = Serial.available();
  if (availableBytes > 0) {
    Serial.print("RX_START: bytes=");
    Serial.println(availableBytes);
  }
  
  while (Serial.available() > 0) {
    static String jsonBuffer = "";
    char c = Serial.read();
    
    // 첫 바이트와 마지막 바이트만 로그 (너무 많은 로그 방지)
    if (jsonBuffer.length() == 0) {
      Serial.print("RX_FIRST: ");
      Serial.print((int)c);
      Serial.print(" ('");
      Serial.print(c);
      Serial.println("')");
    }
    
    if (c == '\n' || c == '\r') {
      // 완전한 라인 수신 (\r\n 또는 \n 처리)
      if (c == '\r' && Serial.peek() == '\n') {
        // \r\n 쌍인 경우 \n도 읽어서 버림
        Serial.read();
      }
      
      jsonBuffer.trim();
      if (jsonBuffer.length() > 0) {
        // 원시 데이터 로그 (디버그용)
        Serial.print("RAW RX: [");
        Serial.print(jsonBuffer.length());
        Serial.print(" bytes] ");
        Serial.println(jsonBuffer);
        
        if (jsonBuffer.startsWith("{")) {
          parseInput(jsonBuffer);
        } else {
          Serial.print("ERR: Not JSON format, first char='");
          Serial.print(jsonBuffer.charAt(0));
          Serial.print("', content='");
          Serial.print(jsonBuffer.substring(0, min(20, (int)jsonBuffer.length())));
          Serial.println("'");
        }
      }
      jsonBuffer = "";  // 버퍼 초기화
    } else if (c >= 32 && c <= 126) {
      // 출력 가능한 문자만 버퍼에 추가 (노이즈 필터링)
      jsonBuffer += c;
      
      // 버퍼 오버플로우 방지 (최대 128바이트로 증가)
      if (jsonBuffer.length() > 128) {
        Serial.print("ERR: Buffer overflow (>128 bytes), content: ");
        Serial.println(jsonBuffer);
        jsonBuffer = "";
      }
    } else {
      // 제어 문자는 무시하되 첫 번째만 로그
      static bool loggedControlChar = false;
      if (!loggedControlChar && jsonBuffer.length() == 0) {
        Serial.print("RX_SKIP_CONTROL: 0x");
        Serial.println((int)c, HEX);
        loggedControlChar = true;
      }
      if (c == '\n' || c == '\r') {
        loggedControlChar = false;
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
  // 데이터 수신 확인 로그 (중복 제거 - 이미 loop에서 출력됨)
  // Serial.print("PARSE: ");
  // Serial.println(json);
  
  // JSON 파싱: {"x":-0.42,"active":1}
  int xIndex = json.indexOf("\"x\":");
  int activeIndex = json.indexOf("\"active\":");
  
  // 유효한 JSON 형식인지 확인
  if (xIndex < 0 || activeIndex < 0) {
    Serial.print("ERR: Invalid JSON format - xIndex=");
    Serial.print(xIndex);
    Serial.print(", activeIndex=");
    Serial.println(activeIndex);
    Serial.print("  Received: ");
    Serial.println(json);
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
    Serial.print("ERR: Invalid x value: ");
    Serial.println(xValue);
    return;  // 비정상 값 무시
  }
  
  currentInput = constrain(xValue, -1.0, 1.0);
  
  // active 값 추출
  int activeStart = activeIndex + 9;
  int activeEnd = json.indexOf('}', activeStart);
  if (activeEnd < 0) return;  // 유효하지 않은 형식
  
  String activeStr = json.substring(activeStart, activeEnd);
  handActive = (activeStr.toInt() == 1);
  
  // 목표 서보 각도 계산 (더 정확한 매핑)
  if (handActive) {
    // -1.0 ~ 1.0을 SERVO_MIN ~ SERVO_MAX로 선형 매핑
    float normalized = (currentInput + 1.0) / 2.0; // 0.0 ~ 1.0으로 정규화
    targetServoAngle = (int)(SERVO_MIN + normalized * (SERVO_MAX - SERVO_MIN));
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
  Serial.print(targetServoAngle);
  Serial.print(", current=");
  Serial.println(currentServoAngle);
}

void updateServo() {
  // 즉시 목표 각도로 이동 (확확 돌아가게)
  if (currentServoAngle != targetServoAngle) {
    int oldAngle = currentServoAngle;
    currentServoAngle = targetServoAngle;
    servo.write(currentServoAngle);
    
    // 디버그: 서보 각도 변경 로그 (상세)
    Serial.print("SERVO: ");
    Serial.print(oldAngle);
    Serial.print(" -> ");
    Serial.print(currentServoAngle);
    Serial.print(" deg (target: ");
    Serial.print(targetServoAngle);
    Serial.print(", input: ");
    Serial.print(currentInput, 3);
    Serial.println(")");
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
