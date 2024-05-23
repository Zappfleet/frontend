import useAuthentication from './data/useAuthentication';
import useInactiveSystem from './data/useInactiveSystem';
import { useEffect, useState } from 'react';

export default function useCurrentUserPermissions() {
  const { authInfo } = useAuthentication();
  const { missionList } = useInactiveSystem('select', null)
  const [permits, setPermits] = useState<any>();
  const [permits_systeminactive, setPermits_systeminactive] = useState<any>();

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

  function hasPermitGroup(checkPermit: string[]) {
    return checkPermit.every((item) => {
      if (!permits) return null;
      for (let i = 0; i < permits.length; i++) {
        if (permits[i].startsWith(item)) return true;
      }
      return false;
    });
  }


  function Is_SystemInActive(checkPermit: string[]) {
    //check system is inactive


    let result = false
    permits_systeminactive && permits_systeminactive.data.data && permits_systeminactive.data.data.map((item: any) => {
      console.log(400, permits_systeminactive.data.data, checkPermit);
      const startDate = item.start_date
      const endDate = item.end_date
      const currentDate = new Date();

      if (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
        console.log(700, checkPermit.every((ite) => item.inactive_permissions?.includes(ite)));
        if (checkPermit.every((ite) => item.inactive_permissions?.includes(ite))) {
          result = true
        }
      }
    })
    return result
  }

  function hasPermitFor(checkPermit: string[]) {
    const result = Is_SystemInActive(checkPermit)
    if (result === true) {
      return false
    }
    else {
      return checkPermit.every((item) => permits?.includes(item));
    }
  }

  return {
    hasPermitGroup,
    hasPermitFor,
    hasAdminRank,
    permits,
    authInfo,
  };
}
