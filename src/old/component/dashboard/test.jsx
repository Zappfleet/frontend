const AdmindDashboard = ({ isDispatcher }) => {
  const height = useContext(HeightContext);

  const [stats, setStats] = useState({});

  const [listDisplay, setListDisplay] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const resStatsRequest = await getStatsRequest();
      const resStatsTrips = await getStatsTrips();
      const newStat = {
        statsRequest: resStatsRequest?.data?.requests?.[0] || {},
        statsTrips: resStatsTrips?.data?.trips?.[0] || {}
      };
      setStats(newStat)
      console.log(newStat.statsRequest.by_area);
    }
    fetchStats();
  }, []);

  const getByCostCenterData = () => {
    if (!stats?.statsRequest?.by_cost_center) return { data: [], total: 0 };

    let t = 0;
    const data = stats.statsRequest.by_cost_center.map((item) => {
      t += item.total;
      return { title: item._id, value: item.total, color: getDarkColor() }
    })
    return { data, total: t }
  }

  const getByAreaData = () => {
    if (!stats?.statsRequest?.by_area) return { data: [], total: 0 };

    let t = 0;
    const data = stats.statsRequest.by_area.map((item) => {
      t += item.total;
      console.log(item.name);
      return { title: item.name, value: item.total, color: getDarkColor() }
    })
    return { data, total: t }
  }

  const getMonthlyData = () => {
    const options = {
      year: "numeric",
      month: "numeric"
    }
    if (!stats?.statsRequest?.by_date) return [];
    return stats.statsRequest.by_date.map((item) => {
      const d = new Date();
      d.setFullYear(item._id.year, item._id.month, 1);
      return { name: d.toLocaleDateString("fa-IR", options), uv: item.total }
    })
  }

  const getDispatcherRequestData = () => {
    if (!stats?.statsRequest?.by_dispatcher) return [];
    return stats.statsRequest.by_dispatcher.map((item) => {
      return { name: item.full_name, uv: item.total }
    })
  }

  const getDispatcherTripData = () => {
    if (!stats?.statsTrips?.by_dispatcher) return [];
    return stats.statsTrips.by_dispatcher.map((item) => {
      return { name: item._id, uv: item.total }
    })
  }

  const tripByStats = () => {
    const arr = stats?.statsTrips?.by_status || [];
    return arr.map((item, index) => {
      const url = `/trip?limit=${item.total}&status[]=${item._id}`;
      return { title: "سفر " + getTripStatusString(item._id), body: item.total, url }
    })
  }

  const requestByStats = () => {
    const arr = stats?.statsRequest?.by_status || [];
    return arr.map((item, index) => {
      const url = `/request?step[]=0&step[]=1&step[]=2&step[]=3&step[]=4&path=passenger.full_name&order=asc&status[]=${item._id}`;
      return { title: "درخواست " + getRequestStatusString(item._id), body: item.total, url }
    })
  }

  const getStatisfactionOf = (driver_fullname) => {
    if (!driver_fullname) return "!";

    const driverStatisfactionItem = stats.statsTrips.by_satisfaction_rate.find((item) => {
      return item._id == driver_fullname;
    });
    return driverStatisfactionItem?.ave_rate || "#"
  }

  const handleOnClick = (url) => {
    setListDisplay(url);
  }

  const renderDriversTable = () => {
    if (!stats?.statsTrips?.by_car) return "";
    return <Table>
      <thead>
        <tr>
          <th>راننده</th>
          <th> خودرو</th>
          <th>تعداد کل سفر</th>
          <th>میانگین رضایت از راننده</th>
        </tr>
      </thead>
      <tbody>{
        stats.statsTrips.by_car.map((item) => {
          if (!item?.driver) return "";
          return <tr>
            <td>{item.driver.user.full_name}</td>
            <td>{convertCarNameCode(item?.car?.name_code)}</td>
            <td>{item.total}</td>
            <td>{getStatisfactionOf(item.driver.user.full_name)}</td>
          </tr>
        })
      }</tbody>
    </Table>
  }

  const areaData = getByAreaData();
  const costCenterData = getByCostCenterData();

  return (
    <div class="container-fluid" style={{ height }}>
      <ScrollArea className="h-100">
        <div className={`${styles.statsContainer} ${styles.barchartContainer} m-4`}>
          <h2 className={styles.statHeader}>آمار در یک نگاه</h2>
          {renderByStatusValues([...tripByStats(), ...requestByStats()], handleOnClick)}
        </div>

        <div className={`${styles.statsContainer} ${styles.barchartContainer} m-4`}>
          <h2 className={styles.statHeader}>آمار سفر رانندگان</h2>
          {renderDriversTable()}
        </div>
        <div className={`${styles.statsContainer}`}>
          <div className='container'>
            {!isDispatcher && <div className={`row ${styles.barchartContainer} m-3`}>
              <div className='col-12 col-lg-6'>
                <h3 className={styles.statHeader}>سفر توزیع کننده</h3>
                <div style={{ margin: 30 }}>
                  <BarChart width={400} height={250} data={getDispatcherTripData()}>
                    <XAxis dataKey="name" stroke="#333" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uv" fill="#7251B2" barSize={8} radius={6} />
                  </BarChart>
                </div>
              </div>
              <div className={`col-12 col-lg-6 `}>
                <h3 className={styles.statHeader}>درخواست توزیع کننده</h3>
                <div style={{ margin: 30 }}>
                  <BarChart width={400} height={250} data={getDispatcherRequestData()}>
                    <XAxis dataKey="name" stroke="#333" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="uv" fill="#F77564" barSize={8} radius={6} />
                  </BarChart>
                </div>
              </div>
            </div>}
            <div className='row'>
              <div className={`col-12 col-lg-6 ${styles.barchartContainer} m-4`}>
                <div className={styles.statsContainer}>
                  <h3 className={styles.statHeader}>{isDispatcher ? "آمار روزانه درخواست ها" : "آمار ماهانه درخواست ها"}</h3>
                  <div style={{ margin: 30 }}>
                    <BarChart width={500} height={250} data={getMonthlyData()}>
                      <XAxis dataKey="name" stroke="#333" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="uv" fill="#37F564" barSize={8} radius={6} />
                    </BarChart>
                  </div>
                </div>
              </div>
              <div className={`col-12 col-lg-4 ${styles.barchartContainer} m-4`}>
                <h3>نسبت درخواست</h3>
                <br />
                <h4 className={styles.statHeader}>به تفکیک محدوده</h4>
                <div className={styles.piechartContainer}>
                  <div className={styles.piechartDetails}>
                    {areaData.data.map(item => {
                      return <p style={{ backgroundColor: item.color, color: "#E4DCF1", fontWeight: "bold", borderRadius: "4px", padding: "0.3rem", margin: "0.3rem", width: "150px" }}>
                        {item?.title}  {parseInt((item.value / areaData.total) * 100)}%
                      </p>;
                    })}
                  </div>
                  <PieChart
                    className={styles.piechart}
                    data={areaData.data}
                  />
                </div>
                <br />
                <h4 className={styles.statHeader}>به تفکیک مرکز هزینه</h4>
                <div className={styles.piechartContainer}>
                  <div className={styles.piechartDetails}>
                    {costCenterData.data.map(item => {
                      return <p style={{ backgroundColor: item.color, color: "#E4DCF1", fontWeight: "bold", borderRadius: "4px", padding: "0.3rem", margin: "0.3rem", width: "150px" }}>
                        {item?.title} {parseInt((item.value / costCenterData.total) * 100)}%
                      </p>;
                    })}
                  </div>
                  <PieChart
                    className={styles.piechart}
                    data={costCenterData.data}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <br />
        <ListDisplayModal listDisplay={listDisplay} setListDisplay={setListDisplay} />
      </ScrollArea>
    </div>
  );
};