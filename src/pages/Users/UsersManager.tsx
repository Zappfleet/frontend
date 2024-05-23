import { BiLock, BiMobile, BiXCircle } from 'react-icons/bi';
import LoaderButton from '../../components/LoaderButton';
import ErrorMessage from '../Form/FormErrorMessage';
import { BsPersonVcard } from 'react-icons/bs';
import { HiOutlineUser } from 'react-icons/hi';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import useAuthentication from '../../hooks/data/useAuthentication';
import Loader from '../../common/Loader';
import useRoles from '../../hooks/data/useRoles';
import useUsers from '../../hooks/data/useUsers';
import {
  clearFormInputs,
  fillFormInputs,
  readFormInputs,
} from '../../lib/form';
import useValidation from '../../hooks/useValidation';
import {
  MSG_MIN_LENGTH,
  MSG_PICK_ATLEAST_ONE,
  MSG_REQUIRED_FIELD,
  translateDetailKey,
  userStatusEntries,
} from '../../lib/string';
import { getApiClient } from '../../apis/client';
import { NotificationController } from '../../lib/notificationController';
import Chips from '../../components/Chips';


import useCurrentUserPermissions from '../../hooks/useCurrentUserPermissions';
import {
  PERMIT_USERS_CREATE,
  PERMIT_USERS_EDIT,
  PERMIT_USERS_DELETE,
  PERMIT_USERS_LIST
} from '../../lib/constants'

const role_prefix = 'role_';

const baseValidationRules = {
  username: {
    isMinLength: { value: 1, message: MSG_REQUIRED_FIELD },
  },
  password: {
    isMinLength: { value: 6, message: MSG_MIN_LENGTH },
  },
  phone: {
    isMinLength: { value: 11, message: MSG_MIN_LENGTH },
  },
  status: {
    isMinLength: { value: 1, message: MSG_REQUIRED_FIELD },
  },
};

function combineValidationRules(additionalSignUpFields: any = {}) {
  const extraFields: any = {};
  Object.entries(additionalSignUpFields).map((entry) => {
    const key = entry[0];
    extraFields[key] = {
      isMinLength: { value: 1, message: MSG_REQUIRED_FIELD },
    };
  });

  return { ...baseValidationRules, ...extraFields };
}

const UsersManager = () => {

  const { hasPermitGroup, hasPermitFor, hasAdminRank, permits } =
    useCurrentUserPermissions();

  const [loading, setLoading] = useState<boolean>(false)
  const [permission_SUBMIT, setPermission_SUBMIT] = useState<boolean>(false)
  const [permission_EDIT, setPermission_EDIT] = useState<boolean>(false)
  const [permission_DELETE, setPermission_DELETE] = useState<boolean>(false)
  const [permission_LIST, setPermission_LIST] = useState<boolean>(false)

  useEffect(() => {
    setPermission_SUBMIT(hasPermitFor([PERMIT_USERS_CREATE]))
    setPermission_EDIT(hasPermitFor([PERMIT_USERS_EDIT]))
    setPermission_DELETE(hasPermitFor([PERMIT_USERS_DELETE]))
    setPermission_LIST(hasPermitFor([PERMIT_USERS_LIST]))

    //  setLoading(true)
  }, [hasPermitFor])

  const formRef = useRef<any>();
  const { authInfo } = useAuthentication();
  const { data: roleData } = useRoles();
  const { userList, refreshData } = useUsers();

  const signupMethodRef = useRef<any>();

  const [selectedUserRow, setSelectedUserRow] = useState<any>(null);

  const [ui, setUi] = useState<any>({
    isLoading: false,
    selectedSignupMethod: null,
  });

  const selectedSignupMethodData =
    authInfo?.org.signupMethods.find(({ key }: any) => {
      return key == ui.selectedSignupMethod;
    }) || authInfo?.org.signupMethods[0];

  const validationRules = combineValidationRules(
    selectedSignupMethodData?.userFields || {}
  );

  const { validate, errors, appendManuallError, clearErrors }: any =
    useValidation(validationRules);

  function handle_clearSelectedRow() {
    clearErrors();
    clearFormInputs(formRef);
    setSelectedUserRow(null);
  }

  async function handle_onRowClick(user: any) {
    if (user.reg_key == null) {
      NotificationController.showError('امکان ویرایش این کاربر وجود ندارد');
      return;
    }
    setUi({ ...ui, selectedSignupMethod: user.reg_key });
    setTimeout(() => {
      clearErrors();
      const formData = {
        ...user,
        ...user.details,
      };
      delete formData.details;
      delete formData.roles;

      fillFormInputs(formRef, formData);

      const nodes = document.querySelectorAll(`[id^="${role_prefix}"]`);
      for (let i = 0; i < nodes.length; i++) {
        const inputNode = nodes[i] as HTMLInputElement;
        inputNode.checked = false;
      }
      user.roles.map((roleId: string) => {
        (
          document.getElementById(`${role_prefix}${roleId}`) as HTMLInputElement
        ).checked = true;
      });
      setSelectedUserRow(user);
    }, 100);
  }

  if (authInfo == null) return <Loader />;

  const isEditing = selectedUserRow != null;

  const handle_submitData = (e: any) => {
    e.preventDefault();

    const formData = readFormInputs(formRef);

    const ignoreFields = [];
    if (isEditing) ignoreFields.push('password');

    const isInvalid = validate(formData, ignoreFields);

    const selectedRoles: any = [];
    const body: any = {};

    const someRoleIsSelected = Object.entries(formData)
      .map((entry) => {
        const [key, value] = entry;
        if (key.startsWith(role_prefix)) {
          if (value == true) {
            selectedRoles.push(key.split('_')[1]);
            return true;
          } else {
            return false;
          }
        } else {
          body[key] = value;
        }
        return false;
      })
      .some((item) => {
        return item;
      });

    if (!someRoleIsSelected) {
      appendManuallError({ role: MSG_PICK_ATLEAST_ONE });
    }

    if (isInvalid || !someRoleIsSelected) return;

    const netArgs = {
      ...body,
      roles: selectedRoles,
      key: selectedSignupMethodData.key,
    };

    const onSuccess = ({ data }: any) => {
      clearFormInputs(formRef);
      clearErrors();
      refreshData();
      setSelectedUserRow(null);
      NotificationController.showSuccess('اطلاعات با موفقیت ثبت شد');
    };

    const onError = (e: any) => {
      NotificationController.showError(e.message);
    };

    if (isEditing) {
      getApiClient()
        .updateUser(selectedUserRow._id, netArgs)
        .then(onSuccess)
        .catch(onError);
    } else {
      getApiClient().createUser(netArgs).then(onSuccess).catch(onError);
    }
  };

  const handle_signupMethodChanged = (e: any) => {
    setUi({ ...ui, selectedSignupMethod: e.target.value });
  };

  return (
    <div className="flex rounded border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="relative w-full p-6 lg:w-1/3">
        <div
          className={classNames('absolute left-5 h-2', {
            hidden: selectedUserRow == null,
          })}
        >
          <BiXCircle
            onClick={handle_clearSelectedRow}
            className="cursor-pointer text-2xl hover:text-danger"
          />
        </div>
        <label
          className={classNames('mb-3 inline-block', {
            hidden: isEditing,
          })}
        >
          {'نوع ثبت نام'}
        </label>
        <select
          className={classNames('select-box mb-4 w-full p-2', {
            hidden: isEditing,
          })}
          ref={signupMethodRef}
          onChange={handle_signupMethodChanged}
        >
          {authInfo?.org?.signupMethods?.map(({ key, title }: any) => {
            return (
              <option key={key} value={key}>
                {title}
              </option>
            );
          })}
        </select>
        <form ref={formRef}>
          {Object.entries(selectedSignupMethodData.userFields).map(
            (entry: any) => {
              const [key, value] = entry;

              const disabled =
                ui.isLoading ||
                (selectedSignupMethodData.userFields[key].editable == false &&
                  isEditing);
              return (
                <div key={key} className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    {value.title}
                    <ErrorMessage message={errors[key]} />
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      name={key}
                      type="text"
                      disabled={disabled}
                      placeholder={`${value.title} را وارد کنید`}
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />

                    <span className="absolute right-2">
                      <BsPersonVcard size={20} className={'text-gray-5'} />
                    </span>
                  </div>
                </div>
              );
            }
          )}

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              شماره همراه
              <ErrorMessage message={errors.phone} />
            </label>
            <div className="relative flex items-center justify-center">
              <input
                type="text"
                name={'phone'}
                disabled={ui.isLoading}
                placeholder="شماره همراه خود را وارد کنید"
                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />

              <span className="absolute right-2">
                <BiMobile size={20} className={'text-gray-5'} />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              رمز ورود
              <ErrorMessage message={errors.password} />
            </label>
            <div className="relative flex items-center justify-center">
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                // disabled={ui.isLoading}
                placeholder="رمز ورود خود را وارد کنید"
                className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />

              <span className="absolute right-2">
                <BiLock size={20} className={'text-gray-5'} />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              وضعیت
              <ErrorMessage message={errors.status} />
            </label>
            <select name="status" className="select-box w-full p-2">
              {userStatusEntries.map((entry) => {
                const [value, text] = entry;
                return <option value={value}>{text}</option>;
              })}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              نقش ها
              <ErrorMessage message={errors.role} />
            </label>

            {roleData?.roles?.map((item: any) => {
              return (
                <span className="inline-flex py-2 pl-4">
                  <label htmlFor={item._id} className="cursor-pointer px-2">
                    {item.title}
                  </label>
                  <input
                    name={`${role_prefix}${item._id}`}
                    id={`${role_prefix}${item._id}`}
                    type="checkbox"
                    className="cursor-pointer"
                  />
                </span>
              );
            })}
          </div>

          <div className="mb-5">
            {permission_SUBMIT === true &&
              <LoaderButton
                isLoading={ui.isLoading}
                onClick={handle_submitData}
                className={
                  'mt-3 w-full cursor-pointer  rounded-lg bg-primary p-2 text-white transition hover:bg-opacity-90'
                }
              >
                {'ثبت نام'}
              </LoaderButton>
            }
            {permission_SUBMIT === false &&
              <LoaderButton
                disabled={true}
                isLoading={ui.isLoading}
                className={
                  'NoPermission mt-3 w-full cursor-pointer  rounded-lg  p-2 text-white transition hover:bg-opacity-90'
                }
              >
                {'ثبت نام'}
              </LoaderButton>
            }

          </div>
        </form>
      </div>

      <div className="lg:w-2/2 hidden p-6 lg:block lg:flex-1">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-2 text-center dark:bg-meta-4">
              <th className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                نام کاربری
              </th>
              <th className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                تلفن
              </th>
              <th className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                نام و نام خانوادگی
              </th>
              <th className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                نقش
              </th>
              <th className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                وضعیت
              </th>
              {authInfo?.org?.userListDetailsDisplayColumns?.map(
                ({ key, title }: any) => {
                  return (
                    <th
                      className="whitespace-pre px-4 py-2 text-sm text-black  dark:text-white"
                      key={key}
                    >
                      {title}
                    </th>
                  );
                }
              )}
            </tr>
          </thead>
          <tbody>
            {userList?.map((item: any) => {
              return (
                <tr
                  onClick={() => handle_onRowClick(item)}
                  key={item._id}
                  className="cursor-pointer text-center hover:bg-gray-4"
                >
                  <td className="px-4 py-2 text-sm text-black dark:text-white">
                    {item.username}
                  </td>
                  <td className="px-4 py-2 text-sm text-black dark:text-white">
                    {item.phone}
                  </td>
                  <td className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                    {item.full_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-black dark:text-white">
                    {item.roles.map((role: any) => {
                      return (
                        <Chips className={'px-3 py-1'}>
                          {
                            roleData?.roles?.find((item: any) => {
                              if (item._id == role) return item;
                            })?.title
                          }
                        </Chips>
                      );
                    })}
                  </td>
                  <td className="whitespace-pre px-4 py-2 text-sm text-black dark:text-white">
                    {Object.fromEntries(userStatusEntries)[item.status]}
                  </td>
                  {authInfo?.org?.userListDetailsDisplayColumns?.map(
                    ({ key }: any) => {
                      return (
                        <td
                          className="px-4 py-2 text-sm text-black dark:text-white"
                          key={key}
                        >
                          {item.details?.[key]}
                        </td>
                      );
                    }
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManager;
