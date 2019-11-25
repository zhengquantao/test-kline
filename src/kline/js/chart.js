import { ChartManager } from './chart_manager'
import { Control } from './control'
import Kline from './kline'
import { Template } from './templates'
import $ from 'jquery'

export class Chart {
    constructor() {
        this._data = null;
        this._charStyle = "CandleStick";
        this._depthData = {
            array: null,
            asks_count: 0,
            bids_count: 0,
            asks_si: 0,
            asks_ei: 0,
            bids_si: 0,
            bids_ei: 0
        };
        this.strIsLine = false;
        this._range = Kline.instance.range;
        this._symbol = Kline.instance.symbol;
    }

    setTitle() {
        let lang = ChartManager.instance.getLanguage();
        let title = Kline.instance.symbolName;
        title += ' ';
        title += this.strIsLine ? Chart.strPeriod[lang]['line'] : Chart.strPeriod[lang][this._range];
        title += (this._contract_unit + '/' + this._money_type).toUpperCase();
        ChartManager.instance.setTitle('frame0.k0', title);
    }


    setSymbol(symbol) {
        this._symbol = symbol;
        this.updateDataAndDisplay();
    }

    updateDataAndDisplay(newData) {
        Kline.instance.symbol = this._symbol;
        Kline.instance.range = this._range;
        /**
         * 46-50 lines is QQ "挺好!" add
        */
        if (newData !== undefined) {
            ChartManager.instance.setCurrentDataSource('frame0.k0', this._symbol + '.' + this._range, newData);
        } else {
            ChartManager.instance.setCurrentDataSource('frame0.k0', this._symbol + '.' + this._range);
        }
        //ChartManager.instance.setCurrentDataSource('frame0.k0', this._symbol + '.' + this._range);
        ChartManager.instance.setNormalMode();
        let f = Kline.instance.chartMgr.getDataSource("frame0.k0").getLastDate();
        if (f === -1) {
            Kline.instance.requestParam = Control.setHttpRequestParam(Kline.instance.symbol, Kline.instance.range, Kline.instance.limit, null);
            Control.requestData(true);
        } else {
            Kline.instance.requestParam = Control.setHttpRequestParam(Kline.instance.symbol, Kline.instance.range, null, f.toString());
            Control.requestData();
        }
        ChartManager.instance.redraw('All', false);
    }


    setCurrentContractUnit(contractUnit) {
        this._contract_unit = contractUnit;
        this.updateDataAndDisplay();
    }

    setCurrentMoneyType(moneyType) {
        this._money_type = moneyType;
        this.updateDataAndDisplay();
    }

    setCurrentPeriod(period) {
        this._range = Kline.instance.periodMap[period];
        if (Kline.instance.type === "stomp" && Kline.instance.stompClient.ws.readyState === 1) {
            Kline.instance.subscribed.unsubscribe();
            Kline.instance.subscribed = Kline.instance.stompClient.subscribe(Kline.instance.subscribePath + '/' + Kline.instance.symbol + '/' + this._range, Control.subscribeCallback);
        }
        this.updateDataAndDisplay();
        Kline.instance.onRangeChangeFunc(this._range);
    }

    updateDataSource(data) {
        this._data = data;
        ChartManager.instance.updateData("frame0.k0", this._data);
    }

    updateDepth(array) {
        if (array == null) {
            this._depthData.array = [];
            ChartManager.instance.redraw('All', false);
            return;
        }
        if (!array.asks || !array.bids || array.asks === '' || array.bids === '')
            return;
        let _data = this._depthData;
        _data.array = [];
        for (let i = 0; i < array.asks.length; i++) {
            let data = {};
            data.rate = array.asks[i][0];
            data.amount = array.asks[i][1];
            _data.array.push(data);
        }
        for (let i = 0; i < array.bids.length; i++) {
            let data = {};
            data.rate = array.bids[i][0];
            data.amount = array.bids[i][1];
            _data.array.push(data);
        }
        _data.asks_count = array.asks.length;
        _data.bids_count = array.bids.length;
        _data.asks_si = _data.asks_count - 1;
        _data.asks_ei = 0;
        _data.bids_si = _data.asks_count - 1;
        _data.bids_ei = _data.asks_count + _data.bids_count - 2;
        for (let i = _data.asks_si; i >= _data.asks_ei; i--) {
            if (i === _data.asks_si && _data.array[i] !== undefined) {
                _data.array[i].amounts = _data.array[i].amount;
            } else if (_data.array[i + 1] !== undefined) {
                _data.array[i].amounts = _data.array[i + 1].amounts + _data.array[i].amount;
            }
        }
        for (let i = _data.bids_si; i <= _data.bids_ei; i++) {
            if (i === _data.bids_si && _data.array[i] !== undefined) {
                _data.array[i].amounts = _data.array[i].amount;
            } else if (_data.array[i - 1] !== undefined) {
                _data.array[i].amounts = _data.array[i - 1].amounts + _data.array[i].amount;
            }
        }
        ChartManager.instance.redraw('All', false);
    }

    setMainIndicator(indicName) {
        this._mainIndicator = indicName;
        if (indicName === 'NONE') {
            ChartManager.instance.removeMainIndicator('frame0.k0');
        } else {
            ChartManager.instance.setMainIndicator('frame0.k0', indicName);
        }
        ChartManager.instance.redraw('All', true);
    }

    setIndicator(index, indicName) {
        let status = Kline.instance.status;
        if (indicName === 'NONE') {
            /*
            let index = 2;
            if (Template.displayVolume === false)
                index = 1;
            */
            let index = 1;
            let areaName = ChartManager.instance.getIndicatorAreaName('frame0.k0', index);
            if (areaName !== '')
                ChartManager.instance.removeIndicator(areaName);
        } else {
            /*
            let index = 2;
            if (Template.displayVolume === false)
                index = 1;
            */
            let index = 1;
            let areaName = ChartManager.instance.getIndicatorAreaName('frame0.k0', index);
            if (areaName === '') {
              //Template.createIndicatorChartComps('frame0.k0', indicName);
            } else {
                ChartManager.instance.setIndicator(areaName, indicName);
                ChartManager.instance.removeIndicator(status[indicName]);
                ChartManager.instance.redraw('All', true);
            }
        }
        ChartManager.instance.redraw('All', true);
    }

    addNewIndicator(indic){
        let indicatorStatus = Kline.instance.indicator;
        let status = Kline.instance.status;
        if(indic === "VOLUME"){
            if (indicatorStatus.VOLUME === false){
                Template.createIndicatorChartCompsVOLUME('frame0.k0', 'VOLUME');
            }else{
                let areaName = status.VOLUME;
                ChartManager.instance.removeIndicator(areaName);
            }

        }
        else if(indic === "MACD"){
            if(indicatorStatus.MACD === false){
                 Template.createIndicatorChartCompsMACD('frame0.k0', 'MACD');
            }else{
                let areaName = status.MACD;
                ChartManager.instance.removeIndicator(areaName);
            }
        }
        else if(indic === "BOLL") {
            if(indicatorStatus.BOLL === false){
                Template.createIndicatorChartCompsBOLL('frame0.k0', 'BOLL');
            }else{
                let areaName = status.BOLL;
                ChartManager.instance.removeIndicator(areaName);
            }
        }
        else if(indic === "KDJ"){
            if(indicatorStatus.KDJ === false){
                Template.createIndicatorChartCompsKDJ('frame0.k0', 'KDJ');
            }else{
                let areaName = status.KDJ;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "StochRSI"){
            if(indicatorStatus.StochRSI === false){
                 Template.createIndicatorChartCompsStochRSI('frame0.k0', 'StochRSI');
            }else{
                let areaName = status.StochRSI;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "RSI"){
            if(indicatorStatus.RSI === false){
                Template.createIndicatorChartCompsRSI('frame0.k0', 'RSI');
            }else{
                let areaName = status.RSI;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "DMI"){
            if(indicatorStatus.DMI === false){
                Template.createIndicatorChartCompsDMI('frame0.k0', 'DMI');
            }else{
                let areaName = status.DMI;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "OBV"){
            if(indicatorStatus.OBV === false){
                 Template.createIndicatorChartCompsOBV('frame0.k0', 'OBV');
            }else{
                  let areaName = status.OBV;
                  ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "SAR"){
            if(indicatorStatus.SAR === false){
                 Template.createIndicatorChartCompsSAR('frame0.k0', 'SAR');
            }else{
                let areaName = status.SAR;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "DMA"){
            if(indicatorStatus.DMA === false){
                Template.createIndicatorChartCompsDMA('frame0.k0', 'DMA');
            }else{
                let areaName = status.DMA;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "TRIX"){
            if(indicatorStatus.TRIX === false){
                 Template.createIndicatorChartCompsTRIX('frame0.k0', 'TRIX');
            }else{
                let areaName = status.TRIX;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "BRAR"){
            if(indicatorStatus.BRAR === false){
                Template.createIndicatorChartCompsBRAR('frame0.k0', 'BRAR');
            }else{
                 let areaName = status.BRAR;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "VR"){
            if(indicatorStatus.VR === false){
                Template.createIndicatorChartCompsVR('frame0.k0', 'VR');
            }else{
                let areaName = status.VR;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "EMV"){
            if(indicatorStatus.EMV === false){
                Template.createIndicatorChartCompsEMV('frame0.k0', 'EMV');
            }else{
                let areaName = status.EMV;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "WR"){
            if(indicatorStatus.WR === false){
                Template.createIndicatorChartCompsWR('frame0.k0', 'WR');
            }else{
                let areaName = status.WR;
                ChartManager.instance.removeIndicator(areaName)
            }

        }
        else if(indic === "ROC"){
            if(indicatorStatus.ROC === false){
                 Template.createIndicatorChartCompsROC('frame0.k0', 'ROC');
            }else{
                let areaName = status.ROC;
                ChartManager.instance.removeIndicator(areaName)
            }

        }
        else if(indic === "MTM"){
            if(indicatorStatus.MTM === false){
                 Template.createIndicatorChartCompsMTM('frame0.k0', 'MTM');
            }else{
                let areaName = status.MTM;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        else if(indic === "PSY"){
            if(indicatorStatus.PSY === false){
                Template.createIndicatorChartCompsPSY('frame0.k0', 'PSY');
            }else{
                let areaName = status.PSY;
                ChartManager.instance.removeIndicator(areaName)
            }
        }
        ChartManager.instance.redraw('All', true);
    }

    addIndicator(indicName) {
        ChartManager.instance.addIndicator(indicName);
        ChartManager.instance.redraw('All', true);
    }

    removeIndicator(indicName) {
        let areaName = ChartManager.instance.getIndicatorAreaName(2);
        ChartManager.instance.removeIndicator(areaName);
        ChartManager.instance.redraw('All', true);
    };

}
Chart.strPeriod = {
    'zh-cn': {
        'line': '(分时)',
        '1min': '(1分钟)',
        '5min': '(5分钟)',
        '15min': '(15分钟)',
        '30min': '(30分钟)',
        '1hour': '(1小时)',
        '1day': '(日线)',
        '1week': '(周线)',
        '3min': '(3分钟)',
        '2hour': '(2小时)',
        '4hour': '(4小时)',
        '6hour': '(6小时)',
        '12hour': '(12小时)',
        '3day': '(3天)'
    },
    'en-us': {
        'line': '(Line)',
        '1min': '(1m)',
        '5min': '(5m)',
        '15min': '(15m)',
        '30min': '(30m)',
        '1hour': '(1h)',
        '1day': '(1d)',
        '1week': '(1w)',
        '3min': '(3m)',
        '2hour': '(2h)',
        '4hour': '(4h)',
        '6hour': '(6h)',
        '12hour': '(12h)',
        '3day': '(3d)'
    },
    'zh-tw': {
        'line': '(分時)',
        '1min': '(1分鐘)',
        '5min': '(5分鐘)',
        '15min': '(15分鐘)',
        '30min': '(30分鐘)',
        '1hour': '(1小時)',
        '1day': '(日線)',
        '1week': '(周線)',
        '3min': '(3分鐘)',
        '2hour': '(2小時)',
        '4hour': '(4小時)',
        '6hour': '(6小時)',
        '12hour': '(12小時)',
        '3day': '(3天)'
    }
};
