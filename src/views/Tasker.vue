<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <div class="text-h4 font-weight-light mb-1">Tasker</div>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center mb-5">
        <v-col cols="6">
          <v-text-field 
            :disabled="isButtonDisabled"
            v-model="tujuan" 
            label="Tujuan" 
            variant="outlined" 
            required
            ></v-text-field>
          <v-text-field 
            :disabled="isButtonDisabled"
            v-model="pesan" 
            label="Pesan (Angka)"
            variant="outlined" 
            @keyup="cekPolaPesan"
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
            :disabled="isButtonDisabled || tujuan === '' || pesan === '' || !correctPesanPattern"
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
            :disabled="isButtonDisabled"
            @click="rmq.disconnect()"
          >
            <v-icon
              icon="mdi-power"
              size="large"
              start
            />

            {{ isButtonDisabled ? 'Disconnected' : 'Disconnect' }}
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
  const pesan = ref('')

  let rmq = new RabbitMQ('workQ');

  const isButtonDisabled = computed(()=>{
    return (rmq.getConnectionStatus() && rmq.getChannelStatus()) ? false : true
  })

  onMounted(async ()=>{
    rmq.initRMQConnection()
  })

  onUnmounted(() => {
    rmq.disconnect()
  })

  const correctPesanPattern = ref(false)
  const cekPolaPesan = (val) => {
    if(pesan.value && /^(\d+)(,\d+)*$/.test(pesan.value)){
      correctPesanPattern.value = true
    }else{
      correctPesanPattern.value = false
    }
  }

  const kirimPesan = () => {
    if(/^(\d+)(,\d+)*$/.test(pesan.value)){ // jika pesan yang ingin dikirim memiliki format array of int like 1,3,2,4,5, maka akan dikirim 1 per 1
      let arrayOfInt = pesan.value.split(',')
      for(let i=0; i< arrayOfInt.length; i++){ 
        rmq.sendMessage(tujuan.value, arrayOfInt[i])
      }
    }else{ // jika hanya 1 angka saja yang ingin dikirim
      rmq.sendMessage(tujuan.value, pesan.value)
    }
    pesan.value = ''
  }
</script>
