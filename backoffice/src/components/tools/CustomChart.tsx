import * as React from "react";

// Props
interface IChartProps {
    data: Array<Object>;
    titleX: string;
    titleY: string;
}

// State
interface IChartState {
    data: Array<Object>;
    titleX: string;
    titleY: string;
    am4core: any;
    am4themes_animated: any;
    am4charts: any;
}

export class CustomChart extends React.Component<IChartProps, IChartState> {
    constructor(props: IChartProps) {
        super(props);

        this.state = {
            data: this.props.data,
            titleX: this.props.titleX,
            titleY: this.props.titleY,
            am4core: (window as any).am4core,
            am4themes_animated: (window as any).am4themes_animated,
            am4charts: (window as any).am4charts
        }
    }

    public componentDidMount(): void {
        const self = this;

        this.state.am4core.ready(function() {
            self.initChart(self.state.data);
        });
    }

    public componentWillReceiveProps(props: IChartProps): void {
        this.setState({
            data: props.data,
            titleX: props.titleX,
            titleY: props.titleY
        }, () => this.initChart(this.state.data));
    }

    private initChart(data: Array<Object>): void {
        this.state.am4core.useTheme(this.state.am4themes_animated);

        const chart = this.state.am4core.create("chartdiv", this.state.am4charts.XYChart);
        chart.data = data;

        const categoryAxis = chart.xAxes.push(new this.state.am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "label";
        categoryAxis.title.text = this.state.titleX;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;

        const valueAxis = chart.yAxes.push(new this.state.am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.title.text = this.state.titleY;

        this.createSeries(chart, "incident", "Incident", true, "#df392d");
        this.createSeries(chart, "defect", "Analyse", true, "#027b79");
        this.createSeries(chart, "intervention", "Intervention", true, "#fcba02");
        this.createSeries(chart, "sickness_leave", "Congé maladie", true, "#483d41");
        this.createSeries(chart, "paid_leave", "Congé payé", true, "#71c5e7");
    }

    private createSeries(chart, field, name, stacked, color): void {
        const series = chart.series.push(new this.state.am4charts.ColumnSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "label";
        series.name = name;
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series.stacked = stacked;
        series.columns.template.width = this.state.am4core.percent(95);
        series.columns.template.fill = this.state.am4core.color(color);
    }

    public render(): React.ReactNode {
        if (this.state.data) {
            return <div id="chartdiv" style={{ height: "500px", opacity: 0.7 }}></div>
        }

        return null;
    }
}
