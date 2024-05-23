import classNames from "classnames";

const Chips = (props: any) => {
    return <span  className={classNames("inline-block bg-primary m-1 py-1 text-white rounded-full text-xs whitespace-pre", props.className)}>{
        props?.children
    }</span>
}

export default Chips;