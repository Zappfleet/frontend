import { useEffect, useState } from 'react';
import { getApiClient } from '../../apis/client';

export default function usePermittedUsers({
  permissions,
  include_external_base,
  search_all,
}: {
  permissions: string[];
  include_external_base: boolean;
  search_all?: boolean;
}) {

  console.log(8798,permissions,search_all);
  
  const [userList, setUserList] = useState<any>(null);
  const [state, setState] = useState({
    in_progress: false,
  });

  async function refreshData(search = '') {
    return new Promise((resolve, reject) => {
      setState({ ...state, in_progress: true });
      getApiClient()
        .getPermittedUserList(permissions, search, include_external_base , search_all)
        .then(({ data }) => {
          setUserList(data);
          resolve(data);
        })
        .catch(reject)
        .finally(() => {
          setState({ ...state, in_progress: false });
        });
    });
  }

  useEffect(() => {
    refreshData();
  }, []);

  return {
    userList,
    state,
    refreshData,
  };
}
