import * as React from "react";
import * as Flex from "react-simple-flex-grid";
import moment from "moment";

import * as Api from "../../Api";

import { ITicket } from "../../models/ITicket";
import { ITracker } from "../../models/ITracker";
import { SelectUniversal } from "../tools/SelectUniversal";
import { CustomChart } from "../tools/CustomChart";

// State
interface IMenuState {
    trackers: Array<ITracker>;
    tickets: Array<ITicket>;
    data: Array<Object>;
    selectedTrackers: Array<Object>,
    selectedX: { value: string, label: string },
    selectedPeriod: { value: string, label: string },
    selectedAmplitude: { value: string, label: string, mixin: any }
}

export class Statistic extends React.Component<Object, IMenuState> {
    constructor(props: Object) {
        super(props);

        this.state = {
            trackers: new Array<ITracker>(),
            tickets: new Array<ITicket>(),
            data: new Array<Object>(),
            selectedTrackers: new Array<Object>(),
            selectedX: { value: "region", label: "Régions" },
            selectedPeriod: { value: "past-month", label: "1 mois" },
            selectedAmplitude: { value: "1day", label: "1 jour", mixin: this.initToDay }
        }
    }

    public async componentDidMount(): Promise<void> {
        const trackers: Array<ITracker> = (await Api.Tracker.find() as any).trackers;
        const selectedTrackers: Array<any> = trackers.map(tracker => ({ value: tracker.id, label: tracker.name, tracker }));

        const tickets: Array<ITicket> = (await Api.Statistic.findWithDuration("past-year") as any).tickets;
        this.setState({ trackers, selectedTrackers, tickets, data: this.generateFormattedData(selectedTrackers, tickets, this.state.selectedX.value.toLowerCase()) });
    }

    private generateFormattedData(selectedTrackers: Array<any>, tickets: Array<ITicket>, criteria: string): Array<any> {
        tickets = tickets.filter(ticket => selectedTrackers.map(selectedTracker => selectedTracker.tracker.id).includes(ticket.tracker.id));

        let fields: Array<any> = new Array<any>();
        let aggregates: any;

        if (criteria == "period") {
            aggregates = Object.values(this.groupByCreatedDate(this.state.selectedAmplitude.mixin, tickets));
        } else if (criteria == "region") {
            aggregates = Object.values(this.groupByRegion(tickets));
        } else {
            return null;
        }

        for (const aggregate of aggregates) {
            const nodes = Object.values(this.groupByTraker(aggregate));

            let field: any = {};
            for (const node of nodes) {
                if (node.length > 0) {
                    if (criteria == "period") {
                        switch(this.state.selectedAmplitude.value) {
                            case "1hour":
                                field["label"] = moment(node[0].ticket.created).format("HH:00") + " - " + moment(node[0].ticket.created).add(1, "hours").format("HH:00");
                                break;
                            case "1day":
                                field["label"] = moment(node[0].ticket.created).format("DD/MM/YYYY");
                                break;
                            case "1month":
                                field["label"] = moment(node[0].ticket.created).format("MM/YYYY");
                                break;
                            default:
                                field["label"] = node[0].created.toString();
                        }
                        
                        field[node[0].ticket.tracker.shortname] = node.length;
                    } else if (criteria == "region") {
                        field["label"] = node[0].region.name;
                        field[node[0].ticket.tracker.shortname] = node.length;
                    }
                }
            }

            if (!(Object.entries(field).length === 0 && field.constructor === Object)) {
                fields.push(field);
            }
        }

        return fields;
    }

    private groupByCreatedDate(transform: (date: Date) => Date, tickets): Array<any> {
        return tickets.reduce(function (acc, ticket) {
            const created: Date = transform(new Date(ticket.created));

            (acc[created.toString()] = acc[created.toString()] || []).push({ ticket, created });
            return acc;
        }, {});
    }

    private groupByRegion(tickets): Array<any> {
        return tickets.reduce(function (acc, ticket) {
            (acc[ticket.region.id] = acc[ticket.region.id] || []).push({ ticket, region: ticket.region });
            return acc;
        }, {});
    }

    private groupByTraker(aggregates: Array<any>): Array<any> {
        return aggregates.reduce(function (acc, aggregate) {
            (acc[aggregate.ticket.tracker.id] = acc[aggregate.ticket.tracker.id] || []).push(aggregate);
            return acc;
        }, []);
    }

    private initToHour(rawDate: Date): Date {
        const date: Date = new Date(rawDate);
        date.setHours(rawDate.getHours());

        return date;
    }

    private initToDay(rawDate: Date): Date {
        const date: Date = new Date(rawDate);
        date.setHours(0, 0, 0, 0);

        return date;
    }

    private initToMonth(rawDate: Date): Date {
        return new Date(rawDate.getFullYear(), rawDate.getMonth());
    }

    // Handler >>> 
        private handleTrackerChange(trackers: Array<any>): void {
            trackers = trackers || new Array<ITracker>();
            this.setState({ selectedTrackers: trackers, data: this.generateFormattedData(trackers, this.state.tickets, this.state.selectedX.value.toLowerCase()) });
        }

        private handleXChange(x): void {
            this.setState({ selectedX: x, data: this.generateFormattedData(this.state.selectedTrackers, this.state.tickets, x.value.toLowerCase()) });
        }

        private async handlerTotalPeriodChange(totalPeriod): Promise<void> {
            const tickets: Array<ITicket> = (await Api.Statistic.findWithDuration(totalPeriod.value) as any).tickets;
            this.setState({ tickets, data: this.generateFormattedData(this.state.selectedTrackers, tickets, this.state.selectedX.value.toLowerCase()) });
        }

        private handleAmplitudeChange(amplitude): void {
            this.setState({ selectedAmplitude: amplitude }, () => this.setState({ data: this.generateFormattedData(this.state.selectedTrackers, this.state.tickets, this.state.selectedX.value.toLowerCase()) }));
        }
    // <<< Handler

    public render(): React.ReactNode {
        if (this.state.tickets.length) {
            // return <CustomChart data={ this.state.data } titleX="Périodes" titleY="Nombre d'incidents par type" />;
            return <Flex.Row>
                <Flex.Col xs={ 12 }>
                    <Flex.Row>
                        <Flex.Col xs={ 0 } md={ 3 }></Flex.Col>
                        <Flex.Col xs={ 12 } md={ 6 }>
                            <SelectUniversal
                                isMulti={ true }
                                options={ this.state.trackers.map(tracker => ({ value: tracker.id, label: tracker.name, tracker })) }
                                defaultValue={ this.state.selectedTrackers }
                                name="tracker"
                                onChange={ this.handleTrackerChange.bind(this) } />
                        </Flex.Col>
                        <Flex.Col xs={ 0 } md={ 3 }></Flex.Col>
                    </Flex.Row><br />

                    {
                        this.state.selectedTrackers.length
                            && <React.Fragment>
                                <Flex.Row>
                                    <Flex.Col xs={ 0 } md={ 3 }></Flex.Col>
                                    <Flex.Col xs={ 12 } md={ 2 }>
                                        <SelectUniversal
                                            options={ [] }
                                            defaultValue={{ value: "y", label: "Nombre de tickets par type" }}
                                            name="y"
                                            onChange={ console.log } />
                                    </Flex.Col>
                                    <Flex.Col xs={ 12 } md={ 2 }>
                                        <strong style={{ textAlign: "center", width: "100%", display: "inline-block", marginTop: "10px", textTransform: "uppercase" }}>en fonction des</strong>
                                    </Flex.Col>
                                    <Flex.Col xs={ 12 } md={ 2 }>
                                        <SelectUniversal
                                            options={ [{ value: "period", label: "Périodes" }, { value: "region", label: "Régions" }] }
                                            defaultValue={ this.state.selectedX }
                                            name="x"
                                            onChange={ this.handleXChange.bind(this) } />
                                    </Flex.Col>
                                    <Flex.Col xs={ 0 } md={ 3 }></Flex.Col>
                                </Flex.Row><br />

                                <Flex.Row>
                                    <Flex.Col xs={ 0 } md={ 3 }></Flex.Col>
                                    <Flex.Col xs={ 12 } md={ 3 }>
                                        <Flex.Row>
                                            <Flex.Col xs={ 12 } md={ 6 }>
                                                <strong style={{ textAlign: "center", width: "100%", display: "inline-block", marginTop: "10px" }}>Période totale</strong>
                                            </Flex.Col>
                                            <Flex.Col xs={ 12 } md={ 6 }>
                                                <SelectUniversal
                                                    options={ [{ value: "past-24-hours", label: "24 heures" }, { value: "past-3-days", label: "3 jours" }, { value: "past-week", label: "1 semaine" }, { value: "past-month", label: "1 mois" }, { value: "past-year", label: "1 an" }] }
                                                    defaultValue={ this.state.selectedPeriod }
                                                    name="totalPeriod"
                                                    onChange={ this.handlerTotalPeriodChange.bind(this) } />
                                            </Flex.Col>
                                        </Flex.Row>
                                    </Flex.Col>
                                    <Flex.Col xs={ 12 } md={ 3 }>
                                        <Flex.Row>
                                            {
                                                (this.state.selectedX && this.state.selectedX.value == "period")
                                                    && <React.Fragment>
                                                        <Flex.Col xs={ 12 } md={ 6 }>
                                                            <strong style={{ textAlign: "center", width: "100%", display: "inline-block", marginTop: "10px" }}>Amplitude</strong>
                                                        </Flex.Col>
                                                        <Flex.Col xs={ 12 } md={ 6 }>
                                                            <SelectUniversal
                                                                options={ [{ value: "1hour", label: "1 heure", mixin: this.initToHour }, { value: "1day", label: "1 jour", mixin: this.initToDay }, { value: "1month", label: "1 mois", mixin: this.initToMonth }] }
                                                                defaultValue={ this.state.selectedAmplitude }
                                                                name="amplitude"
                                                                onChange={ this.handleAmplitudeChange.bind(this) } />
                                                        </Flex.Col>
                                                    </React.Fragment>
                                                    || null
                                            }
                                        </Flex.Row>
                                    </Flex.Col>
                                </Flex.Row>
                            </React.Fragment>
                            || null
                    }
                </Flex.Col>

                <Flex.Col xs={ 12 } style={{ marginTop: "30px" }}>
                    {
                        this.state.selectedTrackers.length && this.state.data
                            && <CustomChart data={ this.state.data } titleX={ this.state.selectedX.label } titleY="Nombre de tickets par type" />
                            || null
                    }
                </Flex.Col>
            </Flex.Row>;
        }

        return null;
    }
}
