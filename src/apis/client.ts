import axios from 'axios';

interface ApiClientConfig {
  baseUrl: string;
}

class ApiClient {
  axiosInstance;

  constructor(props?: ApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL || props?.baseUrl,
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
    console.log(1000,"/api/v2/users/sign-in");
    
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

  async getReportAgencyCost(agency_id?: string, dateFilter?: any) {
    const params = createParams(undefined, dateFilter);
    return this.axiosInstance.get(`/api/v2/reports/agency-costs/${agency_id}`, {
      params,
    });
  }

  async getReportDriverDaily(driver_id?: string, dateFilter?: any) {
    const params = createParams(undefined, dateFilter);
    return this.axiosInstance.get(`/api/v2/reports/driver-daily/${driver_id}`, {
      params,
    });
  }

  async getReportDriverGeneral(driver_id?: string, dateFilter?: any) {
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
    //console.log(77, status);

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
    //console.log(77, status);

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
    console.log(7722222, status);

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
    return await this.axiosInstance.patch(
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

  async getListOfConcerningMissionsAreal(status: string, dateFilter: any) {
    return await this.axiosInstance.get(`/api/v2/services/missions/areal`, {
      params: createParams(status, dateFilter),
    });
  }

  async getListOfConcerningMissionsAsPassenger(
    status: string,
    dateFilter: any
  ) {
    return await this.axiosInstance.get(`/api/v2/services/missions/passenger`, {
      params: createParams(status, dateFilter),
    });
  }

  async getListOfConcerningMissionsAsDriver(status: string, dateFilter: any) {
    return await this.axiosInstance.get(`/api/v2/services/missions/driver`, {
      params: createParams(status, dateFilter),
    });
  }

  async getMissionDetails(mission_id: string) {
    return await this.axiosInstance.get(
      `/api/v2/services/missions/${mission_id}`
    );
  }

  async submitFullMission(fullBody: any) {
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




}

function createParams(status?: string, dateFilter?: any) {
  return {
    status,
    gmt_from: dateFilter?.gmt_from,
    gmt_to: dateFilter?.gmt_to,
  };
}

export function getApiClient(config?: ApiClientConfig) {
  return new ApiClient(config);
}
