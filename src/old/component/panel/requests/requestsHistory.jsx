import List from "../../../components/common/list";
import { useState } from "react";
import RequestsfilterModal from "../../../components/request/requestsfilterModal";
import { Group, Modal, Text } from "@mantine/core";
import { IsoToJalali, timeToString } from "../../../utils/dateTools";
import {
  getRequestStatusString,
  getRequestStepString,
} from "../../../utils/requestHelper";
import _ from "lodash";
import RequestDetailsBox from "../../../components/request/requestDetailsBox";
import httpService from "../../../services/httpService";
import settings from "../../../config";
import { catchError } from "../../../utils/errorHelper";
import { SucccessToast } from "../../../components/common/errorToast";

const RequestsHistory = () => {
  const [sortColumn, setSortColumn] = useState({path : "passenger.full_name" , order : "asc"});
  const [modalOpened, setModalOpened] = useState(false);
  const [request, setRequest] = useState();
  const [loading, setLoading] = useState(false);
  const [iscancelReuestModalOpen, setIscancelReuestModalOpen] = useState(false);
  const [mutateSignal, setMutateSignal] = useState(false);

  const renderStatusColor=(item)=>{
    switch (item?.status) {
     case 0:
       return {color:"#616161"}
     case 1:
     case 3:
     case 6:
       return {color:"#d32f2f"}
     case 2:
     case 5:
       return {color:"#03a9f4"}
     case 4:
       return {color:"#81c784"}
     case 7:
       return {color:"#ef6c00"}
     case 8:
       return {color:"#ab47bc"}
     case 9:
       return {color:"#00c853"}
     default:
      return {}
    }
     
   }

  const columns = [
    { path: "passenger.full_name", label: "مسافر" },
    { path: "locations.start.adr", label: "مبدا" },
    { path: "locations.finish.adr", label: "مقصد" },
    {
      content: (item) => {
        return (
          <Group>
            <div>
              <Text>{IsoToJalali(item?.for_date)}</Text>
              <Text>{timeToString(item?.for_time)}</Text>
            </div>
          </Group>
        );
      },
      path: "for_date",
      label: "تاریخ",
    },
    {
      content: (item) => {
      return (
        <Text>{timeToString(item?.past_for_time[0]?.from)}</Text>
      )
      },
      // path: "for_date",
      label: "ساعت قبلی",
    },
    {
      content: (item) => {
        return getRequestStepString(item?.step);
      },
      path: "step",
      label: "فاز",
    },
    {
      content: (item) => {
        return getRequestStatusString(item?.status);
      },
      path: "status",
      label: "وضعیت",
      style:(item)=> renderStatusColor(item)
    },
  ];
  const onSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handleRowClick = async (id) => {
    try {
      setLoading(true);
      const { data } = await httpService.get(
        settings.apiUrl + "/request/" + id
      );
      setLoading(false);
      setRequest(data?.doc);
      setModalOpened(true);
    } catch (error) {
      setLoading(false);
      catchError(error);
    }
  };

  const handleCheckRequest = async (result) => {
    try {
      setLoading(true);
      await httpService.put(settings.apiUrl + `/request/${request._id}/check`, {
        result,
      });
      setModalOpened(false);
      setIscancelReuestModalOpen(false);
      setLoading(false);
      SucccessToast({
        message: result ? "درخواست  تایید شد" : "درخواست لغو شد",
      });
      setMutateSignal(!mutateSignal);
      setRequest(null);
    } catch (error) {
      setLoading(false);
      catchError(error);
      setIscancelReuestModalOpen(false);
    }
  };

  return (
    <>
      <List
        url="/request"
        filterModal={
          <RequestsfilterModal
            defaultValues={{
              for_time: [],
              for_date: null,
              status: _.range(10),
              step: _.range(5),
            }}
          />
        }
        onRowClick={handleRowClick}
        columns={columns}
        onSort={onSort}
        sortColumn={sortColumn}
        mutateSignal={mutateSignal}
        placeholder=" جستجو ..."
        // hideFilter={true}
      />
      <Modal
        opened={modalOpened}
        setOpened={setModalOpened}
        size="xl"
        onClose={() => setModalOpened(false)}
      >
        <RequestDetailsBox
          request={request}
          onCheck={handleCheckRequest}
          loading={loading}
          setIscancelReuestModalOpen={setIscancelReuestModalOpen}
          iscancelReuestModalOpen={iscancelReuestModalOpen}
        />
      </Modal>
    </>
  );
};

export default RequestsHistory;
