import PassengerServiceRequest, {
  MODE_USER_ONLY,
} from '../../pages/Passenger/PassengerServiceRequest/PassengerServiceRequest';
import useFullScreenModal from '../useFullScreenModal';

export default function useRequestEditModal() {
  const {
    show: showFullScreenModal,
    ui: FullScreenModalUi,
    close: closeFullScreenModal,
  } = useFullScreenModal({
    renderContent: ({ data, submitCallback }: any) => {
      if (data == null) return '';
      const initialValues = {
        _id: data._id,
        service: data.service,
        datetime: [data.gmt_for_date],
        ...data.details,
      };

      const initialLocations = data.locations.map((locationItem: any) => {
        return {
          lat: locationItem.coordinates[0],
          lng: locationItem.coordinates[1],
          ...locationItem.meta,
        };
      });
      return (
        <div>
          <h2 className="p-2 text-primary">ویرایش درخواست کاربر</h2>
          <PassengerServiceRequest
            mode={MODE_USER_ONLY}
            submitCallback={submitCallback}
            initialLocations={initialLocations}
            initialValues={initialValues}
            className="!top-12"
          />
        </div>
      );
    },
  });
  return {
    showFullScreenModal,
    FullScreenModalUi,
    closeFullScreenModal,
  };
}
