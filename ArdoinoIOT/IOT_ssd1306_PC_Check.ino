#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define SCREEN_ADDRESS 0x3C
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define FONT_SIZE1 1
#define FONT_SIZE2 2
#define FONT_COLOR WHITE
#define DISTANCE_TOP 27
#define DISTANCE_LEFT 0
#define LOGO_DISTANCE_TOP DISTANCE_TOP +  26
#define LOGO_DISTANCE_LEFT DISTANCE_LEFT + 68
// On an arduino UNO:       A4(SDA), A5(SCL)
// On an arduino MEGA 2560: 20(SDA), 21(SCL)
// On an arduino LEONARDO:   2(SDA),  3(SCL)
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

String str = "ABCDEF";
int i = 0;


void setup() {
  Serial.begin(9600);

  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) { Serial.println(F("SSD1306 allocation failed")); for(;;); }
  display.setRotation(2);
  delay(2000);
  
  display.clearDisplay();
  display.setTextSize(FONT_SIZE2);
  display.setTextColor(FONT_COLOR);
  display.setCursor(DISTANCE_LEFT, DISTANCE_TOP);
  display.println(str);// Display static text
  display.display(); 
}

void loop() {
  lcdDisply();
}


void lcdDisply(){
  display.clearDisplay();
  display.setTextSize(2);
  display.setCursor(5, 0);
  display.println("IOT Server");
  display.setTextSize(FONT_SIZE2);
  display.setCursor(DISTANCE_LEFT, DISTANCE_TOP);
  display.println(str);// Display static text

  display.setTextSize(FONT_SIZE1);
  display.setCursor(LOGO_DISTANCE_LEFT, LOGO_DISTANCE_TOP);
  display.println("ArthurCam");
  display.setCursor(LOGO_DISTANCE_LEFT + 28, LOGO_DISTANCE_TOP + 8);
  display.println(".com");

  display.setCursor(DISTANCE_LEFT, LOGO_DISTANCE_TOP);
  display.println(i >= 10 ? String(i) : "0" + String(i) );
  display.println("  sec");
  i %= 59;
  ++i;
  display.display(); 
  delay(1000);
}
