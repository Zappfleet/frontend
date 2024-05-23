"use client";
import React, { useState } from 'react';

export interface ModalState {
    open: boolean,
    data?: any
}
export interface ModalActions {
    handle_toggle: () => void,
    handle_open: (data?: any) => void,
    handle_close: () => void
}

const useModal = (): ModalState & ModalActions => {

    const [state, setState] = useState<ModalState>({
        open: false,
    });

    const handle_toggle = () => setState({ ...state, open: !state.open })

    const handle_open = (data: any) => setState({ ...state, open: true, data })

    const handle_close = () => setState({ ...state, open: false })

    return {
        ...state,
        handle_toggle,
        handle_open,
        handle_close
    }
};

export default useModal;