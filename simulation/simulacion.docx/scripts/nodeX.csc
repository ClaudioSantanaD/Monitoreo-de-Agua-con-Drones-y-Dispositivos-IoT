atget id id
set x 22
loop
receive w
print "Temp:" x
data message id x
send message
delay 1000