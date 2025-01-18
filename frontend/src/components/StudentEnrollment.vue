<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="card" style="width: 60rem;">
          <h5 class="card-header">Course Enrollments</h5>
          <div class="card-body">
            <form @submit.prevent="lookupEnrollments" class="enrollment-form">
              <div class="row mb-3">
                <label for="course_id" class="col-sm-2 col-form-label">Course ID:</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" id="course_id" v-model="form.course_id" required>
                </div>
              </div>
              <button type="button" class="btn btn-primary" @click="confirmCourse">Confirm</button>
              <br> <br>
  
              <!-- Display Enrollments or Error -->
              <div v-if="enrollments.length > 0" class="enrollment-list">
                <h5>Students Enrolled in the Course:</h5>
                <ul>
                  <li v-for="student in enrollments" :key="student.student_id">
                    {{ student.student_name }} ({{ student.student_id }})
                  </li>
                </ul>
              </div>
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios';
  import { reactive, ref } from 'vue'; 
  
  const form = reactive({
    course_id: ''
  });
  
  const enrollments = ref([]);
  const error = ref('');
  
  const confirmCourse = async () => {
    if (!form.course_id) {
      error.value = 'Please enter a Course ID before confirming.';
      enrollments.value = [];
      return;
    }
    try {
      const response = await axios.get(`http://127.0.0.1:5000/enrollments/${form.course_id}`);
      enrollments.value = response.data;
      error.value = '';
    } catch (err) {
      error.value = 'Failed to fetch enrollments. Please check the Course ID and try again.';
      enrollments.value = [];
      console.error('Error fetching course enrollments:', err.message);
    }
  };
  
  const lookupEnrollments = async () => {
    // This will now be handled by the `confirmCourse` function.
    // We don't need to submit a form here, as it's just confirming the course.
  };
  
  </script>
  
  <style scoped>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  
  .enrollment-form .form-control {
    width: 450px;
  }
  
  .card {
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h5 {
    text-align: center;
  }
  
  .enrollment-list {
    margin-top: 20px;
  }
  
  .alert {
    color: red;
    font-weight: bold;
  }
  </style>
  