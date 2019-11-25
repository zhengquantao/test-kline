import { ChartManager } from './chart_manager'
import { ChartSettings } from './chart_settings'
import * as data_sources from './data_sources'
import * as data_providers from './data_providers'
import * as areas from './areas'
import * as plotters from './plotters'
import { Timeline } from './timeline'
import { CName } from './cname'
import * as layouts from './layouts'
import * as themes from './themes'
import * as ranges from './ranges'
import Kline from './kline'
import row from "element-ui/packages/row/src/row";
export class Template {
    static createCandlestickDataSource(dsAlias) {
        return new data_sources.MainDataSource(dsAlias);
    }

    static createDataSource(dsName, dsAlias, createFunc) {
        let mgr = ChartManager.instance;
        if (mgr.getCachedDataSource(dsAlias) === null)
            mgr.setCachedDataSource(dsAlias, createFunc(dsAlias));
        mgr.setCurrentDataSource(dsName, dsAlias);
        mgr.updateData(dsName, null);
    }

    static createTableComps(dsName) {
        this.createMainChartComps(dsName);
        this.createTimelineComps(dsName);
    }

    static createMainChartComps(dsName) {
        let mgr = ChartManager.instance;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".main";
        let rangeAreaName = areaName + "Range";
        let area = new areas.MainArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        let rangeArea = new areas.MainRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.MainDataProvider(areaName + ".main");
        mgr.setDataProvider(dp.getName(), dp);
        mgr.setMainIndicator(dsName, "MA");
        let range = new ranges.MainRange(areaName);
        mgr.setRange(range.getName(), range);
        range.setPaddingTop(28);
        range.setPaddingBottom(12);
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CandlestickPlotter(areaName + ".main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.MinMaxPlotter(areaName + ".decoration");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.MainInfoPlotter(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CDynamicLinePlotter(areaName + ".tool");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.COrderGraphPlotter(areaName + "Range.grid");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.LastClosePlotter(areaName + "Range.decoration");
        mgr.setPlotter(plotter.getName(), plotter);
    }

    static createIndicatorChartComps(dsName, indicName) {
        let mgr = ChartManager.instance;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        let rowIndex = tableLayout.getAreaCount() >> 1;
        let heights = ChartSettings.get().charts.areaHeight;
        if (heights.length > rowIndex) {
            let a, i;
            for (i = 0; i < rowIndex; i++) {
                a = tableLayout.getAreaAt(i << 1);
                a.setTop(0);
                a.setBottom(heights[i]);
            }
            area.setTop(0);
            area.setBottom(heights[rowIndex]);
        }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === false) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.IndicatorPlotter(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.IndicatorInfoPlotter(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
    }

    static createIndicatorChartCompsVOLUME(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.VOLUME;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterVOLUME(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotter(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.VOLUME = areaName;
    }

    static createIndicatorChartCompsMACD(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.MACD;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        console.log(areaName)
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterVOLUME(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotter(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.MACD = areaName;
    }

    static createIndicatorChartCompsKDJ(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.KDJ;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterKDJ(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterKDJ(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.KDJ = areaName;
    }

    static createIndicatorChartCompsStochRSI(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.StochRSI.show;
        let isInit = Kline.instance.indicator.StochRSI.init;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow || isInit) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterStochRSI(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterStochRSI(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.StochRSI = areaName;
    }

    static createIndicatorChartCompsRSI(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.RSI;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterRSI(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterRSI(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.RSI = areaName;

    }

    static createIndicatorChartCompsDMI(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.DMI;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterDMI(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterDMI(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.DMI = areaName;
    }

    static createIndicatorChartCompsOBV(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.OBV;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterOBV(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterOBV(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.OBV = areaName;

    }

    static createIndicatorChartCompsBOLL(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.BOLL;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterBOLL(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterBOLL(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.BOLL = areaName;

    }

    static createIndicatorChartCompsSAR(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.SAR;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterSAR(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterSAR(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.SAR = areaName;

    }

    static createIndicatorChartCompsDMA(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.DMA;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterDMA(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterDMA(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.DMA = areaName;

    }

    static createIndicatorChartCompsTRIX(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.TRIX;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterTRIX(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterTRIX(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.TRIX = areaName;

    }

    static createIndicatorChartCompsBRAR(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.BRAR;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterBRAR(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterBRAR(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.BRAR = areaName;

    }

    static createIndicatorChartCompsVR(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.VR;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterVR(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterVR(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.VR = areaName;

    }

    static createIndicatorChartCompsEMV(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.EMV;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterEMV(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterEMV(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.EMV = areaName;

    }

    static createIndicatorChartCompsWR(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.WR;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterWR(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterWR(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.WR = areaName;

    }

    static createIndicatorChartCompsROC(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.ROC;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterROC(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterROC(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.ROC = areaName;
    }

    static createIndicatorChartCompsMTM(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.MTM;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterMTM(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterMTM(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.MTM = areaName;
    }

    static createIndicatorChartCompsPSY(dsName, indicName) {
        let mgr = ChartManager.instance;
        let isShow = Kline.instance.indicator.PSY;
        let tableLayout = mgr.getArea(dsName + ".charts");
        let areaName = dsName + ".indic" + tableLayout.getNextRowId();
        let rangeAreaName = areaName + "Range";
        let area = new areas.IndicatorArea(areaName);
        mgr.setArea(areaName, area);
        tableLayout.addArea(area);
        // let rowIndex = tableLayout.getAreaCount() >> 1;
        // let heights = ChartSettings.get().charts.areaHeight;
        // if (heights.length > rowIndex) {
        //     let a, i;
        //     for (i = 0; i < rowIndex; i++) {
        //         a = tableLayout.getAreaAt(i << 1);
        //         a.setTop(0);
        //         a.setBottom(heights[i]);
        //     }
        //     area.setTop(0);
        //     area.setBottom(heights[rowIndex]);
        // }
        let rangeArea = new areas.IndicatorRangeArea(rangeAreaName);
        mgr.setArea(rangeAreaName, rangeArea);
        tableLayout.addArea(rangeArea);
        let dp = new data_providers.IndicatorDataProvider(areaName + ".secondary");
        mgr.setDataProvider(dp.getName(), dp);
        if (mgr.setIndicator(areaName, indicName) === isShow) {
            mgr.removeIndicator(areaName);
            return;
        }
        let plotter = new plotters.MainAreaBackgroundPlotter(areaName + ".background");
        mgr.setPlotter(plotter.getName(), plotter); // plotter.getName()
        plotter = new plotters.CGridPlotter(areaName + ".grid");
        mgr.setPlotter(plotter.getName(), plotter);
        //指标线
        plotter = new plotters.IndicatorPlotterPSY(areaName + ".secondary");
        mgr.setPlotter(plotter.getName(), plotter);
        //左上显示
        plotter = new plotters.IndicatorInfoPlotterPSY(areaName + ".info");
        mgr.setPlotter(plotter.getName(), plotter);
        //游标显示
        plotter = new plotters.SelectionPlotter(areaName + ".selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //右边数字变
        plotter = new plotters.RangeAreaBackgroundPlotter(areaName + "Range.background");
        mgr.setPlotter(plotter.getName(), plotter);
        // 滑动的  和 底部指标名字
        plotter = new plotters.RangePlotter(areaName + "Range.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.RangeSelectionPlotter(areaName + "Range.selection");
        mgr.setPlotter(plotter.getName(), plotter);
        //已经初始化
        Kline.instance.status.PSY = areaName;

    }

    static createTimelineComps(dsName) {
        let mgr = ChartManager.instance;
        let plotter;
        let timeline = new Timeline(dsName);
        mgr.setTimeline(timeline.getName(), timeline);
        plotter = new plotters.TimelineAreaBackgroundPlotter(dsName + ".timeline.background");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.TimelinePlotter(dsName + ".timeline.main");
        mgr.setPlotter(plotter.getName(), plotter);
        plotter = new plotters.TimelineSelectionPlotter(dsName + ".timeline.selection");
        mgr.setPlotter(plotter.getName(), plotter);
    }

    static createLiveOrderComps(dsName) {
        let mgr = ChartManager.instance;
        let plotter;
        plotter = new plotters.BackgroundPlotter(dsName + ".main.background");
        mgr.setPlotter(plotter.getName(), plotter);
        //plotter = new plotters.CLiveOrderPlotter(dsName + ".main.main");
        mgr.setPlotter(plotter.getName(), plotter);
    }

    static createLiveTradeComps(dsName) {
        let mgr = ChartManager.instance;
        let plotter;
        plotter = new plotters.BackgroundPlotter(dsName + ".main.background");
        mgr.setPlotter(plotter.getName(), plotter);
        //plotter = new plotters.CLiveTradePlotter(dsName + ".main.main");
        mgr.setPlotter(plotter.getName(), plotter);
    }

}

export class DefaultTemplate extends Template {

    static loadTemplate(dsName, dsAlias) {
        let mgr = ChartManager.instance;
        let settings = ChartSettings.get();
        let frameName = (new CName(dsName)).getCompAt(0);
        mgr.unloadTemplate(frameName);
        this.createDataSource(dsName, dsAlias, this.createCandlestickDataSource);
        let frame = new layouts.DockableLayout(frameName);
        mgr.setFrame(frame.getName(), frame);
        mgr.setArea(frame.getName(), frame);
        frame.setGridColor(themes.Theme.Color.Grid1);
        let area = new areas.TimelineArea(dsName + ".timeline");
        mgr.setArea(area.getName(), area);
        frame.addArea(area);
        area.setDockStyle(areas.ChartArea.DockStyle.Bottom);
        area.Measuring.addHandler(area, TemplateMeasuringHandler.onMeasuring);
        let tableLayout = new layouts.TableLayout(dsName + ".charts");
        mgr.setArea(tableLayout.getName(), tableLayout);
        tableLayout.setDockStyle(areas.ChartArea.DockStyle.Fill);
        frame.addArea(tableLayout);
        this.createTableComps(dsName);
        mgr.setThemeName(frameName, settings.theme);
        return mgr;
    }

}

export class TemplateMeasuringHandler {

    static onMeasuring(sender, args) {
        let width = args.Width;
        let height = args.Height;
        let areaName = sender.getNameObject().getCompAt(2);
        if (areaName === "timeline") {
            sender.setMeasuredDimension(width, 22);
        }
    }

}
