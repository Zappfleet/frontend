import { Box } from "@mantine/core";
import Joi from "joi";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import FunForm from "../../../../components/common/from/functionalForm";
import MyInput from "../../../../components/common/from/input";
import { joiResolver } from "@hookform/resolvers/joi";

const CreateLocation = ({ onRegister, dispatchers = [] }) => {
  const schema = useMemo(
    () =>
      Joi.object({
        name: Joi.string().required(),
        plaque: Joi.string().allow(null, ""),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

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
        className="w-100"
      >
        <MyInput
          label="نام مکان"
          placeholder="انتخاب نام مکان"
          name="name"
          required={true}
          error={errors.name?.message}
          autoFocus
        />
        <MyInput
          label="شماره پلاک "
          placeholder="شماره پلاک"
          name="plaque"
          error={errors.plaque?.message}
          autoFocus
        />
      </FunForm>
    </Box>
  );
};
export default CreateLocation;
