import useAuthentication from './data/useAuthentication';
import useInactiveSystem from './data/Restrictions/useInactiveSystem';
import useSetWorkingWeek from './data/Restrictions/useSetWorkingWeek';
import { useEffect, useState } from 'react';
import { NotificationController } from '../lib/notificationController';
import { getDayName } from '../utils/utils';

export default function useCurrentUserPermissions() {
  const { authInfo } = useAuthentication();
  const { missionList } = useInactiveSystem('select', null)
  const { result: resultSetWorkingWeek } = useSetWorkingWeek('select', 9, null)

  const [permits, setPermits] = useState<any>();
  const [permits_systeminactive, setPermits_systeminactive] = useState<any>();
  const [type, setType] = useState<any>();

  useEffect(() => {
    const permits =
      authInfo?.auth?.roles.map(({ permissions }: any) => permissions).flat() ||
      [];

    missionList && setPermits_systeminactive(missionList)

    const deligatedPermits =
      authInfo?.deligations
        ?.map(({ permissions }: any) => permissions)
        .flat() || [];

    setPermits([...permits, ...deligatedPermits]);
  }, [authInfo?.auth]);

  function hasAdminRank() {
    return authInfo?.auth?.roles
      ?.map((item: any) => {
        return item.rank == 'admin';
      })
      .some((resultIsTrue: boolean) => resultIsTrue);
  }

  function initialPermit(menuItem: any) {
   // console.log(78,menuItem, menuItem.split('.')[0]);

    let result = true
    const notAllowed = import.meta.env.VITE_NOT_ALLOWED_MENU ? JSON.parse(import.meta.env.VITE_NOT_ALLOWED_MENU) : []
    notAllowed.map((item: any) => {
      if (menuItem.split('.')[0] === item || menuItem === item) {
        result = false
      }
    })
    return result
  }

  function hasPermitGroup(checkPermit: string[]) {
    return checkPermit.every((item) => {
      if (!permits) return null;
      for (let i = 0; i < permits.length; i++) {
        if (initialPermit(item)) {
          if (permits[i].startsWith(item)) return true;
        }
        else {
          return false
        }
      }
      return false;
    });
  }




  function Is_WorkingWeek() {
    let result = true
    const dayName = getDayName(new Date());
    if (resultSetWorkingWeek?.data?.[0]) {
      if (resultSetWorkingWeek.data[0].value[dayName] === false) {
        result = false
      }
    }
    return result
  }


  function Is_SystemInActive(checkPermit: string[]) {
    //check system is inactive
    let result = false
    permits_systeminactive && permits_systeminactive.data.data && permits_systeminactive.data.data.map((item: any) => {
      // console.log(400, permits_systeminactive.data.data, checkPermit);
      const startDate = item.start_date
      const endDate = item.end_date
      const currentDate = new Date();

      if (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
        //   console.log(700, checkPermit.every((ite) => item.inactive_permissions?.includes(ite)));
        if (checkPermit.every((ite) => item.inactive_permissions?.includes(ite))) {
          result = true
        }
      }

    })
    return result
  }


  let showNotification_SystemInActive = true
  let showNotification_WorkingWeek = true

  function hasPermitFor(checkPermit: string[]) {
    const result_Is_SystemInActive = Is_SystemInActive(checkPermit)
    const result_Is_WorkingWeek = Is_WorkingWeek()

    if (result_Is_SystemInActive === true) {
      setType('SystemInActive')
      return false
    }

    let checkworkingweek = false
    checkPermit.map((item: any) => {
      if (item === "SERVICE.ORG.DIRECT_SUBMIT" || item === 'SERVICE.PERSONAL.SUBMIT') {
        checkworkingweek = true
      }
    })

    if (result_Is_WorkingWeek === false && checkworkingweek) {
      setType('No_WorkingWeek')
      return false
    }

    //console.log(700,checkPermit,permits);

    return checkPermit.every((item) => initialPermit(item) ? permits?.includes(item) : false);
  }


  return {
    hasPermitGroup,
    hasPermitFor,
    hasAdminRank,
    permits,
    authInfo,
    type
  };
}
