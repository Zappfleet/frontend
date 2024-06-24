import { joiResolver } from "@hookform/resolvers/joi";
import { Box } from "@mantine/core";
import Joi from "joi";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import MyCheckBox from "../../../../components/common/from/checkBox";
import FunForm from "../../../../components/common/from/functionalForm";
import MyInput from "../../../../components/common/from/input";
import MySelect from "../../../../components/common/from/select";

const CreateAreaForm = ({ onRegister, dispatchers , item }) => {
  const schema = useMemo(
    () =>
      Joi.object({
        name: Joi.string().required().messages({
          "string.empty": ` نام محدوده را وارد کنید`,
          "string.min": ` نام محدوده حداقل 4 کارکتر است`,
          "any.required": ` نام محدوده را وارد کنید`,
        }),
        dispatcher_id: Joi.string().alphanum().required().messages({
          "string.empty": ` توزیع کننده را انتخاب کنید`,
          "any.required": ` توزیع کننده را انتخاب کنید`,
        }),
        need_manager_approve: Joi.boolean().optional(),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const handleDispatchers = () => {
	if (item?.dispatcher) {
		const fixedDispatchers = item?.dispatcher?.map((dispatcher) => ({
			label: dispatcher.full_name,
			value: dispatcher.account_id,
		}));
		const modifiedDispatchers = [...dispatchers, ...fixedDispatchers];

		return modifiedDispatchers;
	}
	return dispatchers;
};

  return (
    <Box
      className="shadow-sm w-100 p-2 p-md-5"
      aria-disabled="true"
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[1],
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
        borderRadius: theme.radius.md,
        transition: "0.2s",
      })}
    >
      <FunForm
        buttonLabel="ثبت"
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onRegister}
		state={item}
        className="w-100"
      >
        <MyInput
          label="نام محدوده"
          placeholder="انتخاب نام محدوده"
          name="name"
          required={true}
          error={errors.name?.message}
          autoFocus
        />
        <MySelect
          label="توزیع کننده"
          disabled={handleDispatchers()?.length === 0}
          placeholder={
            handleDispatchers().length > 0
              ? "انتخاب کنید"
              : "توزیع کننده بدون محدوده یافت نشد"
          }
          data={handleDispatchers()}
          name="dispatcher_id"
          required={true}
          error={errors.dispatcher_id?.message}
        />
        <MyCheckBox
          label="عدم نیاز به تایید مدیر پروژه"
          name="need_manager_approve"
          error={errors.need_manager_approve?.message}
		  isCheckbox={true}
        />
      </FunForm>
    </Box>
  );
};

export default CreateAreaForm;
