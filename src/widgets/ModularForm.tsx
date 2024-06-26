import { ModularInput } from '../components/ModularInput';
import renderUi from '../lib/renderUi';

function ModularForm({ fields, onInputChange, mode, formState }: any) {
  //console.log(800, formState,fields);

  return (
    <>
      {fields?.map((moduleProps: any) => {
        //console.log(760,moduleProps.key);
        
        return renderUi(
          <ModularInput
            {...moduleProps}
            value={formState[moduleProps.key]}
            onChange={onInputChange}
            key={moduleProps.key}
            inputKey={moduleProps.key}
          />
        ).if(moduleProps.mode == null || moduleProps.mode == mode);
      })}
    </>
  );
}

export default ModularForm;
