import { Message, Client } from "paho-mqtt";

let isConnected = false;
let messageCallback = null;

const clientId = "mqtt_" + Math.random().toString(16).substr(2, 8);
const client = new Client("test.mosquitto.org", 8081, clientId);

const connect = () => {
    if (isConnected && client.isConnected()) {
      console.log("🔄 Já conectado ao broker.");
      return;
    }
  
    client.onMessageArrived = onMessageArrived;
  
    client.connect({
      onSuccess: onSuccess,
      onFailure: onFail,
      useSSL: true,
    });
  };
  

function onSuccess() {
  console.log("✅ Conectado ao broker Mosquitto!");
  isConnected = true;
  client.subscribe("teste/mosquitto/expo"); // você pode parametrizar depois se quiser
}

function onFail() {
  console.log("❌ Falha ao conectar");
  isConnected = false;
}

function onMessageArrived(message) {
  console.log("📩 Mensagem recebida:", message.payloadString);
  if (messageCallback) {
    messageCallback(message.destinationName, message.payloadString);
  }
}

const sendMessage = (topico, mensagem) => {
  if (isConnected && client.isConnected()) {
    const payload = new Message(mensagem);
    payload.destinationName = topico;
    client.send(payload);
  } else {
    console.log("❌ Cliente ainda não conectado ao broker.");
  }
};

const setOnMessageCallback = (callback) => {
  messageCallback = callback;
};

export { connect, sendMessage, setOnMessageCallback };
