import { Password } from 'tabler-icons-react';
import { getApiClient } from '../../apis/client';
import useAuthentication from '../../hooks/data/useAuthentication';
import useUsers from '../../hooks/data/useUsers';
import { NotificationController } from '../../lib/notificationController';
import { useValidateForm } from '../../utils/validation';
import './style.scss'
import React, { useEffect, useState } from 'react';





const validationRules: any = {
  "phone": {
    required: true,
    showName: ''
  },
  "password": {
    required: true,
    min:6,
    showName: ''
  }
};

const Profile = () => {

  const { authInfo } = useAuthentication();
  const { userList } = useUsers();

  const [fields, setFields] = useState<Partial<any>>();
  //validate
  const { errors: validateErrors, refreshData: validateRefreshData } = useValidateForm(validationRules, fields)

  useEffect(() => {
    
    
    if (authInfo && userList) {
      const user = userList?.filter((ite: any) => ite._id === authInfo?.auth?._id)
      setFields(user[0])
     // console.log(52200,user[0]);
    }
  }, [authInfo])

  useEffect(() => {
  }, [fields])

  const onSuccess = () => {
    setFields({ ...fields, password: '' })
    NotificationController.showSuccess('اطلاعات با موفقیت ثبت شد');
  };

  const onError = (e: any) => {
    NotificationController.showError(e.message);
  };

  const handleSubmit = () => {
    let updateInfo = {
      phone: fields?.phone,
      password:fields?.password,
    }

    getApiClient()
    .updateUser(fields?._id, updateInfo)
    .then(onSuccess)
    .catch(onError);
  };

  return (
    <div className="container-fluid mt-5 profile-component">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <div className="card">
            <div className="page-title">
              <i> {'پروفایل'}</i>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label"> نام :   </label>
                <span> {fields?.fullname}</span>
              </div>
              <div className="mb-3">
                <label className="form-label">کد پرسنلی :</label>
                <span> {fields?.username}</span>
              </div>
              <div className="mb-3">
                <label className="form-label">شماره موبایل</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                  value={fields?.phone || ''}
                  placeholder='09123456789'
                  autoComplete="off"
                />
                {validateErrors['phone']?.length > 0 &&
                  <>
                    <div className='validate'>
                      <i className='fa fa-exclamation-triangle'></i>
                      <div className='error-msg'> {validateErrors['phone']?.map((error: any) => { return <p>{error}</p> })} </div>
                    </div>
                  </>
                }
              </div>
              {/* <div className="mb-3">
                <label className="form-label">رمز عبور فعلی</label>
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setFields({ ...fields, currentPassword: e.target.value })}
                  value={fields?.currentPassword || ''}
                  required
                  placeholder='رمز عبور فعلی'
                />
                {validateErrors['currentPassword']?.length > 0 &&
                  <>
                    <div className='validate'>
                      <i className='fa fa-exclamation-triangle'></i>
                      <div className='error-msg'> {validateErrors['currentPassword']?.map((error: any) => { return <p>{error}</p> })} </div>
                    </div>
                  </>
                }
              </div> */}
              <div className="mb-3">
                <label className="form-label">رمز عبور جدید</label>
                <input
                  type="password"
                  className="form-control"
                  onChange={(e) => setFields({ ...fields, password: e.target.value })}
                  value={fields?.password}
                  required
                  placeholder='رمز عبور جدید'
                  autoComplete="off"
                />
                {validateErrors['password']?.length > 0 &&
                  <>
                    <div className='validate'>
                      <i className='fa fa-exclamation-triangle'></i>
                      <div className='error-msg'> {validateErrors['password']?.map((error: any) => { return <p>{error}</p> })} </div>
                    </div>
                  </>
                }
              </div>
              <div className="d-grid">
                <button
                  disabled={Object.keys(validateErrors).length === 0 ? false : true}
                  onClick={() => handleSubmit()}
                  className={`my-btn ${Object.keys(validateErrors).length === 0 ? '' : `my-btn-inactive`}`}>
                  ثبت</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
