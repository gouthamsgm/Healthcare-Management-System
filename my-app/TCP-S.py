import socket
import threading
clients=[]
nicknames=[]
HOST='0.0.0.0'
PORT=5000
def broadcast(send_client,msg):
    for client in clients:
        if client != send_client:
            try:
                client.send(msg)
            except:
                remove_client(client)
def handle_client(client):
    while True:
        try:
            message=client.recv(1024)
            if not message:
                break
            broadcast(client,message)
        except:
            break
    remove_client(client)
def remove_client(client):
    if client in clients:
        index=clients.index(client)
        nickname=nicknames[index]
        clients.remove(client)
        nicknames.remove(nickname)
        client.close()
        print(f"{nickname} is connected")
        broadcast(client,f"{nickname} is chatting".encode())
def receive():
    server=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    server.bind((HOST,PORT))
    server.listen()
    while True:
        client,addr=server.accept()

        client.send("NICK".encode())
        nickname=client.recv(1024).decode()
        clients.append(client)
        nicknames.append(nickname)
        broadcast(client,f"{nickname} has joined".encode())
        client.send(f"Connected to server".encode())
        thread=threading.Thread(target=handle_client,args=(client,))
        thread.start()
if __name__ == "__main__":
    receive()
