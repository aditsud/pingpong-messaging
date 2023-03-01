<template>
  <div class="workerInstance">
    <v-app>
      <v-app-bar compact color="primary">
        <v-toolbar-title>{{`Receiver ${id}`}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon :color="isOnline ? 'green' : 'red'">mdi-circle</v-icon>
        </v-btn>
        <v-btn icon @click="closeEmitter">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-app-bar>
      <v-main id="main">
        <div class="fix"></div>
        <div id="outputDiv" v-for="opt in output">
          {{ opt }}
        </div>
      </v-main>
      <v-footer>
        <v-text-field 
          ref="inputCommand" 
          prefix=">>>" 
          v-model="command" 
          label="" 
          variant="outlined" 
          @keyup.enter="processCommand"
          :loading="loading"
          :disabled="loading || disconnected || isOnline"
        ></v-text-field>
      </v-footer>
    </v-app>
   
  </div>
  
</template>

<script setup>
import { defineProps, inject, computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { RabbitMQ } from '@/plugins/rabbitmq'

const emitter = inject('emitter')
const rmq = ref(null);

const props = defineProps({
  id: Number
})

const inputCommand = ref(null)
const command = ref('')
const output = ref(['Masukkan nama exchange ...'])

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
const disconnected = ref(false)
const isOnline = computed(()=>{
  return (rmq.value !== null && hasInitiate.value && rmq.value.getConnectionStatus() && rmq.value.getChannelStatus()) ? true : false
})
watch(isOnline, (newVal, oldVal) => {
  if(!oldVal && newVal){
    if(routing.value !== '')  output.value.push(`Connected to exchange [${exchange.value}/${routing.value}]`)
    else output.value.push(`Connected to exchange [${exchange.value}]`)
    output.value.push('Waiting for message . . .')
    command.value = 'Online';
  }else if(oldVal && !newVal){
    output.value[output.value.length - 1] = 'Disconnected';
    disconnected.value = true;
    command.value = 'Please Reopen the Receiver Window to Start from Beginning'
  }
})

const loading = ref(false)
const routing = ref('')
const exchange = ref('')
const processCommand = async () => {

  if(!isOnline.value){
    loading.value = true;
    if(exchange.value === ''){
      exchange.value = command.value;
      output.value.push(`Exchange: [${command.value}]`)
      output.value.push('Masukkan nama routing (jika tidak ada, langsung enter) ...')
      command.value = '';
      loading.value = false;
    }else if(exchange.value !== ''){
      let pub = exchange.value;
      routing.value = command.value;
      if(command.value !== '') pub = pub + '/' + command.value;
      rmq.value =  new RabbitMQ(pub, callbackSubscribe, false, 'exchange')
      hasInitiate.value = true;
      rmq.value.initRMQConnection()
      loading.value = false
    }

    
  }
  
}


const callbackSubscribe = async (response)=>{
  
  let val = response.body;
  output.value[output.value.length - 1] = `Pesan diterima: ${val}`
  setTimeout(()=>{
    output.value.push('Waiting for message . . .')
  }, 3000)
}

const closeEmitter = () => {
  emitter.emit('closeWorker', props.id)
}

onMounted(()=>{
  inputCommand.value.focus()
})

onUnmounted(()=>{
  if(rmq.value !== null) rmq.value.disconnect();
})
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

.workerInstance :deep(.v-footer){ 
  align-items: flex-start;
  border-top: 1px solid gray;
  padding-top: 10px !important;
  height: 44px;
}
</style>