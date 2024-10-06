import { BiLock, BiMobile, BiXCircle } from 'react-icons/bi';
import './style.scss'
import LoaderButton from '../../../components/LoaderButton';
import ErrorMessage from '../../Form/FormErrorMessage';
import { BsPersonVcard } from 'react-icons/bs';
import { HiOutlineUser } from 'react-icons/hi';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import useAuthentication from '../../../hooks/data/useAuthentication';
import Loader from '../../../common/Loader';
import useRoles from '../../../hooks/data/useRoles';
import useUsers from '../../../hooks/data/useUsers';
import {
  clearFormInputs,
  fillFormInputs,
  readFormInputs,
} from '../../../lib/form';
import useValidation from '../../../hooks/useValidation';
import {
  MSG_MIN_LENGTH,
  MSG_PICK_ATLEAST_ONE,
  MSG_REQUIRED_FIELD,
  translateDetailKey,
  userStatusEntries,
} from '../../../lib/string';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';
import Chips from '../../../components/Chips';


import useCurrentUserPermissions from '../../../hooks/useCurrentUserPermissions';
import {
  PERMIT_USERS_CREATE,
  PERMIT_USERS_EDIT,
  PERMIT_USERS_DELETE,
  PERMIT_USERS_LIST
} from '../../../lib/constants'
import DataGrid from '../../../components/DataGrid/DataGrid';

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
  // console.log(21);

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

  const processUserList = (userList: any[], roleData: any) => {
    return userList.map(user => {
      // Map roles to get an array of role titles
      const rolesTitlesArray = user.roles.map((role: any) => {
        const roleTitle = roleData?.roles?.find((item: any) => item._id === role)?.title;
        return roleTitle;
      });

      // Join role titles with a space
      const rolesTitle = rolesTitlesArray.join(' ');

      // Map roles to include id and title
      const rolesWithIdAndTitle = user.roles.map((role: any) => {
        const roleTitle = roleData?.roles?.find((item: any) => item._id === role)?.title;
        return {
          id: role,
          title: roleTitle,
        };
      });

      // Translate status to Persian
      let statusText = '';
      if (user.status === 'ACTIVE') {
        statusText = 'فعال';
      } else {
        statusText = 'غیر فعال';
      }

      // Return updated user object with rolesTitle, roles, and statusText
      return {
        ...user,
        rolesTitle: rolesTitle,
        status: statusText,
      };
    });
  };



  useEffect(() => {
    //console.log(4, userList);

    if (userList && roleData) {
      const k = processUserList(userList, roleData);
      // console.log(100, k);

    }
  }, [userList])

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
    console.log(75, user);

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

  const options = [{ id: 1, value: 10 }, { id: 2, value: 30 }, { id: 3, value: 50 }]
  const thead = [
    { key: '', name: '- update -' },
    { key: 'username', name: 'نام کاربری' },
    { key: 'phone', name: 'تلفن' },
    { key: 'full_name', name: 'نام و نام خانوادگی' },
    { key: 'rolesTitle', name: 'نقش' },
    { key: 'status', name: 'وضعیت' },
    // { key: 'startDate', name: 'تاریخ شروع ', type: 'caleadar', key2: 'fromdate' },
    // { key: 'endDate', name: 'تاریخ پایان', type: 'caleadar', key2: 'todate' },

  ]


  return (
    <>
      <div className="UsersManager-component">
        <div className="row">
          <div className="col-12 col-md-4 order-2 order-md-1">
            <div className="right">
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
              {!isEditing &&
                <div>
                  <label>
                    {'نوع ثبت نام'}
                  </label>
                  <select className='form-control'
                    disabled={import.meta.env.VITE_CUSTOMER_NAME == 'zarghan' ? true : false}
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
                </div>
              }

              <form ref={formRef}>
                {Object.entries(selectedSignupMethodData.userFields).map(
                  (entry: any) => {
                    const [key, value] = entry;

                    const disabled =
                      ui.isLoading ||
                      (selectedSignupMethodData.userFields[key].editable == false &&
                        isEditing);
                    return (
                      <div className='div-li' key={key}>
                        <label>
                          {value.title}
                          <ErrorMessage message={errors[key]} />
                        </label>
                        <div className='have-icon'>
                          <input
                            className='form-control'
                            name={key}
                            type="text"
                            disabled={disabled}
                            placeholder={`${value.title} را وارد کنید`}
                          />
                          <i className='fa fa-user icon'></i>
                        </div>
                      </div>
                    );
                  }
                )}

                <div className='div-li'>
                  <label>
                    شماره همراه
                    <ErrorMessage message={errors.phone} />
                  </label>
                  <div className='have-icon'>
                    <input
                      className='form-control'
                      type="text"
                      name={'phone'}
                      disabled={ui.isLoading}
                      placeholder="شماره همراه خود را وارد کنید"
                    />
                    <i className='fa fa-phone icon'></i>
                  </div>
                </div>

                <div className='div-li'>
                  <label>
                    رمز ورود
                    <ErrorMessage message={errors.password} />
                  </label>
                  <div className='have-icon'>
                    <input
                      className='form-control'
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      // disabled={ui.isLoading}
                      placeholder="رمز ورود خود را وارد کنید"
                    />
                    <i className='fa fa-key icon'></i>
                  </div>
                </div>

                <div className='div-li'>
                  <label>
                    وضعیت
                    <ErrorMessage message={errors.status} />
                  </label>
                  <select className='form-control' name="status">
                    {userStatusEntries.map((entry) => {
                      const [value, text] = entry;
                      return <option value={value}>{text}</option>;
                    })}
                  </select>
                </div>

                <div className='div-li'>
                  <label>
                    نقش ها
                    <ErrorMessage message={errors.role} />
                  </label>

                  {roleData?.roles?.map((item: any) => {
                    return (
                      <div>
                        <label htmlFor={item._id}>
                          {item.title}
                        </label>
                        <input
                          name={`${role_prefix}${item._id}`}
                          id={`${role_prefix}${item._id}`}
                          type="checkbox"
                        />
                      </div>
                    );
                  })}
                </div>

                <div>
                  {permission_SUBMIT === true &&
                    <div>
                      {/* {ui.isLoading} */}
                      <button className='my-btn' onClick={handle_submitData}>
                        {'ثبت نام'}
                      </button>
                    </div>
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
          </div>
          <div className="col-12 col-md-8 order-1 order-md-2">
            {userList && roleData && authInfo &&
              <DataGrid
                pagesize={options[0].value}
                items={processUserList(userList, roleData)}
                options={options}
                thead={thead}
                clickOnRow={handle_onRowClick}
              />}
            {/* <table className='table table-hover'>
              <thead>
                <tr>
                  <th>
                    نام کاربری
                  </th>
                  <th>
                    تلفن
                  </th>
                  <th>
                    نام و نام خانوادگی
                  </th>
                  <th>
                    نقش
                  </th>
                  <th>
                    وضعیت
                  </th>
                  {authInfo?.org?.userListDetailsDisplayColumns?.map(
                    ({ key, title }: any) => {
                      return (
                        <th key={key} >{title} </th>
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
                      key={item._id}>
                      <td >
                        {item.username}
                      </td>
                      <td >
                        {item.phone}
                      </td>
                      <td>
                        {item.full_name}
                      </td>
                      <td >
                        {item.roles.map((role: any) => {
                          return (
                            <Chips>
                              {
                                roleData?.roles?.find((item: any) => {
                                  if (item._id == role) return item;
                                })?.title
                              }
                            </Chips>
                          );
                        })}
                      </td>
                      <td>
                        {Object.fromEntries(userStatusEntries)[item.status]}
                      </td>
                      {authInfo?.org?.userListDetailsDisplayColumns?.map(
                        ({ key }: any) => {
                          return (
                            <td
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
            </table> */}
          </div>
        </div>
      </div >





    </>
  );
};

export default UsersManager;
