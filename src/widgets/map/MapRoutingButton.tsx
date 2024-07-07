import React from 'react';
import './style.scss'

const ShowLocationsInGoogleMaps = ({ locations }: any) => {

    const constructGoogleMapsUrl = () => {
        const baseUrl = 'https://www.google.com/maps/dir/';
        const coordinates = locations.map((loc: any) => `${loc[1]},${loc[0]}`).join('/');
        return `${baseUrl}${coordinates}/@35.188554,-115.294222,6z/data=!3m1!4b1?entry=ttu`;
    };

    return (
        <div className="mapRouting-component">
            <button className='my-btn'>
                <a className='my-link'
                    href={constructGoogleMapsUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    مسیریابی
                </a>
            </button>
        </div>
    );
};

export default ShowLocationsInGoogleMaps;
