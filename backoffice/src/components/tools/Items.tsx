import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import { ITicket } from "../../models/ITicket";
import { IItemData } from "../../models/IItemData";
import { IItem } from "../../models/IItem";

import { InputUniversal } from "./InputUniversal";

// Props
interface ItemsProps {
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

    private handleInputChange(data: IItemData): void {
        const { ticket } = this.state;
        ticket.data.map(d => {
            if (d.id == data.id) {
                d = data;
            }

            return data;
        });

        this.setState({ ticket });
    }

    public render(): React.ReactNode {
        return <React.Fragment>
            {
                this.state.ticket && this.state.ticket.data && this.state.ticket.data.reduce((acc, item, index) => { acc[Math.floor(index / 2)] = [ ...(acc[Math.floor(index / 2)] || []), item ]; return acc; }, []).map((d: Array<IItemData>) => {
                    return <Flex.Row>
                        {
                            d.map(data => {
                                return <Flex.Col xs={ 12 } md={ 6 }>
                                    {
                                        data.item.universal.category == "input"
                                            && <InputUniversal 
                                                data={ data }
                                                readonly={ this.state.readonly }
                                                onChange={ this.handleInputChange.bind(this) } />
                                    }
                                </Flex.Col>;
                            })
                        }
                    </Flex.Row>;
                })
            }
        </React.Fragment>;
    }
}
