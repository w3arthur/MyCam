using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;
using WebSocketSharp;   // NuGet\Install-Package WebSocketSharp -Version 1.0.3-rc11 // https://github.com/sta/websocket-sharp
using WebSocket = WebSocketSharp.WebSocket; //try another package or use .Net Framework
using ErrorEventArgs = WebSocketSharp.ErrorEventArgs;


// Add issue if no server
// if server turned off or delay to recheck if it reconnected or error message
// close server> client if app off
// Create an instance of WS Client
//ping to server
// the port is closed issue (turn off the arduino)
// on error reset after time...
// if there is no ports
// if it wrong port

namespace SocketIOHandShake
{
    internal class Program
    {

        public const string WebSocketLocation = "ws://127.0.0.1:3777/ws_arduino";//"ws://arthurcam.com:3777/ws_arduino"; //;  //localhost
        public const string ApiWebSocketLocation = "http://localhost:3777/api/arduino";//"https://arthurcam.com/api/arduino"; //   //set to ArthurCam.com
        public const string WebSocketApprovalMessage = "desktopApplication";
        public const int ArduinoMaxInputSize = 18;
        public const string StringOutputValue = "9";
        public const string SerialFirstConnectValue = "42";
        public static readonly short[] LedList = { 1 };

        public static readonly string[] ports = SerialPort.GetPortNames();
        public static WebSocket? ws;
        public static SerialPort? myport;

        //public static CancellationTokenSource sourceToken = new CancellationTokenSource();

        static void Main(string[] args)
        {
            Console.WriteLine("ArthurCam.com Web, Connection + Arduino Connection:");
            try
            {
                using (myport = new SerialPort())
                using (ws = new WebSocket(WebSocketLocation))
                {
                    //Serial Port
                    myport.BaudRate = 9600;
                    myport.PortName = ports[ports.Length - 1]; //myport.PortName = "COM3";  //Please fix!
                    myport.Open();

                    //WebSocket
                    ws.OnClose += Ws_OnClose; ;
                    ws.Connect();  //mess on error
                    if (!ws.Ping()) { throw new Exception("There is websocket server issue, selected server: " + WebSocketLocation); }
                    ws.Send(WebSocketApprovalMessage);
                    ws.OnMessage += Ws_OnMessage!; // += add new event handler

                    //Arduino Test
                    ArduinoSerialPostFirstConnection();
                    ArduinoSerialPost("Your Text Here<-");


                    Console.WriteLine("Please enter 1 from the web api to turn on the lamp:");
                    Console.WriteLine("Please leave the program running!");
                    Console.WriteLine("Sure the Arduino connected first!, selected port: " + myport.PortName);
                    Console.WriteLine("check functionality with " + ApiWebSocketLocation);
                    //ArduinoLed("0");
                    Console.ReadKey();  //fix
                }
            }
            catch (Exception ex)  { Console.Clear(); Console.WriteLine("! "+ex.Message); }

        }
        ~Program() { /*ws?.Close(); myport?.Dispose();*/}

        private static void Ws_OnClose(object? sender, CloseEventArgs e)
        { //message on error
            Console.Clear();   
            if (!(ws?.Ping() ?? false)) { Console.WriteLine("There is websocket server issue, selected server: " + WebSocketLocation);}
        }

        private static void Ws_OnMessage(object sender, MessageEventArgs e)
        {
            try
            {  //"Received from the server " 
                Console.WriteLine(e.Data);
                ArduinoSerialPost(e.Data);
            }
            catch (Exception ex) { Console.WriteLine(ex.Message); }
        } //Who send, Contain Arguments



        private static void ArduinoSerialPostFirstConnection()
        {
            try
            {
                Console.WriteLine("get start to work with arduino");
                myport.WriteLine(SerialFirstConnectValue);
                Console.WriteLine(myport.ReadLine());
                Console.WriteLine(myport.ReadLine());
            }
            catch (Exception ex) { throw new Exception("Arduino first connection fail, issue:" + ex.Message); }
        }

        private static void ArduinoSerialPost(string input)
        {
            try
            {
                string inputTrim = input.Trim();
                if (input.Contains(WebSocketApprovalMessage)) return;
                if (!myport!.IsOpen) throw new Exception("Arduino port is closed!, port:" + myport.PortName); ;
                if (input.Length > ArduinoMaxInputSize) inputTrim = input.Substring(0, ArduinoMaxInputSize); // make string shorter
                
                long intTryAll = 0;
                short intTryFirst = 0;
                bool inputTryParse = long.TryParse(inputTrim, out intTryAll);
                bool inputTryFirstParse = short.TryParse(inputTrim.Substring(0, 1), out intTryFirst);
                if (inputTrim.Length == 1 && inputTryParse && LedList.Contains((short)intTryAll))
                { // is a 1 number  && is a led
                    myport.WriteLine(inputTrim);
                }
                else if (inputTryFirstParse)
                { // is a string with first number
                    //if (input.Length > ArduinoMaxInputSize - 1)  inputTrim = inputTrim.Substring(0, ArduinoMaxInputSize - 1);
                    myport.WriteLine(StringOutputValue);
                    myport.WriteLine(inputTrim);
                }
                else
                { //is a string
                    myport.WriteLine(StringOutputValue);
                    myport.WriteLine( inputTrim);
                }


                //Console.WriteLine(intTemp);
                Console.WriteLine(myport.ReadLine());
                Console.WriteLine(myport.ReadLine());

            }
            catch (Exception ex) { throw new Exception( "Arduino Issue, Please Reset the program, issue:" + ex.Message);  }
        }


    }
}
