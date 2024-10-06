"use client";
import './style.scss'
import ModalLayout from "../../components/ModalLayout/ModalLayout";
import useModal from "../useModal";
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const useConfirmModal = (className: any) => {

    const modal = useModal();

    const ui =  
        <ModalLayout
            {...modal}
            mode="center"
            className={className}
            renderContent={(data: any) => {
                if (!data) return "";
                return <div className="useConfirmModal-component">
                    <label>{data.title}</label>
                    <p>{data.desc}</p>
                    <div>
                        <button className='my-btn' onClick={(e) => {
                            data.onConfirm(e);
                            modal.handle_close();
                        }}>{data.label_confirm}</button>
                        <button className='my-btn' onClick={modal.handle_close}>{data.label_cancel}</button>
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