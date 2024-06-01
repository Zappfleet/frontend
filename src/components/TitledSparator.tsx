import React from 'react';

const TitledSparator = (props: any) => {
    return (
        <div>
            <span></span>
            <span>
                <span>{props.title}</span>
                <span>{props.icon}</span>
            </span>
            <span></span>
        </div>
    );
};

export default TitledSparator;