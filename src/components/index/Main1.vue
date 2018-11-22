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
      <div class="choosed"> 前端交互统计>{{value}}</div><!-- 显示对应选择 -->
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
      <div id="indexChart" :style="{width:'1230px',height:'400px'}"></div>
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
          <button class="btn-search" @click="changeProduction">搜索</button>
          <el-button class="page-ml" @click="prepage">前一页</el-button>
          <el-button  type="primary">{{pageval}}</el-button>
          <el-button class="next-btn" @click="nextpage">后一页</el-button>
          <!-- pre-next page -->
        </div>
        
      </div>
      <!-- 业务复选行为搜索选择（行为搜索） -->
      <div class="table-rel"> 
        <div class="shame"></div>
        <el-table
        v-loading="loading"
          :data="tableData"
           ref="table"
    @selection-change="handleSelectionChange"
    @sort-change="sortChange"
    :row-class-name="tableRowClassName"
    :default-sort = "{prop: 'count', order: 'descending'}"
          >
          <el-table-column
      type="selection"
      width="55"
      label="趋势比较">
          </el-table-column>
          <el-table-column
            prop="business"
            label="业务"
            width="180"
            sortable="custom"
            class-name="title-position" 
            >
          </el-table-column>
          <el-table-column
            prop="action"
            label="行为"
            sortable="custom"
            width="120">
          </el-table-column>
          <el-table-column
            prop="detail"
            label="历史趋势"
            width="160">
            <template slot-scope="scope">
              <p @click="handleDetail(scope.row)"><img class="historypng" src="@/assets/history.png"></p>
            </template>
          </el-table-column>
          <el-table-column
            prop="usercount"
            label="用户数"
            sortable="custom">
          </el-table-column>
          <el-table-column
            prop="count"
            label="次数"
            sortable="custom">
          </el-table-column>
          <el-table-column
            prop="succ_count"
            label="成功次数"
            sortable="custom">
          </el-table-column>
          <el-table-column
            prop="fail_count"
            label="失败次数"
            sortable="custom">
            <template slot-scope="scope">
              <div v-if="scope.row.fail_count!=0">
                <el-button
                  size="mini"
                  @click="errDetail(scope.row)">
                  <p class="err-wrapper">{{scope.row.fail_count}}</p>
                </el-button>
                </div>
                <div v-else>
                  <el-button
                  size="mini"
                  disabled
                   >
                  <p class="err-wrapper">0</p>
                </el-button>
                </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="suss_time_average"
            width="180"
            label="成功平均耗时（ms）"
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
      :current-page.sync="currentPage4"
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
      ctype: "前端交互统计", //初始nav
      ctypeValue: "0",
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
        {label: '选择PC/MB',
          businessArr: ["所有PC","所有MB"]}, 
          {label: '详细业务',
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
      valPainter:[],//传给nextTick的勾选数组

      row:{},//所选的row，进入详情页
      sum: 0, //总共多少条数据
      changeSize:10,
      pagedata: [], //分页后的数据集合
      currentRow: null,
      currentPage: "1",
      pageval: "1", //当前页码

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
      isFirst:1,
      isSearching:true,
      isSort:true,
      isTime:true,
      isinicheck:true,
      rowlenght:2,
    };
  },

  components: {},

  computed: {},

  created(){
     
  },//created可以读到data里面的ctypeValue
  
  mounted() {
    this.prepearData()
    this.InitFirst();//拦截执行初始化方法
  },
  
  beforeDestroy(){

  },//vue生命组件

  watch: {
  
  },

  methods: {
    //----------------数据初始化Mock--------------------
        prepearData () {
          var Mock = require('mockjs')
          var data = Mock.mock({
              // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
              'list|1-10': [{
                  // 属性 id 是一个自增数，起始值为 1，每次增 1
                  'productName|+1': 1
              }],
              name: {
                  first: '@FIRST',
                  middle: '@FIRST',
                  last: '@LAST',
                  full: '@first @middle @last'
              },
          })
          // 输出结果
          console.log(JSON.stringify(data, null, 4))
          
          var Random = Mock.Random
          Random.first()
          // => "n.clark@miller.io"
          Mock.mock('@first')
          // => "y.lee@lewis.org"
          var a1=Mock.mock( { first: '@first' } )
          // => { email: "v.lewis@hall.gov" }
          console.log(a1)

          Random.extend({
              constellation: function(date) {
                  var constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
                  return this.pick(constellations)
              }
          })
          Random.constellation()
          // => "水瓶座"
          Mock.mock('@CONSTELLATION')
          // => "天蝎座"
          const a2=Mock.mock({
              constellation: '@CONSTELLATION'
          })
          // => { constellation: "射手座" }
          console.log(a2)
        },
    //----------------初始化模块--------------------------------
        InitFirst:function(){
          this.productionGetItem()//获取选择产品的缓存
          this.businessdefinePort();//根据类型请求，返回所有的产品的所有业务
        },
        businessdefinePort: function() {
          this.$http
            .get(
              "http://report.ruiyunnet.com/report/report/businessdefine?id=" + 0
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
             this.echartClear();
             this.ssBusi[1].businessArr =this.businessdefine[this.value]; //详情业务列表
             for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
               if(this.ssBusi[1].businessArr==""){
                  this.ssBusi[1].businessArr.splice(i,1);
               }
             }//排空
             this.totalResults=[];
             this.details=[];
             this.painterArr=[];//切换产品 清空
             var inputBusi=this.searching()//第一遍searching
             var paramsByTimeSum = {
                  statType: this.ctypeValue, //必选
                  product: this.value, //必选
                  business: inputBusi,
                  action:this.inputsearch,
                  startTime: this.value7[0],
                  endTime: this.value7[1],
                  pageSize:this.changeSize-1,
                  pageNo:this.pageval,
                  };
            console.log(this.changeSize);
            console.log(this.pageval);

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
                console.log(response.data);
                this.tableSum= response.data;
                var n=response.data["statReportNum"];
                var pageNum=Math.ceil(n/this.changeSize);//多出这么多的全站总计出来
                console.log(n);
                console.log(pageNum);
                this.sum=n+pageNum;//????????????????
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
                      this.loading=false;
                    } //遍历出所有(常规数据统计)

                    this.initcheck();//将Table和Echart连接起来,初始勾选的重要方法
                }
                catch(err){
                    console.log("===gettable无正确对象===")
                }
              },
              response => {
                console.log("error");
              }
            );
        }, //ByTimeSum接口，获取table
    // ----------------绘图模块---------------------------------
        initcheck:function(){
            this.$nextTick(function(){
              var checkArr=[this.tableData[0],this.tableData[1],this.tableData[2]]
              this.toggleSelection(checkArr)
            }) 
            /*
              nextTick是连接Table和Echart的唯一纽带 
            */
        },
        toggleSelection(rows) {
            this.rowlenght=rows.length;
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
            // console.log("handleSelectionChange");
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
              },2000);
        }, //echart原生 插件绘图方法，并添加加载loading；
        echartClear:function(){
          this.tmp=[];
          this.xtmp={};
          this.echart();
        }, //Echart清空；

    // ------------------点击各类按钮响应方法--------------------

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
            this.isTime=false;
            var param = {
              statType: this.ctypeValue, //必选
              product: this.value, //必选
              startTime: this.value7[0],
              endTime: this.value7[1]
            };
            this.totalResults=[];
            this.details=[];
            this.painterArr=[];//防止重复push全站总计；
           
            this.changeProduction();
          }, //时间控件切换时间触发；
      //------PCMB勾选-----
          pcmbChange:function(){
             var nowpcmb=[];
            if(this.busiselectedShow.indexOf("所有PC")!=-1){
              for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
                if(this.ssBusi[1].businessArr[i].indexOf("PC")!=-1){
                  nowpcmb.push(this.ssBusi[1].businessArr[i]);
                }
              } 
            }//存在所有PC
            if(this.busiselectedShow.indexOf("所有MB")!=-1){
              for(var i=0;i<this.ssBusi[1].businessArr.length;i++){
                if(this.ssBusi[1].businessArr[i].indexOf("MB")!=-1){
                  nowpcmb.push(this.ssBusi[1].businessArr[i]);
                }
              }
            }//存在所有MB
                  return nowpcmb;//所有PC/MB的业务
          },

      //---搜索---

          searching:function(){
              var a=JSON.stringify(this.busiselectedShow);
              var b;
              var busiNormal;
              var busiNormalObj;
              var newbusiNormalObj=[];
              var inputBusi=[];
              if(this.busiselectedShow.indexOf("所有MB")!=-1||this.busiselectedShow.indexOf("所有PC")!=-1){
                  var regpc = new RegExp("所有PC");
                  b = a.replace(regpc,""); 
                  var regmb= new RegExp("所有MB");
                  busiNormal = b.replace(regmb,"");
                  busiNormalObj=JSON.parse(busiNormal);
                  newbusiNormalObj=[];
                  for(var i=0;i<busiNormalObj.length;i++){
                    if(busiNormalObj[i]!=""){
                      newbusiNormalObj.push(busiNormalObj[i]);
                    }
                  }
              //删除PC&MB，取常规business(但是不删this.busiselectedShow); 
                  if(this.pcmbChange().length!=0){
                      inputBusi=this.pcmbChange();
                  }//是否有选中所有PC/MB
                  for(var i=0;i<newbusiNormalObj.length;i++){
                    inputBusi.push(newbusiNormalObj[i]);
                  }
                  console.log(inputBusi)
              }//存在PC||MB时
              else{
                    inputBusi=this.busiselectedShow;
              }
              //this.changeProduction();
             return inputBusi;
          },//点击搜索按钮触发:判断搜索条件

      //---切换页码/分页Size/前一页/后一页---
          handleCurrentChange(val) {
              this.pageval=val;
              this.changeProduction();    
          }, //切换页码
          handleSizeChange(val) {
            this.changeSize=val;
            this.changeProduction();
          },//分页器（PageSize）
          prepage() {
              if(this.pageval>0){
                this.pageval--;
                this.currentPage4=this.pageval;
                this.changeProduction();
              }
              
          }, //前一页（添加全站总计）
          nextpage() {
            if(this.pageval==1){
               this.currentPage4=2;
            }
            this.pageval++;
            console.log(this.pageval);
            this.currentPage4=this.pageval;
            this.changeProduction();
          }, //后一页（添加全站总计）

      //---排序---
          sortChange:function(prop){
           if(this.isFirst==1){
             this.isFirst++;
           }else{this.isSort=false;}

           if(prop.order=="descending"||prop.order=="ascending"){
              if(prop.order=="descending"){
                this.tableData=this.noTagPageTableData.sort(this.byasc(prop.prop)).reverse()
              }else{
                this.tableData=this.noTagPageTableData.sort(this.byasc(prop.prop))
              }
              // this.pageTag(); 此处会造成重复执行pagetag
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
            localStorage.setItem("nav1所选产品",this.value);
        },
        productionGetItem:function(){
          this.value=localStorage.getItem("nav1所选产品");//从缓存获取this.value
          if(this.value==null){
            this.value="掌中宝商品"
          } //如果没有 则赋值；
        },
      //---全站总计添加颜色---
        tableRowClassName:function({row, rowIndex}) {
            if (rowIndex === 0) {
              return 'total-row';
            } 
            return '';
        },//全站总计行添加背景颜色 

 }
};
//备注：初始状态下：最重要的是实现element的Table列表，和Echart绘图；
    //Table:列表初始化状态根据所选的产品，将本产品的所有业务的所有行为所记录的数据进行展示
      //Table的入参有：所选类型、所选产品、起止时间（必选），业务、行为（可选）；
      //返回的分为：常规统计和全站总计(基本时间单位为小时)数据；
      //Tbale:1.分页器功能；2.切换时间；3.搜索（模糊）；4.排序功能;5.进入详情页;6.进入错误页；
    //Echart:Echart图生成所需要的信息有：类型、产品、起止时间、table勾选行、指标、按时或按天；
      //Echart的入参有：所选类型、所选产品、起止时间、业务、行为；(唯一性)，判断按时或按天选接口请求后台
      //返回的根据指标的判断进行输出；
      //Echart:1.切换时间；2切换指标；3.切换table勾选行；4.全站总计项;
  //$nextTick
   
//跳坑指南：
         //1.全站总计是一条特殊的信息，他是接口中单独的totalResult/totalResults属性
         //2.ByTimeSum接口返回的total是totalResult,ByTime接口返回的是totalResults;
         //3.不能通过compareBtn拦截的原因是接口的原因，不允许多组业务、行为一起请求;
         //4.切换页面,Echart的变化(所勾选项目是否跟随);
         //5.产品缓存，勾选项、时间等是否缓存;


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