import * as React from "react";
import * as Flex from "react-simple-flex-grid";

import { DateTool } from "../tools/DateTool";
import { ListUniversal } from "../tools/ListUniversal";
import { EditorUniversal } from "../tools/EditorUniversal";
import { InputUniversal, InputUniversalType } from "../tools/InputUniversal";
import { MapUniversal } from "../tools/MapUniversal";
import { Universal } from "../tools/Universal";
import { ASharedComponent } from "../tools/ASharedComponent";
import { CommentList } from "./CommentList";
import { ITicket } from "../../models/ITicket";
import { IItemWrapper } from "../../models/IItemWrapper";
import { IGeneric } from "../../models/IGeneric";
import * as Api from "../../Api";

import "./TicketContent.scss";

// Props
interface ITicketContentProps {
    ticket: ITicket;
    ticketId: number;
    readonly: boolean;
    archived: boolean;
}

// State
interface ITicketContentState {
    ticket: ITicket;
    readonly: boolean;
    archived: boolean;
    wrappers: Array<IItemWrapper>;
    wrapper: IItemWrapper;
}

export class TicketContent extends ASharedComponent<ITicketContentProps, ITicketContentState> {
    public static defaultProps: ITicketContentProps = {
        ticket: null,
        ticketId: 0,
        readonly: false,
        archived: false
    };

    constructor(props: ITicketContentProps) {
        super(props);

        this.state = {
            ticket: props.ticket,
            readonly: props.readonly || props.archived,
            archived: props.archived,
            wrappers: new Array<IItemWrapper>(),
            wrapper: null
        };
    }

    public async componentDidMount(): Promise<void> {
        const self = this;

        super.componentDidMount();

        try {
            if (this.props.ticket == null) {
                const ticket: ITicket = await Api.Ticket.findOne(this.props.ticketId);
                this.setState({ ticket });

                const wrappers: Array<IItemWrapper> = await Api.Item.findByTicket(this.props.ticketId);
                this.setState({ wrappers }, function() {
                    this.subscribe("wrapper", "wrapper", async function() {
                        await Api.Item.updateByTicket(self.state.ticket.id, { ...self.state.wrapper });

                        const ticket: ITicket = { ...self.state.ticket };
                        ticket.updated = new Date();

                        self.setState({ ticket }, () => console.log(this.state.ticket.updated));
                    }); // to initialize communication between components
                });
            }
        } catch(err) {
            console.error(err);
        }
    }


    private fetchListUniversal(model: string): Promise<Array<IGeneric>> {
        if (model == "status") {
            return Api.Status.find();
        } else if (model == "priority") {
            return Api.Priority.find();
        } else if (model == "tracker") {
            return Api.Tracker.find();
        } else if (model == "region") {
            return Api.Region.find();
        }

        return Promise.reject("unknown model");
    }

    private updateListUniversal(model: string, ref: IGeneric, readonly: boolean): void {
        if (!readonly) {
            const ticket: ITicket = this.state.ticket;
            ticket[model] = ref || null;

            this.setState({ ticket });
        }
    }

    private updateEditorUniversal(model: string, value: string, readonly: boolean): void {
        if (!readonly) {
            if (model == "ticket") {
                const ticket: ITicket = this.state.ticket;
                ticket.description = value ? btoa(value) : null;

                this.setState({ ticket });
            }
        }
    }

    private makeUpUniversals(): React.ReactNode {
        return [<hr />].concat(this.state.wrappers.reduce((result, value, index, array) => {
            if (index % 2 == 0) {
                result.push(array.slice(index, index + 2));
            }

            return result;
        }, []).map((wrappers) => {
            return <Flex.Row>
                <Flex.Col xs={ 12 } md={ 6 }>
                    <Universal 
                        wrapper={ wrappers[0] }
                        readonly={ this.state.readonly } />
                </Flex.Col>

                {
                    (wrappers.length > 1) && 
                        <Universal 
                            wrapper={ wrappers[1] }
                            readonly={ this.state.readonly } />
                }
            </Flex.Row>;
        }));
    }

    public render(): React.ReactNode {
        if (this.state.ticket) {
            return <section className={ [ "ticket-content" ].concat(this.state.archived ? "ticket-content__archived" : []).join(" ") }>
                <header>
                    <Flex.Row align="middle">
                        <Flex.Col xs={ 1 }>
                            <img className="ticket-content__gravatar" title="Auteur" src="https://www.gravatar.com/avatar/54fc98617b5c0b9a77a8b05f0879490c?rating=PG&size=50&default=wavatar" />
                        </Flex.Col>
                        <Flex.Col xs={ 11 }>
                            <div className="ticket-content__subject">
                                <strong>{ this.state.ticket.summary }</strong><br />
                                <small>Ajouté par <a href={ "/tickets/reporter/" + this.state.ticket.reporter.id }>{ this.state.ticket.reporter.pseudo }</a> <DateTool datetime={ this.state.ticket.created } prefix="le " />. </small>
                                {
                                    this.state.ticket.updated && <small>Mise à jour <DateTool datetime={ this.state.ticket.updated } prefix="le " />.</small>
                                }
                            </div>
                        </Flex.Col>
                    </Flex.Row>
                </header>

                <section className="ticket-content__body">
                    <Flex.Row>
                        <Flex.Col xs={ 12 } md={ 6 }>
                            <ListUniversal 
                                property="Tracker" 
                                value={ this.state.ticket.tracker } 
                                model="tracker" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ true } />
                        </Flex.Col>

                        <Flex.Col xs={ 12 } md={ 6 }>
                            <ListUniversal 
                                property="Statut" 
                                value={ this.state.ticket.status } 
                                model="status" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ this.state.readonly } />
                        </Flex.Col>
                    </Flex.Row>

                    <Flex.Row>
                        <Flex.Col xs={ 12 } md={ 6 }>
                            <ListUniversal 
                                property="Région" 
                                value={ this.state.ticket.region } 
                                model="region" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ true } />
                        </Flex.Col>
                        <Flex.Col xs={ 12 } md={ 6 }>
                            <ListUniversal 
                                property="Priorité" 
                                value={ this.state.ticket.priority } 
                                model="priority" 
                                onChange={ this.updateListUniversal.bind(this) } 
                                onFetch={ this.fetchListUniversal.bind(this) } 
                                required={ true } 
                                readonly={ this.state.readonly } />
                        </Flex.Col>
                    </Flex.Row>

                    {
                        this.state.wrappers.length > 0 && this.makeUpUniversals()
                    }

                    <div className="ticket-content__description">
                        <EditorUniversal 
                            value={ this.state.ticket.description ? atob(this.state.ticket.description) : "" } 
                            model="ticket"
                            onChange={ this.updateEditorUniversal.bind(this) } 
                            readonly={ this.state.readonly } />
                    </div>
                </section>
            </section>;
        }

        return null;
    }
}
