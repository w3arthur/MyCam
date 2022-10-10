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


namespace SocketIOHandShake
{
    internal class Program
    {

        public static readonly string WebSocketLocation = "ws://127.0.0.1:5000/ws_arduino";  //localhost
        public static readonly string ApiWebSocketLocation = "http://localhost:5000/api/arduino";
        public static readonly string ArduinoSerialTestValue = "0";
        public static readonly string WebSocketApprovalMessage = "desktopApplication";
        public static WebSocket? ws;
        public static SerialPort? myport;
        public static readonly string[] ports = SerialPort.GetPortNames();


        public static CancellationTokenSource sourceToken = new CancellationTokenSource();

        static void Main(string[] args)
        {
            Console.WriteLine("Web Socket");
            try
            {
                using (myport = new SerialPort())
                using (ws = new WebSocket(WebSocketLocation))
                {
                    //serial port
                    myport.BaudRate = 9600;
                    myport.PortName = ports[ports.Length - 1]; //myport.PortName = "COM3";  //Please fix!

                   


                    myport.Open();
                    Console.WriteLine("please enter 1: ");

                    ws.OnClose += Ws_OnClose; ;

                    ws.Connect();
                       //mess on error
                    if (!ws.Ping()) { throw new Exception("There is websocket server issue, selected server: " + WebSocketLocation); }
                    ws.Send(WebSocketApprovalMessage);
                    ws.OnMessage += Ws_OnMessage!; // += add new event handler

                    

                    Console.WriteLine("Please leave the program running!");
                    Console.WriteLine("Sure the Arduino connected first!, selected port: " + myport.PortName);
                    Console.WriteLine("check functionality with " + "http://localhost:5000/api/arduino");
                    Task.Run(() => { Task.Delay(500); ArduinoLed("0"); });
          
                    Console.ReadKey();
                }
            }
            catch (Exception ex)  { Console.Clear(); Console.WriteLine("! "+ex.Message); }


        }

        private static void Ws_OnClose(object? sender, CloseEventArgs e)
        {
            Console.Clear();    //mess on error
            if (!(ws?.Ping() ?? false)) { Console.WriteLine("There is websocket server issue, selected server: " + WebSocketLocation);}
        }


        ~Program() { ws?.Close(); myport?.Dispose(); }

        private static void Ws_OnMessage(object sender, MessageEventArgs e)
        {
            try 
            { 
                Console.WriteLine(e.Data); //"Received from the server " 
                ArduinoLed(e.Data);
            }
            catch (Exception ex) { Console.WriteLine(ex.Message); }
        } //Who send, Contain Arguments



        private static void ArduinoLed(string input)
        {
            try
            {

                sourceToken.CancelAfter(5000);
                int intTry = 0;
                if (input.Contains(WebSocketApprovalMessage)) return;
                if (!int.TryParse(input, out intTry) ) throw new Exception("Input is not an int, the input " + input); ;
                if (!myport!.IsOpen) throw new Exception("Arduino port is closed!, port:" + myport.PortName); ;
                myport!.WriteLine(input);
                //Console.WriteLine(intTemp);
                Console.Write(myport.ReadLine());
                Console.Write(myport.ReadLine());
                Console.WriteLine();
            }
            catch (Exception ex) { throw new Exception( "Arduino Issue, Please Reset the program, issue:" + ex.Message);  }

        }





    }
}
