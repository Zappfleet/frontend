"use client";

import ModalLayout from "../components/ModalLayout";
import useModal from "./useModal";

const useConfirmModal = () => {

    const modal = useModal();

    const ui = <ModalLayout
        {...modal}
        mode="center"
        renderContent={(data: any) => {
            if (!data) return "";
            return <div className="lg:w-90">
                <label className="text-lg pl-4">{data.title}</label>
                <p className="text-sm p-4">{data.desc}</p>
                <div className="flex">
                    <button className="flex-1 p-2 mx-3 rounded-md text-white bg-primary" onClick={(e) => {
                        data.onConfirm(e);
                        modal.handle_close();
                    }}>{data.label_confirm}</button>
                    <button className="flex-1 p-2 mx-3 rounded-md" onClick={modal.handle_close}>{data.label_cancel}</button>
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