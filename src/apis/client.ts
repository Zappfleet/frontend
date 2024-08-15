import axios from 'axios';

interface ApiClientConfig {
  baseUrl: string;
}

class ApiClient {
  axiosInstance;



  constructor(props?: ApiClientConfig) {
    const environmentName = import.meta.env.VITE_ENVIRONMENT_NAME; // assuming VITE_ENVIRONMENT_NAME holds your environment name

    //console.log(800,environmentName);

    let baseUrl;
    if (environmentName === 'local') {
      baseUrl = import.meta.env.VITE_BASE_URL;
    } else if (environmentName === 'server') {
      baseUrl = import.meta.env.VITE_BASE_URL_SERVER;
    } else {
      baseUrl = props?.baseUrl; // Fallback to props if environment variables are not set
    }
    // console.log(900,baseUrl);

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });


    this.axiosInstance.interceptors.request.use(
      function (config) {
        const accessToken = localStorage.getItem('bearer_token');
        if (accessToken != null)
          config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      function (response) {
        // TODO modify response data
        return response;
      },
      function (error) {
        // TODO modify response error
        return Promise.reject(error);
      }
    );
  }

  async createRole(body: any) {
    return this.axiosInstance.post(`/api/v2/roles`, body);
  }

  async editRole(_id: string, body: any) {
    return this.axiosInstance.put(`/api/v2/roles/${_id}`, body);
  }

  async listRoles() {
    return this.axiosInstance.get(`/api/v2/roles/`);
  }

  async deactiveRole(_id: string) {
    return this.axiosInstance.patch(`/api/v2/roles/${_id}`, { active: false });
  }

  async getAllPermissions() {
    return this.axiosInstance.get(`/api/v2/roles/permissions`);
  }

  async login(body: any) {
    // console.log(1000, "/api/v2/users/sign-in");

    return this.axiosInstance.post(`/api/v2/users/sign-in`, body);
  }

  async verifyRegister(body: any) {
    return this.axiosInstance.post(`/api/v2/users/sign-up-verify`, body);
  }

  async register(body: any) {
    return this.axiosInstance.post(`/api/v2/users/sign-up`, body);
  }

  async auth() {
    return this.axiosInstance.get(`/api/v2/users/auth`);
  }

  async createUser(body: any) {
    return this.axiosInstance.post(`/api/v2/users`, body);
  }

  async updateUser(_id: string, body: any) {
    return this.axiosInstance.put(`/api/v2/users/${_id}`, body);
  }

  async getUserList(filter: any) {
    return this.axiosInstance.get(`/api/v2/users`);
  }

  async getPermittedUserList(
    permissions: string[],
    search?: string,
    include_external_base?: boolean,
    search_all?: boolean
  ) {
    return this.axiosInstance.get('/api/v2/users/permission-filter', {
      params: {
        include_external_base,
        search,
        permissions: permissions.join(','),
        search_all,
      },
    });
  }

  async createBasicEntity(body: string, group: string) {
    return this.axiosInstance.post(`/api/v2/vehicles/${group}`, body);
  }

  async updateBasicEntity(key: string, body: any, group: string) {
    return this.axiosInstance.patch(`/api/v2/vehicles/${group}/${key}`, body);
  }

  async getBasicEntities(include_inactive = 'true') {
    return this.axiosInstance.get(`/api/v2/vehicles/data`, {
      params: { include_inactive },
    });
  }

  async insertAgency(body: any) {
    return this.axiosInstance.post(`/api/v2/vehicles/agency`, body);
  }

  async updateAgency(body: any, _id: string) {
    return this.axiosInstance.put(`/api/v2/vehicles/agency/${_id}`, body);
  }

  async insertVehicle(body: any) {
    return this.axiosInstance.post(`/api/v2/vehicles`, body);
  }

  async updateVehicle(body: any, _id: string) {
    return this.axiosInstance.put(`/api/v2/vehicles/${_id}`, body);
  }

  async createRegion(body: any) {
    return this.axiosInstance.post(`/api/v2/regions/`, body);
  }

  async updateRegion(body: any, _id: string) {
    return this.axiosInstance.put(`/api/v2/regions/${_id}`, body);
  }

  async deleteRegion(_id: string) {
    return this.axiosInstance.delete(`/api/v2/regions/${_id}`);
  }

  async getRegionList() {
    return this.axiosInstance.get(`/api/v2/regions/`);
  }

  async getAgencyList(agency_name?: string) {
    const params: any = {};
    agency_name && (params.agency_name = agency_name);
    return this.axiosInstance.get(`/api/v2/vehicles/agency`, { params });
  }

  async getReportAgencyCost() {
    // const params = createParams(undefined, dateFilter);
    return this.axiosInstance.get(`/api/v2/reports/agency-costs`);
  }

  async getReportDriverDaily(driver_id?: string, dateFilter?: any) {
    const params = createParams(undefined, dateFilter);
    return this.axiosInstance.get(`/api/v2/reports/driver-daily/${driver_id}`, {
      params,
    });
  }

  async getReportDriverGeneral(driver_id?: string, dateFilter?: any) {
    //console.log(122,dateFilter);

    const params = createParams(undefined, dateFilter);
    return this.axiosInstance.get(
      `/api/v2/reports/driver-general/${driver_id}`,
      { params }
    );
  }



  /////sgh
  async getReportTimeOfServices(status: string, fromDate: any, toDate: any) {
    //console.log(77, status);

    const params = {
      status: status,
      fromdate: fromDate,
      todate: toDate
    }

    return this.axiosInstance.get(
      `/api/v2/reports/TimeOfServices`,
      { params }
    );
  }



  async getCountOfServices(status: string, fromDate: any, toDate: any) {
  
    const params = {
      status: status,
      fromdate: fromDate,
      todate: toDate
    }

    return this.axiosInstance.get(
      `/api/v2/reports/CountOfServices`,
      { params }
    );
  }

  async getMissions_by_StatusAndDriverID(
    status: string,
    driverID: any
  ) {
    //console.log(100);

    return await this.axiosInstance.get(`/api/v2/services/missions/getMissions_by_StatusAndDriverID`, {
      params: createParams(status, driverID),
    });
  }


  async insert_InactiveSystem(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/restrict/insert_InactiveSystem`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_InactiveSystem(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/restrict/update_InactiveSystem/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_InactiveSystem() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/restrict/select_InactiveSystem`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_InactiveSystem(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/restrict/delete_InactiveSystem/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async getRestOfServices(status: string, fromDate: any, toDate: any) {
    console.log(77, status, fromDate, toDate);

    const params = {
      status: status,
      fromdate: fromDate,
      todate: toDate
    }

    return this.axiosInstance.get(
      `/api/v2/reports/RestOfServices`,
      { params }
    );
  }

  async getDriverList_By_LastServiceAdnDistanse(status: string) {
    //console.log(7722222, status);

    const params = {
      status: status,
    }

    return this.axiosInstance.get(
      `/api/v2/reports/DriverList_By_LastServiceAdnDistanse`,
      { params }
    );
  }

  async getVehicleList(
    search?: string,
    group?: string,
    status?: string,
    service?: string
  ) {
    const params: any = {};
    search && (params.search = search);
    group && (params.group = group);
    status && (params.status = status);
    service && (params['services.service'] = service);
    return this.axiosInstance.get(`/api/v2/vehicles`, { params });
  }

  async submitRequest(body: any) {
    return await this.axiosInstance.post(`/api/v2/services/requests/`, body);
  }

  async updateRequest(body: any, _id: string) {
    return await this.axiosInstance.put(
      `/api/v2/services/requests/${_id}`,
      body
    );
  }

  async getRelatedRequestsAreal(params: any = {}) {
    return await this.axiosInstance.get(`/api/v2/services/requests/areal`, {
      params,
    });
  }

  async getRelatedRequestsPassenger(params: any = {}) {
    return await this.axiosInstance.get(`/api/v2/services/requests/mine`, {
      params,
    });
  }

  async updateRequestStatus(request_id: string, status: string) {
    console.log(8,`/api/v2/services/requests/${status}/${request_id}`);
    
    return await this.axiosInstance.get(
      `/api/v2/services/requests/${status}/${request_id}`
    );
  }

  async getDraftMission() {
    return await this.axiosInstance.post(`/api/v2/services/missions/`);
  }

  async assignRequestToMission(mission_id: string, request_id: string) {
    return await this.axiosInstance.patch(
      `/api/v2/services/missions/${mission_id}/request/${request_id}`
    );
  }
  async removeRequestFromMission(mission_id: string, request_id: string) {
    return await this.axiosInstance.delete(
      `/api/v2/services/missions/${mission_id}/request/${request_id}`
    );
  }

  async getSortedVehicles(mission_id?: string) {
    return await this.axiosInstance.get(
      `/api/v2/services/missions/${mission_id}/vehicle/`
    );
  }

  async assignVehicleToMission(mission_id: string, vehicle_id: string) {
    return await this.axiosInstance.patch(
      `/api/v2/services/missions/${mission_id}/vehicle/${vehicle_id}`
    );
  }

  async removeVehicleFromMission(mission_id: string) {
    return await this.axiosInstance.delete(
      `/api/v2/services/missions/${mission_id}/vehicle/`
    );
  }

  async updateMissionStatus(mission_id: string, status: string) {
    return await this.axiosInstance.patch(
      `/api/v2/services/missions/${mission_id}/${status.toLocaleLowerCase()}`
    );
  }

  async saveMissionComment(mission_id: string, comment: any) {
    let body = {
      mission_id: mission_id,
      comment: comment
    }
    return await this.axiosInstance.post(`/api/v2/services/missions/saveMissionComment`, body
    );
  }

  async getMissionComment(mission_id: string) {
    let params = {
      mission_id: mission_id,
    }
    return await this.axiosInstance.get(`/api/v2/services/missions/getMissionComment`, {
      params
    }
    );
  }



  async setMissionRequestOnRoute(mission_id: string, request_id: string) {
    return await this.axiosInstance.patch(
      `/api/v2/services/missions/${mission_id}/${request_id}/on-route`
    );
  }

  async setMissionRequestCurrentLocation(
    mission_id: string,
    request_id: string,
    index: number
  ) {
    return await this.axiosInstance.patch(
      `/api/v2/services/missions/${mission_id}/${request_id}/location/${index}`
    );
  }

  async getListOfConcerningMissionsAreal(status: string, dateFilter: any, paging: any) {
    //console.log(79,paging);

    return await this.axiosInstance.get(`/api/v2/services/missions/areal`, {
      params: createParams(status, dateFilter, paging),
    });
  }

  async getListOfConcerningMissionsAsPassenger(
    status: string,
    dateFilter: any,
    paging: any
  ) {
    return await this.axiosInstance.get(`/api/v2/services/missions/passenger`, {
      params: createParams(status, dateFilter, paging),
    });
  }




  async getListOfConcerningMissionsAsDriver(status: string, dateFilter: any, paging: any) {
    return await this.axiosInstance.get(`/api/v2/services/missions/driver`, {
      params: createParams(status, dateFilter, paging),
    });
  }

  async getMissionDetails(mission_id: string) {
    return await this.axiosInstance.get(
      `/api/v2/services/missions/${mission_id}`
    );
  }

  async submitFullMission(fullBody: any) {
    console.log(88);

    return await this.axiosInstance.post(
      `/api/v2/services/missions/full`,
      fullBody
    );
  }

  async getDeligationsOn(user_id: string) {
    return await this.axiosInstance.get(
      `/api/v2/roles/permissions/deligate/${user_id}`
    );
  }


  async select_FavoriteLocation() {
    // const params = {
    //   item:item
    // }
    return await this.axiosInstance.get(`/api/v2/favoriteLocations/select_FavoriteLocation`)//, { params });
  }

  async insert_FavoriteLocation(item: any) {
    let body = {
      item: item
    }
    //console.log(111, item);

    return await this.axiosInstance.post(`/api/v2/favoriteLocations/insert_FavoriteLocation`, body
    );
  }

  async update_FavoriteLocation(item: any) {
    return this.axiosInstance.put(`/api/v2/favoriteLocations/update_FavoriteLocation/${item._id}`, { item });
  }

  async delete_FavoriteLocation(_id: string) {
    return this.axiosInstance.delete(`/api/v2/favoriteLocations/delete_FavoriteLocation/${_id}`);
  }



  async selectRestrictions(key: any, count: any) {
    const params = {
      key: key,
      count: count
    }
    return await this.axiosInstance.get(`/api/v2/restrict/selectRestrictions`, { params });
  }

  async updateRestrictions(key: any, value: any) {
    console.log(53);
    let body = {
      key: key,
      value: value
    }
    try {
      return this.axiosInstance.put(`/api/v2/restrict/updateRestrictions`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async insertRestrictionShowRequests(key: number, count: any) {
    let body = {
      key: key,
      count: count
    }
    return await this.axiosInstance.post(`/api/v2/restrict/insertRestrictionShowRequests`, body
    );
  }

  async selectRestrictionShowRequests(key: number, count: any) {
    const params = {
      key: key,
      count: count
    }
    return await this.axiosInstance.get(`/api/v2/restrict/selectRestrictionShowRequests`, { params });
  }


  async insertSetWorkingWeek(key: number, item: any) {
    console.log(88);

    let body = {
      key: key,
      item: item
    }
    return await this.axiosInstance.post(`/api/v2/restrict/insertSetWorkingWeek`, body
    );
  }

  async selectSetWorkingWeek(key: any, item: any) {


    const params = {
      key: key,
      item: item
    }
    // console.log(789);
    return await this.axiosInstance.get(`/api/v2/restrict/selectSetWorkingWeek`, { params });
  }

  async submitDeligationOn(
    other_user_id: string,
    add_permits: string[],
    revoke_permits: string[]
  ) {
    return await this.axiosInstance.post(
      `/api/v2/roles/permissions/deligate/`,
      {
        other_user_id,
        add_permits,
        revoke_permits,
      }
    );
  }


  //agance
  async insert_Agance(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_Agance`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_Agance(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/Agance/update_Agance/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_Agance() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/Agance/select_Agance`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_Agance(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/Agance/delete_Agance/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  //sodureParvane
  async insert_sodureParvane(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_sodureParvane`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_sodureParvane(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/agance/update_sodureParvane/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_sodureParvane() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/agance/select_sodureParvane`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_sodureParvane(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/agance/delete_sodureParvane/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }



  //aganceDriver
  async insert_AganceDriver(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_AganceDriver`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_AganceDriver(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/Agance/update_AganceDriver/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_AganceDriver() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/Agance/select_AganceDriver`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_AganceDriver(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/Agance/delete_AganceDriver/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  //aganceVehicle
  async insert_AganceVehicle(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_AganceVehicle`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_AganceVehicle(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/Agance/update_AganceVehicle/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_AganceVehicleByDriverID(driver_user: any) {
    const params = {
      driver_user: driver_user,
    }
    //console.log(7888,params);

    try {
      return this.axiosInstance.get(
        `/api/v2/Agance/select_AganceVehicleByDriverID`, { params }
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async select_AganceVehicle() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/Agance/select_AganceVehicle`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_AganceVehicle(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/Agance/delete_AganceVehicle/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }



  //carteSalahiyat
  async insert_carteSalahiyat(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_carteSalahiyat`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_carteSalahiyat(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/agance/update_carteSalahiyat/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_carteSalahiyat() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/agance/select_carteSalahiyat`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_carteSalahiyat(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/agance/delete_carteSalahiyat/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }



  //TarefeAvarez
  async insert_TarefeAvarez(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_TarefeAvarez`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_TarefeAvarez(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/agance/update_TarefeAvarez/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_TarefeAvarez() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/agance/select_TarefeAvarez`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_TarefeAvarez(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/agance/delete_TarefeAvarez/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }



  //MoayeneFani
  async insert_MoayeneFani(body: any) {
    try {

      return this.axiosInstance.post(
        `/api/v2/agance/insert_MoayeneFani`,
        body
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  async update_MoayeneFani(body: any) {
    try {
      const _id = body._id
      return this.axiosInstance.put(`/api/v2/agance/update_MoayeneFani/${_id}`, body);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async select_MoayeneFani() {
    //console.log(8989);

    try {
      return this.axiosInstance.get(
        `/api/v2/agance/select_MoayeneFani`
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }


  async delete_MoayeneFani(id: string) {
    try {
      return this.axiosInstance.delete(`/api/v2/agance/delete_MoayeneFani/${id}`);
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  //selectAganceProfileByDriverId
  async selectAganceProfileByDriverId(driverId: any) {
    //console.log(8989);
    const params = {
      driverId: driverId
    }

    try {
      return this.axiosInstance.get(
        `/api/v2/agance/selectAganceProfileByDriverId`, { params }
      );
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

}

function createParams(status?: string, dateFilter?: any, paging?: any) {
  return {
    status,
    gmt_from: dateFilter?.gmt_from,
    gmt_to: dateFilter?.gmt_to,
    paging
  };
}




export function getApiClient(config?: ApiClientConfig) {
  return new ApiClient(config);
}
