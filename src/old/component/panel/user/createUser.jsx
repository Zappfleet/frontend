import { useContext, useState } from "react";
import Joi from "joi";
import { SucccessToast } from "../../../components/common/errorToast";
import MyInput from "../../../components/common/from/input";
import FunForm from "../../../components/common/from/functionalForm";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { HeightContext } from "../panel";
import { Box, Center, LoadingOverlay } from "@mantine/core";
import {  roleList } from "../../../utils/userHelper";
import { useNavigate } from "react-router-dom";
import MySelect from "../../../components/common/from/select";
import { catchError } from "../../../utils/errorHelper";
import settings from "../../../config";
import httpService from "../../../services/httpService";

const schema = Joi.object({
  full_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": ` نام کاربر را وارد کنید`,
    "string.min": ` نام کاربر حداقل 3 کارکتر است`,
    "any.required": ` نام کاربر را وارد کنید`,
  }),
  nat_num: Joi.string().min(10).max(11).required().messages({
    "number.base": `  کدملی کاربر را وارد کنید`,
    "number.min": `   فرمت کدملی صحیح نیست`,
    "number.max": `   فرمت کدملی صحیح نیست`,
    "any.required": `  کدملی کاربر را وارد کنید`,
  }),
  phone_num: Joi.string().min(10).max(11).required().messages({
    "number.base": `  شماره همراه کاربر را وارد کنید`,
    "number.min": `  فرمت شماره همراه صحیح نیست `,
    "number.max": `  فرمت شماره همراه صحیح نیست `,
    "any.required": `  شماره همراه کاربر را وارد کنید`,
  }),
  emp_num: Joi.number()
    .min(111)
    .max(99999999)
    .allow("")
    .optional()
    .messages({
      "number.min": `کدپرسنلی حداقل 3 کارکتر است   `,
      "number.max": `  فرمت کدپرسنلی صحیح نیست `,
    }),
  role: Joi.number().valid(0, 1, 2, 3, 4).required().messages({
    "number.base": `  نقش کاربر را وارد کنید`,
    "any.only": `  نقش کاربر را وارد کنید`,
    "any.required": `  نقش کاربر را وارد کنید`,
  }),
});


const CreateUser = ({user,updateList}) => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: joiResolver(schema) });
 
  const onSubmit = async (data) => {

    const { full_name, nat_num, phone_num, role , emp_num}=data

 
    const id = user?.id;
    const body={
      full_name,
      nat_num,
      phone_num,
      role,
    }

    if (emp_num?.toString()?.trim()){
      body.emp_num = emp_num; 
    }
 
    const createUser =()=> httpService.post(`${settings.apiUrl}/user`, body);
		const editUser = ()=>httpService.put(`${settings.apiUrl}/user/${id}`, body);
    const chooseApi = user?.id ? editUser : createUser;
    try {
      setLoading(true);
      await chooseApi()
      if(id){
        updateList()
       } else  navigate("/panel/user/list", { replace: true });
 
      SucccessToast({
				message: user?.id
					? "کاربر با موفقیت ویرایش شد"
					: "کاربر با موفقیت ایجاد شد",
			});
    
      setLoading(false);
      reset()
    } catch (error) {
      setLoading(false);
      catchError(error);
    }
  };

  const height = useContext(HeightContext);
  const header = `${user?.id?"ویرایش کاربر":"ایجاد کاربر جدید"}`;

  return (
    <div className="container-fluid" style={{ height }}>
      <LoadingOverlay visible={loading} />
      <Center className="h-100">
        <div className={` ${user?.id?"col-lg-8":"col-md-11 col-lg-4 col-11"}`}>
          <Box
            className="shadow-sm w-100 p-5"
            aria-disabled="true"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[1],
              marginBottom: theme.spacing.md,
              borderRadius: theme.radius.md,
              transition: "0.2s",
            })}
          >
            <h1 className="text-right my-3 text-h4">{header}</h1>
            <FunForm
              buttonLabel={user?.id ? "ویرایش کاربر":"ایجاد کاربر"}
              register={register}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              className="w-100"
              autocomplete="off"
              state={user}
            >
              <MyInput
                label="نام کامل کاربر"
                placeholder="نام کامل کاربر را وارد کنید"
                name="full_name"
                required={true}
                error={errors.full_name?.message}
                autoFocus
              />
              <MyInput
                label="کدملی"
                placeholder="کدملی کاربر را وارد کنید"
                name="nat_num"
                required={true}
                error={errors.nat_num?.message}
                autoFocus
              />
              <MyInput
                label="تلفن همراه"
                placeholder="تلفن همراه  کاربر را وارد کنید"
                name="phone_num"
                required={true}
                error={errors.phone_num?.message}
                autoFocus
              />
              <MyInput
                label="کدپرسنلی"
                placeholder="کدپرسنلی  کاربر را وارد کنید"
                name="emp_num"
                type="number"
                required={false}
                error={errors.emp_num?.message}
                autoFocus
                disabled={user?.id}
              />
              <MySelect
                label="نقش کاربر"
                placeholder="نقش کاربر  را وارد کنید"
                data={roleList}
                name="role"
                required={true}
                error={errors.role?.message}
              />
            </FunForm>
          </Box>
        </div>
      </Center>
    </div>
  );
};
export default CreateUser;
