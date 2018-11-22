<template>
    <div id="app">
    <toptitle class="top-title"></toptitle>
    <div class="magin-center">
    <aside-nav-child class="aside-content"></aside-nav-child>
    <router-view class="main-content"></router-view>
    </div>
    </div>
</template>

<script>
import history from 'components/history.vue'
import TopTitle from '../../components/index/TopTitle.vue';
import AsideNavChild from '../../components/AsideNavChild.vue';
export default {
  name: 'app',
  components:{
   history:history,
   Toptitle: TopTitle,
   AsideNavChild:AsideNavChild}
}
$(function() {
  setInterval(function() {
    $(".aside-content").css("height", $(".main-content").innerHeight());
  }, 10);
});//左右两块高度相等
</script>

<style>

</style>
