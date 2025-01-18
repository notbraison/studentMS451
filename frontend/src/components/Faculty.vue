<template>
    <div class="container mt-5">
      <h1>Computer Science Faculty Members</h1>
      <br />
  
      <section class="faculty-list">
        <div v-if="facultyList.length > 0" class="faculty-cards">
          <div class="card" v-for="faculty in facultyList" :key="faculty.faculty_id" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">{{ faculty.firstname }} {{ faculty.lastname }}</h5>
              <p class="card-text"><strong>Email:</strong> {{ faculty.email }}</p>
              <p class="card-text"><strong>Phone:</strong> {{ faculty.phone_number }}</p>
              <p class="card-text"><strong>Department:</strong> {{ faculty.department }}</p>
              <p class="card-text"><strong>Courses Taught:</strong></p>
              <ul>
                <li v-for="course in faculty.courses" :key="course.course_id">
                  {{ course.course_name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        <div v-else>
          <p>No Computer Science faculty members found.</p>
        </div>
      </section>
  
      <br />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'FindCSFaculty',
    data() {
      return {
        facultyList: [], // List of faculty members under CS
      };
    },
    methods: {
      // Fetch all faculty members under Computer Science department
      async fetchCSFaculty() {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/faculty/cs'); // Replace with the actual endpoint for fetching CS faculty
          this.facultyList = response.data;
        } catch (error) {
          console.error('Error fetching faculty members:', error.message);
        }
      },
    },
    mounted() {
      this.fetchCSFaculty(); // Fetch CS faculty members on component mount
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .faculty-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .card {
    margin-bottom: 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .card-title {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .card-text {
    font-size: 1rem;
  }
  
  .card-text ul {
    list-style-type: none;
    padding: 0;
  }
  
  .card-text li {
    margin: 5px 0;
  }
  </style>
  