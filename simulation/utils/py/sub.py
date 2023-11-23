# You should define the values of:
# the broker (line 9)
# the topic (line 13)
# the client id (line 17)

from paho.mqtt import client as mqtt_client

# Broker
broker = "***broker***"
port = 1883

# Topic
topic = "***topic***"

print("getid", flush=True)
id = input()
client_id = "***id****"+id


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!", flush=True)
        else:
            print("Failed to connect, return code", rc, flush=True)

    client = mqtt_client.Client(client_id)
    # client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client

def subscribe(client: mqtt_client):
    def on_message(client, userdata, msg):
        message = msg.payload.decode()
        if message=="1":
            print("print RECEIVED 1", flush=True)
            print("mark", flush=True)
        if message=="0":
            print("print RECEIVED 0", flush=True)
            print("unmark", flush=True)

    client.subscribe(topic)
    client.on_message = on_message

def run():
    client = connect_mqtt()
    subscribe(client)
    client.loop_forever()


if __name__ == '__main__':
    run()