import { useEffect, useState } from 'react';
import { getApiClient } from '../../apis/client';

function useDeligation({ user_id }: any) {
  const [deligations, setDeligations] = useState<any>();

  useEffect(() => {
    if (user_id != null) {
      setDeligations(null);
      getDeligationsOn(user_id).then((res) => {
        if (res?.data != null) setDeligations(res.data);
      });
    }
  }, [user_id]);

  async function getDeligationsOn(user_id: string) {
    try {
      return await getApiClient().getDeligationsOn(user_id);
    } catch (e) {
      console.log(e);
    }
  }

  async function submitDeligationOn(
    other_user_id: string,
    add_permits: string[],
    revoke_permits: string[]
  ) {
    try {
      return await getApiClient().submitDeligationOn(
        other_user_id,
        add_permits,
        revoke_permits
      );
    } catch (e) {}
  }

  return {
    submitDeligationOn,
    deligations,
  };
}

export default useDeligation;
