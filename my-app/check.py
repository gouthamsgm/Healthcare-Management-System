def compute(data):
    s=0
    for bit in data:
        if bit=='1':
            s=(s&1)+1
    s=(~s)&(1)
    return s

data="10101"
c=compute(data)
print(c)

