#include "LoRaWan_APP.h"
#include "Arduino.h"
#include <OneWire.h>
#include <DallasTemperature.h>
#include "HT_SSD1306Wire.h"
#include <WiFi.h> // Incluye la librería WiFi para ESP32
#include <HTTPClient.h>

#define RF_FREQUENCY           915000000 // Hz
#define TX_OUTPUT_POWER        14        // dBm
#define LORA_BANDWIDTH         0         // [0: 125 kHz, 1: 250 kHz, 2: 500 kHz, 3: Reserved]
#define LORA_SPREADING_FACTOR  7         // [SF7..SF12]
#define LORA_CODINGRATE        1         // [1: 4/5, 2: 4/6, 3: 4/7, 4: 4/8]
#define LORA_PREAMBLE_LENGTH   8         // Same for Tx and Rx
#define LORA_SYMBOL_TIMEOUT    0         // Symbols
#define LORA_FIX_LENGTH_PAYLOAD_ON false
#define LORA_IQ_INVERSION_ON   false
#define RX_TIMEOUT_VALUE       1000
#define BUFFER_SIZE            30        // Define the payload size here MAX 255

char rxpacket[BUFFER_SIZE];
static RadioEvents_t RadioEvents;
int16_t rssi, rxSize;
bool lora_idle = true;

// Declare the display instance
extern SSD1306Wire display;

// Define tus credenciales de Wi-Fi
const char* ssid = "BzyA";
const char* password = "nohaycontra";

// Define la estructura TemperatureData
struct TemperatureData {
    float temperature;
    int field;
};
void setup() {
    Serial.begin(115200);
    Mcu.begin();
    rssi = 0;
    rxSize = 0;

    // Inicializa la pantalla
    display.init();
    //display.flipScreenVertically();

    display.setFont(ArialMT_Plain_10);
    display.setTextAlignment(TEXT_ALIGN_LEFT);
    display.clear();
    display.display();
    
    // Conéctate a la red Wi-Fi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        display.clear();
        display.drawString(0, 0, "Conectando a la red Wi-Fi...");
        Serial.println("Conectando a la red Wi-Fi...");
        display.display();
    }
    delay(1000);
    display.clear();
    Serial.println("Conexión a la red Wi-Fi exitosa!");
    display.drawString(0, 0, "Conexión Wi-Fi exitosa!");
    display.display();

    RadioEvents.RxDone = OnRxDone;
    Radio.Init(&RadioEvents);
    Radio.SetChannel(RF_FREQUENCY);
    Radio.SetRxConfig(MODEM_LORA, LORA_BANDWIDTH, LORA_SPREADING_FACTOR,
                       LORA_CODINGRATE, 0, LORA_PREAMBLE_LENGTH,
                       LORA_SYMBOL_TIMEOUT, LORA_FIX_LENGTH_PAYLOAD_ON,
                       0, true, 0, 0, LORA_IQ_INVERSION_ON, true);
}

void loop() {
    if (lora_idle) {
        lora_idle = false;
        Serial.println("Into RX mode");
        Radio.Rx(0);
    }
    Radio.IrqProcess();
}

void OnRxDone(uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr) {
    rssi = rssi;
    rxSize = size;
    memcpy(rxpacket, payload, size);
    rxpacket[size] = '\0';
    Radio.Sleep();
    
    // Display the received packet, RSSI, and RX size on the OLED screen
    display.clear();
    display.drawString(0, 0, "Mode: RX");
    display.drawString(0, 12, String(rxpacket));
    display.drawString(0, 24, "RSSI: " + String(rssi));
    display.drawString(0, 36, "RX Size: " + String(rxSize));
    display.display();
    Serial.println(rxpacket);

    // Crear un objeto String con la cadena original
    String packetString(rxpacket);

    // Definir un arreglo de posibles prefijos para identificar diferentes sensores
    String prefixes[] = {"N1S1:", "N2S1:", "N3S1:", "N3S2:"};

    // Recorrer los posibles prefijos para encontrar el formato del paquete
    for (int i = 0; i < sizeof(prefixes) / sizeof(prefixes[0]); i++) {
        int start = packetString.indexOf(prefixes[i]);
        while (start != -1) {
            // Encontrado el prefijo, ahora extraer el valor de temperatura
            int end = packetString.indexOf("°C", start);
            if (end != -1) {
                String temperatureString = packetString.substring(start + prefixes[i].length(), end);
                float temperature = temperatureString.toFloat();

                // Enviar el valor de temperatura a ThingSpeak
                sendTemperatureToThingSpeak(temperature, i + 1);
                
                // Buscar el siguiente sensor
                start = packetString.indexOf(prefixes[i], end);
            } else {
                // No se encontró "°C", salir del bucle
                break;
            }
        }
    }

    lora_idle = true;
}


void sendTemperatureToThingSpeak(float temperature, int field) {
    // Verificar si la temperatura es diferente de -127 antes de enviarla a ThingSpeak
    if (temperature != -127) {
        // Crear la URL de la solicitud GET
        String url = "https://api.thingspeak.com/update?api_key=C5QVWPX8772IWS5A&field" + String(field) + "=" + String(temperature);
        
        // Imprimir la URL para verificar
        Serial.println("URL: " + url);
        
        // Enviar la solicitud GET
        HTTPClient httpClient;
        httpClient.begin(url);
        int responseCode = httpClient.GET();
        
        // Imprimir el código de respuesta del servidor
        Serial.println("Response Code: " + String(responseCode));

        // Comprobar el código de respuesta
        if (responseCode == 200) {
            // La solicitud se ha realizado correctamente
            Serial.println("Se ha subido: "+ String(temperature));
            Serial.println("Solicitud GET realizada correctamente al field: " + String(field) );
        } else {
            // La solicitud ha fallado
            Serial.println("Error al subir: "+ String(temperature));
            Serial.println("Error al realizar la solicitud GET al field: " + String(field) );
        }
        // Cerrar la conexión HTTP
        httpClient.end();
        // Esperar unos segundos antes de la próxima solicitud
        delay(5000);  // Puedes ajustar este valor según sea necesario

    } else {
        // El valor de temperatura es -127, no lo envíes a ThingSpeak
        Serial.println("Valor de temperatura inválido (-127), no se enviará al field: " + String(field));
    }
}