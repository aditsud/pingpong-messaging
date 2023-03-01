import Stomp from 'stompjs'
import { reactive } from 'vue'

export class RabbitMQ {
  

  constructor (channel, cb = null, ack = false, type='queue') {
    this.host = 'ws://rmq2.pptik.id:15674/ws';
    this.user = 'TMDG2022';
    this.password = 'TMDG2022';
    this.vhost = '/TMDG2022';

    this.stompHeader = {
      'durable': true,
      'auto-delete': false,
      'exclusive': false,
      'persistent': true
    };
    if(type==='exchange'){
      // kalau tipe exchange, durable harus dibuat false. lebih bagus tidak usah dikasih header sekalian, biar default aja
      this.stompHeader = {};
    }
    if(ack){
      this.stompHeader.ack = 'client'
    }
    this.ack = ack
    this.type = type
    
    this.connectionStatus = reactive([false]);
    this.channelStatus = reactive([false]);

    this.channel = channel
    this.cb = cb
  }

  initRMQConnection(){
    
    this.ws = new WebSocket(this.host);
    this.client = Stomp.over(this.ws); 

    this.client.heartbeat.outgoing = 3000;
    this.client.heartbeat.incoming = 3000;
    this.client.debug = (message) => {
      console.log("StompJS: ", message);
      if(message.includes('Whoops! Lost connection') || message.includes('DISCONNECT')){
        this.connectionStatus[0] = false;
        this.channelStatus[0] = false;
        return;
      } 
    }; 
    
    this.client.connect(this.user, this.password, this.on_connect, this.on_error, this.vhost);
  }

  on_error = () =>{
    // on failed
    this.channelStatus[0] = false;
    this.connectionStatus[0] = false;
  }

  on_connect = () =>{
    // on succeed
    this.connectionStatus[0] = true
    this.client.subscribe(`/${this.type}/${this.channel}`, async (response) => {
      // do nothing
      if(this.cb !== null){
        this.cb(response)
        // if(this.ack) response.ack();
      }
    }, this.stompHeader);
    if(Object.keys(this.client.subscriptions).length > 0) this.channelStatus[0] = true;
  }

  sendMessage(tujuan, pesan){
    this.client.send(`/${this.type}/${tujuan}`, { "content-type": "text/plain" }, pesan);
  }

  getConnectionStatus(){
    return this.connectionStatus[0];
  }

  getChannelStatus(){
    return this.channelStatus[0];
  }

  disconnect(){
    this.connectionStatus[0] = false;
    this.channelStatus[0] = false;
    this.client.disconnect();
  }
}