<script lang="ts">
export default {
  name: 'ZLoader',
};
</script>

<script setup lang="ts"></script>

<template>
  <div class="loader-wrapper">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader-wrapper {
  position: absolute;
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);

  display: flex;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 1px solid currentcolor;
  border-radius: 50%;
  animation: 1s loader-04 linear infinite;
  position: relative;

  display: inline-block;
  width: 2em;
  height: 2em;
  vertical-align: middle;
  pointer-events: none;

  &::before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    position: absolute;
    top: -0.2em;
    left: 50%;
    border: 0.4em solid currentcolor;
    border-radius: 50%;
  }
}

@keyframes loader-04 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
