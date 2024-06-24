// import useSWR from "swr";
// //import settings from "'../../../src/config";
// import { useEffect, useState, createElement, useContext, useRef } from "react";
// import httpService from "../../../services/httpService";
// import { Center, Container, Grid, Pagination, ScrollArea } from "@mantine/core";
// //import LoadingContainer from "../../hoc/loadingContainer";
// //import FixHeightContent from "../../hoc/fixHeightContent";
// import RestHeightContent from "../../hoc/restHeightContent";
// import SearchBox from "../../common/filter&search/searchBox";
// import FilterBox from "../../common/filter&search/filterBox";
// import ItemPerPage from "../../common/filter&search/itemPerPage";
// import MyTable from "../../common/table";
// import { HeightContext } from "../../panel/panel";
// import { useElementSize } from "@mantine/hooks";

// const List = ({
//   url,
//   size,
//   width,
//   onSort,
//   loading,
//   onRowClick,
//   hideFilter,
//   sortColumn,
//   filterModal,
//   mutateSignal,
//   placeholder,
//   columns: originalColumns,
// }) => {
//   let dataLoading = false;
//   const firstRender = useRef(false);
//   const [paginationData, setPaginationData] = useState();
//   const [data, setData] = useState();
//   const [params, setParams] = useState({});
//   const [openFilterModal, setOpenFilterModal] = useState(false);
//   const [activePage, setActivePage] = useState(1);
//   let count = 0;

//   const columns = [
//     {
//       content: () => {
//         count += 1;
//         return count;
//       },
//     },
//     ...originalColumns,
//   ];

//   const height = useContext(HeightContext);
//   const { ref: fixRef, height: fixHeight } = useElementSize();
//   const { ref: paginateRef, height: paginateHeight } = useElementSize();

//   const {
//     data: list,
//     error,
//     mutate: mutateList,
//   } = useSWR([settings.apiUrl + url, { params: { ...params, ...sortColumn } }], httpService.get);

//   if (!list && !error) {
//     dataLoading = true;
//   }

//   const handlePageChange = (page) => {
//     params.page = page;
//     setParams({ ...params });
//     setActivePage(page);
//   };

//   useEffect(() => {
//     if (list?.data?.docs) {
//       const { data } = list;
//       console.log("this is columns for reserve:",data.docs)
//       setData(data.docs);
//       delete data.docs;
//       setPaginationData(data);
//     }
//   }, [list?.data]);

//   useEffect(() => {
//     if (!firstRender.current) return (firstRender.current = true);
//     mutateList();
//   }, [mutateSignal]);

//   return (
//     <LoadingContainer loading={loading || dataLoading} height={height}>
//       <Container size={size} style={{ width }}>
//         <div className="row" ref={fixRef}>
//           <Grid>
//             <Grid.Col lg={5}>
//               <SearchBox
//                 placeholder={placeholder}
//                 onSearch={(search) => {
//                   setParams((prev) => ({ ...prev, ...search }));
//                 }}
//               />
//             </Grid.Col>
//             {filterModal != null && <Grid.Col span={1}>
//               <FilterBox setOpenModal={setOpenFilterModal} hideFilter={hideFilter}>
//                 {createElement(filterModal.type, {
//                   ...filterModal.props,
//                   opened: openFilterModal,
//                   setOpened: setOpenFilterModal,
//                   onFilter: (filter) => {
//                     setParams((prev) => ({ ...prev, ...filter }));
//                   },
//                 })}
//               </FilterBox>
//             </Grid.Col>}
//             <Grid.Col span={4}>
//               <ItemPerPage
//                 setLimit={(limit) => {
//                   params.limit = limit;
//                   params.page = 1;
//                   setParams({ ...params });
//                   setActivePage(1);
//                 }}
//               />
//             </Grid.Col>
//           </Grid>
//         </div>

//         <RestHeightContent>
//           <ScrollArea style={{ height: height - fixHeight - paginateHeight }}>
//             <MyTable
//               data={data}
//               onSort={onSort}
//               loading={loading}
//               columns={columns}
//               sortColumn={sortColumn}
//               onRowClick={onRowClick}
//             />
//           </ScrollArea>

//           <Center ref={paginateRef}>
//             <Pagination
//               page={activePage}
//               onChange={handlePageChange}
//               total={paginationData?.totalPages}
//             />
//           </Center>
//         </RestHeightContent>
//       </Container>
//     </LoadingContainer>
//   );
// };

// export default List;
