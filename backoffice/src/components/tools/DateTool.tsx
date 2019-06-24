import * as React from "react";
import TimeAgo from "react-timeago";
import fr from "react-timeago/lib/language-strings/fr";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import Moment from "react-moment";
import "moment-timezone";

// Props
interface IDateToolProps {
    datetime: Date | string | number;
    prefix: string;
}

// State
interface IDateToolState {
    datetime: Date;
}

export class DateTool extends React.Component<IDateToolProps, IDateToolState> {
    static defaultProps = {
        prefix: ""
    };

    private static formatter: any = buildFormatter(fr);

    constructor(props: IDateToolProps) {
        super(props);

        if (props.datetime instanceof Date) {
            this.state = { datetime: this.stringToDate(props.datetime) };
        } else {
            this.state = { datetime: this.stringToDate(props.datetime) };
        }
    }

    private stringToDate(datetime: Date | string | number): Date {
        if (datetime instanceof Date) {
            return datetime as Date;
        }

        return new Date(datetime);
    }

    public componentWillReceiveProps(props: IDateToolProps): void {
        this.setState({ datetime: this.stringToDate(props.datetime) });
    }

    public render(): React.ReactNode {
        if ((Date.now() - this.state.datetime.getTime()) >= 86400000) { // one day
            return <React.Fragment>
                { this.props.prefix }
                <Moment format="DD/MM/YYYY à HH:mm">{ this.state.datetime.toString() }</Moment>
            </React.Fragment>;
        } else {
            return <TimeAgo date={ this.state.datetime.toString() } formatter={ DateTool.formatter } />
        }
    }
}
