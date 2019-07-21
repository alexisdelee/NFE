import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import { ITicket } from "../../models/ITicket";
import { IItemData } from "../../models/IItemData";

import { InputUniversal } from "../tools/InputUniversal";
import { TextareaUniversal } from "../tools/TextareaUniversal";
import { MapUniversal } from "../tools/MapUniversal";

import "./Items.scss";

// Props
interface ItemsProps {
    new: boolean;
    ticket: ITicket;
    readonly: boolean;
    onChange: (ticket: ITicket) => void;
}

// State
interface ItemsState {
    ticket: ITicket;
    readonly: boolean;
}

export class Items extends React.Component<ItemsProps, ItemsState> {
    constructor(props: ItemsProps) {
        super(props);

        this.state = {
            ticket: this.props.ticket,
            readonly: this.props.readonly
        };
    }

    public async componentWillReceiveProps(props: ItemsProps): Promise<void> {
        this.setState({ ticket: props.ticket });
    }

    private notifyParent(ticket: ITicket): void {
        this.setState({ ticket });
        this.props.onChange(ticket);
    }

    private handleInputChange(data: IItemData): void {
        const { ticket } = this.state;
        ticket.data.map(d => {
            if (d.id == data.id) {
                d = data;
            }

            return data;
        });

        this.notifyParent(ticket);
    }

    private compare(a: IItemData, b: IItemData): number {
        if (a.item.sort < b.item.sort) {
            return -1;
        } else if (a.item.sort > b.item.sort) {
            return 1;
        } else {
            return 0;
        }
    }

    private makeUpForm(data: IItemData): React.ReactNode {
        if (data.item.universal.category == "input") {
            return <InputUniversal
                        new={ this.props.new }
                        data={ data }
                        readonly={ this.state.readonly }
                        onChange={ this.handleInputChange.bind(this) } />;
        } else if (data.item.universal.category == "textarea") {
            return <TextareaUniversal
                        new={ this.props.new }
                        data={ data }
                        readonly={ this.state.readonly }
                        onChange={ this.handleInputChange.bind(this) } />;
        } else if (data.item.universal.category == "map") {
            return <MapUniversal
                        new={ this.props.new }
                        data={ data }
                        readonly={ this.state.readonly }
                        onChange={ this.handleInputChange.bind(this) } />;
        }

        return null;
    }

    public render(): React.ReactNode {
        return <div className="items-content">
            {
                (this.state.ticket && this.state.ticket.data && this.state.ticket.data.some(data => data.item.universal.category == "input" && data.item.universal.label == "file"))
                    && <React.Fragment>
                        <small className="blink warning">
                            <strong>&#9888; l'upload de fichiers est limité à 2GB et sera stocké sur un serveur externe durant seulement 7 jours</strong>
                        </small><br /><br />
                    </React.Fragment>
                    || null
            }

            {
                this.state.ticket && this.state.ticket.data && this.state.ticket.data.sort(this.compare).reduce((acc, item, index) => { acc[Math.floor(index / 2)] = [ ...(acc[Math.floor(index / 2)] || []), item ]; return acc; }, []).map((d: Array<IItemData>) => {
                    return <Flex.Row>
                        {
                            d.map(data => {
                                return <Flex.Col xs={ 12 } md={ 6 }>
                                    {
                                        this.makeUpForm(data)
                                    }
                                </Flex.Col>;
                            })
                        }
                    </Flex.Row>;
                })
            }
        </div>;
    }
}
