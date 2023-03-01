<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <div class="text-h4 font-weight-light mb-1">Worker</div>

      <div class="py-5" />

      <v-row class="d-flex align-center justify-center mb-5">
        <v-col cols="6" v-for="id in instances">
          <WorkerInstance :id="id"></WorkerInstance>
        </v-col>
      </v-row>

      <div class="py-5" />

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
            @click="addInstance"
          >
            <v-icon
              icon="mdi-dock-window"
              size="large"
              start
            />

            Buat Instance Baru
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
  import { backButton } from '@/plugins/util'
  import { ref, inject} from 'vue';
  import WorkerInstance from './WorkerInstance.vue';

  const emitter = inject('emitter')
  
  const instances = ref([])
  const addInstance = () => {
    if(instances.value.length === 0) instances.value.push(1)
    else instances.value.push(instances.value[instances.value.length - 1] + 1)
  }
  emitter.on('closeWorker', (id) => {
    for(let i=0; i<instances.value.length; i++){
      if(instances.value[i] === id){
        instances.value.splice(i, 1);
        return;
      }
    }
  })

</script>
