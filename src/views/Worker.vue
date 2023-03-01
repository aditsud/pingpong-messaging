<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <div class="text-h5 font-weight-light mb-1"><b>UTS Matakuliah Desain Aplikasi Interaktif</b>
        <br/>by: Aditya Sudyana (23222063)<br/>
        <span class="link-repo"><a href="https://github.com/aditsud/pingpong-messaging" target="_blank">https://github.com/aditsud/pingpong-messaging</a></span>
      </div>

      <div class="py-5" />

      <v-row class="d-flex align-center justify-center mb-5">
        <v-col cols="12">
          <WorkerInstance></WorkerInstance>
        </v-col>
      </v-row>

      
    </v-responsive>
  </v-container>
</template>

<script setup>
import WorkerInstance from './WorkerInstance.vue';
</script>

<style scoped>
.link-repo{
  font-size: 18px;
}
</style>
