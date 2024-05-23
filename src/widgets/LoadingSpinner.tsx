import classNames from "classnames";
import React from "react";

export default function LoadingSpinner(props: any) {
    return (
        <div className={classNames(props.className, "spinner-container")} >
            <div className={classNames(props.spinnerClassName, "loading-spinner")}>
            </div>
        </div>
    );
}