import { findText } from '../../../../lib/string';
import './style.scss'

export function VehicleItem(props: any) {
  const { vehicle, basicData } = props;
  if (vehicle == null || basicData == null) {
    return '';
  }

  const isNotAgency = vehicle?.extra?.agency_name == null;
  return (
    <div className='VehicleItem-component'>
      <div>
        {isNotAgency ? (
          <span className='name'>
            {vehicle?.driver_user?.full_name || 'بدون راننده'}
          </span>
        ) : (
          <span>
            <span className='name'>{'آژانس : '}</span>
            <span>{vehicle?.extra?.agency_name}</span>
          </span>
        )}
      </div>

      {isNotAgency && (
        <>

          {Object.entries(vehicle.extra).map(([_, value]: any) => {
            return (
              <span>
                {findText(value, basicData[`${_}s`])}
              </span>
            );
          })}


          {`(`}
          {vehicle.services?.map((service: any, index: number) => {
            return (
              <span>
                {
                  basicData?.services?.find?.((item: any) => {
                    return item.key == service.service;
                  }).title
                }
                {index != vehicle.services?.length - 1 ? ' , ' : ''}
              </span>
            );
          })}
          {`)`}

        </>
      )}
    </div>
  );
}
