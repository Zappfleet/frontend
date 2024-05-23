import classNames from "classnames";

export default function SimpleButton(props: any) {
    return <button
        {...props}
        className={classNames(
            "bg-primary text-white text-sm dark:bg-boxdark disabled:bg-disabled disabled:bg-opacity-90 dark:disabled:bg-disabled dark:disabled:bg-opacity-90 ",
            "duration-200 active:saturate-50 rounded py-2 px-4 flex items-center justify-center",
            props.className || "")}
    >
        {props.children}
    </button>
}