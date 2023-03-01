<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-center text-center fill-height">
      <div class="text-h4 font-weight-light mb-1">Broadcast</div>

      <div class="py-14" />

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
            to="/broadcaster"
            min-width="164"
            size="x-large"
            variant="flat"
          >
            <v-icon
              icon="mdi-multicast"
              size="large"
              start
            />

            Broadcaster
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            to="/receiver"
            min-width="164"
            size="x-large"
            variant="flat"
          >
            <v-icon
              icon="mdi-satellite-uplink"
              size="large"
              start
            />

            Receiver
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
  import { backButton } from '@/plugins/util'
</script>
