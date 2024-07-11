import { MdDelete, MdEdit } from 'react-icons/md';
import './style.scss'
import TreeView from '../../../components/TreeView';
import useRoles from '../../../hooks/data/useRoles';
import { useState, useRef } from 'react';
import CheckboxFive from '../../../components/CheckboxFive';
import { BiCheck, BiCheckCircle } from 'react-icons/bi';
import { getApiClient } from '../../../apis/client';
import { NotificationController } from '../../../lib/notificationController';
import useConfirmModal from '../../../hooks/useConfirmModal/useConfirmModal';
import classNames from 'classnames';
import { translateAction } from '../../../utils/utils';

const DEFAULT_NEW_ROLE_STATE: any = {
  inputActive: false,
  inputValue: '',
  activeEditModeFor: null,
};

const RoleActions = () => {
  const { data, refreshRoles } = useRoles();

  //console.log(300, data);

  const permissionsTreeData = convertPermissionsData('', data.permissions);

  const [newRoleState, setNewRoleState] = useState(DEFAULT_NEW_ROLE_STATE);

  const [selectedRole, setSelectedRole] = useState<any>(null);

  const { show: showConfirm, ui: ModalUi } = useConfirmModal(null);

  function updateSelectedRole() {
    if (selectedRole == null) return;
    const roleId = selectedRole.id;
    setSelectedRole(null);
    updateRole(roleId, null);
  }

  function updateActiveRole() {
    const roleTitle = newRoleState.inputValue;
    const roleId = newRoleState.activeEditModeFor as string;
    setNewRoleState(DEFAULT_NEW_ROLE_STATE);
    if (roleTitle.trim().length == 0) return;

    updateRole(roleId, roleTitle);
  }

  function updateRole(roleId: string, roleTitle: string | null) {
    const body: any = {
      permissions: getSelectedRoles(),
      auto_assign_rules: [],
    };
    if (roleTitle != null) {
      body.title = roleTitle.trim();
    }
    getApiClient()
      .editRole(roleId, body)
      .then(({ data }) => {
        NotificationController.showSuccess('نقش با موفقیت ویرایش شد');
        refreshRoles();
      })
      .catch((e) => {
        NotificationController.showError(e.message);
      });
  }

  function submitNewRole() {
    const roleTitle = newRoleState.inputValue;
    setNewRoleState(DEFAULT_NEW_ROLE_STATE);
    if (roleTitle.trim().length == 0) return;

    const body = {
      title: roleTitle.trim(),
      permissions: getSelectedRoles(),
      auto_assign_rules: [],
    };

    getApiClient()
      .createRole(body)
      .then(({ data }) => {
        NotificationController.showSuccess('نقش جدید ایجاد شد');
        refreshRoles();
      })
      .catch((e) => {
        NotificationController.showError(e.message);
      });
  }

  function checkboxId(id: string) {
    return `roles_${id}`;
  }

  function handle_editRole(item: any) {
    handle_onRoleClick(item);
    setNewRoleState({
      ...newRoleState,
      inputValue: item.title,
      activeEditModeFor: item.id,
    });
  }

  function handle_deleteRole(item: any) {
    getApiClient()
      .deactiveRole(item.id)
      .then(({ data }) => {
        NotificationController.showSuccess('نقش مورد نظر حذف گردید');
        refreshRoles();
      })
      .catch((e) => {
        NotificationController.showError(e.message);
      });
  }

  function handle_deleteRoleModal(item: any) {
    showConfirm({
      title: 'حذف نقش',
      desc: `آیا از حذف نقش ${item.title} اطمینان دارید?`,
      label_confirm: 'حذف کن!',
      label_cancel: 'خیر',
      onConfirm: () => handle_deleteRole(item),
    });
  }

  function handle_activateNewRole() {
    clearCheckboxes();
    setNewRoleState({ ...newRoleState, inputActive: true });
  }

  function handle_checkChange(e: any, item: any) {
    const parentCheckbox = document.getElementById(
      checkboxId(item.id)
    ) as HTMLInputElement;
    const childrenValue = parentCheckbox?.checked;

    const childBoxes = document.querySelectorAll(
      `[id^="${checkboxId(item.id)}."]`
    );
    for (let i = 0; i < childBoxes.length; i++) {
      const input = childBoxes[i] as HTMLInputElement;
      input.indeterminate = false;
      input.checked = childrenValue;
    }

    const splittedIds = item.id.split('.');
    splittedIds.pop();

    do {
      const siblingBoxes = document.querySelectorAll(
        `[id^="${checkboxId(splittedIds.join('.'))}."]`
      );
      const siblingValues = [];
      for (let i = 0; i < siblingBoxes.length; i++) {
        const input = siblingBoxes[i] as HTMLInputElement;
        siblingValues.push(input.checked);
      }
      const someSiblingsAreFalse = siblingValues.some(
        (value) => value == false
      );
      const someSiblingsAreTrue = siblingValues.some((value) => value == true);
      const allSiblingsAreFalse = siblingValues.every(
        (value) => value == false
      );
      const allSiblingsAreTrue = siblingValues.every((value) => value == true);

      const ancestorBox = document.getElementById(
        `${checkboxId(splittedIds.join('.'))}`
      );
      const input = ancestorBox as HTMLInputElement;

      if (input != null) {
        if (someSiblingsAreFalse && someSiblingsAreTrue)
          input.indeterminate = someSiblingsAreFalse;
        else input.indeterminate = false;

        if (allSiblingsAreTrue) input.checked = true;

        if (allSiblingsAreFalse) input.checked = false;
      }

      splittedIds.pop();
    } while (splittedIds.length > 0);
  }

  function getSelectedRoles() {
    const checkedIds = [];
    const allCheckboxes = document.querySelectorAll(
      `[id^="${checkboxId('')}"]`
    );
    for (let i = 0; i < allCheckboxes.length; i++) {
      const input = allCheckboxes[i] as HTMLInputElement;
      if (input.checked) {
        checkedIds.push(input.id.split('roles_')[1]);
      }
    }
    return checkedIds;
  }

  function clearCheckboxes() {
    const allCheckboxes = document.querySelectorAll(
      `[id^="${checkboxId('')}"]`
    );
    for (let i = 0; i < allCheckboxes.length; i++) {
      const input = allCheckboxes[i] as HTMLInputElement;
      input.checked = false;
    }
  }

  function handle_onRoleClick(item: any) {


    clearCheckboxes();
    setSelectedRole(item);


    item.permissions.map((permission_key: string) => {

      const element = document.getElementById(
        `${checkboxId(permission_key)}`
      ) as HTMLInputElement;

      //  console.log(78, element);
      const ariaIsRootWithExpanded = element.getAttribute('aria-expanded');

      if (ariaIsRootWithExpanded !== 'true') {
        //  console.log(77, element);
        element.checked = true;
      }
      handle_checkChange(null, { id: permission_key });
    });
  }

  return (
    <div className="RoleActions-component">
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="right">
            <table className="w-full border-l border-gray-4">
              <thead className="border-b border-gray-4">
                <tr>
                  <th colSpan={2} className="px-2 pb-2 pt-4 text-center text-sm">
                    <button
                      onClick={handle_activateNewRole}
                      className=" border-px mx-6 rounded-md border-primary bg-primary px-6 py-1 text-white dark:border-boxdark"
                    >
                      {'ایجاد نقش جدید'}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.roles?.map((item: any) => {
                  if (newRoleState.activeEditModeFor == item.id) {
                    return (
                      <tr>
                        <td colSpan={2}>
                          <div className="relative">
                            <input
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  event.preventDefault();
                                  updateActiveRole();
                                }
                              }}
                              autoFocus={true}
                              onChange={(e) =>
                                setNewRoleState({
                                  ...newRoleState,
                                  inputValue: e.target.value,
                                })
                              }
                              value={newRoleState.inputValue}
                              className="w-full border-2 border-primary py-3 pl-14 pr-3 outline-none"
                            />
                            <BiCheck
                              onClick={updateActiveRole}
                              className={
                                'absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-4xl hover:text-success'
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr
                      onClick={() => handle_onRoleClick(item)}
                      key={item._id}
                      className={classNames({
                        'cursor-pointer hover:bg-gray-2':
                          selectedRole?.id != item.id,
                        'cursor-pointer bg-gray-4': selectedRole?.id == item.id,
                      })}
                    >
                      <td className="text-md p-3">{item.title}</td>
                      <td className="flex justify-end p-3 text-left">
                        {item.is_static == false && (
                          <>
                            <MdEdit
                              onClick={() => handle_editRole(item)}
                              size={30}
                              className="mx-1 cursor-pointer rounded-full p-1.5 hover:bg-gray-4"
                            />
                            <MdDelete
                              onClick={() => handle_deleteRoleModal(item)}
                              size={30}
                              className="mx-1 cursor-pointer rounded-full p-1.5 hover:bg-gray-4 hover:text-danger"
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {newRoleState.inputActive && (
              <div className="relative">
                <input
                  onBlur={() => {
                    submitNewRole();
                    setNewRoleState(DEFAULT_NEW_ROLE_STATE);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      submitNewRole();
                    }
                  }}
                  autoFocus={true}
                  onChange={(e) =>
                    setNewRoleState({ ...newRoleState, inputValue: e.target.value })
                  }
                  value={newRoleState.inputValue}
                  className="w-full border-2 border-primary py-3 pl-14 pr-3 outline-none"
                />
                <BiCheck
              /*onClick={submitNewRole}*/ className={
                    'absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-4xl hover:text-success'
                  }
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="left">
            <div className="border-b border-gray-4 px-2 pb-2 pt-4 text-right text-sm">
              <button
                onClick={updateSelectedRole}
                className="border-px rounded-md border-primary bg-white px-6 py-1 text-primary hover:bg-gray dark:border-boxdark"
              >
                {'ذخیره'}
              </button>
            </div>
            <div className="p-3">
              <TreeView
                checkboxId={checkboxId}
                handle_checkChange={handle_checkChange}
                data={{ children: permissionsTreeData }}
              />
            </div>
          </div>
        </div>
      </div>

      {ModalUi}
    </div>


  );
};

function convertPermissionsData(prefix: string, permissions: any) {
  const permissionEntries = Object.entries(permissions);

  const children: any = permissionEntries.map((entry) => {
    const [key, value] = entry;
    const valueIsString = typeof value === 'string' || value instanceof String;
    const id = prefix == '' ? key : `${prefix}.${key}`;
    return {
      id,
      title: translateAction(key),
      children: valueIsString ? null : convertPermissionsData(id, value),
    };
  });
  return children;
}



export default RoleActions;
