if(!self.define){let s,e={};const i=(i,l)=>(i=new URL(i+".js",l).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(l,r)=>{const n=s||("document"in self?document.currentScript.src:"")||location.href;if(e[n])return;let a={};const u=s=>i(s,n),o={module:{uri:n},exports:a,require:u};e[n]=Promise.all(l.map((s=>o[s]||u(s)))).then((s=>(r(...s),a)))}}define(["./workbox-3e911b1d"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/AganceDriver-36fcb849.js",revision:null},{url:"assets/AganceDriver-bcbc29af.css",revision:null},{url:"assets/AganceItems-600d4862.js",revision:null},{url:"assets/AganceItems-cff39ece.css",revision:null},{url:"assets/AganceProfile-664e3f07.js",revision:null},{url:"assets/AganceProfile-93ae05e5.css",revision:null},{url:"assets/AganceRegister-c86ac084.js",revision:null},{url:"assets/Alerts-e575e9f0.js",revision:null},{url:"assets/AreaManager-2ab910ad.css",revision:null},{url:"assets/AreaManager-dfb30e01.js",revision:null},{url:"assets/BasicSwitcher-50dcca88.js",revision:null},{url:"assets/BottomSheetModal-a3284b58.js",revision:null},{url:"assets/Breadcrumb-bc0ba5e7.css",revision:null},{url:"assets/Breadcrumb-e4475f51.js",revision:null},{url:"assets/Buttons-e4035275.js",revision:null},{url:"assets/Calendar-8ec80ece.js",revision:null},{url:"assets/CardSalahiyat-1b5f69f1.js",revision:null},{url:"assets/CardSalahiyat-4ff00b98.css",revision:null},{url:"assets/carIcon-ac58272a.js",revision:null},{url:"assets/Chart-ae3d84d8.js",revision:null},{url:"assets/Chips-0adb3513.js",revision:null},{url:"assets/Comments-173905d4.css",revision:null},{url:"assets/comments-4f6f4135.js",revision:null},{url:"assets/Comments-a4c8b121.js",revision:null},{url:"assets/Comments-e27f0d40.js",revision:null},{url:"assets/CountOfServicesOfDrivers-bd5171e0.js",revision:null},{url:"assets/Dabirkhane-1d749e05.js",revision:null},{url:"assets/dateTools-587f68dc.js",revision:null},{url:"assets/DefaultLayout-0e61f497.js",revision:null},{url:"assets/DefaultLayout-5abf88aa.css",revision:null},{url:"assets/DefinitionsManager-7959d274.js",revision:null},{url:"assets/DeligationManager-efa3d91d.css",revision:null},{url:"assets/DeligationManager-fa67e2af.js",revision:null},{url:"assets/DriverCurrentMissionService-248e52ef.css",revision:null},{url:"assets/DriverCurrentMissionService-ba09d9fc.js",revision:null},{url:"assets/DriverList_By_LastServiceAdnDistanse-241eb86c.js",revision:null},{url:"assets/DriverMissionHistory-214ab20f.css",revision:null},{url:"assets/DriverMissionHistory-640eb1b4.js",revision:null},{url:"assets/Estehamhaye3gane-d6b3da91.js",revision:null},{url:"assets/Estehamhaye3gane-f2d93e37.css",revision:null},{url:"assets/EstelamAmaken-1e2c58d9.js",revision:null},{url:"assets/EstelamAmaken-79d9ab0b.css",revision:null},{url:"assets/FileUpload-a1b75713.js",revision:null},{url:"assets/FormElements-65b81081.js",revision:null},{url:"assets/FormLayout-4de81152.js",revision:null},{url:"assets/html2canvas.esm-e0a7d97b.js",revision:null},{url:"assets/InActiveSystem-09946892.css",revision:null},{url:"assets/InActiveSystem-ffdfb3e7.js",revision:null},{url:"assets/index-4b638fea.js",revision:null},{url:"assets/index-a384ea37.css",revision:null},{url:"assets/index.es-44cb3d9a.js",revision:null},{url:"assets/index.esm-f82767a5.js",revision:null},{url:"assets/LocationSearch-0c7343c4.js",revision:null},{url:"assets/LocationSearch-f06e097f.css",revision:null},{url:"assets/MapContainer-a1f86b32.js",revision:null},{url:"assets/MapContainer-b17c47d4.css",revision:null},{url:"assets/marker-red-cc8765ae.js",revision:null},{url:"assets/MissionHistory-15f7f5de.js",revision:null},{url:"assets/MissionHistory-f3b7ccaa.css",revision:null},{url:"assets/Page403-1c916ea1.css",revision:null},{url:"assets/Page403-34de9313.js",revision:null},{url:"assets/PassengerFavoriteLocation-99ac5395.js",revision:null},{url:"assets/PassengerFavoriteLocation-df187484.css",revision:null},{url:"assets/PassengerMissionDetails-4648dd2c.js",revision:null},{url:"assets/PassengerMissionDetails-ff2e6561.css",revision:null},{url:"assets/PassengerRequestHistory-96c7697f.js",revision:null},{url:"assets/PassengerServiceRequest-554150e4.css",revision:null},{url:"assets/PassengerServiceRequest-57f670d5.js",revision:null},{url:"assets/PlaqueInput-aecdb007.js",revision:null},{url:"assets/Profile-b19dc1dd.js",revision:null},{url:"assets/Profile-f7513c14.css",revision:null},{url:"assets/purify.es-f1fd0f50.js",revision:null},{url:"assets/RegisterMoayeneFani-59cfaba0.js",revision:null},{url:"assets/RegisterMoayeneFani-83c822e1.css",revision:null},{url:"assets/RegisterTarefeAvarez-05f0f4ba.css",revision:null},{url:"assets/RegisterTarefeAvarez-36ad0d8d.js",revision:null},{url:"assets/renderUi-10abc2ba.js",revision:null},{url:"assets/Reports-c715c45a.js",revision:null},{url:"assets/Reports-f7fc8a16.css",revision:null},{url:"assets/RequestHistory-82d85458.js",revision:null},{url:"assets/RequestHistory-cbcd38ba.css",revision:null},{url:"assets/RestOfDriverBetweenServises-e042762c.js",revision:null},{url:"assets/Restrictions-325145e8.js",revision:null},{url:"assets/Restrictions-8cad72b9.css",revision:null},{url:"assets/RestrictionShowRequests-1c206636.js",revision:null},{url:"assets/RestrictionShowRequests-bf7cac00.css",revision:null},{url:"assets/RoleActions-c9ab24fb.js",revision:null},{url:"assets/RoleActions-d692e0fd.css",revision:null},{url:"assets/Settings-ac21d19c.js",revision:null},{url:"assets/SetWorkingWeek-0827d6ec.js",revision:null},{url:"assets/SetWorkingWeek-543dacc8.css",revision:null},{url:"assets/SimpleButton-b66aa1df.js",revision:null},{url:"assets/SodureParvane-94599077.css",revision:null},{url:"assets/SodureParvane-df51331b.js",revision:null},{url:"assets/style-29540f5b.css",revision:null},{url:"assets/style-3087b5d5.js",revision:null},{url:"assets/Style-588b3d1c.css",revision:null},{url:"assets/style-8ee731fd.css",revision:null},{url:"assets/SuggestionTextInput-de8ae0dd.js",revision:null},{url:"assets/SuggestionTextInput-f7d0b99d.css",revision:null},{url:"assets/TabbedPanel-41bf6451.css",revision:null},{url:"assets/TabbedPanel-861d1946.js",revision:null},{url:"assets/Tables-f5db5d37.js",revision:null},{url:"assets/TimeOfServices-55dc193b.js",revision:null},{url:"assets/TitledSparator-69b1d396.js",revision:null},{url:"assets/TripMission-13c1375b.js",revision:null},{url:"assets/TripMission-db46618b.css",revision:null},{url:"assets/useAganceDriver-96d5f859.js",revision:null},{url:"assets/useAganceRegister-325531e9.js",revision:null},{url:"assets/useComments-8eb5e44a.js",revision:null},{url:"assets/useConfirmModal-a114480e.js",revision:null},{url:"assets/useConfirmModal-b468787c.css",revision:null},{url:"assets/useFavorite-7253379e.js",revision:null},{url:"assets/useItemSetToggle-3f1f039f.js",revision:null},{url:"assets/useNeshanApi-69a62daf.js",revision:null},{url:"assets/user-03-3459d852.js",revision:null},{url:"assets/useRestrictionShowRequests-298147b4.js",revision:null},{url:"assets/useRoles-606a36f3.js",revision:null},{url:"assets/UsersManager-d58a25ff.css",revision:null},{url:"assets/UsersManager-ea51e6b1.js",revision:null},{url:"assets/UsersSuggestionInput-a4d8adf9.js",revision:null},{url:"assets/UsersSuggestionInput-fce16f35.css",revision:null},{url:"assets/useSocket-4f91f465.js",revision:null},{url:"assets/useVehicleBasicData-dc6e97f6.js",revision:null},{url:"assets/useVehicles-4e45c742.js",revision:null},{url:"assets/validation-753ab0c5.js",revision:null},{url:"assets/VehicleManager-4a301953.css",revision:null},{url:"assets/VehicleManager-c41a5cba.js",revision:null},{url:"assets/WordProcessor-87b83d1d.js",revision:null},{url:"bootstrap/bootstrap.rtl.min.css",revision:"06aaa62c1857860d26d86c95fbc5046f"},{url:"font-awesome/css/all.css",revision:"4d039a527e8976dc1a3f3f2fde049e73"},{url:"font-awesome/css/all.min.css",revision:"c325be79a5ecca85d68eb9e5b65a547a"},{url:"font-awesome/css/brands.css",revision:"12d2224c6f52c19378d835b851669854"},{url:"font-awesome/css/brands.min.css",revision:"77637029fca024667114fcdf5bbfbbf7"},{url:"font-awesome/css/fontawesome.css",revision:"fa57a4c6d35a4c84ef393d5427cee339"},{url:"font-awesome/css/fontawesome.min.css",revision:"15e623f974855bfda674d1d6f12d2911"},{url:"font-awesome/css/regular.css",revision:"1722dc3a75db9fa31b371b13b0adee1e"},{url:"font-awesome/css/regular.min.css",revision:"42d09661822972ebc5c2feb5bd9cc8ef"},{url:"font-awesome/css/solid.css",revision:"56930668cd8081f16592ff937b59adab"},{url:"font-awesome/css/solid.min.css",revision:"80488c4b5a3c971b1f6fcb015fdf54e3"},{url:"font-awesome/css/svg-with-js.css",revision:"89b153196c7209f963b9c1db601bfb0a"},{url:"font-awesome/css/svg-with-js.min.css",revision:"a481aa60d8a2a776b01eaebf8b73ab0a"},{url:"font-awesome/css/v4-font-face.css",revision:"1f0fc2ce0e52cb927473d48ce178694d"},{url:"font-awesome/css/v4-font-face.min.css",revision:"18ff4381fee854799b17c2d1fd1f5f98"},{url:"font-awesome/css/v4-shims.css",revision:"3c287201d94b1d847e02aa01d3770820"},{url:"font-awesome/css/v4-shims.min.css",revision:"b179b3372e22ec97992038b52be36c15"},{url:"font-awesome/css/v5-font-face.css",revision:"5beeb24a335757790070ba6db79d7127"},{url:"font-awesome/css/v5-font-face.min.css",revision:"325e2eaece3f635dca19d7a103066e17"},{url:"index.html",revision:"95b480e664f9f161b650651201cca897"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"service-worker.js",revision:"1850118da2313823c180c3295f18830c"},{url:"favicon.ico",revision:"94e47f5dcf4e91b704f169ebcb4c9390"},{url:"pwa-192x192.png",revision:"f970049db6a030eb997883ec6bd5083e"},{url:"pwa-512x512.png",revision:"f970049db6a030eb997883ec6bd5083e"},{url:"manifest.webmanifest",revision:"8db4cfba72e6916d79368a5b503871fd"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));