<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">   
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link to="/enrol" class="nav-link active"> Enrollment</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/profile" class="nav-link active">Student</router-link>
            </li>
            <li class="nav-item" >
              <router-link to="/coursedetails" class="nav-link active">Course Details</router-link>
            </li>
            <li class="nav-item" >
              <router-link to="/reports" class="nav-link active">Faculty</router-link>
            </li>
        </ul>
        </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
    data() {
      return {
        
      };
    },
  };
  </script>
  
  <style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    padding: 10px;
    background-color: #333; /* Example background */
    z-index: 1000; /* Ensures it's above other content */
  }
  
  .nav-link {
    color: white; /* Link color */
  }
  
  .user-welcome {
    color: #007bff;
    font-size: 19px;
    font-weight: bold;
  }
  
  /* Adjustments to position the logout button and profile icon */
  .navbar-nav:last-child {
    display: flex;
    align-items: center; /* Vertically center items */
  }
  
  .nav-item {
    margin-left: 20px; /* Space between logout and profile */
  }
  </style>
  