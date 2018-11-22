<template>
  <div>
    <div class="list-content">
      <el-button type="info" disabled class="list-pro">产品</el-button>
      <el-select v-model="value" placeholder="请选择" @change="changeProduction()" >
        <el-option
          v-for="item in productionArr"
          :key="item"
          :label="item"
          :value="item" class="list-input"
          >
        </el-option>
      </el-select>
      <div class="choosed"> 业务使用情况>{{value}}</div><!-- 显示对应选择 -->
     </div>  
     <!-- 类别及产品列表 -->
      <div class="time-content">
      <div class="time-position">
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
     <div class="charts">
      <div class="choose-more">
      <el-select v-model="evalue" placeholder="选择指标" @change="getquota">
      <el-option
        v-for="item in quota"
        :key="item"
        :label="item"
        :value="item" 
       >
      </el-option>
      </el-select> 
     </div>
      <div class="choose-hourday">
           <el-radio-group v-model="radio3" @change="timechange">
      <el-radio-button label="按时"></el-radio-button>
      <el-radio-button label="按天"></el-radio-button>
    </el-radio-group> </div>    
      <div id="indexChart" :style="{width:'1180px',height:'400px'}"></div>
     </div>
     <!-- 百度Echart控件- -->
      <div class="busi-s">
          <div class="busi-choose">
                 <el-select v-model="busiselectedShow" multiple
                  filterable
                  @change="pcmbChange"
                  placeholder="请选择业务">
                      <el-option-group
                        v-for="group in ssBusi"
                        :key="group.label"
                        :label="group.label">
                        <el-option
                          v-for="item in group.businessArr"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-option-group>
                    </el-select>
          <el-input v-model="inputsearch" placeholder="请输入行为关键词" class="inputsearch"></el-input>
          <button class="btn-search" @click="searching()">搜索</button>
          <el-button class="page-ml" @click="prepage">前一页</el-button>
          <el-button  type="primary">{{pageval}}</el-button>
          <el-button class="next-btn" @click="nextpage">后一页</el-button>
          <!-- pre-next page -->
        </div>
        
      </div>
      <!-- 业务复选行为搜索选择（行为搜索） -->
      <div class="table-rel"> 
        <!-- <div class="bg-compare"></div><div class="compare" @click="compareBtn()">趋势比较</div> -->
        <div class="shame" ><img style="width:16px;height:20px;" src="@/assets/forword-down.png" alt=""></div>
        <!-- <div class="shame1"><el-checkbox v-model="totalchecked" @change="totalcheck()" label=""></el-checkbox></div> -->
        <!-- <div class="compare1">业务↓</div>-->
         <el-table
        v-loading="loading"
          :data="tableData"
           ref="table"
    @selection-change="handleSelectionChange"
    @sort-change="sortChange"
    :row-class-name="tableRowClassName"
          >
          <el-table-column
      type="selection"
      width="55"
      label="趋势比较">
          </el-table-column>
          <el-table-column
            prop="business"
            label="业务"
            sortable="custom"
            class-name="title-position" 
            >
          </el-table-column>
          <el-table-column
            prop="action"
            label="指标"
            sortable="custom"
            >
          </el-table-column>
          <el-table-column
            prop="usercount"
            label="用户数"
            sortable="custom">
          </el-table-column>
          <el-table-column
            prop="count"
            label="任务数"
            sortable="custom">
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
import EventBus from "../../js/bus";
export default {
  data() {
    return {
      ctype: "业务使用情况", //初始nav
      ctypeValue: "2",
      value: "", //初始产品
      businessdefine: {}, //所有产品的所有业务(接接口数据)
      tableSum: [], //Sum接口返回Table表(接接口数据)
      productionArr: [], //产品列表数据
      
      val:[],//Table所勾选的全部信息
      cacheVal:[],//缓存中的Table所勾选信息
      totalResults: "", //ByTime/ByTimeEveryDay 全站总计请求返回结果
      details:[],//ByTime/ByTimeEveryDay  details请求返回结果
      painterArr:[],//绘图信息
      
      ssBusi: [
        {label: '',
          businessArr: []}, 
          {label: '',
          businessArr:[]}//businessArr:[],//业务列表数据
          ],
      busiselectedShow: [], //显示在搜索框中的业务    对比参照本系统与友盟搜索区别
      daycount:1,
      daycountEnd:1,
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
      value7: [new Date(), new Date()], //时间(两个值) [0]:开始 [1]：结束 //今天
      radio: "1",
      quota: ["用户数", "次数", "成功次数", "失败次数", "成功平均耗时"], //选择指标
      evalue: "用户数", //已选的指标

      
      acted: "", //已选行为
      inputsearch:"",//所输入的进行搜索的行为
      businessAsk:[],
      actionAsk:{},
      list: [],
      loading: true,
      tableData: [], //table表数据
      noTagPageTableData:[],
      valPainter:[],//传给nextick的勾选数组

      row:{},//所选的row，进入详情页
      sum: 0, //总共多少条数据
      changeSize:10,
      pagedata: [], //分页后的数据集合
      currentRow: null,
      currentPage: "1",
      pageval: "1", //当前页码
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 1,
      radio3: "按时", //当前是按时还是按天
      lastWeek: "",
      usercount: [],
      count: [],
      fail_count: [],
      succ_count: [],
      suss_time_average: [],
        //带业务搜索的table数据集合
      myxaxis: {},
      arr:[],
      tmp: [],//series
      xtmp: {
        type: "category",
        boundaryGap: false,
        data: []
      },
      legend:{},//将悬浮框内容显示出来
      lastVal:[],
      getStorageTableCheck:[],
    };
  },

  components: {},

  computed: {},

  created(){
     
  },//created可以读到data里面的ctypeValue
  
  mounted() {
    this.InitFirst();//拦截执行初始化方法
  },
  
  beforeDestroy(){

  },//vue生命组件

  watch: {
    // '$route':''
  },

  methods: {
    //----------------初始化模块--------------------------------
        InitFirst:function(){
        this.productionGetItem()//获取选择产品的缓存
        this.businessdefinePort();//根据类型请求，返回所有的产品的所有业务
        },
        businessdefinePort: function() {
          this.$http
            .get(
              "http://report.ruiyunnet.com/report/report/businessdefine?id=" + 2
            )
            .then(
              response => {
                this.businessdefine = response.data;
                //这里的请求返回有一个方法异步执行的顺序问题
                for (var item in this.businessdefine) {
                  this.productionArr.push(item);
                }//产品列表
                this.changeProduction();
              },
              response => {
                console.log("error");
              }
            );  
        },
        changeProduction:function(){
             this.ssBusi[1].businessArr =this.businessdefine[this.value]; //详情业务列表
             for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
               if(this.ssBusi[1].businessArr==""){
                  this.ssBusi[1].businessArr.splice(i,1);
               }
             }//排空
             this.totalResults=[];
             this.details=[];
             this.painterArr=[];//切换产品 清空
             var paramsByTimeSum = {
                  statType: this.ctypeValue, //必选
                  product: this.value, //必选
                  startTime: this.value7[0],
                  endTime: this.value7[1]
                  };
            this.gettable(paramsByTimeSum);//初始查询table 不带业务和行为
            this.prodctionSetItem();
        },

    // ----------------绘表模块---------------------------------
        gettable: function(paramsByTimeSum){
          this.tableData=[];
          this.$http
            .post(
              "http://report.ruiyunnet.com/report/report/getBusinessByTimeSum",
              paramsByTimeSum)
            .then(
              response => {
                this.tableData=[];//清空tabledata
                this.tableSum= response.data;
                console.log(this.tableSum);

                var details = response.data["details"];
                var totalResult = response.data["totalResult"];
                totalResult.business="全站总计";
                totalResult.action="";
                details.unshift(totalResult);//Table:将totalResult整合details
                
                try{
                      for (var i = 0; i < details.length; i++) {
                      var newsearch = {
                        business: details[i].business,
                        action: details[i].action,
                        detail:"点击进入",
                        usercount: details[i].usercount,
                        count: details[i].count,
                        succ_count: details[i].succ_count,
                        fail_count: details[i].fail_count,
                        suss_time_average: details[i].suss_time_average,
                      };
                      this.tableData.push(newsearch);
                    } //遍历出所有(常规数据统计)
                }
                catch(err){
                    console.log("===gettable无正确对象===")
                }
                this.pageTag(); //进行分页
              },
              response => {
                console.log("error");
              }
            );
        }, //ByTimeSum接口，获取table
        pageTag: function() {
          var Listlength = this.tableData.length;
          this.noTagPageTableData=this.tableData;//将分页前的tabledata保存
          this.sum = Listlength; //总共有多少条数据
          var n=this.changeSize;
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
                }//最后一页的数据
            this.pagedata.splice(-1,1,lastPageData);
            this.handleCurrentChange(1); //最开始的分页，从第一页开始
        }, //分页器（n条每页）
        handleCurrentChange(val) {
          this.totalResults=[];
          this.details=[];
          this.painterArr=[];//防止重复push全站总计；
          this.pageval = val;
          var pageval = this.pageval - 1; //当前页对应的数组（数）
          this.tableData = this.pagedata[pageval];//当前页
          /*
          nexTick是连接Table和Echart的唯一纽带 
          */
          this.$nextTick(function(){

            if(this.valPainter.length==0){
               this.toggleSelection([this.noTagPageTableData[0],this.noTagPageTableData[1]]);
             }else{
                this.toggleSelection(this.valPainter);
                console.log(this.valPainter);
            }
          }
          )
          this.loading=false;
        }, //切换页码，显示对应table

    // ----------------绘图模块---------------------------------
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.table.toggleRowSelection(row);
            });
          } else {
            this.$refs.table.clearSelection();
          }
        },//勾选
        handleSelectionChange(val) {
          this.val=val;

          this.getVal();//改变this.valPainter的值
          try{
             var CurrentChecked=val[val.length-1];//目前所勾选
             this.businessAsk=CurrentChecked.business;
             this.actionAsk=CurrentChecked.action;
                if(this.businessAsk=="全站总计"){
                  this.mysearchTotal();
                }else{ 
                  this.mysearchDetails();
                }
           }//判断当前勾选是否是全站总计？mysearchTotal:mysearchDetails
          catch (err){
            console.log("===handleSelectionChange===");
          } 
        }, //新勾选一条(一条)就请求一次后台//勾选情况发生变化;
        mysearchTotal:function(){
          var eparamTotal={
               statType: this.ctypeValue, //必选
               product: this.value, //必选
               startTime: this.value7[0],
               endTime: this.value7[1]
          }
         if (this.radio3 == "按时") {
            this.$http
              .post(
                "http://report.ruiyunnet.com/report/report/getBusinessByTime",
                eparamTotal
              )
              .then(
                response => {
                  this.totalResults = response.data.totalResults;
                  for(var i=0;i<this.totalResults.length;i++){
                      this.totalResults[i].business="全站总计";
                      this.totalResults[i].action="";
                    }//为每个小时的全站总计信息添加"全站总计"business
                  this.getpainterArr();
                },
                response => {
                  console.log("error");
                }
              );
          } else {
            this.$http
              .post(
                "http://report.ruiyunnet.com/report/report/getBusinessByTimeEveryDay",
                eparamTotal
              )
              .then(
                response => {
                 this.totalResults = response.data.totalResults;
                  for(var i=0;i<this.totalResults.length;i++){
                      this.totalResults[i].business="全站总计";
                      this.totalResults[i].action="";
                    }//为每个小时的全站总计信息添加"全站总计"business
                  this.getpainterArr();
                },
                response => {
                  console.log("error");
                }
              );
          }
        },//因为total和details信息都源于同一接口；抽离分开
        mysearchDetails: function() {
          var eparam = {
                statType: this.ctypeValue, //必选
                product: this.value, //必选
                business:[this.businessAsk], //所选业务
                action:this.actionAsk,//所选行为
                startTime: this.value7[0],
                endTime: this.value7[1]
          };
          if (this.radio3 == "按时") {
            this.$http
              .post(
                "http://report.ruiyunnet.com/report/report/getBusinessByTime",
                eparam
              )
              .then(
                response => {
                   this.details=response.data.details;
                   this.getpainterArr();
                },
                response => {
                  console.log("error");
                }
              );
          } else {
            this.$http
              .post(
                "http://report.ruiyunnet.com/report/report/getBusinessByTimeEveryDay",
                eparam
              )
              .then(
                response => {
                  this.details=response.data.details;
                  this.getpainterArr();
                },
                response => {
                  console.log("error");
                }
              );
          }
        },//myserch方法是请求后台接口的方法：判断按时（ByTime）还是按天进行（ByTimeEveryDay）
          //绘图请求后台：入参为所选类型、产品、业务、行为、起止时间,向后台请求;
          
        getpainterArr:function(){
            if(this.totalResults.length!=0){
              this.painterArr.unshift(this.totalResults);
            } 
            if(this.details.length!=0){
              this.painterArr.push(this.details);
            }//不为空则push
          /*
          取消勾选，将改变this.painterArr
          */
          var difference=[];//painterArr与val的差别集合
          var valNow=[];
          var painterArrNow=[];
          if(this.val.length!=this.painterArr.length){
                for(var i=0;i<this.val.length;i++){
                  valNow.push(this.val[i].business+"~"+this.val[i].action)
                }
                for(var i=0;i<this.painterArr.length;i++){
                  painterArrNow.push(this.painterArr[i][0].business+"~"+this.painterArr[i][0].action);
                }
            let a=valNow;
            let b=painterArrNow; 
            difference = a.concat(b).filter(v => !a.includes(v) || !b.includes(v));//取差集
          }//取消某一行或几行(差集)
          for(var k=0;k<difference.length;k++){
            for(var i=0;i<painterArrNow.length;i++){
                      if(painterArrNow[i]==difference[k]){
                             this.painterArr.splice(i,1)
                        }  }
          }
          this.painterArr=this.deleteRepeatArrobj(this.painterArr);//去重
          var arr=this.painterArr;
         //arr为X业务X行为的未指标分类前的数组集合(一个业务和一个行为对应的一个数组 的集合)
          var usercount = [];
          var count = [];
          var fail_count = [];
          var succ_count = [];
          var suss_time_average = [];
          var myxaxis = [];
          for (var k = 0; k < arr.length; k++) {
            usercount[k] = [];
            count[k] = [];
            fail_count[k] = [];
            succ_count[k] = [];
            suss_time_average[k] = [];
            myxaxis[k] = [];
              for (var i = 0; i < arr[k].length; i++) {
                usercount[k].push(arr[k][i].usercount);
                count[k].push(arr[k][i].count);
                fail_count[k].push(arr[k][i].fail_count);
                succ_count[k].push(arr[k][i].succ_count);
                suss_time_average[k].push(arr[k][i].suss_time_average);
                myxaxis[k].push(arr[k][i].listdate);
              }
            }
          //指标分类
          this.usercount = usercount;
          this.count = count;
          this.fail_count = fail_count;
          this.succ_count = succ_count;
          this.suss_time_average = suss_time_average;
          for(var i=0;i<myxaxis.length;i++){
            if(myxaxis[i].length>0){
               this.myxaxis=this.trim(myxaxis[i]);
              break;
            }
          }//对日期处理
          this.getquota();
        },
        getquota: function() {
          this.echartClear();
          var nowitem;
          if (this.evalue == "用户数") {
            nowitem = this.usercount;
          } else if (this.evalue == "次数") {
            nowitem = this.count;
          } else if (this.evalue == "成功次数") {
            nowitem = this.succ_count;
          } else if (this.evalue == "失败次数") {
            nowitem = this.fail_count;
          } else if (this.evalue == "成功平均耗时") {
            nowitem = this.suss_time_average;
          } //指标选择
          var mylegend={};   
          var myytmp=[];
          for (var k=0;k<nowitem.length;k++){
            myytmp[k]=[];
            myytmp[k]={
                name:  "NO." +
                (k + 1) +
                this.value +
                "-" +
                this.painterArr[k][0].business+
                  "-" +
                this.painterArr[k][0].action+
                "-" +
                this.evalue,
                type:'line',
                data:nowitem[k],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }

          }
          var myxtmp ={
            type: 'category',
            boundaryGap: false,
            data: this.myxaxis
          }
          this.tmp =myytmp;
          this.xtmp =myxtmp;
          this.echart(); //绘图（一次）
        }, //正式绘图：此方法判断所选指标后，然后调用Echart原生绘图方法,绘图成功；
        echart: function() {
          var indexChart = echarts.init(document.getElementById("indexChart"));
          indexChart.clear();
              indexChart.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                legend:this.legend,
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                    grid: {
                      left: "10%",
                      right: "4%",
                      bottom: "3%",
                      containLabel: true
                    },
                    xAxis: this.xtmp,
                    series: this.tmp,
                  });
          // ---------加载中-----------
              indexChart.showLoading({
                  text : '加载中',
                  textStyle : {
                      fontSize : 20
                  }
              });
              setTimeout(function (){
                  indexChart.hideLoading();
                  // indexChart.setOption()
              },1000);
        }, //echart原生 插件绘图方法，并添加加载loading；
        echartClear:function(){
          this.tmp=[];
          this.xtmp={};
          this.echart();
        }, //Echart清空；

    // ------------------点击各类按钮响应方法---------------------------

      // ---时间控件模块---
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
          }, //时间辅助：入参X天前，返回X天的时间
          timechange: function() {
            var param = {
              statType: this.ctypeValue, //必选
              product: this.value, //必选
              startTime: this.value7[0],
              endTime: this.value7[1]
            };
            this.totalResults=[];
            this.details=[];
            this.painterArr=[];//防止重复push全站总计；
            var valPainterHalf=[];
              for(var i=[(this.valPainter.length)/2]-1;i<this.valPainter.length;i++){
                valPainterHalf.push(this.valPainter[i]);
              }
            
            this.gettable(param);
          }, //时间控件切换时间触发；
      //------PCMB勾选---------
          pcmbChange:function(){
             var nowpcmb=[];
             var a=["所有PC","所有MB"];
            if(this.busiselectedShow=="所有PC"){
              for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
                if(this.ssBusi[1].businessArr[i].indexOf("PC")!=-1){
                  nowpcmb.push(this.ssBusi[1].businessArr[i]);
                }
              } 
            }//所有PC
            else if(this.busiselectedShow=="所有MB"){
              for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
                if(this.ssBusi[1].businessArr[i].indexOf("MB")!=-1){
                  nowpcmb.push(this.ssBusi[1].businessArr[i]);
                }
              }
            }//所有MB
            else if(this.busiselectedShow.sort().toString()==a.sort().toString()){
              for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
                if(this.ssBusi[1].businessArr[i].indexOf("PC")!=-1){
                 nowpcmb.push(this.ssBusi[1].businessArr[i]);
                }
                if(this.ssBusi[1].businessArr[i].indexOf("MB")!=-1){
                  nowpcmb.push(this.ssBusi[1].businessArr[i]);
                }
              }
            }//所有MB&PC
          
            return nowpcmb;
          },//这种情况下，PC/MB不能和普通业务同时勾选;
      //---搜索---
          searching:function(){

                if(this.pcmbChange().length!=0){
                   this.tableData=[];
                    var param={
                          statType: this.ctypeValue, //必选
                          product: this.value, //必选
                          business: this.pcmbChange(),
                          startTime: this.value7[0],
                          endTime: this.value7[1]}
                    this.gettable(param);
                }//勾选了PC/MB

                else{
                            var param={
                                statType: this.ctypeValue, //必选
                                product: this.value, //必选
                                business: this.busiselectedShow,
                                action:this.inputsearch,
                                startTime: this.value7[0],
                                endTime: this.value7[1]}
                                console.log(param);
                            this.gettable(param);   
                    }
          },//点击搜索按钮触发:判断搜索条件

      //---分页Size/前一页/后一页---
          handleSizeChange(val) {
            this.changeSize=val;
            this.changeProduction();
          },//分页器（每页的Size）
          prepage() {
            if(this.pageval>1){
              var val=this.pageval;
              this.pageval = val-1;
              var pageval = this.pageval - 1; //当前页对应的数组（数）
              var pagedata = this.pagedata;
              this.tableData = pagedata[pageval];
            }
          }, //前一页（添加全站总计）
          nextpage() {
            if(this.pageval<Math.ceil(this.sum/10)){
            var val=this.pageval;
            this.pageval = val+1;
            var pageval = this.pageval - 1; //当前页对应的数组（数）
            var pagedata = this.pagedata;
            this.tableData = pagedata[pageval];
            }
          }, //后一页（添加全站总计）

      //---排序---
          sortChange:function(prop){
           if(prop.order=="descending"||prop.order=="ascending"){
              if(prop.order=="descending"){
                this.tableData=this.noTagPageTableData.sort(this.byasc(prop.prop)).reverse()
              }else{
                this.tableData=this.noTagPageTableData.sort(this.byasc(prop.prop))
              }
              this.pageTag();
            }
          },//点击排序触发：排序不能只是当前table排序，而是整个table排序,所以不能用Element原生排序
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
          },//排序辅助：排序构造函数


      //--------日期格式修改--------
          trim:function(arr){
            if(arr.length==0){
              return
            }
            var strArr=[]
            for(var i=0,len=arr.length;i<len;i++){
              var newstr=arr[i].substr(0,4)+'.'+arr[i].substr(4,2)+'.'+arr[i].substr(6,2)+' '+arr[i].substr(8,2)+':00'
              strArr.push(newstr)
            }
            return strArr
          },
      //-------去重（数组中的对象）-----
          deleteRepeatArrobj(arr){
            var StringData=[];
            var noRepeatArr=[];
            for(var i=0;i<arr.length;i++){
                StringData.push(JSON.stringify(arr[i]))
            }
            var StringData = Array.from(new Set(StringData));//去重
            for(var i=0;i<StringData.length;i++){
              noRepeatArr.push(JSON.parse(StringData[i]))
            }
            return noRepeatArr;
          },//arr为许多对象的集合（数组）
      //---进入历史页和错误页---
          handleDetail:function(row){
            this.row=row;
            var row=this.row;
            var param={
              statType: this.ctypeValue, //必选
                        product: this.value, //必选
                        business: row.business, //业务
                        action: row.action,
                        startTime: this.value7[0],
                        endTime: this.value7[1]
            };
            window.open("history.html"+"?param="+JSON.stringify(param));
          },//进入历史页：页面间URL挂参param（类型、产品、业务、行为、起止时间）
          errDetail:function(row){
            this.row=row;
            var row=this.row;
            var param={
              statType: this.ctypeValue, //必选
                        product: this.value, //必选
                        business: row.business, //业务
                        action: row.action,
                        startTime: this.value7[0],
                        endTime: this.value7[1]
            };
            window.open("err.html"+"?param="+JSON.stringify(param));
          },//进入错误页：页面间URL挂参param（类型、产品、业务、行为、起止时间）    
      //---localstorage---------
        prodctionSetItem:function(){
            localStorage.setItem("nav3所选产品",this.value);
        },
        productionGetItem:function(){
          this.value=localStorage.getItem("nav3所选产品");//从缓存获取this.value
          if(this.value==null){
            this.value="掌中宝商品自动分销定时器"
          } //如果没有 则赋值；
        },
        tableCheckSetItem:function(){
          localStorage.setItem("table勾选项",JSON.stringify(this.val));
        },
        tableCheckGetItem:function(){
          this.cacheVal=JSON.parse(localStorage.getItem("table勾选项"));
        },
      //--------勾选记录-------------
      getVal:function(){

          for(var k=0;k<this.val.length;k++){
               for(var i=0;i<this.noTagPageTableData.length;i++){
                  if(this.noTagPageTableData[i].business==this.val[k].business&
                  this.noTagPageTableData[i].action==this.val[k].action){
                    this.valPainter.push(this.noTagPageTableData[i])
                   }//如果未分页前的tableData的已勾选业务和行为当前相等，将他们都赋给this.valPainter
                }
            }
            this.valPainter=this.deleteRepeatArrobj(this.valPainter);//去重
      }
 }
};


$(function() {
  $(".btn-search").hover(
    function() {
      $(this).css("background", "#4f7bb8");
    },
    function() {
      $(this).css("background", "#2e5eab");
    }
  );
  $(".btn-search").click(function() {
    $(this).css("background", "#1d4185");
  });
});//搜索按钮交互
</script>
<style>
</style>