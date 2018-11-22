<!--  -->
<template>
  <div class="asnav">
    <el-row class="tac">
  <el-col :span="12">
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo left-nav"
    >
    <!-- default-active="1" 默认选中样式 -->
      <el-menu-item @click="AsideNav1()"  v-bind:index="i1" class="item">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">前端交互统计</span>
      </el-menu-item>
      <el-menu-item @click="AsideNav2()" v-bind:index="i2" class="item">
        <i class="el-icon-service"></i>
        <span slot="title">服务运行统计</span>
      </el-menu-item>
      <el-menu-item @click="AsideNav3()" v-bind:index="i3" class="item">
        <i class="el-icon-menu"></i>
        <span slot="title">业务使用情况</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</el-row>
  </div>
</template>

<script>
import EventBus from "../../js/bus";
export default {
  data() {
    return {
      i1: "1",
      i2: "2",
      i3: "3",
      // style: {minHeight:window.screen.availHeight+'px',},
    };
  },
  mounted() {
    this.getUrl();
  },
  created() {},
  methods: {
    getUrl: function() {
      var urlparam = window.location.href;
      if (urlparam.indexOf("2") != -1) {
        this.i2 = "1";
        this.i1 = "2";
        this.i3 = "3";
      }
      if (urlparam.indexOf("3") != -1) {
        this.i3 = "1";
        this.i1 = "3";
        this.i2 = "2";
      }
    }, //页面间传递type的值
    AsideNav1: function() {
      this.$router.push({ path: "/nav1" });
    },
    AsideNav2: function() {
      this.$router.push({ path: "/nav2" });
    },
    AsideNav3: function() {
      this.$router.push({ path: "/nav3" });
    }
    // demo(number) {
    //   EventBus.$emit("getNumber", number);
    //   this.$router.push({ path: "/#" });
    // }
  }
};
</script>
<style>

</style>