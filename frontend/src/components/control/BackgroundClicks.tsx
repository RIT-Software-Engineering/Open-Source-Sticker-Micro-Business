import { createContext, useCallback, useContext, useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactElement } from "react";
import type { Callback } from "../../Types";
import Listener, { type Handle } from "../../modules/Listener";

/**
 * Manages background click tree context
 */
class ClickContextObject extends Listener {
    /** Listener ids to ignore on the next notification */
    private ignore: Set<number>;

    constructor() {
        super();

        this.ignore = new Set();
    }

    /**
     * Ignore this listener on the next notification
     * @param handle The listener to ignore
     */
    public IgnoreNext(handle: Handle) {
        this.ignore.add(handle.id);
    }

    /**
     * If this listener is being ignored, listen again
     * @param handle The listener to manage
     */
    public ListenNext(handle: Handle) {
        this.ignore.delete(handle.id);
    }

    public override NotifyListeners(): void {
        for(const id of super.BoundListeners) {
            if(!this.ignore.has(id)) {
                super.NotifyListener(id);
            }
        } this.ignore.clear();
    }
}

/** The click context */
const ClickContext = createContext(new ClickContextObject());

type _IBackgroundClicksScopeCustomProps = {
    /** What to do when a background click is triggered */
    onBackgroundClick?: Callback | undefined;
}

export type IBackgroundClicksScopeProps = 
    Omit<HTMLAttributes<HTMLDivElement>, keyof _IBackgroundClicksScopeCustomProps> &
    _IBackgroundClicksScopeCustomProps;

/**
 * Triggers an event for clicks on any elements between this one and the closest provider above
 */
export default function BackgroundClicksScope(props: IBackgroundClicksScopeProps): ReactElement {
    const handle = useRef<Handle | null>(null);

    // Not deleting this throws an `UnknownEventHandler` exception
    const {onBackgroundClick} = props;
    props = {...props};
    delete props.onBackgroundClick;

    const clickContext = useContext(ClickContext);
    
    /**
     * Bind a listener
     */
    useEffect(() => {
        if(onBackgroundClick != null) {
            handle.current = clickContext.AddListener(onBackgroundClick);

            return () => {
                handle.current?.Remove();
                handle.current = null;
            }
        } else return () => {};
    }, [onBackgroundClick, clickContext]);

    /**
     * Ignore the next click notificaiton since this element was clicked and it is now propagating up
     */
    const OnClick = useCallback((event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        if(handle.current != null) clickContext.IgnoreNext(handle.current);

        /**
         * Make sure to resume listening if the propagation is stopped before the click reaches the provider
         */
        event.stopPropagation = () => {
            if(handle.current != null) clickContext.ListenNext(handle.current);

            event.stopPropagation();
        }

        /**
         * Extend the base onClick prop
         */
        if(props.onClick != null) props.onClick(event);
    }, [props.onClick]);

    return <div
        {...props}
        onClick={OnClick}
    />
}

export type IBackgroundClicksProviderProps = HTMLAttributes<HTMLDivElement>;

/**
 * Provides background clicks for all child elements that aren't occluded by another provider
 */
export function BackgroundClicksProvider(props: IBackgroundClicksProviderProps): ReactElement {
    // Remove children to make sure that children skip a layer in the tree correctly
    const {children} = props;
    props = {...props};
    delete props.children

    const clickContext = useState(new ClickContextObject())[0];

    /**
     * When this element gets a click event, notify bound listeners
     */
    const OnClick = useCallback((event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        clickContext.NotifyListeners();

        /**
         * Extend the base onClick prop
         */
        if(props.onClick != null) props.onClick(event);
    }, [props.onClick]);

    return <div {...props} onClick={OnClick}>
        <ClickContext value={clickContext} children={children}/>
    </div>
}