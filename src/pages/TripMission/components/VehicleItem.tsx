import { findText } from '../../../lib/string';

export function VehicleItem(props: any) {
  const { vehicle, basicData } = props;
  if (vehicle == null || basicData == null) {
    return '';
  }

  const isNotAgency = vehicle?.extra?.agency_name == null;
  return (
    <span className="flex">
      <span className="flex flex-1 flex-col px-1">
        <div className="flex items-center">
          {isNotAgency ? (
            <span className="text-primary">
              {vehicle?.driver_user?.full_name || 'بدون راننده'}
            </span>
          ) : (
            <span>
              <span className="text-primary">{'آژانس : '}</span>
              <span>{vehicle?.extra?.agency_name}</span>
            </span>
          )}
        </div>

        {isNotAgency && (
          <div className="flex items-center">
            <span>
              {Object.entries(vehicle.extra).map(([_, value]: any) => {
                return (
                  <span className="mx-0.5">
                    {findText(value, basicData[`${_}s`])}
                  </span>
                );
              })}
            </span>
            <span className="mx-1 text-sm">
              {`(`}
              {vehicle.services?.map((service: any, index: number) => {
                return (
                  <span className="mx-0.5">
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
            </span>
          </div>
        )}
      </span>
    </span>
  );
}
