<!--  -->
<template>
  <div>
    <el-row class="tac">
  <el-col :span="12">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo left-nav"
    >
      <el-menu-item @click="changePage1()"  v-bind:index="h1" class="item">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">前端交互统计</span>
      </el-menu-item>
      <el-menu-item @click="changePage2()" v-bind:index="h2" class="item">
        <i class="el-icon-service"></i>
        <span slot="title">服务运行统计</span>
      </el-menu-item>
      <el-menu-item @click="changePage3()" v-bind:index="h3" class="item">
        <i class="el-icon-menu"></i>
        <span slot="title">业务使用情况</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</el-row>
  </div>
</template>

<script>
import EventBus from "../js/bus";
export default {
  data(){
    return{
       h1:"",
       h2:"",
       h3:"",
       type1:1,
       type2:2,
       type3:3
    }
   
  },
  created(){
        EventBus.$on('getType', statType => {  
            if(statType==0){
                this.h1="1";
            }
             if(statType==1){
                this.h2="1";
            }
             if(statType==2){
                this.h3="1";
            }
        });
  },
  methods: {
    changePage1:function(){
      window.location.href="index.html";
    },
    changePage2:function(){
      window.location.href="index.html#nav2";
    },
    changePage3:function(){
       window.location.href="index.html#nav3";
    },
    // demo(number) {
    //   EventBus.$emit("getNumber", number);
    //   this.$router.push({ path: "/#" });
    // }
  }
};
</script>
<style>

</style>