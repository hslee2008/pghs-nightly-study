<template>
  <div class="text-center">
    <h2 class="text-grey-darken-2">{{ date }}</h2>
    <p class="text-grey-darken-1">야자 {{ getSchedule() }}교시 / {{ time }}</p>

    <br />
    <br />

    <v-text-field
      v-model="studentId"
      label="학번"
      placeholder="예시) 10822"
      variant="outlined"
      class="mb-4"
    ></v-text-field>
    <v-text-field
      v-model="name"
      label="이름"
      placeholder="예시) 홍길동"
      variant="outlined"
      class="mb-4"
    ></v-text-field>
    <v-autocomplete
      v-model="seat"
      label="자리"
      :items="seats()"
      variant="outlined"
      class="mb-4"
    ></v-autocomplete>

    <div class="d-flex" style="direction: rtl; text-align: justify">
      <v-checkbox
        v-model="autoCheck"
        label="다음 QR찍을 시 자동출석"
        color="primary"
      ></v-checkbox>
    </div>

    <br />

    <v-btn color="primary" block @click="checkIn">출석하기</v-btn>

    <v-dialog v-model="checkedIn" max-width="600" persistent>
      <v-card class="pb-3 text-center pt-5">
        <div class="text-center">
          <v-icon size="x-large">mdi-desk-lamp</v-icon>
        </div>

        <v-card-title> {{ name }} | 야자 {{ getSchedule() }}교시 </v-card-title>
        <v-card-subtitle> {{ seat }} </v-card-subtitle>

        <br />

        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" variant="tonal" to="/data">
            야자 순위 보기
          </v-btn>
        </v-card-actions>

        <div>
          <p class="text-grey">버전 v0.0.1</p>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { $auth, $db } = useNuxtApp();

const time = ref(null);
const date = ref(null);

const name = ref("");
const studentId = ref("");
const seat = ref("");
const autoCheck = ref(true);

//dialogs
const checkedIn = ref(false);

onMounted(() => {
  date.value = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  time.value = new Date().toLocaleTimeString();

  setInterval(() => {
    time.value = new Date().toLocaleTimeString();
  }, 1000);

  if (localStorage.getItem("pghs-nightly-study")) {
    studentId.value = localStorage.getItem("pghs-nightly-study").split("-")[0];
    name.value = localStorage.getItem("pghs-nightly-study").split("-")[1];

    const checkInDB = dbRef(
      $db,
      `check-in/${date.value}/${getSchedule()}/${studentId.value}`
    );
    onValue(checkInDB, (snapshot) => {
      if (snapshot.exists()) {
        seat.value = snapshot.val().seat;
        checkedIn.value = true;
      }
    });
  }
});

function checkIn() {
  if (autoCheck.value) {
    localStorage.setItem(
      "pghs-nightly-study",
      studentId.value + "-" + name.value
    );
  }

  const checkInDB = dbRef(
    $db,
    `check-in/${date.value}/${getSchedule()}/${studentId.value}`
  );
  set(checkInDB, {
    studentId: studentId.value,
    name: name.value,
    seat: seat.value,
    time: new Date().toLocaleTimeString(),
  });

  const studentDB = dbRef(
    $db,
    `students/${studentId.value}/check-in/${date.value}/${getSchedule()}`
  );
  set(studentDB, {
    time: new Date().toLocaleTimeString(),
  });

  checkedIn.value = true;
}
</script>

<style>
.v-input__details {
  display: none;
}
</style>
