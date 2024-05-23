import { useRef, useState } from "react";
import { neshanClient } from "../../apis/neshan";

const DEFAULT_SEARCH_STATE = {
    inProgress: false,
    searchResult: null,
    geocodingResult: null,
}

export type AddressSearchItem = {}

export type AddressSearchResult = Array<{
    title: string,
    address: string,
    neighbourhood: string,
    region: string,
    type: string,
    category: string,
    location: {
        x: number,
        y: number
    }
}>

export type ReverseGeocodingResult = {
    formatted_address: string,
    city: string,
    state: string,
    county: string,
    district: string,
}

export type NeshanSearchState = {
    inProgress: boolean,
    searchResult: AddressSearchResult | null,
    geocodingResult: ReverseGeocodingResult | null,

}

export default function useNeshanApi() {

    const [searchState, setSearchState] = useState<NeshanSearchState>(DEFAULT_SEARCH_STATE);

    const updateState = (new_state: any) => {
        setSearchState({ ...new_state })
    }

    const searchTimer = useRef<NodeJS.Timeout>();

    const clearAddressSearch = () => {
        setSearchState(DEFAULT_SEARCH_STATE);
    }

    const reverseGeocoding = (lat: number, lng: number): Promise<ReverseGeocodingResult> => {
        const stateClone = { ...searchState };
        stateClone.inProgress = true;
        updateState(stateClone);
        return new Promise((resolve, reject) => {
            neshanClient.reverse(lat, lng)
                .then(({ data }) => { resolve(data) })
                .catch(reject)
                .finally(() => {
                    stateClone.inProgress = false;
                    updateState(stateClone);
                })
        })

    }

    const searchAddress = (term: string, lat: number, lng: number) => {
        if (searchTimer.current != null) clearTimeout(searchTimer.current);
        const stateClone = { ...searchState };
        stateClone.inProgress = true;
        stateClone.searchResult = null;
        updateState(stateClone);

        searchTimer.current = setTimeout(() => {
            neshanClient.searchAddress(term.trim(), lat, lng).then(({ data }) => {
                stateClone.inProgress = false;
                stateClone.searchResult = filterDuplicateAddresses(data.items);
                updateState(stateClone)
            }).catch(() => {
                stateClone.inProgress = false;
                updateState(stateClone);
            })
        }, 1000)
    }

    return {
        searchAddress,
        reverseGeocoding,
        clearAddressSearch,
        searchState
    };
}

export function getAddressObjText(item: any) {
    const el = [];
    if (item.address != null) el.push(item.address);
    if (item.title != null) el.push(item.title);
    return el.join(" - ")
}

function filterDuplicateAddresses(items: any): any {
    const filterdResult: any = [];

    items.map((item: any) => {
        if (filterdResult.find((i: any) => getAddressObjText(item) == getAddressObjText(i)) == null) {
            filterdResult.push(item);
        }
    })
    return filterdResult;
}