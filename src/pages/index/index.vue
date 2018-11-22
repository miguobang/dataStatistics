<template>
  <div id="app">
    <toptitle class="top-title"></toptitle>
    <div class="magin-center">
    <aside-nav class="aside-content"></aside-nav>
    <router-view class="main-content"></router-view>
    </div>
  </div>
</template>

<script>
import TopTitle from '../../components/index/TopTitle.vue';
import AsideNav from '../../components/index/AsideNav.vue';
export default {
  name: 'app',
   components: {
   Toptitle: TopTitle,
   AsideNav:AsideNav
  },
}
    $(function(){
      setInterval(
        function()
        {$(".aside-content").css("height", $(".main-content").innerHeight());},
      10) 
    })
    
</script>

<style>
</style>
