<template>
  <div class="workerInstance">
    <v-app>
      <v-app-bar compact color="primary">
        <v-toolbar-title class="text-left">Program Pingpong Messaging {{ id!='' ? `(Channel: ${id})` : '' }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="disconnect">
          <v-icon :color="isOnline ? 'green' : 'red'">mdi-circle</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main id="main">
        <div class="fix"></div>
        <div id="outputDiv" v-for="opt in output">
          {{ opt }}
        </div>
      </v-main>
      <v-footer>
        <v-row class="row-footer">
          <v-col class="row-footer" align-self="center" v-if="tujuan !== ''"><span class="tujuan">Kirim pesan ke {{ tujuan }}</span> : </v-col>
          <v-col :cols="tujuan!=='' ? '9' : '12'">
            <v-text-field 
              ref="inputCommand" 
              prefix=">>>" 
              v-model="command" 
              label="" 
              variant="outlined" 
              @keyup.enter="processCommand"
              :loading="loading"
              :disabled="loading"
            >
            </v-text-field>
          </v-col>
        </v-row>
        
      </v-footer>
    </v-app>
   
  </div>
  
</template>

<script setup>
import {  computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { RabbitMQ } from '@/plugins/rabbitmq'

const rmq = ref(null);
const id = ref('')
const tujuan = ref('')

const inputCommand = ref(null)
const command = ref('')
const output = ref(['Masukkan nama queue channel Anda untuk mengirim pesan ...'])

const outputLength = computed(()=>{
  return output.value.length
})
watch(outputLength, (val)=>{
  let nestedElement = document.getElementById('main')
  setTimeout(()=>{
    nestedElement.scrollTop = nestedElement.scrollHeight
  },100)
})

const hasInitiate = ref(false)
const isOnline = computed(()=>{
  return (rmq.value !== null && hasInitiate.value && rmq.value.getConnectionStatus() && rmq.value.getChannelStatus()) ? true : false
})
watch(isOnline, (newVal, oldVal) => {
  if(!oldVal && newVal){
    output.value[0] = output.value[0] + ` [${command.value}]`
    output.value.push(`Terhubung ke queue: [${command.value}]`)
    if(id.value===''){
      id.value = command.value;
      output.value.push('Masukkan nama queue/routing tujuan ...')
    }
    command.value = '';
  }else if(oldVal && !newVal){
    output.value[output.value.length - 1] = 'Koneksi Terputus';
    output.value.push('Masukkan nama queue channel Anda untuk mengirim pesan ...');
    command.value = ''
  }
})

const loading = ref(false)
const processCommand = async () => {

  loading.value = true;
  if(id.value === ''){
    // inisialisasi koneksi ke queue
    rmq.value =  new RabbitMQ(command.value, callbackSubscribe)
    hasInitiate.value = true;
    rmq.value.initRMQConnection()
    loading.value = false;
  }else if(id.value !== '' && tujuan.value === ''){
    // tentukan tujuan queue
    tujuan.value = command.value;
    output.value.push(`Tujuan Queue: [${command.value}]`)
    setTimeout(()=>{
      output.value.push('Menunggu pesan masuk ...')
    }, 3000) 
    command.value = '';
    loading.value = false
  }else{
    // kirim pesan ke queue
    rmq.value.sendMessage(tujuan.value, command.value);
    output.value.push(`Kirim pesan ke ${tujuan.value}: ${command.value}`)
    setTimeout(()=>{
      output.value.push('Menunggu pesan masuk ...')
    }, 3000) 
    command.value = '';
    loading.value = false;
  }
  
  
}


const callbackSubscribe = async (response)=>{

  let val = response.body;
  output.value[output.value.length - 1] = `Pesan masuk: ${val}`
  setTimeout(()=>{
    output.value.push('Menunggu pesan masuk ...')
  }, 3000) 
}


onMounted(()=>{
  inputCommand.value.focus()
})

onUnmounted(()=>{
  if(rmq.value !== null) rmq.value.disconnect();
})

const disconnect = () => {
  if(rmq.value !== null){
    rmq.value.disconnect();
    id.value = '';
    tujuan.value = '';
    hasInitiate.value = false;
    rmq.value = null;
  }
}
</script>



<style scoped>
.workerInstance{
  /* height: 400px; */
  border: 1px solid grey;
  border-radius: 10px;
}

.workerInstance :deep(.v-application){
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 400px;
}

.workerInstance :deep(.v-application__wrap){
  height: 400px;
  min-height: 400px;
}

.workerInstance :deep(.v-main){
  height: calc(400px - 180px);
  overflow-y: scroll;
  flex-grow: 1;
  margin-top: 64px;
  padding: 20px !important;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.workerInstance :deep(.v-main .fix){
  flex: 1 1 auto;
}

.row-footer{
  margin-bottom: 24px;
}

.workerInstance :deep(.v-footer){ 
  align-items: flex-start;
  border-top: 1px solid gray;
  padding-top: 10px !important;
  height: 44px;
}
.tujuan{
  font-weight: 500;
}
</style>