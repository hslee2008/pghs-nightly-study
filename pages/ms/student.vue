<template>
  <div class="text-center mx-5">
    <h2 class="text-grey-darken-2">{{ date }}</h2>
    <p class="text-grey-darken-1">아침자습 / {{ time }}</p>

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
      :disabled="!studentId || !name || checkedIn"
    >
      출석하기
    </v-btn>

    <v-dialog v-model="checkedIn" persistent max-width="290">
      <v-card class="pb-3 text-center pt-5">
        <div style="position: absolute; top: 0; right: 0" class="mx-2 mt-1">
          <p class="text-grey">버전 v0.0.3</p>
        </div>
        <div class="text-center">
          <v-icon size="x-large">mdi-desk-lamp</v-icon>
        </div>

        <v-card-title class="text-h5"> 아침자습 </v-card-title>

        <br />

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text to="/ms/data"
            >아침자습 순위 확인하기</v-btn
          >
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
const autoCheck = ref(true);

//dialogs
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

  if (localStorage.getItem("pghs-morningly-study")) {
    studentId.value = localStorage
      .getItem("pghs-morningly-study")
      .split("-")[0];
    name.value = localStorage.getItem("pghs-morningly-study").split("-")[1];

    const checkInDB = dbRef(
      $db,
      `zms-check-in/${date.value}/${studentId.value}`
    );
    onValue(checkInDB, (snapshot) => {
      if (snapshot.exists()) {
        checkedIn.value = true;
      }
    });
  }
});

function checkIn() {
  if (autoCheck.value) {
    localStorage.setItem(
      "pghs-morningly-study",
      studentId.value + "-" + name.value
    );
  }

  const checkInDB = dbRef($db, `zms-check-in/${date.value}/${studentId.value}`);
  set(checkInDB, {
    studentId: studentId.value,
    name: name.value,
    time: new Date().toLocaleTimeString(),
  });

  const studentDB = dbRef(
    $db,
    `zms-students/${studentId.value}/check-in/${date.value}`
  );
  set(studentDB, {
    time: new Date().toLocaleTimeString(),
  });

  const nameDB = dbRef($db, `zms-students/${studentId.value}`);
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
