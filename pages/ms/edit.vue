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
      no-data-text="이런 자리는 없어요!"
    ></v-autocomplete>

    <br />

    <v-btn color="primary" block @click="checkIn" :disabled="!seat" class="mb-2">
      대리 출석하기
    </v-btn>
    <v-btn color="primary" block to="/ns/teacher"> 출석 확인하기 </v-btn>
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
});

function checkIn() {
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

  const nameDB = dbRef($db, `students/${studentId.value}`);
  update(nameDB, {
    name: name.value,
  });

  reloadWindow();
}
</script>

<style>
.v-input__details {
  display: none;
}
</style>
