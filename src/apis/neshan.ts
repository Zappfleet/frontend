import axios from "axios";

export const NeshanMapKey = "web.98dc74e44c2544b493dff43bc3316fbb";
export const NeshanServiceKey = "service.a964983a7b31434fa832e9f83a18f26f";

const neshanBaseUrl = "https://api.neshan.org";

class NeshanClient {

    axiosClient;

    constructor() {
        this.axiosClient = axios.create({
            baseURL: neshanBaseUrl,
            headers: { "Api-Key": NeshanServiceKey }
        })

    }

    async searchAddress(term: string, lat: number, lng: number) {
        return await this.axiosClient.get("/v1/search", { params: { term, lat, lng } });
    }

    async reverse(lat: number, lng: number) {
        return await this.axiosClient.get("/v5/reverse", { params: { lat, lng } });
    }

}


export const neshanClient = new NeshanClient();