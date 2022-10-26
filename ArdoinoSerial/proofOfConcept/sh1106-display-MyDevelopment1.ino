
#include "U8glib.h"

#define FONT_SIZE1 u8g_font_fixed_v0
#define FONT_SIZE2 u8g_font_8x13r
#define DISTANCE_TOP 36
#define DISTANCE_LEFT 0
#define LOGO_DISTANCE_TOP DISTANCE_TOP +  20
#define LOGO_DISTANCE_LEFT DISTANCE_LEFT + 70

//U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_NONE);	// I2C / TWI 
//U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_DEV_0|U8G_I2C_OPT_FAST);	// Dev 0, Fast I2C / TWI
U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_NO_ACK);	// Display which does not send ACK

void u8g_prepare(void) {
  u8g.setFont(u8g_font_6x10);
  u8g.setFontRefHeightExtendedText();
  u8g.setDefaultForegroundColor();
  u8g.setFontPosTop();
}

char userString[19] = "YOUR TEXT HERE \0";
int second = 1;

void draw(void) {

  
  //u8g.setFont(u8g_font_unifont);  // graphic commands to redraw the complete screen should be placed here  
  u8g.setFont(FONT_SIZE2);
  
  u8g.drawStr( DISTANCE_LEFT, DISTANCE_TOP, userString + '\0');  
  u8g.setFont(FONT_SIZE1);
  u8g.drawStr( LOGO_DISTANCE_LEFT, LOGO_DISTANCE_TOP, "ArthurCam\0");  
  u8g.drawStr( LOGO_DISTANCE_LEFT + 28, LOGO_DISTANCE_TOP + 8, ".com\0");  

  //char secondString[3] = String(1).c_str();
  u8g.drawStr( DISTANCE_LEFT + 7, LOGO_DISTANCE_TOP, ( (second < 10 ? "0" + String(second) : "" + String(second)) ).c_str() );
  u8g.drawStr( DISTANCE_LEFT + 10, LOGO_DISTANCE_TOP + 8, "sec");
  
}


void setup(void) {
  // u8g.setRot180(); // flip screen, if required
  //u8g.setHardwareBackup(u8g_backup_avr_spi);  // set SPI backup if required
  // assign default color value
  if ( u8g.getMode() == U8G_MODE_R3G3B2 ) u8g.setColorIndex(255); // white
  else if ( u8g.getMode() == U8G_MODE_GRAY2BIT )  u8g.setColorIndex(3); // max intensity
  else if ( u8g.getMode() == U8G_MODE_BW )  u8g.setColorIndex(1); // pixel on
  else if ( u8g.getMode() == U8G_MODE_HICOLOR ) u8g.setHiColorByRGB(255,255,255);
}

void loop(void) {
  u8g_prepare();
  u8g.firstPage();  
  do { draw(); } while( u8g.nextPage() );  // picture loop
  //do in parralel
  second %= 59;
  ++second;
  delay(1000); // rebuild the picture after some delay
}

