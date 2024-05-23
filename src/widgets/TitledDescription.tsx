import classNames from 'classnames';
import React from 'react';

type TitledDescriptionProps = {
    title: string,
    desc: string,
    className?: string,
    inline?: boolean,
}

const TitledDescription = (props: TitledDescriptionProps) => {
    return (
        <span {...props} className={classNames(
            'flex',
            {
                "flex-col": !props.inline,
                "flex-row": props.inline
            },
            props.className || "")

        }>
            <span className='text-primary pb-1'>{props.title}</span>
            <p className='whitespace-pre-wrap'>{props.desc}</p>
        </span >
    );
};

export default TitledDescription;