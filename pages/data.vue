<template>
  <div class="text-center mx-10">
    <h1 class="text-grey-darken-2">야자 출석 순위</h1>

    <br />

    <v-card v-if="loading" class="mb-3" elevation="0" width="90vw">
      <v-progress-linear color="primary" indeterminate></v-progress-linear>
    </v-card>

    <div v-if="!loading">
      <v-card
        v-for="(student, index) in students"
        :key="index"
        class="mb-3"
        @click="showStudentDetails(student)"
        variant="tonal"
        width="90vw"
      >
        <div class="ml-3 mt-3" style="position: absolute">
          <p class="text-decoration-underline">{{ student.rank }}등</p>
        </div>
        <div>
          <v-card-title v-if="student.name">
            {{ student.name?.toString().split("")[0] }} *
            {{ student.name?.toString().split("")[2] }}
          </v-card-title>
          <v-card-text>
            <p>출석 횟수: {{ student.attendanceCount }}회</p>
          </v-card-text>
        </div>
      </v-card>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="text-h5">학생 정보</v-card-title>
          <v-card-text>
            <p><strong>순위:</strong> {{ selectedStudent.rank }}</p>
            <p><strong>이름:</strong> {{ selectedStudent.name }}</p>
            <p>
              <strong>출석 횟수:</strong>
              {{ selectedStudent.attendanceCount }}회
            </p>
            <p>
              <strong>최근 출석일:</strong>
              {{ selectedStudent.lastAttendanceDate }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">닫기</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-footer style="position: absolute; bottom: 0; right: 0; width: 100%">
        <v-btn color="primary" block variant="tonal" to="/check-in">
          <v-icon>mdi-chevron-left</v-icon> 돌아가기
        </v-btn>
      </v-footer>
    </div>
  </div>
</template>

<script setup>
const { $db } = useNuxtApp();

const students = ref([]);
const dialog = ref(false);
const selectedStudent = ref({});
const loading = ref(true);

function showStudentDetails(student) {
  selectedStudent.value = student;
  dialog.value = true;
}

onMounted(() => {
  const studentsDB = dbRef($db, "students");

  onValue(studentsDB, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      const studentList = Object.keys(data).map((id) => {
        const attendanceRecords = data[id]["check-in"] || {};
        console.log(data[id]);
        const attendanceCount = Object.keys(attendanceRecords).length;
        const lastAttendanceDate =
          Object.keys(attendanceRecords).sort().pop() || "-";

        return {
          rank: 0, // Placeholder; will calculate below
          name: data[id]?.name,
          attendanceCount,
          lastAttendanceDate,
        };
      });

      // Sort by attendance count descending and assign ranks
      studentList.sort((a, b) => {
        if (a.attendanceCount === b.attendanceCount) {
          return a.lastAttendanceDate < b.lastAttendanceDate ? 1 : -1;
        }
        return b.attendanceCount - a.attendanceCount;
      });
      studentList.forEach((student, index) => {
        student.rank = index + 1;
      });

      students.value = studentList;

      setTimeout(() => {
        loading.value = false;
      }, 1000);
    }
  });
});
</script>

<style>
.v-card {
  max-width: 800px;
  margin: 0 auto;
  cursor: pointer;
}
</style>
