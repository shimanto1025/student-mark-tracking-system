<template>
  <router-view />
</template>

<script setup>
// Main app component - just a router view container
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Print styles */
@media print {
  body * {
    visibility: hidden;
  }
  .report-preview, .report-preview * {
    visibility: visible;
  }
  .report-preview {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>