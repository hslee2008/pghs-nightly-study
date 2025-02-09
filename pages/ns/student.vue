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
      :rules="[rules.required, rules.studentIdFormat]"
    ></v-text-field>

    <v-text-field
      v-model="name"
      label="이름"
      placeholder="예시) 홍길동"
      variant="outlined"
      class="mb-4"
      :rules="[rules.required, rules.nameLength, rules.koreanNameFormat]"
    ></v-text-field>

    <v-autocomplete
      v-model="seat"
      label="자리"
      :items="seats()"
      variant="outlined"
      class="mb-4"
      no-data-text="이런 자리는 없어요!"
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
      v-if="!checkedIn"
      color="primary"
      block
      @click="checkIn"
      :disabled="!seat || !isValidForm"
    >
      출석하기
    </v-btn>
    <v-btn v-else color="primary" block href="https://theannoyingsite.com/">
      출석하기
    </v-btn>

    <v-dialog v-model="checkedIn" persistent max-width="400">
      <v-card class="pb-3 text-center pt-5">
        <div style="position: absolute; top: 0; right: 0" class="mx-2 mt-1">
          <p class="text-grey">버전 v0.0.3</p>
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

        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" variant="outlined" text to="/ns/data">
            야자 순위 확인하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const time = ref(null);
const date = ref(null);

const name = ref("");
const studentId = ref("");
const seat = ref("");
const autoCheck = ref(true);
const checkedIn = ref(false);

const rules = {
  required: (value) => !!value || "필수 입력 사항입니다.",
  studentIdFormat: (value) =>
    /^[1-9]0\d{3}$/.test(value) || "학번 형식이 잘못되었습니다 (예: 10822)",
  nameLength: (value) =>
    value.length >= 2 || "이름은 최소 2글자 이상이어야 합니다.",
  koreanNameFormat: (value) =>
    /^[가-힣]{2,6}$/.test(value) || "이름은 한글 2~6글자여야 합니다.",
};

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
    const savedData = localStorage.getItem("pghs-nightly-study").split("-");
    studentId.value = savedData[0];
    name.value = savedData[1];

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

const isValidForm = computed(() => {
  return (
    rules.required(studentId.value) === true &&
    rules.studentIdFormat(studentId.value) === true &&
    rules.required(name.value) === true &&
    rules.nameLength(name.value) === true
  );
});

function checkIn() {
  if (!isValidForm.value) return;

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

  const nameDB = dbRef($db, `students/${studentId.value}`);
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
