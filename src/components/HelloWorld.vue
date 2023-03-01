<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">

      <div class="text-h6 font-weight-light mb-1">Hasil Tugas <b>Modul 2 RabbitMQ</b></div>

      <h1 class="text-h5 font-weight-bold">
        <span class="text-body-1">oleh: </span>Aditya Sudyana <span class="text-body-2">(23222063)</span><br/>
        <span class="text-body-1">dan </span>Bene Genhaq Suseno <span class="text-body-2">(23222026)</span>
      </h1>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            color="primary"
            to="/work-queue"
            min-width="164"
            size="x-large"
            variant="flat"
          >
            <v-icon
              icon="mdi-tray-full"
              size="large"
              start
            />

            Work Queues
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            to="/publish-subscribe"
            min-width="164"
            size="x-large"
            variant="flat"
          >
            <v-icon
              icon="mdi-broadcast"
              size="large"
              start
            />

            Brodcast
          </v-btn>
        </v-col>

        <!-- <v-col cols="auto">
          <v-btn
            color="primary"
            to="/routing"
            min-width="164"
            size="x-large"
            variant="flat"
          >
            <v-icon
              icon="mdi-routes"
              size="large"
              start
            />

            Routing
          </v-btn>
        </v-col> -->
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
  //
</script>
