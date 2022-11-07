
#include "U8glib.h"

#define FONT_SIZE1 u8g_font_fixed_v0
#define FONT_SIZE2 u8g_font_8x13r
#define DISTANCE_TOP 36
#define DISTANCE_LEFT 0
#define LOGO_DISTANCE_TOP DISTANCE_TOP +  20
#define LOGO_DISTANCE_LEFT DISTANCE_LEFT + 70

#define TIME_DELAY_FOR_STRING_INPUT 2000
#define RESET_STRING "YOUR TEXT HERE "
#define RESET_STRING_ACTION "Your Text Here->"
#define RESET_SERIAL_INPUT_VALUE 42
#define STRING_SERIAL_INPUT_VALUE 9
#define LED1_2 7
#define LAMP 2

#define LED1_VALUE 7
#define LED2_VALUE 8
#define LAMP_VALUE 2

//U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_NONE);  // I2C / TWI 
//U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_DEV_0|U8G_I2C_OPT_FAST); // Dev 0, Fast I2C / TWI
U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_NO_ACK); // Display which does not send ACK


String userString = RESET_STRING;
bool isLedPlay = false;

void ledPlay(){
          digitalWrite(LED1_VALUE, !digitalRead(LED1_VALUE)); 
          digitalWrite(LED2_VALUE, !digitalRead(LED1_VALUE)); 
          delay(1000);
}


int second = 0; //second counter

void draw(void) {
  //u8g.setFont(u8g_font_unifont);  // graphic commands to redraw the complete screen should be placed here  
  u8g.setFont(FONT_SIZE2);
  
  u8g.drawStr( 14, 10, "Serial Port" );  
  u8g.drawStr( DISTANCE_LEFT, DISTANCE_TOP, userString.c_str());  
  u8g.setFont(FONT_SIZE1);
  u8g.drawStr( LOGO_DISTANCE_LEFT, LOGO_DISTANCE_TOP, "ArthurCam\0");  
  u8g.drawStr( LOGO_DISTANCE_LEFT + 28, LOGO_DISTANCE_TOP + 8, ".com\0");  

  //char secondString[3] = String(1).c_str();
  u8g.drawStr( DISTANCE_LEFT + 7, LOGO_DISTANCE_TOP, ( (second < 10 ? "0" + String(second) : "" + String(second)) ).c_str() );
  u8g.drawStr( DISTANCE_LEFT + 10, LOGO_DISTANCE_TOP + 8, "sec");
  
}


void setup(void) {
  pinMode(LAMP_VALUE, OUTPUT);
  pinMode(LED1_VALUE, OUTPUT);
  pinMode(LED2_VALUE, OUTPUT);
  Serial.begin(9600);
  Serial.println("Waiting to "+ String(STRING_SERIAL_INPUT_VALUE) +" and string or "+ String(LED1_2) +" value... ");
  u8g.setRot180(); // flip screen, if required
  //u8g.setHardwareBackup(u8g_backup_avr_spi);  // set SPI backup if required
  // assign default color value:
  if ( u8g.getMode() == U8G_MODE_R3G3B2 ) u8g.setColorIndex(255); // white
  else if ( u8g.getMode() == U8G_MODE_GRAY2BIT )  u8g.setColorIndex(3); // max intensity
  else if ( u8g.getMode() == U8G_MODE_BW )  u8g.setColorIndex(1); // pixel on
  else if ( u8g.getMode() == U8G_MODE_HICOLOR ) u8g.setHiColorByRGB(255,255,255);
}

void loop(void) {
  u8g_prepare();
  u8g.firstPage();  
  do { draw(); } while( u8g.nextPage() );  // picture loop
  
  
  second = (millis()/1000)%60;
  if(isLedPlay) ledPlay();
  else delay(1000); // rebuild the picture after some delay
}



void serialEvent()
{
    while (!Serial.available());
    int action = Serial.parseInt();
    if ( action == LED1_2 ){
      isLedPlay = !isLedPlay;
      if(!isLedPlay){
        digitalWrite(LED1_VALUE, LOW); 
        digitalWrite(LED2_VALUE, LOW); 
      }
      Serial.println("ok led");
    }
    else if ( action == LAMP ){ digitalWrite(LAMP_VALUE, !digitalRead(LAMP_VALUE)); Serial.println("ok lamp");}
    else if ( action == STRING_SERIAL_INPUT_VALUE ){
        String diplayString = "";
        Serial.println("waiting for string, waiting set for (msec): " + String(TIME_DELAY_FOR_STRING_INPUT));
        unsigned long startTime =  millis();
        do {
         diplayString = Serial.readString();  
         diplayString.trim();
        }
        while (diplayString == "" && (millis() - startTime) % TIME_DELAY_FOR_STRING_INPUT == 0);
        if(diplayString != ""){
          userString = diplayString;
          Serial.println(diplayString);
          Serial.println("ok string");
        }
        else Serial.println("-");
    }
    else if ( action == RESET_SERIAL_INPUT_VALUE ){
      userString = RESET_STRING_ACTION;
      for(int i = 0; i < 2; ++i ){
          digitalWrite(LED1_VALUE, !digitalRead(LED1_VALUE)); 
          delay(500);
          digitalWrite(LED1_VALUE, !digitalRead(LED1_VALUE)); 
          delay(500);
      }
      Serial.println("arduino restart");
    }
    else Serial.println("-");
    delay(1);
}


//default settings
void u8g_prepare(void) {
  u8g.setFont(u8g_font_6x10);
  u8g.setFontRefHeightExtendedText();
  u8g.setDefaultForegroundColor();
  u8g.setFontPosTop();
}