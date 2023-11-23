const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://broker.hivemq.com")

x = 1

client.on("connect", () => {
  console.log("print Connected!")
  setInterval(execute, 1000);
})

function execute() {
  client.publish("cupcarbontest/x", ""+x);
  x = 1 - x
}