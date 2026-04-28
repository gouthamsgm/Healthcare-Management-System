import socket
import threading
HOST="127.0.0.1"
PORT=5000
nickname=input("Enter the name: ")
client=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
client.connect((HOST,PORT))
def receive():
    while True:
        try:
            message=client.recv(1024).decode()
            if message=="NICK":
                client.send(message.encode())
            else:
                print(message)
        except:
            print("Not connected")
            client.close()
            break
def write():
    while True:
        msg=input("")
        msg=f"{nickname}:{msg}"
        client.send(msg.encode())
receive_thread=threading.Thread(target=receive)
receive_thread.start()
writing_thread=threading.Thread(target=write)
writing_thread.start()
