<template>
  <v-container class="pa-0 fill-height">
    <v-row dense align="center" justify="center" class="pa-3">
      <!-- Check Students Link -->
      <v-col cols="12" md="6">
        <v-card
          class="link-card"
          color="primary"
          dark
          elevation="3"
          to="/check-students"
          tag="router-link"
        >
          <v-card-title>
            <v-icon class="mr-3" large>mdi-account-group</v-icon>
            출석 확인
          </v-card-title>
        </v-card>
      </v-col>

      <!-- Check In Link -->
      <v-col cols="12" md="6">
        <v-card
          class="link-card"
          color="secondary"
          dark
          elevation="3"
          to="/check-in"
          tag="router-link"
        >
          <v-card-title>
            <v-icon class="mr-3" large>mdi-check-circle</v-icon>
            야자 출석하기
          </v-card-title>
        </v-card>
      </v-col>

      <!-- Check In Link -->
      <v-col cols="12" md="6">
        <v-card
          class="link-card"
          color="grey"
          dark
          elevation="3"
          to="/data"
          tag="router-link"
        >
          <v-card-title>
            <v-icon class="mr-3" large>mdi-database</v-icon>
            데이터 확인하기
          </v-card-title>
        </v-card>
      </v-col>

      <!-- Check In Link -->
      <v-col cols="12" md="6">
        <v-card
          class="link-card"
          color="grey"
          dark
          elevation="3"
          to="/chart"
          tag="router-link"
        >
          <v-card-title>
            <v-icon class="mr-3" large>mdi-database</v-icon>
            출석 데이터 확인하기
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "FullPageLinks",
};
</script>

<style scoped>
.fill-height {
  height: 100vh; /* Full viewport height */
}

.link-card {
  text-align: center; /* Center align content */
  font-size: 1.5rem; /* Make the text size larger */
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%; /* Ensure cards expand */
  border-radius: 12px; /* Rounded corners for a polished look */
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.v-icon {
  color: white; /* Ensures icons match card text color */
}
</style>
