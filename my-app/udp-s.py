import socket
import time
cport=input("Enter the port:")
csd=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
csd.sendto(b"hello",('127.0.0.1',12345))
msg,addr1=csd.recvfrom(1024)
print("Message:"msg.decode())
