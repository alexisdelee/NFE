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

export class DateTool extends React.Component<IDateToolProps, Object> {
    static defaultProps = {
        prefix: ""
    };

    private static formatter: any = buildFormatter(fr);
    private datetime: Date;

    constructor(props: IDateToolProps) {
        super(props);

        if (props.datetime instanceof Date) {
            this.datetime = props.datetime as Date;
        } else {
            this.datetime = new Date(props.datetime);
        }
    }

    public render(): React.ReactNode {
        if ((Date.now() - this.datetime.getTime()) >= 86400000) { // one day
            return <React.Fragment>
                { this.props.prefix }
                <Moment format="DD/MM/YYYY à HH:mm">{ this.datetime.toString() }</Moment>
            </React.Fragment>;
        } else {
            return <TimeAgo date={ this.datetime.toString() } formatter={ DateTool.formatter } />
        }
    }
}
