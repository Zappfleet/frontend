import classNames from "classnames";

const LoaderButton = (props: any) => {
    return (
        <button
            {...props}
            disabled={props.isLoading || props.disabled}
            className='my-btn'
        >
            {props.children}
            <div className={classNames(
                "duration-200 animate-spin rounded-full  border-solid border-white border-t-transparent mr-2",
                {
                    "h-0 w-0 border-none": !props.isLoading,
                    "h-4 w-4 border": props.isLoading
                }
            )}></div>
        </button>
    );
};


export default LoaderButton;