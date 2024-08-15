import React, { useEffect, useState } from 'react';
import './DataGridStyle.scss'
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import {
    persianDateToGregorian,
    secondsToHMS,
    convertToJalaliDateTiem,
    convertPersianToEnglishDigits
} from '../../utils/utils.js';
import Alert from '../Alert/Alert.js';


const DataGrid = (props: any) => {

     //  console.log(66666666, props.thead);

    const [currentPage, setcurrentPage] = useState(1)
    const [pagesize, setpagesize] = useState(props.pagesize)
    const numOfshow = 10
    const totalPages = ((props.items.length) / pagesize) > (Math.ceil((props.items.length) / pagesize)) ? Math.ceil((props.items.length) / pagesize) + 1 : Math.ceil((props.items.length) / pagesize)
    const [Flag, setFlag] = useState(false)
    const [changeFlag, setChangeFlag] = useState(false)
    const [filterCriteria, setFilterCriteria] = useState({})
    const [copyItems, setCopyItems] = useState<any[]>(props.items.slice(0, pagesize))
    const [searchGrid, setSearchGrid] = useState('')

    const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false)
    const [deleteItem, setDeleteItem] = useState<any>(null)


    const showOptions = props.options.map((item: any) => {
        return <option key={item.id} value={item.value}>
            {item.value}
        </option>
    })

    const [fromdate, setFromDateate] = useState(null);
    const [todate, setTodate] = useState(null);

    const clearDate = (headerKey: any, key2: any) => {
        if (key2 === 'fromdate') {
            setFromDateate(null);
        }
        if (key2 === 'todate') {
            setTodate(null)
        }
        handleHeaderSearch('', headerKey); // Replace 'dateKey' with the actual key
    };


    const handleDateChange = (date: any, headerKey: any, key2: any) => {
        if (key2 === 'fromdate') {
            setFromDateate(date);
            const formattedDate = date ? date.format('YYYY/MM/DD') : '';
            console.log(1452, formattedDate, headerKey);

            handleHeaderSearch(convertPersianToEnglishDigits(formattedDate), headerKey); // Replace 'dateKey' with the actual key you want to filter by

        }
        if (key2 === 'todate') {
            setTodate(date)
            const formattedDate = date ? date.format('YYYY/MM/DD') : '';
            handleHeaderSearch(convertPersianToEnglishDigits(formattedDate), headerKey); // Replace 'dateKey' with the actual key you want to filter by

        }

    };


    const showThead = props.thead.map((item: any) => {
        return item.key === '' ? <th></th> :
            <th>
                <div className={`tr-thead`} >
                    {item.name}
                    <a href='#' onMouseDown={(e) => { setcountForSort(countForSort + 1); handleSort(e, item.key, countForSort) }}><i className='fa fa-sort sort-i'></i></a>
                    {item.type === 'caleadar' &&
                        <>
                            <div style={{ position: 'relative' }}>
                                <DatePicker
                                    onFocusedDateChange={(date) => handleDateChange(date !== null ? (Array.isArray(date) ? date[0] : date) : null, item.key, item.key2)}
                                    calendar={persian}
                                    locale={persian_fa}
                                    className="datetime-picker iscalendar"
                                    inputClass="datetime-input !text-center !text-lg !p-4"
                                    value={item.key2 === 'fromdate' ? fromdate : todate}
                                    placeholder='تاریخ'
                                    editable={false}  // Ensure the input is not editable directly

                                />

                                {fromdate && <i className='fa fa-remove calendar-close' onClick={() => clearDate(item.key, item.key2)}></i>}
                            </div>
                        </>
                    }

                    {item.type !== 'caleadar' &&
                        <input onChange={(e) => handleHeaderSearch(e.target.value, item.key)} className="form-control" type="search" placeholder="جستجو" aria-label="Search" />
                    }
                </div>
                <div className="header-column-resize"></div>
            </th>
    })

    const handleDataGridDelete = (resp: any) => {
        if (resp === true) {
            deleteItem && props.clickOnRow(deleteItem, 'delete')
        }
        setDeleteItem(null)
        setShowDeleteAlert(false)
    }

    const showbody = copyItems.map(item => {
        return <tr key={item.id}>
            {props.thead.map((hitem: any, index: number) => {
                if (hitem.key === '') {
                    return (
                        <td>
                            {hitem.name.includes("delete") &&
                                <i onClick={() => { setDeleteItem(item); setShowDeleteAlert(true) }}
                                    className='fa fa-trash row-delete' ></i>
                            }
                            {hitem.name.includes("update") &&
                                <i onClick={() => props.clickOnRow(item, 'update')} className='fa fa-pencil row-edit' ></i>
                            }
                            {hitem.name.includes("view") &&
                                <i onClick={() => props.clickOnRow(item, 'view')} className='fa fa-eye row-delete' ></i>
                            }
                        </td>
                    );
                }
                if (hitem.key === "name") {
                    return (
                        <td key={index}>
                            {(hitem.img === undefined || (hitem?.img && hitem?.img !== false)) && <img className='tbody-img' src={item.img} alt={item.name} data-csiid="17" data-atf="1" />}
                            <span>{item.name}</span>
                        </td>
                    );
                }
                return <td key={index}>{item[hitem.key]}</td>;
            })}
            {/* Uncomment or add more <td> elements as needed */}
            {/* <td>{item.startDate}</td> */}
            {/* <td>{item.endDate}</td> */}
            {/* <td>{item.time}</td> */}
        </tr>
    });


    useEffect(() => {
        setCopyItems(props.items.slice(0, props.pagesize))
    }, [props.items])
    useEffect(() => {
        //  console.log(96, copyItems);

    }, [copyItems])

    useEffect(() => {
        // console.log(44, pagesize);

        const startIndex = (currentPage - 1) * pagesize;
        const endIndex = startIndex + parseInt(pagesize.toString());
        //  console.log(11, startIndex, pagesize, endIndex);

        const pageItems = props.items.slice(startIndex, endIndex);
        setCopyItems(pageItems);

    }, [pagesize, currentPage])

    useEffect(() => {
        // all filter
        const filterData = (item: any) => {
            return Object.values(item).some((value: any) => {
                if (searchGrid === '' || searchGrid === undefined) {
                    return true // No filter, include the item
                }
                return (value.toString() ?? '').toLowerCase().includes(searchGrid)
            }
            );
        }
        // Filter the data based on the search query
        const filteredDataAll = copyItems && copyItems.filter(filterData);

        //filter based on columns
        const filteredData = filteredDataAll && filteredDataAll.filter((item: any) => {
            // Check each filter field dynamically
            return Object.entries(filterCriteria).every(([key, value]) => {

                console.log(5522, value);

                if (value === '') {
                    return true; // No filter, include the item
                }
                const itemValue = item[key] as string; // Assuming all values are strings
                if (itemValue === undefined) {
                    return true; // Field doesn't exist in item, include it
                }
                const filterValue = value as string; // Assuming filter value is a string
                const lowerCaseItemValue = itemValue.toLowerCase();
                const lowerCaseFilterValue = filterValue.toLowerCase();
                const lowerCaseSearchGrid = (searchGrid ?? '').toLowerCase();
                if (searchGrid !== '' && searchGrid !== undefined) {
                    return lowerCaseItemValue.includes(lowerCaseFilterValue) && lowerCaseItemValue.includes(lowerCaseSearchGrid);
                }
                return lowerCaseItemValue.includes(lowerCaseFilterValue);
            });
        });

        const startIndex = (currentPage - 1) * pagesize;
        const endIndex = startIndex + parseInt(pagesize.toString());
        const pageItems = filteredData.slice(startIndex, endIndex);
        setCopyItems(pageItems);
        //setCopyItems(filteredData)

    }, [filterCriteria, searchGrid])

    const handleHeaderSearch = async (value: any, headerKey: any) => {
        setCopyItems(props.items)
        //  e.preventDefault()
        //  e.stopPropagation()
        setFilterCriteria({
            ...filterCriteria,
            [headerKey]: value,
        });
        setFlag(true)
        setChangeFlag(!changeFlag)
        // setSearchGrid(e.target.value)
    }

    const [countForSort, setcountForSort] = useState(0)
    const handleSort = (e: any, headerkey: any, countForSort: any) => {
        e.preventDefault()
        e.stopPropagation()
        Object.keys(copyItems[0]).map((k, index) => {
            if (k === headerkey) {
                if (countForSort % 2 === 0) {
                    setCopyItems(copyItems.sort((a, b) => {
                        const keys = Object.keys(a);
                        const keyAtIndex = keys[index] as keyof typeof a;
                        return a[keyAtIndex] >= b[keyAtIndex] ? 1 : -1;
                    }));
                }
                else {
                    setCopyItems(copyItems.sort((a, b) => {
                        const keys = Object.keys(a);
                        const keyAtIndex = keys[index] as keyof typeof a;
                        return a[keyAtIndex] <= b[keyAtIndex] ? 1 : -1;
                    }));

                }
            }
        })
        setFlag(true)
        setChangeFlag(!changeFlag)
    }


    let itemList = []
    const clickPrevious = () => {
        setcurrentPage(currentPage - 1)
    }

    const clickNext = () => {
        setcurrentPage(currentPage + 1)
    }

    const clickPage = (index: any) => {
        setcurrentPage(index)
    }

    const handleChangePageSize = (e: any) => {
        setpagesize(e.target.value);
        setcurrentPage(1)
    }

    const p = () => {
        //console.log(1, totalPages);

        <li key='pageprev' className={`page-item`}>
            <a className="page-link"><i className='fa fa-angle-left'></i></a>
        </li>
        if (totalPages > 1) {
            itemList.push(<li key='pageprev' className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <a onClick={clickPrevious} className="page-link"><i className='fa fa-angle-left'></i></a>
            </li>)
        }

        if (currentPage <= numOfshow) {
            for (let index = 1; index <= numOfshow && index <= totalPages; index++) {
                itemList.push(<li key={`page${index}`} className="page-item">
                    <a
                        onClick={(e) => clickPage(index)}
                        className={`page-link ${currentPage === index ? 'active' : ''}`}
                        aria-current={currentPage === index ? 'page' : undefined}
                        href='#'>
                        {index}</a>
                </li>)
            }
        }
        if (currentPage > numOfshow) {
            for (let index = currentPage - (Math.ceil(numOfshow / 2)) + 1; index < currentPage - (numOfshow / 2) + numOfshow && index <= totalPages; index++) {
                itemList.push(<li key={`page${index}`} className="page-item">
                    <a onClick={(e) => clickPage(index)}
                        className={`page-link ${currentPage === index ? 'active' : ''}`}
                        aria-current={currentPage === index ? 'page' : undefined}
                        href='#'>{index}</a>
                </li>)
            }
        }

        if (totalPages > 1) {
            itemList.push(<li key='pageNext' className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <a onClick={clickNext} className="page-link"><i className='fa fa-angle-right'></i></a>
            </li>)
        }
        return itemList
    }
    return (
        <>
            <div id={'DATAGRIG'} className="datagrid-component">

                {showDeleteAlert && <Alert msg={`آیا از حذف اطلاعات مطمئن هستید؟`}
                    handleDataGridDelete={handleDataGridDelete}
                    item={deleteItem}
                />
                }

                <div>
                    {/* <button className="btn btn-success" onClick={() => FakeDataGenerator.generateData(10)}>Generate Data And Save For DataGrid</button> */}
                    {/* <pre>{JSON.stringify(generatedData, null, 2)}</pre> */}
                    <br />
                    <br />
                </div>

                <div className="row">
                    <div className="col-12 col-md-4 flex-start select-component">
                        <div className='flex-center'>
                            {/* <i>Show</i> */}
                            {/* select */}
                            <i>تعداد آیتم در صفحه</i>
                            <select onChange={(e) => handleChangePageSize(e)} value={pagesize} className="form-select">
                                {showOptions}
                            </select>
                        </div></div>
                    {/* <div className="col-12 col-md-3 flex-right">
        <a href='#' ><i className='fa fa-refresh plus-Grid'></i> </a>
        <a href='#' > <i className='fa fa-plus plus-Grid'></i></a>
        <a href='#' onClick={() => printDataGrid()} > <i className='fa fa-file-pdf-o plus-Grid'></i></a>
        <a href='#'  > <i className='fa fa-print plus-Grid'></i></a>
    </div> */}

                    {/* <div className="col-12 col-md-8 flex-right">
        <div className='search-component'>
            <input className="form-control search me-2 " type="search" placeholder="جستجو" aria-label="Search" />
            <button className="btn btn-search" type="submit"><i className='fa fa-search'></i></button>
        </div>
    </div> */}
                </div>


                <div className="row">
                    <div className="col-12">
                        <div className='table-datagrid grid-height'>
                            <table className='pdf_DataGrid table table-hover table-striped'>
                                <thead>
                                    <tr>
                                        {showThead}
                                    </tr>
                                </thead>

                                <tbody>
                                    {showbody}
                                </tbody>


                                {/* <tr>
                        {footerItems}
                    </tr> */}
                            </table>
                            <br />
                            <br />

                            {/* Pagination */}
                            <div className="pagination-component" dir='ltr'>
                                <div className="row paging">

                                    <div className="col-12 col-md-12 flex-center" >
                                        <nav aria-label="...">

                                            <ul className="pagination">
                                                {p()}
                                                {/* <li key='pageprev' className={`page-item`}>
                        <a className="page-link"><i className='fa fa-angle-left'></i></a>
                    </li>

                    <li className="page-item">
                        <a className={`page-link active`}
                            aria-current={`page`}
                            href='#'>1</a>
                    </li>

                    <li className="page-item">
                        <a className={`page-link`}
                            href='#'>2</a>
                    </li>

                    <li className="page-item">
                        <a className={`page-link`}
                            href='#'>3</a>
                    </li>

                    <li className="page-item">
                        <a className={`page-link`}
                            href='#'>4</a>
                    </li>

                    <li key='pageNext' className={`page-item`}>
                        <a className="page-link"><i className='fa fa-angle-right'></i></a>
                    </li> */}
                                            </ul>

                                        </nav>
                                    </div>
                                    <div className="col-12 col-md-12 flex-center text-item">
                                        <i>نمایش  {currentPage <= numOfshow ? 1 : currentPage - (Math.ceil(numOfshow / 2)) + 1}  تا  {currentPage <= numOfshow ? numOfshow >= totalPages ? totalPages : numOfshow : currentPage - (numOfshow / 2) + numOfshow >= totalPages ? Math.ceil(totalPages) : currentPage - (Math.ceil(numOfshow / 2)) + numOfshow}  از  {Math.ceil(totalPages)}  صفحه
                                        </i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </>
    );
};

export default DataGrid;