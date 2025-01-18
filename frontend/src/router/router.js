import { createRouter, createWebHistory } from 'vue-router';

import StudentEnrollment from '@/components/StudentEnrollment.vue';
import Reports from '@/components/Faculty.vue';
import CourseDetails from '@/components/CourseDetails.vue';
import StudentProfile from '@/components/Students.vue';

const routes = [

  {
    path: '/enrol',
    component: StudentEnrollment,
    name: 'StudentEnrollment'
  },
  {
    path: '/reports',
    component: Reports,
    name: 'Reports'
  },
  {
    path: '/coursedetails',
    component: CourseDetails,
    name: 'CourseDetails'
  },
  {
    path: '/profile',
    component: StudentProfile,
    name: 'StudentProfile'
  },
 

];

const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes });
export default router;