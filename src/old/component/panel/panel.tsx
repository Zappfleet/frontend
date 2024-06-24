// import { Outlet, useLocation, useNavigate, } from "react-router";

// import {
//   AppShell,
//   Header,
//   Footer,
//   Text,
//   MediaQuery,
//   Burger,
//   useMantineTheme,
//   ScrollArea,
//   Breadcrumbs,
//   Anchor,
//   Card,
// } from "@mantine/core";
// import SideBar from "../../components/common/Navbar/sidebar";
// import { Brand } from "../../components/common/Navbar/brand";
// import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// import { renderUserSidebarLinks } from "../../utils/userHelper";
// import { useElementSize } from "@mantine/hooks";
// import { UserContext } from "../../App";

// export const HeightContext = createContext();



// const Panel = () => {
//   const user = useContext(UserContext);
//   const router = useNavigate();
//   if (!user) router("/");
//   const navLinks = useMemo(() => renderUserSidebarLinks(user));
//   const theme = useMantineTheme();
//   const [opened, setOpened] = useState(false);
//   const { ref, width, height } = useElementSize();
//   const location = useLocation();


//   const renderBreadCrumbFor = (pathname) => {
//     return buildBreadcrumbItems(navLinks)[pathname];
//   }


//   return (
//     <>

//       <AppShell
//         styles={{
//           main: {
//             background: theme.colors.gray[0],
//           },
//         }}
//         navbarOffsetBreakpoint="sm"
//         asideOffsetBreakpoint="sm"
//         fixed
//         navbar={
//           <SideBar
//             setDrawerOpen={setOpened}
//             opened={opened}
//             links={navLinks}
//             user={user}
//           />
//         }
//         footer={
//           <Footer height={30} p="md">
//             <Text align="center" style={{ lineHeight: ".1" }}>
//               کلیه حقوق این سامانه متعلق به زپ می باشد
//             </Text>
//           </Footer>
//         }
//         header={
//           <Header height={70} p="md">
//             <div
//               style={{ display: "flex", alignItems: "center", height: "100%" }}
//             >
//               <MediaQuery largerThan="sm" styles={{ display: "none" }}>
//                 <Burger
//                   opened={opened}
//                   onClick={() => setOpened((o) => !o)}
//                   size="sm"
//                   color={theme.colors.gray[6]}
//                   mr="xl"
//                 />
//               </MediaQuery>

//               <Brand />
//               <Text weight={700}>سامانه حمل و نقل</Text>
//               {/* <div className="m-3">
//                 <Breadcrumbs>{renderBreadCrumbFor(location.pathname)}</Breadcrumbs>
//               </div> */}
//             </div>
//           </Header>
//         }
//       >
//         <div className="h-100" ref={ref}>
//           <HeightContext.Provider value={height}>
//             <Outlet />
//           </HeightContext.Provider>
//         </div>
//       </AppShell>
//     </>
//   );
// };

// function buildBreadcrumbItems(navLinks) {

//   const breadcrumbItems = {};
//   for (let i = 0; i < navLinks.length; i++) {
//     if (navLinks[i].path != null) {
//       const link = `/panel/${navLinks[i].path}`;
//       breadcrumbItems[link] = [<Anchor href={link} key={i}>
//         {navLinks[i].label}
//       </Anchor>]
//     } else if (navLinks[i].subItems != null) {
//       for (let x = 0; x < navLinks[i].subItems.length; x++) {
//         const subItem = navLinks[i].subItems[x];
//         const link = `/panel/${subItem.path}`;
//         breadcrumbItems[`/panel/${subItem.path}`] = [
//           <Text style={{ color: "gray" }} key={"s-" + i}>
//             {navLinks[i].label}
//           </Text>,
//           <Anchor href={link} key={"g-" + i}>
//             {subItem.label}
//           </Anchor>]
//       }
//     }
//   }

//   return breadcrumbItems;

// }

// export default Panel;
