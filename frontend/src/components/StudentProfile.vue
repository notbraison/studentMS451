<template>
  <div class="container profile-page mt-5">
    <h1>Student Profile</h1>
    <br />

    <section class="profile-content text-center">
      <div class="card mx-auto" style="width: 35rem;" v-if="student">
        <div class="card-body">
          <h2 class="card-title">{{ student.firstname }} {{ student.lastname }}</h2>
          <p class="card-text"><strong>Email:</strong> {{ student.email }}</p>
          <p class="card-text"><strong>Contact:</strong> {{ student.phone_number }}</p>
          <p class="card-text"><strong>Gender:</strong> {{ student.gender }}</p>
          <p class="card-text"><strong>National ID:</strong> {{ student.national_id }}</p>
          <p class="card-text"><strong>Date of Birth:</strong> {{ formattedDate(student.dob) }}</p>
          <p class="card-text"><strong>Age:</strong> {{ student.age }}</p>
          <p class="card-text"><strong>Address:</strong> {{ student.address }}</p>
          <p class="card-text"><strong>Courses Enrolled:</strong></p>
          <ul>
            <li v-for="course in student.courses" :key="course.course_id">
              {{ course.course_name }} ({{ course.course_credits }} credits)
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>Loading student data...</p>
      </div>
    </section>

    <br />
    <div class="text-center mt-4">
      <button class="btn btn-primary" @click="toggleForm">{{ showForm ? 'Cancel' : 'Update Profile' }}</button>
    </div>
    <br />

    <div class="update-form mt-4" v-if="showForm">
      <form @submit.prevent="updateStudent">
        <div class="card mx-auto" style="width: 35rem;">
          <div class="card-body">
            <h5 class="card-title">Update Profile</h5>
            <br />
            <div class="form-group">
              <label for="firstname">First Name:</label>
              <input v-model="updatedStudent.firstname" type="text" id="firstname" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="lastname">Last Name:</label>
              <input v-model="updatedStudent.lastname" type="text" id="lastname" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="email">Email:</label>
              <input v-model="updatedStudent.email" type="email" id="email" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="phone_number">Phone Number:</label>
              <input v-model="updatedStudent.phone_number" type="text" id="phone_number" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="gender">Gender:</label>
              <select v-model="updatedStudent.gender" id="gender" class="form-control" required>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div class="form-group mt-3">
              <label for="dob">Date of Birth:</label>
              <input v-model="updatedStudent.dob" type="date" id="dob" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="age">Age:</label>
              <input v-model="updatedStudent.age" type="number" id="age" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="address">Address:</label>
              <input v-model="updatedStudent.address" type="text" id="address" class="form-control" required />
            </div>
            <div class="form-group mt-3">
              <label for="courses">Courses:</label>
              <select multiple v-model="updatedStudent.courses" id="courses" class="form-control" required>
                <option v-for="course in courseList" :key="course.course_id" :value="course">
                  {{ course.course_name }} ({{ course.course_credits }} credits)
                </option>
              </select>
              <small class="form-text text-muted">Hold Ctrl (Cmd on Mac) to select multiple courses.</small>
            </div>
            <button type="submit" class="btn btn-success mt-4">Save Changes</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentProfile',
  data() {
    return {
      student: null,
      showForm: false,
      updatedStudent: {},
      courseList: [],
    };
  },
  methods: {
    async fetchStudent() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/student'); // Replace with actual endpoint
        this.student = response.data;
        this.updatedStudent = { ...response.data }; // Initialize the form with existing data
      } catch (error) {
        console.error('Error fetching student:', error.message);
      }
    },
    async fetchCourses() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/courses'); // Replace with actual endpoint
        this.courseList = response.data;
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    },
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async updateStudent() {
      try {
        await axios.put('http://127.0.0.1:8000/api/student', this.updatedStudent); // Replace with actual endpoint
        alert('Profile updated successfully');
        this.student = { ...this.updatedStudent }; // Update the displayed data
        this.showForm = false;
      } catch (error) {
        console.error('Error updating student:', error.message);
      }
    },
    formattedDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchStudent();
    this.fetchCourses();
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
</style>
