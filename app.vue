<template>
  <v-app>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <v-main>
        <div class="d-flex justify-center my-10">
          <NuxtPage />
        </div>
      </v-main>
    </NuxtLayout>
  </v-app>
</template>

<script setup>
import { onAuthStateChanged } from "firebase/auth";

useHead({
  title: "판교고 야자출석",
});
</script>
