<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <div class="text-h4 font-weight-light mb-1">Broadcaster</div>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center mb-5">
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-text-field 
                :disabled="isConnected"
                v-model="tujuan" 
                label="Tujuan Broadcast" 
                variant="outlined" 
                required
                ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field 
                :disabled="isConnected"
                v-model="routing" 
                label="Routing (Opsional)" 
                variant="outlined" 
                required
                ></v-text-field>
            </v-col>
          </v-row>
          
          <v-text-field 
            :disabled="!isConnected"
            v-model="pesan" 
            label="Pesan (String)"
            variant="outlined" 
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            color="primary"
            min-width="164"
            size="x-large"
            variant="text"
            @click="backButton"
          >
            <v-icon
              icon="mdi-arrow-left"
              size="large"
              start
            />

            Kembali
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            min-width="164"
            size="x-large"
            variant="flat"
            :disabled="tujuan === '' || isConnected"
            @click="connect"
          >
            <v-icon
              icon="mdi-connection"
              size="large"
              start
            />

            Connect
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            min-width="164"
            size="x-large"
            variant="flat"
            :disabled="tujuan === '' || pesan === '' || !isConnected"
            @click="kirimPesan"
          >
            <v-icon
              icon="mdi-send"
              size="large"
              start
            />

            Kirim Data
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            min-width="164"
            size="x-large"
            variant="flat"
            :disabled="!isConnected"
            @click="rmq.disconnect()"
          >
            <v-icon
              icon="mdi-power"
              size="large"
              start
            />

            {{ !isConnected ? 'Disconnected' : 'Disconnect' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
  import { backButton } from '@/plugins/util'
  import { onMounted, ref, computed, onUnmounted} from 'vue';
  import { RabbitMQ } from '@/plugins/rabbitmq'

  const tujuan = ref('')
  const routing = ref('')
  const pesan = ref('')

  let rmq = ref(null);

  const isConnected = computed(()=>{
    return (rmq.value !== null && rmq.value.getConnectionStatus() && rmq.value.getChannelStatus()) ? true : false
  })

  onMounted(async ()=>{
    
  })

  onUnmounted(() => {
    if(rmq.value !== null) rmq.value.disconnect()
  })

  const connect = () => {
    if(rmq.value !== null) rmq.value.disconnect()
    rmq.value = null;
    let pub = tujuan.value
    if(routing.value !== '') pub = pub + '/' + routing.value
    rmq.value = new RabbitMQ(pub, null, false, 'exchange');
    rmq.value.initRMQConnection()
  }


  const kirimPesan = () => {
    let pub = tujuan.value
    if(routing.value !== '') pub = pub + '/' + routing.value
    rmq.value.sendMessage(pub, pesan.value)
    pesan.value = ''
  }
</script>
