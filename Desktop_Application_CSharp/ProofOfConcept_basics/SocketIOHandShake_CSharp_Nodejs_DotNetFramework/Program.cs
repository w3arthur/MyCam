using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;

// change to C# (.NET)
// NuGet\Install-Package WebSocketSharp -Version 1.0.3-rc11
// https://github.com/sta/websocket-sharp
// Add issue if no server
// if server turned off or delay to recheck if it reconnected or error message
// close server> client if app off

namespace SocketIOHandShake
{
    internal class Program
    {

        public static WebSocket ws;
        static void Main(string[] args)
        {
            Console.WriteLine("Web Socket");
            // Create an instance of WS Client
            //using
            ws = new WebSocket("ws://127.0.0.1:5000/ws_arduino");   //localhost
            ws.Connect();
            ws.Ping();
            ws.Send("desktopApplication");
            ws.OnMessage += Ws_OnMessage; // += add new event handler


            Console.WriteLine("Please leave the program running!");
            Console.ReadKey();

        }
        ~Program() { ws.Close(); }

        private static void Ws_OnMessage(object sender, MessageEventArgs e) //Who send, Contain Arguments
        {
            Console.WriteLine(e.Data); //"Received from the server " 
        }
    }
}
