import {
  Box,
  Button,
  Center,
  Grid,
  Input,
  InputWrapper,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
} from "@mantine/core";
import Joi from "joi";
import { useContext, useEffect, useMemo, useState } from "react";
import plaqueWords from "../../../../utils/plaqueWords";
import { HeightContext } from "../../panel";
import _ from "lodash";
import { carColorCodeList, carGroup, carNameCodeList, IRISA_GROUP } from "../../../../utils/carHelper";
import settings from "../../../../config";
import useSWR from "swr";
import httpService from "../../../../services/httpService";
import { catchError } from "../../../../utils/errorHelper";
import { SucccessToast } from "../../../../components/common/errorToast";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";


let submited = false;


const CreateCar = ({ car, updateList }) => {
  let navigate = useNavigate();
  const schema = useMemo(
    () => ({
      plaque: {
        f: Joi.number().min(10).max(99).required().messages({
          "number.base": `الزامی است`,
          "number.empty": `الزامی است`,
          "number.min": `معتبر نیست`,
          "number.max": `معتبر نیست`,
          "any.required": `الزامی است`,
        }),
        s: Joi.number().min(100).max(999).required().messages({
          "number.base": `الزامی است`,

          "number.empty": `الزامی است`,
          "number.min": `معتبر نیست`,
          "number.max": `معتبر نیست`,
          "any.required": `الزامی است`,
        }),
        t: Joi.number().min(10).max(99).required().messages({
          "number.base": `الزامی است`,

          "number.empty": `الزامی است`,
          "number.min": `معتبر نیست`,
          "number.max": `معتبر نیست`,
          "any.required": `الزامی است`,
        }),
        l: Joi.string().required().messages({
          "string.base": `الزامی است`,
          "string.empty": `الزامی است`,
          "any.required": `الزامی است`,
        }),
      },
      color_code: Joi.number().min(0).max(9).required().messages({
        "number.base": ` رنگ خودرو را انتخاب کنید `,
        "number.empty": ` رنگ خودرو را انتخاب کنید `,
        "number.min": `رنگ خودرو معتبر نیست `,
        "number.max": `رنگ خودرو معتبر نیست `,
        "any.required": `رنگ خودرو را انتخاب کنید `,
      }),
      name_code: Joi.number().min(0).max(50).required().messages({
        "number.base": ` نوع خودرو الزامی است `,

        "number.empty": ` نوع خودرو الزامی است `,
        "number.min": `نوع خودرو معتبر نیست`,
        "number.max": `نوع خودرو معتبر نیست`,
        "any.required": ` نوع خودرو الزامی است `,
      }),
      man_year: Joi.number().min(1300).max(1401).required().messages({
        "number.base": `سال ساخت خودرو الزامی است`,
        "number.empty": `سال ساخت خودرو الزامی است`,
        "number.min": `سال ساخت قبل از ۱۳۰۰ معتبر نیست`,
        "number.min": `سال ساخت بعد از ۱۴۰۱ معتبر نیست`,
        "any.required": `سال ساخت خودرو الزامی است`,
      }),
      user_id: Joi.string().required().messages({
        "string.empty": `راننده خودرو الزامی است `,
        "any.required": `راننده خودرو الزامی است `,
      }),
      group: Joi.number().messages({
        "number.base": `  گروه را انتخاب کنید `,
        "number.empty": ` گروه را انتخاب کنید`,
        "any.required": `گروه را انتخاب کنید`,
      }),
    }),
    []
  );
  const taxiSchema = useMemo(
    () => ({

      phone_num: Joi.string().optional().min(10).max(11).messages({
        "string.base": `  شماره همراه کاربر را وارد کنید`,
        "string.min": `  فرمت شماره همراه صحیح نیست `,
        "string.max": `  فرمت شماره همراه صحیح نیست `,
        "any.required": `  شماره همراه کاربر را وارد کنید`,
      }),
      full_name: Joi.string().required().messages({
        "string.empty": ` نام الزامی است `,
        "any.required": ` نام الزامی است `,
      }),
      group: Joi.number().messages({
        "number.base": `  گروه را انتخاب کنید `,
        "number.empty": ` گروه را انتخاب کنید`,
        "any.required": `گروه را انتخاب کنید`,
      }),
    }),
    []
  );

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [errors, setErrors] = useState();
  const [avaliableDrivers, setAvailableDrivers] = useState([]);
  const [group, setGroup] = useState(car?.group || 0);



  const { data: availabelDriversList, mutate: muteAvailableDrivers } = useSWR(
    [settings.apiUrl + "/user/available-drivers"],
    httpService.get,
    {
      revalidateOnFocus: false,
    }
  );
  const height = useContext(HeightContext);

  const handleRegisterCar = async () => {
    submited = true;
    const isirisaGroup = (group == IRISA_GROUP || car?.group == IRISA_GROUP);
    const options = { abortEarly: false };
    const chooseSchema = isirisaGroup ? schema : taxiSchema

    const fixedData = { ...data }
    if (group != IRISA_GROUP) delete fixedData.plaque
    const { error } = Joi.object(chooseSchema).validate(fixedData, options);
    const id = car?.id;
    const createIrisaCar = () => httpService.post(`${settings.apiUrl}/car`, fixedData)
    const createOtherCar = () => httpService.post(`${settings.apiUrl}/car/snapp-taxi`, fixedData);
    const updateIrisaCar = () => httpService.put(`${settings.apiUrl}/car/${id}`, fixedData)
    const updateOtherCar = () => httpService.put(`${settings.apiUrl}/car/snapp-taxi/${id}`, fixedData)
    const createCar = () => group == IRISA_GROUP ? createIrisaCar() : createOtherCar()
    const editCar = () => car?.group == IRISA_GROUP ? updateIrisaCar() : updateOtherCar()
    const chooseApi = id ? editCar : createCar;


    if (error) {
      for (let item of error.details) {
        if (item.path.length < 2) _.set(errors, item.path[0], item.message);
        else _.set(errors, item.path[0] + "." + item.path[1], item.message);
      }
      return setErrors({ ...errors });
    } else
      try {
        setLoading(true);
        await chooseApi();
        setLoading(false);
        SucccessToast({
          message: id
            ? "خودرو با موفقیت ویرایش شد"
            : "خودرو با موفقیت ثبت شد",
        });
        setData();
        muteAvailableDrivers()
        if (id) {
          updateList()
        } else {
          navigate(isirisaGroup ? "/panel/car/list" : "/panel/car/list-taxi", { replace: true })
        };

      } catch (error) {
        setLoading(false);
        catchError(error);
      }
  };

  const handleChange = (name, e) => {
    if (!submited) {
      if (e instanceof Object) {
        _.set(data, name, e.target.value);
      } else {
        console.log('here error');
        _.set(data, name, e);
      }
      return setData({ ...data });
    } else {

      if (e instanceof Object) {
        _.set(data, name, e.target.value);
        setData({ ...data });
      } else {
        _.set(data, name, e);
        setData({ ...data });
      }
      const chooseSchema = (group == IRISA_GROUP || car?.group == IRISA_GROUP) ? schema : taxiSchema
      const newSchema = { [name]: _.get(chooseSchema, name) };
      const newData = { [name]: _.get(data, name) };
      const error = Joi.object(newSchema).validate(newData);
      _.set(errors, name, error?.error?.details[0]?.message);
      return setErrors({ ...errors });
    }
  };

  const onChange = (name) => {
    return (e) => handleChange(name, e);
  };

  const handleChangeGroup = (e) => {
    setGroup(e)
    handleChange("group", e)
  }



  const handleInitailValues = () => {
    let body;
    if (car) {
      const { color_code, man_year, name_code, plaque } = car
      const { full_name, phone_num } = car?.driver?.user
      delete plaque?._id
      if (car?.group === IRISA_GROUP) {
        body = {
          color_code,
          man_year,
          name_code,
          plaque,
          user_id: car?.driver?.user?.account_id,
        }
      } else {
        body = {
          full_name,
          phone_num,
        }
      }

      return setData(body)
    }
  }
  const handleAvailableDrivers = () => {
    const availabelDrivers = availabelDriversList?.data?.docs.map((driver) => {
      return {
        value: driver?._id,
        label: driver?.full_name,
      };
    });
    if (car?.driver && availabelDrivers) {
      const fixedDriver = {
        value: car?.driver?.user?.account_id,
        label: car?.driver?.user?.full_name
      }
      const modifiedDrivers = [...availabelDrivers, fixedDriver];
      setAvailableDrivers(modifiedDrivers);
    } else setAvailableDrivers(availabelDrivers);
  }
  useEffect(() => {
    handleAvailableDrivers()
    handleInitailValues()
  }, [availabelDriversList?.data]);


  return (
    <div className="container-fluid" style={{ height }}>
      <LoadingOverlay visible={loading} />
      <Center className="h-100">
        <div className={` ${car?.id ? "col-lg-9" : "col-md-11 col-lg-4 col-11"}`}>
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
            <Text size="lg" weight={800} className="mb-3" align="center">
              {car?.id ? "ویرایش خودرو" : " تعریف خودرو"}
            </Text>
            {!car && <Select
              error={errors?.group}
              className="my-2"
              tabIndex={4}
              label="گروه خودرو"
              placeholder="گروه خودرو را انتخاب کنید"
              data={carGroup}
              required={true}
              onChange={handleChangeGroup}
              onBlur={console.log}
              defaultValue={(car?.group)?.toString() || "0"}
            />}
            {(group == IRISA_GROUP || car?.group == IRISA_GROUP) ? (
              <>
                <InputWrapper label="پلاک خودرو" className="mb-3" required>
                  <Grid>
                    <Grid.Col span={3}>
                      <NumberInput
                        hideControls
                        error={errors?.plaque?.t}
                        placeholder="۱۳"
                        value={data?.plaque?.t}
                        onChange={onChange("plaque.t")}
                        required={true}
                        tabIndex={4}
                        defaultValue={car?.plaque?.t}
                      />
                    </Grid.Col>

                    <Grid.Col span={3}>
                      <NumberInput
                        hideControls
                        error={errors?.plaque?.s}
                        placeholder="۴۱۴"
                        value={data?.plaque?.s}
                        onChange={onChange("plaque.s")}
                        required={true}
                        tabIndex={3}
                        defaultValue={car?.plaque?.s}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Select
                        error={errors?.plaque?.l}
                        placeholder="ب"
                        data={plaqueWords}
                        value={data?.plaque?.l}
                        searchable
                        required={true}
                        onChange={onChange("plaque.l")}
                        onBlur={console.log}
                        tabIndex={2}
                        defaultValue={car?.plaque?.l}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <NumberInput
                        hideControls
                        error={errors?.plaque?.f}
                        placeholder="۴۸"
                        value={data?.plaque?.f}
                        onChange={onChange("plaque.f")}
                        required={true}
                        autoFocus
                        tabIndex={1}
                        defaultValue={car?.plaque?.f}
                      />
                    </Grid.Col>
                  </Grid>
                </InputWrapper>
                <Select
                  error={errors?.name_code}
                  className="my-2"
                  tabIndex={4}
                  label="نوع خودرو"
                  placeholder="نوع خودرو را انتخاب کنید"
                  data={carNameCodeList}
                  required={true}
                  onChange={onChange("name_code")}
                  onBlur={console.log}
                  defaultValue={(car?.name_code)?.toString()}
                />
                <Select
                  error={errors?.color_code}
                  className="my-2"
                  label="رنگ خودرو"
                  searchable
                  placeholder="رنگ خودرو را انتخاب کنید"
                  data={carColorCodeList}
                  required={true}
                  onChange={onChange("color_code")}
                  onBlur={console.log}
                  defaultValue={(car?.color_code)?.toString()}
                />

                <NumberInput
                  label="سال ساخت خودرو"
                  required
                  hideControls
                  className="my-2"
                  error={errors?.man_year}
                  placeholder="سال ساخت خودرو را وارد "
                  value={data?.man_year}
                  onChange={onChange("man_year")}
                  defaultValue={car?.man_year}
                />
                <Select
                  error={errors?.user_id}
                  className="my-2"
                  label="راننده خودرو"
                  placeholder={avaliableDrivers?.length > 0 ? "راننده خودرو را انتخاب کنید" : 'از بخش مرتبط یک راننده تعریف کنید'}
                  data={avaliableDrivers || []}
                  required={true}
                  onChange={onChange("user_id")}
                  onBlur={console.log}
                  disabled={avaliableDrivers?.length === 0}
                  defaultValue={car?.driver?.user?.account_id}
                />
              </>
            ) : (
              <>

                <InputWrapper error={errors?.full_name} label="نام" className="mb-3" required>
                  <Input
                    label="نام"
                    placeholder="نام"
                    onChange={onChange("full_name")}
                    required={true}
                    tabIndex={4}
                    defaultValue={car?.driver?.user?.full_name}
                  />
                </InputWrapper>
                <InputWrapper label="شماره همراه" className="mb-3" error={errors?.phone_num} /*required*/>
                  <Input
                    // required
                    className="my-2"
                    placeholder="شماره همراه را وارد کنید"
                    onChange={onChange("phone_num")}
                    defaultValue={car?.driver?.user?.phone_num}
                  />
                </InputWrapper>
              </>
            )}
            <Button
              color="violet"
              radius="md"
              size="md"
              fullWidth
              type="submit"
              className="btn btn-primary  mt-3"
              onClick={handleRegisterCar}
            // disabled={avaliableDrivers?.length===0}
            >
              {car ? "ویرایش خودرو" : "ثبت خودرو"}
            </Button>
          </Box>
        </div>
      </Center>
    </div>
  );
};

export default CreateCar;
