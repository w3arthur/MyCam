
// https://www.tinkercad.com/things/7hURa9ntR6y

void setup()
{
    pinMode(3, OUTPUT);
    Serial.begin(9600);
    Serial.println("Waiting to true or 1 value... ");
}

void loop()
{

}


void serialEvent()
{
    while (!Serial.available());
    int action = Serial.parseInt();
    if (action == 1 ){ digitalWrite(3, !digitalRead(3)); Serial.println("ok");}
    else Serial.println();
    delay(1);
}


