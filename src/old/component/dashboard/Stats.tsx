import React from 'react';

import styles from './styles/Stats.module.css';

const Stats = (props:any) => {
    const { title, body , url } = props.statsDetails;
    
    return (
        <div onClick={()=>props?.onClick(url)} className={styles.childrenContainer}>
            <div className={styles.children}>
                <button className={styles.button}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.body}>{body}</p>
                </button>
            </div>
            <span className={styles.span}></span>
        </div>
    );
};

export default Stats;