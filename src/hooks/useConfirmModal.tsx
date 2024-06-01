"use client";

import ModalLayout from "../components/ModalLayout/ModalLayout";
import useModal from "./useModal";

const useConfirmModal = () => {

    const modal = useModal();

    const ui = <ModalLayout
        {...modal}
        mode="center"
        renderContent={(data: any) => {
            if (!data) return "";
            return <div>
                <label>{data.title}</label>
                <p>{data.desc}</p>
                <div>
                    <button onClick={(e) => {
                        data.onConfirm(e);
                        modal.handle_close();
                    }}>{data.label_confirm}</button>
                    <button onClick={modal.handle_close}>{data.label_cancel}</button>
                </div>
            </div>
        }}
    />

    const show = (data: any) => {
        modal.handle_open(data);
    }

    return {
        ui,
        show
    }
};

export default useConfirmModal;