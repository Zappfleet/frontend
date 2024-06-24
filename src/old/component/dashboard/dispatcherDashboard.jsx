import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
//components
import Stats from './Stats';
//stylesheets
import statsStyles from './styles/Stats.module.css';
import styles from './styles/DispatcherDashboard.module.css';


const DispatcherDashboard = () => {

    const dispatcherStats = [
        { id: "1", title: "سفرهای درخواست شده", body: "با کلیک، لیست کامل نمایش داده می شود" },
        { id: "2", title: "سفرهای انجام شده", body: "با کلیک، لیست کامل نمایش داده می شود" },
        { id: "3", title: "سفرهای در حال انجام", body: "با کلیک، لیست کامل نمایش داده می شود" },
        { id: "4", title: "سفرهای لغو شده", body: "با کلیک، لیست کامل نمایش داده می شود" },
    ]

    const data = [
        { title: 'One', value: 60, color: '#895095' },
        { title: 'Two', value: 45, color: '#93BAE1' },
        { title: 'Three', value: 40, color: '#7251B2' },
        { title: 'Four', value: 60, color: '#8984D6' }
    ]

    const data2 = [{ name: 'ماه 1', uv: 150, pv: 2400, amt: 2400 },
    { name: 'ماه 2', uv: 600, pv: 2400, amt: 2400 },
    { name: 'ماه 3', uv: 400, pv: 2400, amt: 2400 },
    { name: 'ماه 4', uv: 300, pv: 2400, amt: 2400 }];

    return (
        <div>
            <div className={styles.statsContainer}>
                <h2>آمار روزانه</h2>
                <div className={statsStyles.statsContainer}>
                    {dispatcherStats.map(item => <Stats key={item.id} statsDetails={item} />)}
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.barchart}>
                    <div className={styles.barchartContainer}>
                        <BarChart width={400} height={260} data={data2}>
                            <XAxis dataKey="name" stroke="#333" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="uv" fill="#7251B2" barSize={8} radius={6} />
                        </BarChart>
                    </div>
                    <p className={styles.description}>آمار سفرهای ماهیانه</p>
                </div>

                <div className={styles.piecharts}>
                    <div className={styles.piechartContainer}>
                        <div className={styles.piechartDetails}>
                            {data.map(item => <p style={{ backgroundColor: item.color, color: "#f4f4f4", borderRadius: "4px", padding: "0.3rem", margin: "0.3rem" }}>{item.value}%</p>)}
                        </div>
                        <PieChart
                            className={styles.piechart}
                            data={data}
                        />
                    </div>
                    <p className={styles.description}>آمار رانندگان</p>
                </div>
            </div>
        </div>
    );
};

export default DispatcherDashboard;