import * as React from "react";
import { findDOMNode } from "react-dom";

import { SharedComponent } from "./SharedComponentProvider";

export abstract class ASharedComponent<P = Object, S = Object> extends React.Component<P, S> {
    public static contextType = SharedComponent;
    private static store: {
        context: {
            classname: {
                typeof: Array<typeof ASharedComponent>,
                instance: ASharedComponent
            }
        }
    } = ({} as any);

    private room: Array<ASharedComponent>;

    public componentDidMount(): void {
        for (const room of this.context) {
            this.room = room;

            for (const ctx of room) {
                if (this instanceof ctx) {
                    ASharedComponent.store[room] = ASharedComponent.store[room] || {};
                    ASharedComponent.store[room][this.constructor.name] = {
                        typeof: ctx,
                        instance: this
                    };
                }
            }
        }
    }

    protected subscribe(key: string, prop: string, callback?: () => {}): void {
        const self: ASharedComponent = this;

        findDOMNode(this).addEventListener(key, function(event) {
            (function(detail) {
                self.setState({ [prop]: detail.prop }, callback);
            })((event as any).detail);
        });
    }

    protected publish(key: string, prop: Object): void {
        const event: CustomEvent = new CustomEvent(key, {
            detail: {
                prop
            },
            bubbles: true,
            cancelable: true
        });

        for (const ctx of Object.values(ASharedComponent.store[(this.room as any)])) {
            if (!(this instanceof (ctx as any).typeof)) {
                findDOMNode((ctx as any).instance).dispatchEvent(event);
            }
        }
    }
}
