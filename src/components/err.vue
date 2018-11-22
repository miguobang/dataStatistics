<template>
  <div>
      <div class="list-content" >  
        <div class="choosed err-choosed">错误日志>{{value}}>{{busiselected}}>{{acted}}
           <span style="margin-left:710px; font-size:12px;cursor:pointer" @click="goIndex">返回</span>
          </div><!-- 显示对应选择 -->
      </div>
     <!-- 返回index -->         
    <div class="err-search">
      <div class="err-input"><el-input v-model="errInput" placeholder="请输入内容"></el-input></div>
      <div><el-button @click="goSearchBtn">搜索</el-button></div>
      <div>
       <el-button class="page-ml" @click="prepage">前一页</el-button>
       <el-button  type="primary">{{pageval}}</el-button>
       <el-button class="next-btn" @click="nextpage">后一页</el-button>
      </div>  
    </div>
      <div>
      <el-table
            :data="tableData"
            v-loading="loading"
            >
            <el-table-column
              prop="errList"
              label="错误原因"
              >
            </el-table-column>
            <el-table-column
              prop="errTime"
              label="发生时间"
              >
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
      busi: [],
      active: [],
      activeselected: "1",
      busiselected: [],
      tableData: [],
      input: '',
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
      errInput:"",
      startTime:{},//入参，开始时间
      endTime:{},//入参，结束时间
      loading: true,
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
    getUrl:function(){
         var urlparam=this.getUrlParam("param");
         this.reciveValue=JSON.parse(urlparam);
         this.errInit(this.reciveValue);
         this.param=this.reciveValue;//和单页面应用时对接
         EventBus.$emit("getType", this.reciveValue.statType);//把所选类型传给AsideNavCild
    },

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
        },

    prepage() {
      if(this.pageval>1){
        var val=this.pageval;
        this.pageval = val-1;
        var pageval = this.pageval - 1; 
        var pagedata = this.pagedata;
        this.tableData = pagedata[pageval];
      }
    }, //前一页
    nextpage() {
      if(this.pageval<Math.ceil(this.sum/10)){
      var val=this.pageval;
      this.pageval = val+1;
      var pageval = this.pageval - 1;
      var pagedata = this.pagedata;
      this.tableData = pagedata[pageval];
      }
    }, //后一页

    goIndex: function() {
       window.location.href="index.html";
    },
    errInit:function(value){
      var reciveValue=value;
      this.value=reciveValue.product;
      this.busiselected=reciveValue.business;
      this.acted=reciveValue.action
      this.startTime=reciveValue.startTime;
      this.endTime=reciveValue.startTime;
      this.goSearchBtn();
   
     
    },//初始化
    


    goSearchBtn:function(){
      if(this.busiselected=="全站总计"){
          var paramsByTime = {
              product:this.value,
              startTime: this.startTime,
              endTime: this.endTime,
              reason:this.errInput,
            };//入参
          this.errSearchTotal(paramsByTime);
      }else{
            var paramsByTime = {
              businesskey: [this.busiselected]+"-"+this.acted,//业务(详情页的business是只有一个//从Main.vue传过来)
              startTime: this.startTime,
              endTime: this.endTime,
              reason:this.errInput,
            };//入参
            this.errSearch(paramsByTime);
         }

    },
    errSearchTotal:function(paramsByTime){
        this.$http
            .post(
              "http://report.ruiyunnet.com/report/report/errorByProduct",
              paramsByTime
            )
            .then(
          response => {
            console.log(response.data);
            this.errTable(response.data); 
          },
          response => {
            console.log("error");
          }
        );
    },

    errSearch: function(paramsByTime) {
          this.$http
            .post(
              "http://report.ruiyunnet.com/report/report/errorinfo",
              paramsByTime
            )
            .then(
          response => {
            this.errTable(response.data); 
            
          },
          response => {
            console.log("error");

          }
        );
    },
    errTable: function(arr) {
      this.tableData = []; //绘表之前清空值，初始化
      for (var i = 0; i < arr.length; i++) {
        var newsearch = {
          errList: arr[i].info,
          errTime: arr[i].create_date,
        };
        this.tableData.push(newsearch); 
      }
      this.mypageTag();
    }, //绘表方法


    mypageTag: function() {
      var Listlength = this.tableData.length;
      this.sum = Listlength;
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
                }
        this.handleCurrentChange(1);
    }, //分页器，根据this.tabledata进行分页（10条每页）
    handleSizeChange(val) {
      this.changeSize=val;
      this.goSearchBtn();

    },
    handleCurrentChange(val) {
      this.pageval = val;
      var pageval = this.pageval - 1; //当前页对应的数组（数）
      var pagedata = this.pagedata;
      this.tableData = pagedata[pageval];
      this.loading=false;
    }, //切换分页时候触发
    Dprepage() {
      var val=this.pageval;
      this.pageval = val-1;
      var pageval = this.pageval - 1; //当前页对应的数组（数）
      var pagedata = this.pagedata;
      this.tableData = pagedata[pageval];
    }, //前一页
    Dnextpage() {
      var val=this.pageval;
      this.pageval = val+1;
      var pageval = this.pageval - 1; //当前页对应的数组（数）
      var pagedata = this.pagedata;
      this.tableData = pagedata[pageval];
    }, //后一页
  }
};

</script>
<style>

</style>