const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://broker.hivemq.com")

client.on("connect", () => {
  client.subscribe("cupcarbontest/x", (err) => {
    if (!err) {
      console.log("print Connected!")
    }
  })
})

client.on("message", (topic, message) => {
  console.log(message.toString())
  if(message=="0") console.log("mark")
  if(message=="1") console.log("unmark")
})