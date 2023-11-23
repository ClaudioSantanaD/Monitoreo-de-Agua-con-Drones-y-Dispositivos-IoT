# You should define the values of:
# the broker (line 10)
# the topic (line 14)
# the client id (line 18)

from paho.mqtt import client as mqtt_client
import time

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
            print("Failed to connect, return code ", rc, flush=True)

    # Set Connecting Client ID
    client = mqtt_client.Client(client_id)
    # client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish(client):
    while True:
        client.publish(topic, "1")
        print("print SEND 1", flush=True)
        time.sleep(1)
        client.publish(topic, "0")
        print("print SEND 0", flush=True)
        time.sleep(1)

def run():
    client = connect_mqtt()
    client.loop_start()
    publish(client)
    client.loop_stop()


if __name__ == '__main__':
    run()