
import './style.scss'
import classNames from 'classnames';
import React, { useRef } from 'react';
import useNeshanApi, { getAddressObjText } from '../../hooks/data/useNeshanApi';
import renderUi from '../../lib/renderUi';
import Loader, { SmallLoader } from '../../common/Loader';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';


const LocationSearch = (props: any) => {

   
    const { searchState, searchAddress, clearAddressSearch } = useNeshanApi();
    const resultDivRef = useRef<any>();

    const handle_inputChange = (e: any) => {
        if (e.target.value.trim().length == 0) {
            clearAddressSearch();
            return;
        }
        const center = props.mapRef.current.getCenterLonLat();
        searchAddress(e.target.value, center[1], center[0]);
    }

    const handle_addressResultClick = (result: any) => {
        clearAddressSearch();
        props.mapRef.current.viewCoordinates(result.location.x, result.location.y, 16)
    }

 
    const showResultPane = searchState.inProgress || searchState.searchResult != null;
    return (
        <div className='LocationSearch-component flex-center'>
            <input
                onChange={handle_inputChange}
                className='map-btn'
                placeholder='جستجوی نقشه ...'
                onKeyDown={function (e) {

                    if (e.code == 'ArrowDown' && searchState.searchResult != null && searchState.searchResult.length > 0) {
                        (resultDivRef.current.children[0] as HTMLElement).focus();
                    }
                }}
            />
          
            <div className={classNames(
                'loc-search-result duration-300 absolute top-12 left-1 right-1 rounded bg-white p-1',
                {
                    "opacity-100 -translate-y-0 pointer-events-auto": showResultPane,
                    "opacity-0 -translate-y-2 pointer-events-none": !showResultPane,
                }
            )}>
                {renderUi(  <SmallLoader /> ).if(searchState.inProgress)}
                {renderUi(<div>{"هیچ مکانی پیدا نشد!"}</div>).if(searchState.searchResult != null && searchState.searchResult.length == 0)}
                <ul
                    ref={resultDivRef}
                    className={classNames("duration-300 ", {
                        "opacity-0": searchState.searchResult == null,
                        "opacity-100": searchState.searchResult != null,
                    })}
                >
                    {searchState.searchResult?.map((item: any, index: number) => {
                        if (index > 10) return;
                        return <li
                            tabIndex={0}
                            key={`${item.title}${item.location.x}${item.location.y}`}
                            onKeyDown={function (e) {
                                const target = e.target as HTMLElement;
                                if (e.code == 'Enter') handle_addressResultClick(item)
                                if (e.code == 'ArrowDown' && target.nextSibling) (target.nextSibling as HTMLElement).focus()
                                if (e.code == 'ArrowUp' && target.previousSibling) (target.previousSibling as HTMLElement).focus()
                            }}
                            onClick={() => handle_addressResultClick(item)} className='p-2 cursor-pointer outline-none focus:bg-gray-4 hover:bg-gray-4 active:bg-gray-4'>
                            {getAddressObjText(item)}
                        </li>
                    })}
                </ul>
            </div>
        </div>
    );
};

export default LocationSearch;