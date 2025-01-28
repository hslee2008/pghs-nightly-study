<template>
  <div class="d-flex ga-6">
    <v-card flat width="500px">
      <v-card-title class="text-center">야자 1교시</v-card-title>
      <template v-slot:text>
        <v-text-field
          v-model="search1"
          placeholder="야자 1교시 학생 검색하기"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          clearable
          rounded="lg"
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
        density="compact"
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
              <v-list-item @click="deleteStudent(1, item)" base-color="red">
                <v-list-item-title>
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
          placeholder="야자 2교시 학생 검색하기"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          clearable
          rounded="lg"
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
        density="compact"
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
              <v-list-item @click="deleteStudent(1, item)" base-color="red">
                <v-list-item-title>
                  <v-icon>mdi-delete</v-icon>
                  삭제하기
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const time = ref(null);
const date = ref(null);

const data = ref([]);
const search1 = ref("");
const search2 = ref("");
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

const deleteStudent = (schedule, item) => {
  const checkInDB = dbRef(
    $db,
    `check-in/${date.value}/${schedule}/${item.studentId}`
  );
  onValue(checkInDB, (snapshot) => {
    if (snapshot.exists()) {
      set(checkInDB, null);
    }
  });
};
</script>
