import { ModularInput } from '../components/ModularInput';
import renderUi from '../lib/renderUi';

function ModularForm({ fields, onInputChange, mode, formState, clsssName1 }: any) {
 // console.log(800, clsssName1, clsssName1['proj_code']);

  return (
    <>
      {fields?.map((moduleProps: any) => {
        // console.log(760,moduleProps.key,clsssName1[moduleProps.key],clsssName1[moduleProps.key],clsssName1[moduleProps.key] == false);

        return renderUi(
          <ModularInput
            {...moduleProps}
            className1={clsssName1[moduleProps.key] == false ? true : false}
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
