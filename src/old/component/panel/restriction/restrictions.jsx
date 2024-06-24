import React, { useState, useRef, useEffect } from 'react';
import httpService from '../../../services/httpService';
import { Box, Button, Center, Container, InputWrapper, Table, Text } from '@mantine/core';
import { TimeInput } from "@mantine/dates";
import { NumberInput } from '@mantine/core';
import styles from './PanelRestricted.module.css';
import { Clock, Edit } from "tabler-icons-react";
import MyModal from '../../../components/common/modal';
import { ErrorToast, SucccessToast } from '../../../components/common/errorToast';
import settings from '../../../config';
import useSWR from 'swr';
import { IsoToJalaliWithTime } from '../../../utils/dateTools';

const Restrictions = () => {
  const header = (
    <tr>
      <th className='text-center'></th>
      <th className='text-right'>عنوان</th>
      <th className='th-center text-center'>  مقدار فعلی </th>
      <th className='th-center text-center'>  واحد </th>
    </tr>
  );

  const [restrictions, setRestrictions] = useState();
  const [rows, setRows] = useState();
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState()

  const {
    data: restrictionsList,
    error: restrictionError,
    mutate: mutateRestrictions,
  } = useSWR([settings.apiUrl + "/restriction"], httpService.get, {
    revalidateOnFocus: false,
  });

  const onEdit = (item) => {
    setItem(item)
    setShowModal(true)
  }

  const onRestrictionChange = (value, type) => {
    if (type === 'number') {
      item.value = value;
      setItem({ ...item })
    } else {
      item.value = IsoToJalaliWithTime(value.toISOString()).split(' ')[1];
      setItem({ ...item })
    }
  }

  const handleSubmit = async (item) => {
    try {
      await httpService.post(`${settings.apiUrl}/restriction`, { key: item?.key, value: item?.value });
      SucccessToast({ message: "محدودیت با موفقیت افزوده شد" })
      setShowModal(false);
      mutateRestrictions()
    } catch (error) {
      ErrorToast({ message: "خطا در دریافت جزییات" });
    }
  }

  useEffect(() => {
    setRestrictions(restrictionsList?.data?.docs);
    console.log(restrictionsList?.data?.docs);
  }, [restrictionsList])

  useEffect(() => {
    setRows(restrictions?.map((element) => (
      <tr key={element.name} className="table-row">
        <td>
          <div className='clickable'>
            <Edit
              size={25}
              strokeWidth={1}
              onClick={() => onEdit(element)}
              className="edit-icon"
            />
          </div>
        </td>
        <td style={{ textAlign: "right" }}>{element.title}</td>
        <td>{element.value || 'ثبت نشده'}</td>
        <td>{element?.unit}</td>
      </tr>
    )))
  }, [restrictions])

  return (
    <Container className={styles.mainContainer}>
      <Box
        sx={(theme) => ({
          padding: theme.spacing.xl,
        })}
      >

        <h1 className="my-4">محدودیت ها</h1>

        <Table className=''>
          <thead className='text-center'>{header}</thead>
          <tbody className='text-center'>{rows}</tbody>
        </Table>

        <MyModal
          show={showModal}
          title={item?.title}
          onSave={() => handleSubmit(item)}
          onHide={() => {
            setShowModal(false)
            setItem()
          }}
          saveButtonTitle="ذخیره"
          size='md'
          body={item && <RenderModalBody onRestrictionChange={onRestrictionChange} item={item} />}
        />
      </Box>

    </Container>
  );
};


function RenderModalBody({ item, onRestrictionChange }) {
  const { key, type, desc, value } = item;
  if (type === 'time')
    return <>
      <InputWrapper className={styles.inputWrapper} style={{ border: "none" }} description={desc}>
        <TimeInput
          dir="ltr"
          onChange={(e) => onRestrictionChange(e, type)}
          name="timeInput"
          icon={<Clock size={16} />}
          timePlaceholder='12'
        />
      </InputWrapper>
    </>
  else if (type === 'number')
    return <>
      <InputWrapper style={{ border: "none" }} description={desc}>
        <NumberInput
          name='numberInput'
          id="numberInput"
          onChange={(e) => onRestrictionChange(e, type)}
          defaultValue={value}
          placeholder='30 دقیقه'
          step={1}
          hideControls />
      </InputWrapper>
    </>
  else return null
}

export default Restrictions;