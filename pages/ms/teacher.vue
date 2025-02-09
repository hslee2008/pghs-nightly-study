<template>
  <v-container>
    <!-- Page Title -->
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 font-weight-bold">아침 자습 출석부</h1>
      </v-col>
    </v-row>

    <!-- Global Search Bar & Checkbox -->
    <v-row justify="center" class="mb-5">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          placeholder="학생 검색하기"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          clearable
          rounded="lg"
        ></v-text-field>
        <v-select
          v-if="showSingleClass"
          class="mt-3"
          v-model="selectedClass"
          :items="categories"
          :item-title="formatCategory"
          :item-value="(category) => category"
          label="반 선택"
          hide-details
          variant="outlined"
        ></v-select>
        <v-checkbox v-model="showSingleClass" label="한 반씩 보기"></v-checkbox>
      </v-col>
    </v-row>

    <!-- Student Tables -->
    <v-row width="vw" justify="center">
      <v-col
        v-for="(category, i) in displayedCategories"
        :key="category"
        cols="12"
        sm="12"
        md="6"
        v-if="showClass(category)"
      >
        <v-card flat>
          <!-- Formatted Title -->
          <v-card-title class="text-center text-h6 font-weight-bold">
            {{ formatCategory(category) }}
          </v-card-title>

          <v-data-table
            :headers="tableHeaders"
            :items="filteredStudents(category)"
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
                  <v-list-item @click="deleteStudent(item)" base-color="red">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { $db } = useNuxtApp();

const search = ref("");
const sortedStudents = ref({});
const showSingleClass = ref(false); // Checkbox state
const selectedClass = ref(null); // Selected class from dropdown

const categories = [
  "101",
  "102",
  "103",
  "104",
  "105",
  "106",
  "107",
  "108",
  "201",
  "202",
  "203",
  "204",
  "205",
  "206",
  "207",
  "208",
];

const tableHeaders = [
  { key: "studentId", title: "학번" },
  { key: "name", title: "이름" },
  { key: "time", title: "출석 시간" },
  { key: "actions", title: "더보기" },
];

onMounted(() => {
  const checkInDB = dbRef($db, "zms-students");
  onValue(checkInDB, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const categorizedStudents = {};

      // Initialize categories
      categories.forEach((category) => {
        categorizedStudents[category] = [];
      });

      // Distribute students into categories
      Object.keys(data).forEach((studentId, _) => {
        const student = data[studentId];
        const category = categorizeStudent(studentId);

        // Get today's date in the expected format
        const today = new Date().toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });

        // Extract today's check-in time if it exists
        const checkInTime = student["check-in"]?.[today]?.time || "-";

        // Add student to the correct category with extracted time
        if (categorizedStudents[category]) {
          categorizedStudents[category].push({
            ...student,
            studentId,
            time: checkInTime,
          });
        }
      });

      sortedStudents.value = categorizedStudents;
    }
  });
});

const categorizeStudent = (studentId_string) => {
  const studentId = parseInt(studentId_string.slice(0, 3));
  if (studentId >= 101 && studentId <= 108) {
    return `10${studentId % 10}`; // 101, 102, ..., 108
  } else if (studentId >= 201 && studentId <= 208) {
    return `20${studentId % 10}`; // 201, 202, ..., 208
  } else {
    return "Unknown";
  }
};

const formatCategory = (category) => {
  const year = category.startsWith("10") ? "1학년" : "2학년";
  const classNum = category.slice(-1) + "반";
  return `${year} ${classNum}`;
};

// Determines which categories to display based on checkbox
const displayedCategories = computed(() => {
  return showSingleClass.value && selectedClass.value
    ? [selectedClass.value]
    : categories;
});

// Check if there are students matching the search
const hasMatchingStudents = (category) => {
  return filteredStudents(category).length > 0;
};

// Logic to determine if a class should be shown
const showClass = (category) => {
  return !search.value || hasMatchingStudents(category);
};

const filteredStudents = (category) => {
  if (!search.value) return sortedStudents.value[category] || [];
  return (sortedStudents.value[category] || []).filter(
    (student) =>
      student.name.includes(search.value) ||
      student.studentId.includes(search.value)
  );
};

const deleteStudent = (student) => {
  const studentRef = dbRef($db, `zms-students/${student.studentId}`);
  set(studentRef, null);
  reloadWindow();
};
</script>
