export interface Observable<A> {
    subscribe(observer: Observer<A>): Subscription
}

export interface Observer<A> {
    (value: A): void
}

export interface Subscription {
    unsubscribe(): void
}

export interface RatyStore extends Observable<number> {
    get(): number
    set(value: number): void
    set(modifier: ()=> number): void
    cancel(): void
}

export interface RatyStoreOptions {
    value: (() => number) | number
}

export function create(options: RatyStoreOptions): RatyStore {
    const initialValue = typeof options.value === 'function' ? options.value() : options.value
    let value = initialValue

    const listeners = new Set<Observer<number>>()

    const notify = () => {
        for (const listener of listeners) {
            listener(value)
        }
    }

    const set = (fa: (() => number) | number) => {
        const newValue = typeof fa === 'function' ? fa() : value

        if (newValue !== value) {
            value = newValue

            notify()
        }
    }

    const get = () => value

    const subscribe = (observer: Observer<number>): Subscription => {
        listeners.add(observer)

        return {
            unsubscribe: () => listeners.delete(observer)
        }       
    }

    const cancel = () => set(initialValue)

    return {
        get,
        set,
        subscribe,
        cancel,
    }
}