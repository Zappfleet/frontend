import List from "../../../../components/common/list";
import { useState } from "react";
import { useParams } from "react-router";
import httpService from "../../../../services/httpService";
import settings from "../../../../config";
import { ErrorToast } from "../../../../components/common/errorToast";
import { Group, Table, Text } from "@mantine/core";
import { IsoToJalali, IsoToJalaliWithTime, timeToString } from "../../../../utils/dateTools";
import TripDetailsModal from "../../../../components/trip/tripDetailsModal";
import LocationFilterModal from "../../../../components/location/locationFilterModal";
import { getRequestCostManagerString } from "../../../../utils/requestHelper";
import _ from 'lodash'
import { getTripDistanceString, getTripStatusString } from "../../../../utils/tripHelper";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { AlertCircle } from "tabler-icons-react";
import moment from "moment"
import { numberWithCommas } from "../../../../utils/textTools";



const ListTrips = () => {
  let { mode } = useParams();

  const [sortColumn, setSortColumn] = useState({ path: "passengers.full_name", order: "asc" });
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState();
  const [detailsModal, setDetailsModal] = useState(false);
  const [mutateSignal, setMutateSignal] = useState(1);

 
  const popover = (item)=>{
    return (
      <Popover id="popover-basic" style={{maxWidth:700}}>
      <Popover.Header as="h3">جزییات</Popover.Header>
      <Popover.Body>
        {popoverTable(item)}
      </Popover.Body>
    </Popover>
    )
  }

  const popoverTable=(item)=>{
    const header = (
      <tr>
        <th style={{fontSize:12}} className='text-center'>مسافر</th>
        <th style={{fontSize:12}} className='text-center'>مبدا</th>
        <th style={{fontSize:12}} className='text-center'> مقصد</th>
        <th style={{fontSize:12}} className='th-center text-center'>راننده در مبدا </th>
        <th style={{fontSize:12}} className='th-center text-center'>سوار شدن مسافر </th>
        <th  style={{fontSize:12}} className='th-center text-center'>راننده در مقصد </th>
        <th  style={{fontSize:12}} className='th-center text-center'> پیاده شدن مسافر</th>
      </tr>
    );
    
  const rows=()=>{

   
  
  
    const newTiming= convertTiming(item.timing)
    const uiElements = [];
    for(let i = 0 ; i < item.passengers.length ; i++){
     
          const passenger = item.passengers[i];
          const location = item.locations[i];
          const driverGetOn=newTiming?.[passenger?.account_id]?.[4];
          const passGetOn=newTiming?.[passenger?.account_id]?.[2];
          const driverGetOff=newTiming?.[passenger?.account_id]?.[5];
          const passGetOff=newTiming?.[passenger?.account_id]?.[3];
          uiElements.push(
        
          <tr>
            <td style={{fontSize:12}}>{passenger?.full_name}</td>
            <td style={{fontSize:12}}>{location?.start.adr}</td>
            <td style={{fontSize:12}}>{location?.finish.adr}</td>
            <td style={{fontSize:12}}>{driverGetOn && moment(driverGetOn).format("HH:mm")}</td>
            <td style={{fontSize:12}}>{passGetOn && moment(passGetOn).format("HH:mm")}</td>
            <td style={{fontSize:12}}>{driverGetOff && moment(driverGetOff).format("HH:mm")}</td>
            <td style={{fontSize:12}}>{passGetOff && moment(passGetOff).format("HH:mm")}</td>
          </tr>
         
            );
      

      }

    return uiElements;
  
  }

    return (
      <Table >
        <thead className='text-center'>{header}</thead>
        <tbody className='text-center'>{rows()}</tbody>
      </Table>
    )
  }
   
 

  const renderStatusColor = (item) => {
    switch (item?.status) {
      case 0:
        return { color: "#ef6c00" }
      case 1:
        return { color: "#ab47bc" }
      case 2:
      case 3:
      case 4:
      case 5:
        return { color: "#d32f2f" }
      case 6:
        return { color: "#03a9f4" }
      case 7:
        return { color: "#00c853" }
      default:
        return {}
    }

  }

  const columns = [
   
    {
      content: (item) => {
        return <Text>{item?.driver?.user?.full_name}</Text>;
      },
      path: "driver.user.full_name",
      label: "راننده",
    },
    {
      content: (item) => {
        return <Text>{item?.taxi_cost ? `${numberWithCommas(item.taxi_cost)} ریال` : ""}</Text>;
      },
      path: "taxi_cost",
      label: "هزینه",
    },
    {
      content: (item) => {
        return <Text>
          <Text>{getTripDistanceString(item?.distance_props?.distance_actual)}</Text>
        </Text>
      },
      path: "distance_props.distance_actual",
      label: "مسافت طی شده",
    },
    {
      content: (item) => {
        return <Text>
          <Text>{getTripDistanceString(item?.distance_props?.distance)}</Text>
          <Text size="xs">{item?.distance_props?.dispatcher_override ? `(دستی)` : ``}</Text>

        </Text>
      },
      path: "distance_props.distance",
      label: "مسافت سیستمی",
    },
    {
      content: (item) => {
        return (
          <Text>
            <Group>
              <div>
                <Text>{IsoToJalali(item?.for_date)}</Text>
                <Text>{timeToString(item?.for_time)}</Text>
              </div>
            </Group>
          </Text>
        );
      },
      path: "for_date",
      label: "درتاریخ",
    },
    {
      content: (item) => {
        return (
          <Text>
            {item?.dispatcher[0]?.full_name}
          </Text>
        );
      },
      path: "dispatcher.full_name",
      label: "توزیع کننده",
    },
    {
      content: (item) => {
        return (
          <Text>
            {getRequestCostManagerString(item?.cost_managers[0])}
          </Text>
        );
      },
      path: "cost_managers.cost_center",
      label: "کد پروژه",
    },
    {
      content: (item) => {
        return (
          <Text>
            {getTripStatusString(item?.status)}

          </Text>
        );
      },
      path: "status",
      label: "وضعیت",
      style: (item) => renderStatusColor(item)
    },
    {
      content: (item) => {
        return (
          <Text>
            {IsoToJalaliWithTime(_.find(item?.timing, t => t.key === 1)?.value)}
          </Text>
        );
      },
      // path: "for_time",
      label: "زمان حرکت راننده",
    },
   
    {
      content: (item) => {
        const finishTime=item?.timing?.filter((time)=>time.key==6)
        return (
          <Text>
            {finishTime != null && finishTime.length>0 && moment(finishTime[finishTime.length-1].value).format("HH:mm")}
          </Text>
        );
      },
      // path: "end_time",
      label: "زمان پایان سفر",
    },
    {
      content: (item) => {
        // if(!item?.made_by_dispatcher)
        return (
          <OverlayTrigger
          placement={"bottom-start"}
          overlay={
            popover(item)
          }
        >
          <div>
          <AlertCircle
             size={20}
             color={'#40aabf'}
           />
          </div>
        </OverlayTrigger>
         
        );
      },
      // path: "for_time",
      label: "جزییات ",
    },
 
  ];

  const onSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };

  const chooseShowDistance=(item)=>{
    if(!item?.distance_props?.distance_actual || item?.distance_props?.distance_actual == 0){
      return getTripDistanceString(item?.distance_props?.distance)
    }
    return getTripDistanceString(item?.distance_props?.distance_actual)

  }
  const getSingleItem = async (id) => {
    try {
      const { data } = await httpService.get(settings.apiUrl + "/trip/" + id);
      setItem(data?.doc);
    } catch (error) {
      ErrorToast({ message: "خطا در دریافت جزییات" });
    }
  };

  const handleRowClick = async (id) => {
    setLoading(true);
    await getSingleItem(id);
    setDetailsModal(true);
    setLoading(false);
  };


  return (
    <>
      <List
        size='xl'
        url={mode === 'registered' ? '/trip' : '/trip?created=true'}
        filterModal={<LocationFilterModal />}
        // hideFilter={true}
        onSort={onSort}
        loading={loading}
        columns={columns}
        sortColumn={sortColumn}
        onRowClick={handleRowClick}
        mutateSignal={mutateSignal}
        placeholder="جستجو ..."



      />
      <TripDetailsModal
        item={item}
        opened={detailsModal}
        setOpened={setDetailsModal}
        mutateSignal={() => {
          setMutateSignal(mutateSignal + 1)
          setDetailsModal(false)
        }}
      />
    </>
  );
};

const convertTiming=(timing)=>{

  
const timingOutput={
  
}
for (let i = 0; i < timing.length; i++) {
  const element = timing[i];
  const passengerId=element.passenger_id || element.user.account_id
  if(timingOutput[passengerId]==null) timingOutput[passengerId]={}
  timingOutput[passengerId][element.key]=element.value
  
}
return timingOutput
}

export default ListTrips;
