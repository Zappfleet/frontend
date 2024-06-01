import './style.scss'
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
        <div className='TabLayout-component'>
            {props.tabs.map((tabItem: TabItem) => {
                return <span key={tabItem.key} onClick={() => handle_tabChange(tabItem.key)} 
                className={ `tab ${activeTab === tabItem.key?'active-tab':'no-active'}`}>
                    {tabItem.label}
                </span>
            })}
           
        </div>
    );
};

export default TabLayout;