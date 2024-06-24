import React, { useContext, useEffect, useRef, useState } from "react";
//mantine
import {
  Box,
  Center,
  Input,
  Container,
  InputWrapper,
  LoadingOverlay,
} from "@mantine/core";
//dropzone
import { Button, createStyles, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from "@mantine/dropzone";
import { Settings } from "tabler-icons-react";
import defaultAvatar from "../../../../assets/imgs/default_avatar.png";

import styles from "./Profile.module.css";
import { UserContext } from "../../../../App";
import { getUserById, updateMe } from "../../../../services/userService";
import {
  ErrorToast,
  SucccessToast,
} from "../../../../components/common/errorToast";
import settings from "../../../../config";
import { HeightContext } from "../../panel";
const KEY_PHONE = "phone";
const KEY_PASS_CURRENT = "pass_current";
const KEY_PASS_NEW = "pass_new";

const Profile = () => {
  const user = useContext(UserContext);
  const [form, setForm] = useState({});

  const avatarFile = useRef({});

  const fetchUserData = () => {
    getUserById("me")
      .then((res) => {
        const userData = res.data.doc;

        const avatar =
          userData.avatar &&
          settings.imgUrl + encodeURIComponent(userData.avatar);
        setForm({
          phone: userData.phone_num,
          avatar,
        });
        if (avatar) {
          user.updateUserProps({ avatar });
        }
      })
      .catch((e) => {
        ErrorToast({ message: e?.response?.data?.info || e.message });
      });
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const updateInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getUserAvatar = () => {
    return form.avatar || defaultAvatar;
  };

  const submit = () => {
   
    if (
      (form[KEY_PASS_NEW] && !form[KEY_PASS_CURRENT]) ||
      (!form[KEY_PASS_NEW] && form[KEY_PASS_CURRENT])
    ) {
      ErrorToast({ message: "هر دو ورودی رمز را پر کنید" });
      return;
    }
    const bodyFormData = new FormData();
    if (form[KEY_PASS_NEW]) {
      bodyFormData.append("password", form[KEY_PASS_NEW]);
      bodyFormData.append('current_password', form[KEY_PASS_CURRENT])
    }
    if (form.phone) {
      bodyFormData.append("phone_num", form.phone);
    }
    if (avatarFile?.current?.avatar) {
      bodyFormData.append("avatar", avatarFile.current.avatar);
    }

    updateMe(bodyFormData)
      .then((res) => {
        SucccessToast({ message: "پروفایل با موفقیت به روز رسانی شد" });
        const newForm = {
          ...form,
        };

        newForm[KEY_PASS_CURRENT] = "";
        newForm[KEY_PASS_NEW] = "";
        setForm(newForm);
        fetchUserData();
      })
      .catch((e) => {
        ErrorToast({ message: e?.response?.data?.info || e.message });
      });
  };

  const rejectFile = () => {
    ErrorToast({
      message:
        "خطا در انتخاب فایل. تصویر مورد نظر باید کمتر از 2 مگابایت حجم داشته باشد.",
    });
  };

  const acceptFile = (files) => {
    const selectedFile = files[0];
    const objectUrl = URL.createObjectURL(selectedFile);
    setForm({
      ...form,
      avatar: objectUrl,
    });
    avatarFile.current.avatar = selectedFile;
  };

  const renderUserAvatar = () => {
    return (
      <img
        crossOrigin="anonymous"
        style={{ objectFit: "contain" }}
        src={getUserAvatar()}
        width={130}
        height={130}
        className="rounded-circle"
      />
    );
  };
  const height = useContext(HeightContext);
  return (
    <div className="container-fluid" style={{ height }}>
      <Center className="h-100">
        <div className="col-md-11 col-lg-4 col-11">
          <Box
            className="shadow-sm  p-5"
            aria-disabled="true"
            sx={(theme) => ({
              backgroundColor: theme.colors.gray[1],
              marginBottom: theme.spacing.md,
              borderRadius: theme.radius.md,
              transition: "0.2s",
            })}
          >
            <div
              className={`${styles.profile} d-flex flex-column align-items-center justify-content-flex-start gap-3`}
            >
              <h2 className={styles.profileHeader}>پروفایل کاربری</h2>
              <Dropzone
                padding={0}
                radius={100}
                onDrop={acceptFile}
                onReject={rejectFile}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
              >
                {renderUserAvatar}
              </Dropzone>
              {/* <Avatar radius="xl" size="lg" /> */}
            </div>

            <div className={styles.formContainer}>
              <h4 className={styles.formText}>نام: </h4>
              <h4>{user.full_name}</h4>
            </div>

            <div className={styles.formContainer}>
              <h4 className={styles.formText}>کد پرسنلی: </h4>
              <h4>{user.emp_num}</h4>
            </div>

            <div className={styles.formContainer}>
              <h4 className={styles.formText}>شماره موبایل: </h4>
              <InputWrapper
                className={styles.inputWrapper}
                style={{ border: "none" }}
              >
                <Input
                  autoComplete="off"
                  name={KEY_PHONE}
                  value={form[KEY_PHONE]}
                  className={styles.input}
                  onChange={updateInput}
                  placeholder="شماره همراه"
                />
              </InputWrapper>
            </div>
            <div className={styles.formContainer}>
              <h4 className={styles.formText}>رمز عبور فعلی: </h4>
              <InputWrapper
                className={styles.inputWrapper}
                style={{ border: "none" }}
              >
                <Input
                  autoComplete="new-password"
                  type={"password"}
                  name={KEY_PASS_CURRENT}
                  value={form[KEY_PASS_CURRENT]}
                  className={styles.input}
                  onChange={updateInput}
                  placeholder="رمز عبور فعلی"
                />
              </InputWrapper>
            </div>
            <div className={styles.formContainer}>
              <h4 className={styles.formText}>رمز عبور جدید: </h4>
              <InputWrapper
                className={styles.inputWrapper}
                style={{ border: "none" }}
              >
                <Input
                  autoComplete="off"
                  type={"password"}
                  name={KEY_PASS_NEW}
                  value={form[KEY_PASS_NEW]}
                  className={styles.input}
                  onChange={updateInput}
                  placeholder="رمز عبور جدید"
                />
              </InputWrapper>
            </div>
            <Button onClick={submit} className={styles.button} color="violet">
              ثبت
            </Button>

            {/* <div className={styles.formContainer}>
                            <h4 className={styles.formText}>تغییر پروفایل کاربری: </h4>
                            <div className={classes.wrapper} style={{ width: '240px' }}>
                                <Dropzone
                                    openRef={openRef}
                                    className={classes.dropzone && styles.dropzone}
                                    radius="md"
                                    accept={[MIME_TYPES.pdf]}
                                    maxSize={30 * 1024 ** 2}
                                >
                                    {(status) => (
                                        <div style={{ pointerEvents: 'none' }}>
                                            <Group position="center">
                                                <CloudUpload size={50} color={getActiveColor(status, theme)} />
                                            </Group>
                                            <Text
                                                align="center"
                                                weight={700}
                                                sx={{ color: getActiveColor(status, theme) }}
                                            >
                                                {status.accepted
                                                    ? 'Drop files here'
                                                    : status.rejected
                                                        ? 'Pdf file less than 30mb'
                                                        : 'وارد نمایید'}
                                            </Text>
                                        </div>
                                    )}
                                </Dropzone>

                            </div>
                        </div> */}
          </Box>
        </div>
      </Center>
    </div>
  );
};
export default Profile;
