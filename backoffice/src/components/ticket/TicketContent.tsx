import * as React from "react";
import * as Flex from "react-simple-flex-grid";
import { Redirect } from "react-router-dom";

import { Permission, PermissionMethod } from "../../Permission";
import * as Api from "../../Api";

import { TicketLeftContent } from "./TicketLeftContent";
import { TicketRightContent } from "./TicketRightContent";
import { ITicket } from "../../models/ITicket";

import "./TicketContent.scss";

// Props
interface ITicketContentProps {
    ticket: ITicket;
    ticketId: number;
    readonly: boolean;
    new: boolean;
}

// State
interface ITicketContentState {
    ticket: ITicket;
    readonly: boolean;
    loading: boolean;
}

export class TicketContent extends React.Component<ITicketContentProps, ITicketContentState> {
    public static defaultProps: ITicketContentProps = {
        ticket: null,
        ticketId: 0,
        readonly: false,
        new: false
    };

    constructor(props: ITicketContentProps) {
        super(props);

        this.state = {
            ticket: props.ticket,
            readonly: props.readonly || (this.props.new && !this.getParam("tracker")),
            loading: false
        };
    }

    public async componentDidMount(): Promise<void> {
        if (this.props.new) {
            this.setState({ ticket: {} as ITicket });
        } else if (this.props.ticket == null) {
            const ticket: ITicket = (await Api.Ticket.findOne(this.props.ticketId) as any).ticket;
            this.setState({ ticket, readonly: this.state.readonly || ticket.archived });
        }
    }

    private handleTicketChange(ticket: ITicket) {
        this.setState({ ticket });
    }

    private handleSummaryChange(event): void {
        let ticket: ITicket = this.state.ticket;
        ticket.summary = event.target.value;

        this.setState({ ticket });
    }

    private async handleSaveClick(): Promise<void> {
        this.setState({ loading: true });

        try {
            if (this.props.new) {
                const ticket: ITicket = (await Api.Ticket.post(this.state.ticket) as any).ticket;
                window.location.href = "/tickets/" + ticket.id;
            } else {
                await Api.Ticket.save(this.state.ticket.id, this.state.ticket);
                window.location.reload();
            }
        } catch(err) {
            this.setState({ loading: false });
            alert(err.error ? err.error : err);
        }
    }

    private async handleDeleteClick(): Promise<void> {
        if (!this.props.new) {
            this.setState({ loading: true });

            await Api.Ticket.delete(this.state.ticket.id);
            window.location.href = "/";
        }
    }

    private async handleArchivedClick(): Promise<void> {
        if (!this.props.new) {
            this.setState({ loading: true });
            
            let ticket: ITicket = this.state.ticket;
            ticket.archived = true;

            await Api.Ticket.save(ticket.id, ticket);
            window.location.reload();
        }
    }

    private getParam(key: string): string {
        return new URL(window.location.href).searchParams.get(key);
    }

    public render(): React.ReactNode {
        if (this.state.ticket || this.props.new) {
            return <section className={ (this.state.readonly ? ["ticket-content", "ticket-content__readonly"] : ["ticket-content"]).join(" ") }>
                <Flex.Row>
                    <Flex.Col xs={ 12 }>
                        <fieldset>
                            <legend>Titre du ticket*</legend>
                            
                            {
                                this.state.ticket
                                    && <input 
                                            type="text"
                                            value={ this.state.ticket.summary }
                                            disabled={ this.state.readonly }
                                            onChange={ this.handleSummaryChange.bind(this) }
                                            style={{ padding: "7px 8px", fontSize: "14px", width: "100%" }} />
                            }
                        </fieldset>
                    </Flex.Col>
                </Flex.Row>
                <Flex.Row>
                    <Flex.Col xs={ 12 } md={ 4 }>
                        {
                            Permission.parseFromStorage().has(["users", "regions"], PermissionMethod.READ)
                            && (
                                (this.state.ticket || this.props.new)
                                    && <TicketLeftContent
                                            ticket={ this.state.ticket }
                                            readonly={ this.state.readonly }
                                            new={ this.props.new }
                                            loading={ this.state.loading }
                                            onChange={ this.handleTicketChange.bind(this) }
                                            onSave={ this.handleSaveClick.bind(this) }
                                            onDelete={ this.handleDeleteClick.bind(this) }
                                            onArchived={ this.handleArchivedClick.bind(this) } />
                            )
                        }
                    </Flex.Col>
                    <Flex.Col xs={ 12 } md={ 8 }>
                    {
                            (this.state.ticket || this.props.new)
                                && <TicketRightContent
                                        ticket={ this.state.ticket }
                                        readonly={ this.state.readonly }
                                        new={ this.props.new }
                                        onChange={ this.handleTicketChange.bind(this) } />
                        }
                    </Flex.Col>
                </Flex.Row>
            </section>;
        }

        return null;
    }
}
