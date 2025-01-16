<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="card" style="width: 60rem;">
                <h5 class="card-header">Student Enrollment</h5>
                <div class="card-body">
                    <form @submit.prevent="enrollStudent" class="enrollment-form">
                        <div class="row mb-3">
                            <label for="student_id" class="col-sm-2 col-form-label">Student ID:</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="student_id" v-model="form.student_id" required>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary" @click="confirmStudent">Confirm</button>
                        <br> <br>

                        <!-- Display Enrollments or Error -->
                        <div v-if="enrollments.length > 0" class="enrollment-list">
                            <h5>Student Enrollments:</h5>
                            <ul>
                                <li v-for="enrollment in enrollments" :key="enrollment.course_id">
                                    {{ enrollment.course_name }} ({{ enrollment.course_credits }} credits)
                                </li>
                            </ul>
                        </div>
                        <div v-if="error" class="alert alert-danger">{{ error }}</div>

                        <div class="row mb-3 mt-4">
                            <label for="courses" class="col-sm-2 col-form-label">Courses:</label>
                            <div class="col-sm-10">
                                <select multiple class="form-control" id="courses" v-model="form.courses" required>
                                    <option v-for="course in courseList" :key="course.course_id" :value="course">
                                        {{ course.course_name }} ({{ course.course_credits }} credits)
                                    </option>
                                </select>
                                <small class="form-text text-muted">Hold Ctrl (Cmd on Mac) to select multiple courses.</small>
                            </div>
                        </div>
                        <br>
                        <div class="col-auto">
                            <button class="btn btn-primary" type="reset">Reset</button>
                            &nbsp; &nbsp;
                            <button type="submit" class="btn btn-success" name="submit" value="Enroll">Enroll</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { reactive, ref, onMounted } from 'vue'; // Import onMounted here

const form = reactive({
    student_id: '',
    courses: []
});

const courseList = ref([]);
const enrollments = ref([]);
const error = ref('');

const fetchCourses = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:5000/courses`);
        courseList.value = response.data;
    } catch (err) {
        console.error('Error fetching courses:', err.message);
    }
};

const confirmStudent = async () => {
    if (!form.student_id) {
        error.value = 'Please enter a Student ID before confirming.';
        enrollments.value = [];
        return;
    }
    try {
        const response = await axios.get(`http://127.0.0.1:5000/courses/${form.student_id}`);
        enrollments.value = response.data;
        error.value = '';
    } catch (err) {
        error.value = 'Failed to fetch enrollments. Please check the Student ID and try again.';
        enrollments.value = [];
        console.error('Error fetching student enrollments:', err.message);
    }
};

const enrollStudent = async () => {
    const newEnrollment = {
        student_id: form.student_id,
        courses: form.courses.map(course => ({
            course_id: course.course_id,
            course_name: course.course_name,
            course_credits: course.course_credits
        }))
    };
    try {
        await axios.post('http://127.0.0.1:5000/enrol', newEnrollment);
        alert('Student enrolled successfully');
        form.courses = [];
    } catch (err) {
        console.error('Error enrolling student:', err.message);
    }
};

onMounted(fetchCourses);
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
