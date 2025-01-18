<template>
  <div class="container profile-page mt-5">
    <h1>Students Under CS Faculty</h1>
    <br />

    <section class="profile-content text-center">
      <!-- Faculty selection -->
      <div class="form-group">
        <label for="faculty_id">Select Faculty:</label>
        <select v-model="selectedFaculty" id="faculty_id" class="form-control" @change="fetchStudents">
          <option v-for="faculty in facultyList" :key="faculty.faculty_id" :value="faculty.faculty_id">
            {{ faculty.name }}
          </option>
        </select>
      </div>

      <!-- Student List -->
      <div v-if="students.length > 0" class="student-list mt-4">
        <h5>Students under {{ selectedFacultyName }} Faculty:</h5>
        <ul>
          <li v-for="student in students" :key="student.student_id">
            {{ student.firstname }} {{ student.lastname }} ({{ student.student_id }})
          </li>
        </ul>
      </div>
      <div v-else>
        <p>No students found for the selected faculty.</p>
      </div>
    </section>

    <br />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FindStudentsByFaculty',
  data() {
    return {
      facultyList: [], // List of all faculties
      students: [], // List of students under selected faculty
      selectedFaculty: null, // Selected faculty ID
      selectedFacultyName: '', // Selected faculty name
    };
  },
  methods: {
    // Fetch all faculties
    async fetchFaculties() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/faculties'); // Replace with actual endpoint
        this.facultyList = response.data;
      } catch (error) {
        console.error('Error fetching faculties:', error.message);
      }
    },
    
    // Fetch students under the selected faculty
    async fetchStudents() {
      if (!this.selectedFaculty) return;
      
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/students/faculty/${this.selectedFaculty}`); // Endpoint for fetching students based on faculty
        this.students = response.data;
        
        // Set the faculty name for display
        const faculty = this.facultyList.find(fac => fac.faculty_id === this.selectedFaculty);
        this.selectedFacultyName = faculty ? faculty.name : '';
      } catch (error) {
        console.error('Error fetching students:', error.message);
      }
    },
  },
  mounted() {
    this.fetchFaculties();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  margin-bottom: 20px;
}

.btn {
  width: 100%;
}

.form-control {
  margin-bottom: 10px;
}

.student-list {
  margin-top: 20px;
}

.student-list ul {
  list-style-type: none;
  padding: 0;
}

.student-list li {
  margin: 10px 0;
}
</style>
