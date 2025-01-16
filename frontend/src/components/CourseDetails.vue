<template>
    <div class="container">
      <h1 class="text-center">All Courses</h1>
  
      <div class="filter-section mt-4">
        <label for="departmentFilter" class="form-label"><strong>Filter by Department:</strong></label>
        <select id="departmentFilter" class="form-select" v-model="selectedDepartment" @change="filterCourses">
          <option value="">All Departments</option>
          <option v-for="department in uniqueDepartments" :key="department" :value="department">
            {{ department }}
          </option>
        </select>
      </div>
  
      <div v-if="filteredCourses.length > 0" class="table-responsive mt-4">
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in filteredCourses" :key="course.course_id">
              <td>{{ course.course_id }}</td>
              <td>{{ course.course_name }}</td>
              <td>{{ course.course_credits }}</td>
              <td>{{ course.department }}</td>
              <td><button class="btn btn-warning btn-sm" @click="edit(building)">Edit</button></td>

            </tr>
          </tbody>
        </table>
      </div>
  
      <div v-if="!loading && filteredCourses.length === 0" class="alert alert-warning">
        No courses available for the selected department.
      </div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="loading" class="alert alert-info">Loading courses...</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        courses: [],
        filteredCourses: [],
        uniqueDepartments: [],
        selectedDepartment: '',
        error: '',
        loading: true,
      };
    },
    methods: {
      async fetchCourses() {
        try {
          const response = await axios.get('http://localhost:5000/courses'); // Replace with your API endpoint
          this.courses = response.data;
          this.filteredCourses = response.data;
          this.uniqueDepartments = [
            ...new Set(response.data.map((course) => course.department)),
          ];
          this.error = '';
        } catch (err) {
          this.error = 'Failed to fetch courses. Please try again later.';
          this.courses = [];
          this.filteredCourses = [];
          this.uniqueDepartments = [];
        } finally {
          this.loading = false;
        }
      },
      filterCourses() {
        if (this.selectedDepartment) {
          this.filteredCourses = this.courses.filter(
            (course) => course.department === this.selectedDepartment
          );
        } else {
          this.filteredCourses = this.courses; // Show all courses if no department is selected
        }
      },
    },
    mounted() {
      this.fetchCourses(); // Fetch courses on page load
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #343a40;
  }
  
  .filter-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .table {
    margin-top: 20px;
    font-size: 1rem;
    text-align: left;
  }
  
  .thead-dark {
    background-color: #343a40;
    color: white;
  }
  
  .alert {
    margin-top: 20px;
  }
  </style>
  