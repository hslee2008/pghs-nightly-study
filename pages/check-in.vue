<template>
  <div class="text-center mx-5">
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
        label="다음부터 자동 정보 입력"
        color="primary"
      ></v-checkbox>
    </div>

    <br />

    <v-btn
      color="primary"
      block
      @click="checkIn"
      :disabled="!seat || checkedIn"
    >
      출석하기
    </v-btn>

    <v-dialog v-model="checkedIn" persistent>
      <v-card class="pb-3 text-center pt-5">
        <div style="position: absolute; top: 0; right: 0" class="mx-2 mt-1">
          <p class="text-grey">버전 v0.0.2</p>
        </div>
        <div class="text-center">
          <v-icon size="x-large">mdi-desk-lamp</v-icon>
        </div>

        <v-card-title class="text-h5">
          야자 {{ getSchedule() }}교시 ({{ name }})
        </v-card-title>
        <v-card-subtitle class="text-h6"> 자리: {{ seat }} </v-card-subtitle>

        <br />

        <div v-if="getSchedule() === 1" class="mx-5">
          <p class="text-justify">
            출석이 끝났습니다. 2교시 때 QR을 다시 찍어서 출석해주세요.
          </p>
        </div>

        <br />

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text to="/data">야자 순위 확인하기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { get } from "firebase/database";

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

  const nameDB = dbRef(
    $db,
    `students/${studentId.value}`
  );
  update(nameDB, {
    name: name.value,
  });

  checkedIn.value = true;
}
</script>

<style>
.v-input__details {
  display: none;
}
</style>
