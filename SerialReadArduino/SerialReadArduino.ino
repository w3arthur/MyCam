// https://www.tinkercad.com/things/7hURa9ntR6y

//led edition

void setup()
{
    pinMode(3, OUTPUT);
    Serial.begin(9600);
    Serial.println("Waiting to true or 1 value... ");
}

void loop()
{
    while (!Serial.available());
    String action = Serial.readString();
    Serial.println(action);
    if (action == "true" || action == "1")
        digitalWrite(3, !digitalRead(3));
}
