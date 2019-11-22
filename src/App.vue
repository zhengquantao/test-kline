<template>
  <div id="app" class="home">
    <div>
      <Vue-kline
        :klineParams="klineParams"
        :klineData="klineData"
        @refreshKlineData="refreshKlineData"
        ref="callMethods"
      ></Vue-kline>
      <div id="sidebarTheme">
        <div class="sidebar" ref="sidebar">
          <ul>
            <li @click="flag=false" @mouseenter="tipFlag='关闭'" @mouseleave="tipFlag=false">
              <span class="icon iconfont klineguanji"></span>
              <span class="tip" v-show="tipFlag=='关闭'">关闭</span>
            </li>
            <li
              @click="flag=1"
              :class="{select:flag==1}"
              @mouseenter="tipFlag='数据窗口'"
              @mouseleave="tipFlag=false"
            >
              <span class="icon iconfont klinewendang"></span>
              <span class="tip" v-show="tipFlag=='数据窗口'">数据窗口</span>
            </li>
            <li
              @click="flag=2"
              :class="{select:flag==2}"
              @mouseenter="tipFlag='管理警报'"
              @mouseleave="tipFlag=false"
            >
              <span class="icon iconfont klineclock"></span>
              <span class="tip" v-show="tipFlag=='管理警报'">管理警报</span>
            </li>
            <li
              @click="flag=3"
              :class="{select:flag==3}"
              @mouseenter="tipFlag='成交量'"
              @mouseleave="tipFlag=false"
            >
              <span class="icon iconfont klinefire"></span>
              <span class="tip" v-show="tipFlag=='成交量'">成交量</span>
            </li>
            <li
              @click="flag=4"
              :class="{select:flag==4}"
              @mouseenter="tipFlag='财经日历'"
              @mouseleave="tipFlag=false"
            >
              <span class="icon iconfont klineDate"></span>
              <span class="tip" v-show="tipFlag=='财经日历'">财经日历</span>
            </li>
            <li
              @click="flag=5"
              :class="{select:flag==5}"
              @mouseenter="tipFlag='新闻'"
              @mouseleave="tipFlag=false"
            >
              <span class="icon iconfont klinemessage"></span>
              <span class="tip" v-show="tipFlag=='新闻'">新闻</span>
            </li>
            <li
              @click="flag=6"
              :class="{select:flag==6}"
              @mouseenter="tipFlag='LWSB'"
              @mouseleave="tipFlag=false"
            >
              <span class="icon iconfont klinelight"></span>
              <span class="tip" v-show="tipFlag=='LWSB'">LWSB</span>
            </li>
            <li @click="addIndicator" @mouseenter="tipFlag='添加指标'" @mouseleave="tipFlag=false">
              <span class="icon iconfont klineplus"></span>
              <span class="tip" v-show="tipFlag=='添加指标'">添加指标</span>
            </li>
          </ul>
        </div>
        <div class="content" v-show="flag==1">
          <div class="contentTitle">数据窗口</div>
        </div>
        <div class="content" v-show="flag==2">
          <div class="contentTitle">管理警报</div>
        </div>
        <div class="content" v-show="flag==3">
          <div class="contentTitle">成交量</div>
        </div>
        <div class="content" v-show="flag==4">
          <div class="contentTitle">财经日历</div>
        </div>
        <div class="content" v-show="flag==5">
          <div class="contentTitle">新闻</div>
        </div>
        <div class="content" v-show="flag==6">
          <div class="contentTitle">LWSB</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueKline from "./kline/kline";
import data from "@/assets/data";
import axios from "axios";
export default {
  name: "HelloWorld",
  components: {
    VueKline
  },
  data() {
    return {
      meg: "first vue-cli test, welcome you coming",
      flag: false,
      tipFlag: true,
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight + 300,
      klineParams: {
        width: document.body.clientWidth - 68,
        height: document.body.clientHeight + 300,
        theme: "dark",
        language: "zh-cn",
        ranges: ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"],
        symbol: "BTC",
        symbolName: "BTC/USD",
        intervalTime: 1000,
        depthWidth: 50
      },
      klineData: data
    };
  },
  watch: {
    flag(val) {
      val !== false
        ? this.$refs.callMethods.resize(
            this.screenWidth - 50 - 280,
            this.screenHeight + 300
          )
        : this.$refs.callMethods.resize(
            this.screenWidth - 50,
            this.screenHeight + 300
          );
    }
  },
  methods: {
    requestDatas(url) {
      this.$axios
        .get("http://127.0.0.1:5000/test?name=" + url + ".json")
        .then(ret => {
          this.klineData = ret.data;
          // if(!this.klineData.hasOwnProperty('data')){
          //     this.klineData = ret.data;
          // }else{
          this.$refs.callMethods.kline.chartMgr
            .getChart()
            .updateDataAndDisplay(ret.data.data.lines);
          // }

          // if(this.load){
          //      location.reload()
          // }
          // this.load = true
        });
    },
    refreshKlineData(option) {
      // console.log(option);
      if (option > 3600000) {
        // 周, 日 (两年)
        console.log("天-周 197");
        const url = "ag1912";
        this.requestDatas(url);
      } else if (option > 900000) {
        // 1小时, 30分钟
        console.log("1时--30分 198");
        const url = "ag1910";
        this.requestDatas(url);
      } else {
        // 15, 5, 1分钟
        console.log("1-15分钟 941");
        const url = "ag1911";
        this.requestDatas(url);
      }
    },
    addIndicator() {
      this.$prompt("请输入邮箱", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "你的邮箱是: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    setSize() {
      this.screenWidth = document.body.clientWidth;
      this.screenHeight = document.body.clientHeight;
      let that = this;
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
          this.screenHeight = document.body.clientHeight;
          that.flag !== false
            ? this.$refs.callMethods.resize(
                this.screenWidth - 50 - 280,
                this.screenHeight + 300
              )
            : this.$refs.callMethods.resize(
                this.screenWidth - 50,
                this.screenHeight + 300
              );
        })();
      };
    }
  },
  computed: {},
  mounted() {
    this.setSize();
    this.$refs.sidebar.style.height = window.innerHeight + 300 + "px";
    let arr = document.getElementsByClassName("content");
    for (let i = 0; i < arr.length; i++) {
      arr[i].style.height = window.innerHeight + 300 + "px";
    }
  }
};
</script>
<style  lang='less'>
html,
body {
  height: 100%;
}
.home {
  .sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    z-index: 999;
    height: 100%;
    ul {
      list-style: none;
      margin: 0;
      cursor: pointer;
      padding: 0px;
      box-sizing: border-box;
      li {
        width: 50px;
        height: 55px;
        line-height: 55px;
        position: relative;
        text-align: center;
        .icon {
          font-size: 22px;
        }
        .tip {
          height: 22px;
          padding: 2px 10px;
          border-radius: 4px;
          line-height: 22px;
          font-size: 12px;
          display: inline-block;
          white-space: nowrap;
          position: absolute;
          top: 16px;
          right: 51px;
          z-index: 999;
        }
      }
    }
  }
  .content {
    width: 280px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 51px;
    z-index: 99;
    border-left: 1px solid #ccc;
    padding: 2px;
    box-sizing: border-box;
    .contentTitle {
      width: 100%;
      height: 35px;
      line-height: 35px;
      border-radius: 2px;
      font-size: 14px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
}
.light {
  .sidebar {
    background-color: #fff;
    border-left: 1px solid #ccc;
    ul li .icon {
      color: #333;
    }
    .tip {
      background-color: #262b3e;
      color: #fff;
    }
    .select {
      background-color: #eee;
      .icon {
        color: #2196f3;
      }
    }
  }
  .content {
    background-color: #fff;
    .contentTitle {
      background-color: #eee;
      color: #000;
    }
  }
}
.dark {
  .sidebar {
    background-color: #131722;
    border-left: 1px solid #404040;
    ul li .icon {
      color: #72757f;
    }
    .tip {
      background-color: #4f5966;
      color: #fff;
    }
    .select {
      background-color: #000;
      .icon {
        color: #2196f3;
      }
    }
  }
  .content {
    background-color: #131722;
    border-left: 1px solid #404040;
    .contentTitle {
      background-color: #262b3e;
      color: #fff;
    }
  }
}
</style>

