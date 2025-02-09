<template>
  <v-container fluid>
    <v-row class="fill-height" justify="center">
      <v-col cols="12" md="6">
        <h1 class="text-center">야간 자율 학습</h1>

        <div class="d-flex flex-column ga-4 mt-5">
          <v-card variant="outlined" to="/ns/teacher">
            <v-card-title>
              <v-icon class="mr-3">mdi-calendar-check</v-icon>
              출석 확인하기
            </v-card-title>
          </v-card>

          <v-card variant="outlined" to="/ns/edit">
            <v-card-title>
              <v-icon class="mr-3">mdi-database-check</v-icon>
              학생 대리 출석하기
            </v-card-title>
          </v-card>

          <v-card variant="outlined" to="/ns/data">
            <v-card-title>
              <v-icon class="mr-3">mdi-database-search</v-icon>
              데이터 확인하기
            </v-card-title>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <h1 class="text-center">아침자습 (어얼리 버드)</h1>

        <div class="d-flex flex-column ga-4 mt-5">
          <v-card variant="outlined" to="/ms/teacher">
            <v-card-title>
              <v-icon class="mr-3">mdi-calendar-check</v-icon>
              출석 확인하기
            </v-card-title>
          </v-card>

          <v-card variant="outlined" to="/ms/edit">
            <v-card-title>
              <v-icon class="mr-3">mdi-database-check</v-icon>
              학생 대리 출석하기
            </v-card-title>
          </v-card>

          <v-card variant="outlined" to="/ms/data">
            <v-card-title>
              <v-icon class="mr-3">mdi-database-search</v-icon>
              데이터 확인하기
            </v-card-title>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
