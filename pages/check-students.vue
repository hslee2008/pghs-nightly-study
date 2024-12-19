<template>
  <div class="d-flex ga-6">
    <v-card flat width="500px">
      <v-card-title class="text-center">야자 1교시</v-card-title>
      <template v-slot:text>
        <v-text-field
          v-model="search1"
          placeholder="학생 검색하기"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table
        :headers="[
          { key: 'studentId', title: '학번' },
          { key: 'name', title: '이름' },
          { key: 'seat', title: '자리' },
          { key: 'time', title: '출석 시간' },
          { key: 'actions', title: '더보기' },
        ]"
        :items="Object.values(data[1] ?? {})"
        :search="search1"
        hide-default-footer
        no-data-text="학생이 없습니다."
      >
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn variant="plain" icon v-bind="props">
                <v-icon size="small">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetails(item)">
                <v-list-item-title>
                  <v-icon>mdi-information</v-icon> 정보 보기
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteStudent(1, item)">
                <v-list-item-title color="red">
                  <v-icon>mdi-delete</v-icon>
                  삭제하기
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <v-card flat width="500px">
      <v-card-title class="text-center">야자 2교시</v-card-title>
      <template v-slot:text>
        <v-text-field
          v-model="search2"
          placeholder="학생 검색하기"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
      </template>

      <v-data-table
        :headers="[
          { key: 'studentId', title: '학번' },
          { key: 'name', title: '이름' },
          { key: 'seat', title: '자리' },
          { key: 'time', title: '출석 시간' },
          { key: 'actions', title: '더보기', align: 'end' },
        ]"
        :items="Object.values(data[2] ?? {})"
        :search="search2"
        hide-default-footer
        no-data-text="학생이 없습니다."
      >
        <template #item.actions="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn variant="plain" icon v-bind="props">
                <v-icon size="small">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetails(item)">
                <v-list-item-title>
                  <v-icon>mdi-information</v-icon> 정보 보기
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="deleteStudent(2, item)">
                <v-list-item-title color="red">
                  <v-icon>mdi-delete</v-icon>
                  삭제하기
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="studentInfo" height="600" max-width="1000">
      <v-card class="d-flex justify-center pa-6">
        <v-row class="fill-height">
          <v-col>
            <v-card class="pa-6 mb-4" variant="outlined">
              <v-card-title class="text-center">
                {{ viewStudent.studentId }} {{ viewStudent?.name }}
              </v-card-title>
            </v-card>

            <div class="d-flex">
              <v-sheet width="1000">
                <VCalendar :events="events"></VCalendar>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { VCalendar } from "vuetify/labs/VCalendar";

import { ref, computed, onMounted } from "vue";
const { $auth, $db } = useNuxtApp();

const time = ref(null);
const date = ref(null);

const data = ref([]);
const search1 = ref("");
const search2 = ref("");
const studentInfo = ref(null);
const viewStudent = ref(null);
const events = ref([
  {
    title: "Weekly Meeting",
    start: new Date("2019-01-07 09:00"),
    end: new Date("2019-01-07 10:00"),
  },
]);

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

  const checkInDB = dbRef($db, `check-in/${date.value}`);
  onValue(checkInDB, (snapshot) => {
    if (snapshot.exists()) {
      data.value = snapshot.val();
    }
  });
});

const fetchStudent = (studentId) => {
  const studentDB = dbRef($db, `students/${studentId}/check-in`);
  onValue(studentDB, (snapshot) => {
    if (snapshot.exists()) {
      viewStudent.value.monthlyInfo = Object.keys(snapshot.val());
      events.value = [];
      Object.keys(snapshot.val() ?? {}).forEach((key) => {
        events.value.push({
          title: `야자 참여`,
          start: parseKoreanDateString(key),
          end: parseKoreanDateString(key),
        });
      });
    }
  });
};

const viewDetails = (item) => {
  studentInfo.value = true;
  viewStudent.value = item;
  fetchStudent(item.studentId);
};

const deleteStudent = (schedule, item) => {
  const checkInDB = dbRef(
    $db,
    `check-in/${date.value}/${schedule}/${item.studentId}`
  );
  console.log()
  onValue(checkInDB, (snapshot) => {
    if (snapshot.exists()) {
      set(checkInDB, null);
    }
  });
};
</script>
