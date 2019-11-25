<template>
  <div id="app" class="home">
    <div>
      <Vue-kline :klineParams="klineParams" :klineData="klineData" ref="callMethods"></Vue-kline>
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
            <li
              @click="dialogVisible = true"
              @mouseenter="tipFlag='添加指标'"
              @mouseleave="tipFlag=false"
              class="indicatorBtn"
            >
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

    <!-- 弹出框 -->
    <el-dialog title="指标" :visible.sync="dialogVisible" width="25%" style="min-width:350px;" center>
      <el-table :data="options" style="width: 100%;height:250px;overflow:auto">
        <el-table-column prop="value" label="指标名称"></el-table-column>
        <el-table-column prop="switch" label="开关">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              v-if="scope.row.switch===false"
              @click="addIndicator(scope.row)"
            >开启</el-button>
            <el-button size="mini" type="danger" v-else @click="addIndicator(scope.row)">关闭</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
      meg: "Kline-view",
      flag: false,
      tipFlag: true,
      dialogVisible: false,
      indicatorCounter: 0,
      indicatorHeight: 150,
      indicatorNameCoordinate: {},
      screenWidth: document.body.clientWidth,
      screenHeight: document.body.clientHeight,
      klineParams: {
        width: document.body.clientWidth - 50,
        height: document.body.clientHeight,
        theme: "dark",
        indicator: {
          VOLUME: true,
          MACD: true,
          KDJ: true,
          StochRSI:true,
          RSI: true,
          DMI: true,
          OBV: true,
          BOLL: true,
          SAR: true,
          DMA: true,
          TRIX:true,
          BRAR: true,
          VR: true,
          EMV: true,
          WR:true,
          ROC: true,
          MTM: true,
          PSY: true
        },
        language: "zh-cn",
        ranges: ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"],
        symbol: "BTC",
        symbolName: "BTC/USD",
        intervalTime: 1000,
        depthWidth: 50
      },
      klineData: data,

      options: [
        {
          value: "VOLUME",
          switch: false
        },
        {
          value: "MACD",
          switch: false
        },
        {
          value: "KDJ",
          switch: false
        },
        {
          value: "StochRSI",
          switch: false
        },
        {
          value: "RSI",
          switch: false
        },
        {
          value: "DMI",
          switch: false
        },
        {
          value: "OBV",
          switch: false
        },
        {
          value: "BOLL",
          switch: false
        },
        {
          value: "SAR",
          switch: false
        },
        {
          value: "DMA",
          switch: false
        },
        {
          value: "TRIX",
          switch: false
        },
        {
          value: "BRAR",
          switch: false
        },
        {
          value: "VR",
          switch: false
        },
        {
          value: "EMV",
          switch: false
        },
        {
          value: "WR",
          switch: false
        },
        {
          value: "ROC",
          switch: false
        },
        {
          value: "MTM",
          switch: false
        },
        {
          value: "PSY",
          switch: false
        }
      ],
      value: ""
    };
  },
  watch: {
    flag(val) {
      val !== false
        ? this.$refs.callMethods.resize(
            this.screenWidth - 50 - 280,
            this.screenHeight
          )
        : this.$refs.callMethods.resize(
            this.screenWidth - 50,
            this.screenHeight
          );
    }
  },
  methods: {
    addIndicator(row) {
      let name = row.value;
      row.switch = !row.switch;
      if (this.klineParams.indicator[name]) {
        // 显示
        this.klineParams.indicator[name] = false;
        this.indicatorCounter++;
      } else {
        // 隐藏
        this.klineParams.indicator[name] = true;
        this.indicatorCounter--;
      }
      this.$refs.callMethods.onIndicatorChange(name);
      this.setSize();
      this.setSidebarSize();
      this.dialogVisible = false;
    },
    setSize() {
      this.flag !== false
        ? this.$refs.callMethods.resize(
            this.screenWidth - 50 - 280,
            this.screenHeight + this.indicatorCounter * this.indicatorHeight
          )
        : this.$refs.callMethods.resize(
            this.screenWidth - 50,
            this.screenHeight + this.indicatorCounter * this.indicatorHeight
          );
    },
    watchSize() {
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
          this.screenHeight = document.body.clientHeight;
          this.flag !== false
            ? this.$refs.callMethods.resize(
                this.screenWidth - 50 - 280,
                this.screenHeight
              )
            : this.$refs.callMethods.resize(
                this.screenWidth - 50,
                this.screenHeight
              );
        })();
      };
    },
    setSidebarSize() {
      this.$refs.sidebar.style.height =
        window.innerHeight +
        this.indicatorCounter * this.indicatorHeight +
        "px";
      let arr = document.getElementsByClassName("content");
      for (let i = 0; i < arr.length; i++) {
        arr[i].style.height =
          window.innerHeight +
          this.indicatorCounter * this.indicatorHeight +
          "px";
      }
    }
  },
  mounted() {
    this.watchSize();
    this.setSidebarSize();
  }
};
</script>
<style  lang='less'>
html,
body {
  height: 100%;
  padding-right: 0px !important ;
  box-sizing: border-box;
  .el-popup-parent--hidden {
    overflow-y: auto;
  }
  .el-dialog {
    min-width: 350px;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-table {
    tr {
      th:nth-child(2) {
        text-align: right;
        padding-right: 30px;
      }
      td:last-child {
        text-align: right;
        padding-right: 20px;
      }
    }
  }
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
        &.indicatorBtn {
          position: fixed !important;
          right: 3px;
          bottom: 10px;
          background-color: #4395FF;
          color: #fff;
          width: 45px;
          height: 45px;
          line-height: 48px;
          border-radius: 50%;
          .icon{
            color: #fff;
          }
        }
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

