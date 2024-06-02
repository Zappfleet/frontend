
import './style.scss'
import { BiCheck, BiX } from 'react-icons/bi';
import Chips from '../../components/Chips';
import usePermittedUsers from '../../hooks/data/usePermittedUsers';
import { useState, useRef, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';

import classNames from 'classnames';
import { render } from 'react-dom';
import renderUi from '../../lib/renderUi';
import SuggestionTextInput from '../SuggestionTextInput';

export default function UsersSuggestionInput(props: any) {
  const {
    permissions,
    freeInput,
    showListOnTop = true,
    externalState,
    include_external_base,
    search_all
  } = props;

    
  const { refreshData: fetchUserData }: any = usePermittedUsers({
    permissions,
    include_external_base,
    search_all,
  });

  const innerState = useState<any>(props.value || []);

  const selectedUsers =
    externalState != null ? externalState[0] : innerState[0];
  const setSelectedUsers =
    externalState != null ? externalState[1] : innerState[1];

  const suggestionTextInputRef = useRef<any>();

  useEffect(() => {
    if (props.onChange != null)
      props.onChange({ target: { name: props.name, value: selectedUsers } });
  }, [selectedUsers]);

  const handle_onFreeConfirm = (value: string) => {
    if (!freeInput || value.trim().length == 0) return;
    setSelectedUsers([
      ...selectedUsers,
      {
        is_free: true,
        full_name: value.trim(),
        _id: new Date().getTime().toString(),
      },
    ]);
  };

  const readPermittedUsers = async function readPermittedDrivers(
    search: string
  ): Promise<any[]> {
    return new Promise((resolve, reject) =>
      fetchUserData(search).then(resolve).catch(reject)
    );
  };

  const handle_remove = (user: any) => {
    setSelectedUsers(
      selectedUsers.filter((item: any) => {
        return user._id != item._id;
      })
    );
    props.onChipsItemRemoved?.(user);
  };

  const handle_userSelected = (user: any) => {
    if (
      selectedUsers.find((item: any) => {
        return item._id == user._id;
      }) != null
    )
      return;
    setSelectedUsers([...selectedUsers, user]);
  };

  return (
    <div className='UsersSuggestionInput-component'>
      <div className="search-users">
        {freeInput===true && (
          <MdAdd
            onClick={suggestionTextInputRef.current?.triggerConfirm}
            className={
              'mx-2 cursor-pointer rounded bg-primary text-white shadow'
            }
            size={36}
          />
        )}

        <SuggestionTextInput
          componentRef={suggestionTextInputRef}
          wrapperClassName={'flex-1'}
          showListOnTop={showListOnTop}
          onSuggestionSelected={handle_userSelected}
          onFreeConfirm={handle_onFreeConfirm}
          placeholder="جستجو ..."
          readFromDataSource={readPermittedUsers}
          suggestionRenderer={(item) => (
            <div>{item.full_name}</div>
          )}
        />
      </div>
      <div className={classNames({ hidden: props.hideChips })}>
        <UserSelectionRender
          smallChips={props.smallChips}
          list={props.value || selectedUsers}
          onChipsItemClick={props.onChipsItemClick}
          handleRemove={props.handle_remove || handle_remove}
        />
      </div>
    </div>
  );
}

export function UserSelectionRender({
  list,
  onChipsItemClick,
  handleRemove,
  smallChips,
  highlights,
}: any) {
  return (
    <>
      <div className="UsersSuggestionInput-component">
        <div className='selected-user'>
          {list.map((user: any) => {
            return (
              <Chips
                className={classNames('duration-300', {
                  '!bg-gray-5': user.is_free,
                  '!bg-secondary': user.is_external,
                  'cursor-pointer': onChipsItemClick != null,
                  '!py-0': smallChips,
                  'border-4 border-transparent': highlights != null,
                  '!border-highlight':
                    highlights?.find((item: any) => {
                      return item._id == user._id;
                    }) != null,
                })}
                key={user._id}
              >
                <span
                  onClick={(e) => {
                    onChipsItemClick?.(user);
                  }}
                  className="flex items-center justify-center"
                >
                  <BiX
                    onClick={(e: any) => {
                      e.stopPropagation();
                      handleRemove(user);
                    }}
                    className="cursor-pointer pr-2"
                    size={32}
                  />
                  <span
                    className={classNames('pl-4 pr-1', {
                      'text-xl': !smallChips,
                      'text-sm': smallChips,
                    })}
                  >
                    {user.full_name}
                  </span>
                </span>
              </Chips>
            );
          })}
        </div>
      </div>

    </>
  );
}
