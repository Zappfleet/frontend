import classNames from 'classnames';
import React, { useState } from 'react';

export interface TabItem {
    key: string,
    label: string
}

export interface TabLayoutProps {
    tabs: Array<TabItem>
    defaultActiveTab: string,
    onTabChange: (key: string) => void
}

const TabLayout = (props: TabLayoutProps) => {

    const [activeTab, setActiveTab] = useState<string>(props.defaultActiveTab);

    const handle_tabChange = (key: string) => {
        setActiveTab(key);
        props.onTabChange(key);
    }

    return (
        <div className='flex mb-4 relative overflow-x-auto whitespace-nowrap'>
            {props.tabs.map((tabItem: TabItem) => {
                return <span key={tabItem.key} onClick={() => handle_tabChange(tabItem.key)} className={classNames(
                    'px-2 cursor-pointer border-b-2  px-3 pb-3 z-1',
                    { 'border-primary text-primary': activeTab == tabItem.key },
                    { 'border-gray-4': activeTab != tabItem.key }
                )}>
                    {tabItem.label}
                </span>
            })}
            <span className='absolute left-0 right-0 bottom-0 h-0.5 bg-gray-4' />
        </div>
    );
};

export default TabLayout;