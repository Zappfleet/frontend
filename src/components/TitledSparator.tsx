import React from 'react';

const TitledSparator = (props: any) => {
    return (
        <div className='flex items-center mt-2 mb-1'>
            <span className='flex-1 h-px bg-gray-4'></span>
            <span className='px-2 text-sm text-primary'>
                <span>{props.title}</span>
                <span>{props.icon}</span>
            </span>
            <span className='flex-1 h-px bg-gray-4'></span>
        </div>
    );
};

export default TitledSparator;