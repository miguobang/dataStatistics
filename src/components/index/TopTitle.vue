<!--  -->
<template>
<div class="mytitle">
  
  <div class="logo">
    <img src="../../assets/bonfire.png" alt="" width="30px" height="30px"></div>
  <div class="ruiyun">{{msg}}</div>

    <div class="repairDiv">
    <div class="repair-img">
      <img src="../../assets/repair.png" alt=""></div>
    <div class="repair">{{repair}}</div>
    </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "数据统计系统",
      repair: "维护"
    };
  },

  components: {},

  computed: {},

  /* mounted: {}, */

  methods: {}
};
</script>
<style>

</style>