import time

while True:
	print("getid", flush=True)
	id = input()
	print("print My ID is: "+id, flush=True)
	time.sleep(1)

	print("getname", flush=True)
	name = input()
	print("print My Name is: "+name, flush=True)
	time.sleep(1)

	print("getxy", flush=True)
	xy = input()
	print("print My GPS Coords are: "+xy, flush=True)
	time.sleep(1)

	print("getx", flush=True)
	x = input()
	print("print My Longitude is: "+x, flush=True)
	time.sleep(1)

	print("gety", flush=True)
	y = input()
	print("print My Latitude is: "+y, flush=True)
	time.sleep(1)

	print("ismarked", flush=True)
	y = input()
	print("print Marked: "+y, flush=True)
	time.sleep(1)