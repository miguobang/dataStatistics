<template>
  <div>
      <div class="list-content" >  
        <div class="choosed">历史趋势>{{value}}>{{busiselected}}>{{acted}}
           <span style="margin-left:710px; font-size:12px;cursor:pointer" @click="goIndex">返回</span>
          </div><!-- 显示对应选择 -->
      </div>
     <!-- 返回index -->         
      <div class="time-content1">
          <div class="dis-ib">
          <el-radio-group v-model="radio2" @change="hourdaymonth">
            <el-radio :label="1">小时</el-radio>
            <el-radio :label="2">天</el-radio>
            <el-radio :label="3">月</el-radio>
          </el-radio-group>
          </div>
       <div class="time-position time-position1" >
          <div class="block" style="display:inline-block;"> 
          <el-date-picker
            v-model="value7"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="timechange"
            :picker-options="pickerOptions2"
            >
          </el-date-picker>
          </div>  <!-- 选择时间 -->
        </div><!-- 时间栏控件 -->
    </div>
    
     <!-- Element时间栏控件 -->

  <div id="charts">
    <div id="main"  :style="{width:'1000px',height:'400px',padding:'20px 0px 0px 20px'}"></div>
  </div><!-- echart -->
     <!-- 百度Echart控件- -->
      <div class="busi-s busi-s1">
        <div>
          <el-button class="page-ml" @click="Dprepage">前一页</el-button>
          <el-button  type="primary">{{pageval}}</el-button>
          <el-button class="next-btn" @click="Dnextpage">后一页</el-button>
          </div>
        </div>
      <!-- pre-next page -->
      <div>
      <el-table
            :data="tableData"
            @sort-change="sortChange"
            :default-sort = "{prop: 'times', order: 'descending'}"
            >
            <el-table-column
              width="20">
            </el-table-column>
            <el-table-column
              prop="timeList"
              sortable="custom"
              label="时段"
              width="150">
            </el-table-column>
            <el-table-column
              prop="userNum"
              label="人数"
              sortable="custom"
              width="180">
            </el-table-column>
            <el-table-column
              prop="times"
              sortable="custom"
              label="次数">
            </el-table-column>
            <el-table-column
              prop="timesOk"
              sortable="custom"
              label="成功次数">
            </el-table-column>
            <el-table-column
              prop="timesFail"
              sortable="custom"
              label="失败次数">
            </el-table-column>
            <el-table-column
              prop="useTime"
              sortable="custom"
              label="平均耗时">
            </el-table-column>
        </el-table>
    </div>
  <!-- Table List 显示控件- -->

    <div class="pagetag-content">
    <div class="block block-position" >
    <el-pagination
      
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10,20,40,100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="sum">
    </el-pagination>
     </div>
     </div>
     <!-- 底部分页器 -->
  </div> 
</template>
<script>
import echarts from "echarts";
import index from "vue";
import EventBus from "../js/bus";
export default {
  data() {
    return {
      param:{},
      ctype: "", //初始nav//由Main.vue传过来
      value: "", //初始产品//由Main.vue传过来
      productions: [],
      daycount:1,
      pickerOptions2: {
         disabledDate(time) {
            return time.getTime() > Date.now();
          },
         shortcuts: [
           {
            text: '前一天',
            onClick:(picker)=>{
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (this.daycount++));
              const end=start;
              picker.$emit('pick', [end, start]);
            }
          },
           {
            text: '后一天',
            onClick:(picker)=> {
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24* (-2+this.daycount--));
              const end = start;
              picker.$emit('pick', [start, end]);
            }
            
          },
            {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
              picker.$emit('pick', [start, end]);
            }
          },
           {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      }, //时间控件
      radio2: 1, //时间控件 1 小时 2 天 3月
      value7: [], //时间(两个值) [0]:开始 [1]：结束 //今天
      tabPosition: "7", //近X日
      radio: "1",
      quota: ["用户数", "次数", "成功次数", "失败次数"],
      evalue: "",
      busi: [],
      active: [],
      activeselected: "1",
      busiselected: [],
      tableData: [],
      currentRow: null,
      currentPage: "1",
      pageval: "1", //当前页码
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 1,
      sum: 0,
      pagedata:[],//分组后的数据集合
      ctypeValue: "1",
      acted: "",
      dtmp: "",
      dxtmp: {},
      dytmp: {
        type: "value",
        axisLabel: {
          formatter: "{value}"
        }
      },
      urlParam:"",
      changeSize:10,
      noTagPageTableData:[],
    };
  },

  components: {},

  computed: {},

  created(){
    this.getUrl();
  }
  ,
  mounted() {
    
   },
  beforeDestroy(){
   
  },//销毁EvebtBus
  watch: {},
  methods: {
//  ------------获取url参数-初始化模块-----------
    getUrl:function(){
         var urlparam=this.getUrlParam("param");
         this.reciveValue=JSON.parse(urlparam);
         this.detailInitial(this.reciveValue);
         this.param=this.reciveValue;//和单页面应用时对接
         EventBus.$emit("getType", this.reciveValue.statType);//把所选类型传给AsideNavCild
    },//获取Url参数
    getUrlParam:function(paramName) {  
            var href = window.location.href;  
            var url = decodeURI(href);  
            var idx = url.indexOf("?");  
            var params = url.substring(idx + 1);  
            if (params) {  
                params = params.split("&");  
                for (var i = 0; i < params.length; i += 1) {  
                    var param = params[i].split("=");  
                    if (param[0] == paramName) {  
                        //完善获取url参数的逻辑  
                        var pArr = [];  
                        for (var k = 1, len = param.length; k < len; k++) {  
                            pArr.push(param[k]);  
                        }  
                        var p = pArr.join('=');  
                        var idx1 = p.indexOf("#");  
                        if (idx1 != -1) {  
                            p = p.substring(0, idx1);  
                        }  
                        return p;  
                    }  
                }  
            }  
    },//URL参数获取辅助：获取url的的名为paramName的参数
    detailInitial:function(reciveValue){
      this.value7=[reciveValue.startTime,reciveValue.endTime]
      this.value=reciveValue.product;
      this.busiselected=reciveValue.business;
      this.acted=reciveValue.action;
       var paramsByTime = {
        statType: reciveValue.statType, //必选
        product: reciveValue.product, //必选
        business: [reciveValue.business], //业务(详情页的business是只有一个//从Main.vue传过来)
        action: reciveValue.action,
        startTime: reciveValue.startTime,
        endTime: reciveValue.endTime
      };
      this.Dmysearch(paramsByTime);//执行初始绘图
    },//初始化 传给Dmysearch请求参数：类型、产品、业务、行为、起止时间
    Dmysearch: function(paramsByTime) {
      this.tableData=[];//清空tabledata
       if(this.busiselected=="全站总计"){
           if (this.radio2 == "1"){
          this.$http
            .post(
              "http://report.ruiyunnet.com/report/report/getTotalResult/hour",
              paramsByTime
            )
            .then(
          response => {
            console.log("===receive===")
            var timeAct = response.data; //获取返回data
            this.detailgetpainter(timeAct); //绘图Echart
            this.detailtable(timeAct); //绘表
            this.mypageTag();
          },
          response => {
            console.log("error");
          }
        );}
        else if(this.radio2 == "2"){
           this.$http
        .post(
          "http://report.ruiyunnet.com/report/report/getTotalResult/day",
          paramsByTime
        )
        .then(
          response => {
            var timeAct = response.data; //获取返回data
            this.detailgetpainter(timeAct); //绘图Echart
            this.detailtable(timeAct); //绘表
            this.mypageTag();
          },
          response => {
            console.log("error");
          }
        );
        }
        else if(this.radio2 == "3"){
           this.tabPosition="";
           this.$http
        .post(
          "http://report.ruiyunnet.com/report/report/getTotalResult/month",
          paramsByTime
        )
        .then(
          response => {
            var timeAct = response.data; //获取返回data
            this.detailgetpainter(timeAct); //绘图Echart
            this.detailtable(timeAct); //绘表
            this.mypageTag();
          },
          response => {
            console.log("error");
          }
        );
        }
       }
       else{
        if (this.radio2 == "1"){
        this.$http
          .post(
            "http://report.ruiyunnet.com/report/report/getBusinessByTime",
            paramsByTime
          )
          .then(
            response => {
              var timeAct = response.data; //获取返回data
              this.detailgetpainter(timeAct.details); //绘图Echart
              this.detailtable(timeAct.details); //绘表
              this.mypageTag();
            },
            response => {
              console.log("error");
            }
          );}
          else if(this.radio2 == "2"){
            this.$http
          .post(
            "http://report.ruiyunnet.com/report/report/getBusinessByTimeEveryDay",
            paramsByTime
          )
          .then(
            response => {
              var timeAct = response.data; //获取返回data
              this.detailgetpainter(timeAct.details); //绘图Echart
              this.detailtable(timeAct.details); //绘表
              this.mypageTag();
            },
            response => {
              console.log("error");
            }
          );
          }
          else if(this.radio2 == "3"){
            this.tabPosition="";
            this.$http
          .post(
            "http://report.ruiyunnet.com/report/report/getBusinessByTimeEveryMon",
            paramsByTime
          )
          .then(
            response => {
              var timeAct = response.data; //获取返回data
              this.detailgetpainter(timeAct.details); //绘图Echart
              this.detailtable(timeAct.details); //绘表
              this.mypageTag();
            },
            response => {
              console.log("error");
            }
          );
        }}
        
    }, //向后台请求，返回对应（类型、产品、业务、行为、起止时间）的所有指标信息
      //传给 绘图（detailgetpainter）绘表（detailtable）和执行分页
    detailgetpainter: function(detailpreday) {
      if(detailpreday===[]){
        console.log("您请求的数据为空")
      }
      else {
      var usercount = [];
      var count = [];
      var fail_count = [];
      var succ_count = [];
      var suss_time_average = [];
      var myxaxis = [];
      for (var b = 0; b < detailpreday.length; b++) {
        usercount.push(detailpreday[b].usercount);
        count.push(detailpreday[b].count);
        fail_count.push(detailpreday[b].fail_count);
        succ_count.push(detailpreday[b].succ_count);
        suss_time_average.push(detailpreday[b].suss_time_average);
        myxaxis.push(detailpreday[b].listdate);
      } //在确定只有一个具体业务和具体行为下，只用遍历组成一维数组
      var dataArr = [
        usercount,
        count,
        fail_count,
        succ_count,
        suss_time_average
      ];
      var pointname = [
        "用户数",
        "次数",
        "失败次数",
        "成功次数",
        "成功平均耗时"
      ];
      var mytmp = [];
      for (var i = 0; i < dataArr.length; i++) {
        mytmp[i] = {
          name: pointname[i],
          type: "line",
          data: dataArr[i],
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" }
            ]
          },
          markLine: {
            data: [{ type: "average", name: "平均值" }]
          }
        };
      }
      var myxtmp = [
        {
          type: "category",
          boundaryGap: false,
          data: myxaxis
        } //横坐标显示时间集合
      ];
      this.dtmp = mytmp;
      this.dxtmp = myxtmp;
      this.goEchart();
      } //绘图（一次）
    }, //绘图方法
    goEchart: function() {
      var myChart = echarts.init(document.getElementById("main"));
      myChart.setOption({
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["用户数", "次数", "成功次数", "成功平均耗时"]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: this.dxtmp, //横坐标
        yAxis: this.dytmp, //纵坐标
        series: this.dtmp //平均值最大最小值等
      });
    },//Echart原生方法
    detailtable: function(arr) {
      for (var i = 0; i < arr.length; i++) {
        var newsearch = {
          timeList: arr[i].listdate,
          userNum: arr[i].usercount,
          times: arr[i].count,
          timesOk: arr[i].succ_count,
          timesFail: arr[i].fail_count,
          useTime: arr[i].suss_time_average
        };
        this.tableData.push(newsearch); 
      }
    }, //绘表方法

// --------------时间控件（改变时间）---------------
    hourdaymonth:function(){
       var param=this.param;
          var newparam= {
            statType: param.statType, //必选
            product: param.product, //必选
            business: [param.business], //业务(详情页的business是只有一个//从Main.vue传过来)
            action: param.action,
            startTime: this.value7[0], //开始时间
            endTime: this.value7[1] //结束时间
          }; 
      this.Dmysearch(newparam);
    },
    mytime: function(day, x) {
      var day = new Date();
      day.setTime(day.getTime() - 24 * 60 * 60 * x);
      var s =
        day.getFullYear() +
        "-" +
        (day.getMonth() + 1) +
        "-" +
        day.getDate() +
        " " +
        "00:00:00";
      return s;
    }, //7天
    timechange: function() {
      this.tabPosition = "";
       var param=this.param;
          var newparam= {
            statType: param.statType, //必选
            product: param.product, //必选
            business: [param.business], //业务(详情页的business是只有一个//从Main.vue传过来)
            action: param.action,
            startTime: this.value7[0], //开始时间
            endTime: this.value7[1] //结束时间
          }; 
      this.Dmysearch(newparam);
    }, //时间发生改变后，请求searchtime
    //切换时间的组件
// ---------------分页--------------
    mypageTag: function() {
      var Listlength = this.tableData.length;
      this.noTagPageTableData=this.tableData;//将分页前的tabledata保存
      this.sum = Listlength; //总共有多少条数据
      var n=this.changeSize;
      if (Listlength > n) {
        var pageNum = Math.ceil(this.tableData.length / n);
        var pagedata = [];
        for (var k = 0; k < pageNum; k++) {
          pagedata[k] = [];
          for (var a = k * n; a < (k + 1) * n; a++) {
            pagedata[k].push(this.tableData[a]);
          }
        }
        this.pagedata = pagedata;
        var lastPageData=[];
        for (var a = (pageNum-1) * n; a < (pageNum-1) * n+(this.tableData.length % n); a++) {
              lastPageData.push(this.tableData[a]);
            }
        this.pagedata.splice(-1,1,lastPageData);
        this.handleCurrentChange(1); //最开始的分页，从第一页开始
      } 
    }, //分页器，
    handleSizeChange(val) {
      this.changeSize=val;
      var param=this.param;
          var newparam= {
            statType: param.statType, //必选
            product: param.product, //必选
            business: [param.business], //业务(详情页的business是只有一个//从Main.vue传过来)
            action: param.action,
            startTime: this.value7[0], //开始时间
            endTime: this.value7[1] //结束时间
          }; 
      this.Dmysearch(newparam);

    },
    handleCurrentChange(val) {
      this.pageval = val;
      var pageval = this.pageval - 1; //当前页对应的数组（数）
      var pagedata = this.pagedata;
      this.tableData = pagedata[pageval];
    }, //切换分页时候触发
    Dprepage() {
      if(this.pageval>1){
        var val=this.pageval;
        this.pageval = val-1;
        var pageval = this.pageval - 1; //当前页对应的数组（数）
        var pagedata = this.pagedata;
        this.tableData = pagedata[pageval];
        this.mytotal(); //添加总计
      }
    }, //前一页
    Dnextpage() {
     if(this.pageval<Math.ceil(this.sum/10)){
      var val=this.pageval;
      this.pageval = val+1;
      var pageval = this.pageval - 1; //当前页对应的数组（数）
      var pagedata = this.pagedata;
      this.tableData = pagedata[pageval];
      if(this.tableData==[]){
        console.log("没有后一页了")
      }else{
        this.mytotal(); //添加总计
      }
      }
    }, //后一页
//---------响应点击方法------------
    sortChange:function(prop){

       if(prop.order=="descending"||prop.order=="ascending"){
              if(prop.order=="descending"){
                this.tableData=this.noTagPageTableData.sort(this.byasc(prop.prop)).reverse()
              }else{
                this.tableData=this.noTagPageTableData.sort(this.byasc(prop.prop))
              }
              this.mypageTag();
            }
    },//排序不能只是当前table排序，而是整个table排序

    byasc: function(name){
                return function(o, p){
                  var a, b;
                  if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                      return 0;
                    }
                    if (typeof a === typeof b) {
                      return a < b ? -1 : 1;
                    }
                    return typeof a < typeof b ? -1 : 1;
                  }
                  else {
                    throw ("error");
                  }
                }//排序的构造函数
    },//按照某一指标进行排序的构造函数，数值由大到小;
    goIndex: function() {
          window.location.href="index.html";
         
    },
  }
};
</script>
<style>

</style>