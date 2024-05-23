import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { BiX, BiXCircle } from 'react-icons/bi';

const BottomSheetModal = (props: any) => {

    const [state, setState] = useState<any>({
        show: false
    });


    const ref = useRef<any>();
    const show = () => {
        setState({ ...state, show: true })
    }

    const hide = () => {
        setState({ ...state, show: false })
    }

    const scrollToMax = () => {
        ref.current.scrollTop = ref.current.scrollHeight
    }

    useEffect(() => {
        ref.current.scrollTop = 0;
        const bottomSheet = {
            show,
            hide,
            scrollToMax,
        }
        props.onCreate && props.onCreate(bottomSheet);
    }, []);

    const handle_scrollListener = () => {

        if (ref.current.scrollTop == 0) hide();
    }

    useEffect(() => {
        if (state.show) ref.current.scrollTop = ref.current.scrollHeight;
        else ref.current.scrollTop = 0;
    }, [state]);

    return (
        <div>
            <div
                ref={ref}
                onScroll={handle_scrollListener}
                style={{
                    zIndex: 1000000,
                    scrollBehavior: 'smooth',
                    pointerEvents: state.show ? "auto" : "none"
                }}
                className='fixed left-0 top-0 bottom-0 right-0 overflow-y-scroll scroller hidden-thumb lg:mr-72'>
                <div className={classNames(
                    'fixed left-0 top-0 bottom-0 right-0 bg-boxdark duration-300',
                    {
                        "opacity-70": state.show,
                        "opacity-0": !state.show
                    }
                )}></div>
                <div className='h-full'></div>

                <div className='relative bg-white dark:bg-boxdark py-1 rounded-tr-2xl rounded-tl-2xl'>
                    <div className='flex justify-between px-2'>
                        <span className='opacity-0 pointer-events-none'>
                            <BiX size={30} /> {/* dummy */}
                        </span>
                        <span className='h-1 w-20 bg-gray-4 rounded-lg my-1 lg:hidden'></span>
                        <span className='cursor-pointer'>
                            <BiX onClick={hide} size={30} />
                        </span>
                    </div>
                    <div className='m-2'>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BottomSheetModal;