<template>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
    <p v-else>Loading chart data...</p>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from "chart.js";
import { Bar } from "vue-chartjs";
import { ref, onMounted } from "vue";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { $db } = useNuxtApp(); // Access Nuxt's injected Firebase database
const chartData = ref(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top"
    },
    title: {
      display: true,
      text: "Attendance by Day of the Week"
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Day of the Week"
      }
    },
    y: {
      title: {
        display: true,
        text: "Number of Students"
      },
      beginAtZero: true
    }
  }
};

// Fetch and process attendance data
const fetchAttendanceData = async () => {
  const attendanceByDay = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0
  };

  const studentsDB = dbRef($db, "students");

  onValue(studentsDB, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Process attendance records
      Object.values(data).forEach((student) => {
        const attendanceRecords = student["check-in"] || {};
        Object.keys(attendanceRecords).forEach((date) => {
          const dayOfWeek = new Date(date).toLocaleString("en-US", {
            weekday: "long"
          });
          attendanceByDay[dayOfWeek] += 1;
        });
      });

      // Prepare data for the chart
      chartData.value = {
        labels: Object.keys(attendanceByDay),
        datasets: [
          {
            label: "Number of Students",
            backgroundColor: "#42a5f5",
            borderColor: "#1e88e5",
            borderWidth: 1,
            data: Object.values(attendanceByDay)
          }
        ]
      };
    }
  });
};

onMounted(fetchAttendanceData);
</script>

<style scoped>
div {
  text-align: center;
}
</style>
