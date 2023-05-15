const callbacks: { [eventName: string]: Function } = {};

export const PauseMenuEventHandler = {
    callbacks: {
        /**
         * Add a client-side callback
         *
         * @param {string} eventName
         * @param {Function} callback
         */
        add(eventName: string, callback: Function) {
            callbacks[eventName] = callback;
        },
        /**
         * Get the callback to invoke
         *
         * @template T
         * @param {string} eventName
         * @return {T}
         */
        get<T = Function>(eventName: string): T | undefined {
            if (!callbacks[eventName]) {
                return undefined;
            }

            return callbacks[eventName] as T;
        },
    },
};
