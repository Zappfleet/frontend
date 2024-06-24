import { useEffect, useState } from "react";
import { Button,TransferList } from "@mantine/core";
import { ErrorToast, SucccessToast } from "../../../components/common/errorToast";
import CustomSearchBox from "../../../components/common/filter&search/customeSearchBox";
import { createDeligation, getUserById, searchUsers} from "../../../services/userService";

const GENERAL_PERMISSION_GROUP = "1";
const REQ_PERMISSION_GROUP = "2";
const TRIP_PERMISSION_GROUP = "3";
const CAR_PERMISSION_GROUP = "4";
const LOCATION_PERMISSION_GROUP = "5";
const AREA_PERMISSION_GROUP = "6";
const USER_PERMISSION_GROUP = "7";

const allPermissions = [
    {
      value:GENERAL_PERMISSION_GROUP,
      label: 'اختیارات عمومی',
      permissions: [
        { 
                key : "slRqstLs",
                value : 0,
                method : "GET" 
        },
        { 
                key : "slRqstDt",
                value : 1,
                method : "GET" 
        },
        { 
                key : "slTrpLs",
                value : 2,
                method : "GET" 
        },
        { 
                key : "slTrpDt",
                value : 3,
                method : "GET" 
        },
        { 
                key : "slLc",
                value : 4,
                method : "GET" 
        },
        { 
                key : "srchLcs",
                value : 5,
                method : "GET" 
        },
        { 
                key : "srchUsr",
                value : 6,
                method : "GET" 
        },
        { 
                key : "dlofaut",
                value : 0,
                method : "POST" 
        },
        { 
                key : "slRqst",
                value : 1,
                method : "POST" 
        },
        { 
                key : "slLc",
                value : 2,
                method : "POST" 
        },
        { 
                key : "slTr",
                value : 0,
                method : "PUT" 
        },
        { 
                key : "slRqst",
                value : 1,
                method : "PUT" 
        },
        { 
                key : "slLc",
                value : 0,
                method : "DELETE" 
        },
        ] 
    },
    {
      value:REQ_PERMISSION_GROUP,
      label:'مدیریت درخواست ها',
      permissions: [
        { 
                key : "rqstLs",
                value : 7,
                method : "GET" 
        },
        { 
                key : "rqstDt",
                value : 8,
                method : "GET" 
        },
        { 
                key : "rqst",
                value : 3,
                method : "POST" 
        },
        { 
                key : "rqst",
                value : 2,
                method : "PUT" 
        },
        { 
                key : "rqst",
                value : 2,
                method : "DELETE" 
        },
        ] 
    },
    {
      value:TRIP_PERMISSION_GROUP,
      label:'مدیریت سفر ها',
      permissions: [
                { 
                        key : "trpDrftLs",
                        value : 14,
                        method : "GET" 
                },
                { 
                        key : "trpsDrftDt",
                        value : 15,
                        method : "GET" 
                },
                { 
                        key : "trpLs",
                        value : 16,
                        method : "GET" 
                },
                { 
                        key : "trpDt",
                        value : 17,
                        method : "GET" 
                },
                { 
                        key : "trpDrft",
                        value : 4,
                        method : "POST" 
                },
                { 
                        key : "prvTrp",
                        value : 8,
                        method : "POST" 
                },
                { 
                        key : "trpDrft",
                        value : 11,
                        method : "PUT" 
                },
                { 
                        key : "trp",
                        value : 3,
                        method : "PUT" 
                },
                { 
                        key : "trp",
                        value : 3,
                        method : "DELETE" 
                },
        ] 
    },
    {
      value:CAR_PERMISSION_GROUP,
      label:'مدیریت خودرو ها',
      permissions: [
        { 
                key : "acCrLs",
                value : 18,
                method : "GET" 
        },
        { 
                key : "acCrDt",
                value : 19,
                method : "GET" 
        },
        { 
                key : "crLs",
                value : 23,
                method : "GET" 
        },
        { 
                key : "crDt",
                value : 24,
                method : "GET" 
        },
        { 
                key : "cr",
                value : 7,
                method : "POST" 
        },
        { 
                key : "asCrDrv",
                value : 5,
                method : "PUT" 
        },
        { 
                key : "car",
                value : 8,
                method : "PUT" 
        },
        { 
                key : "car",
                value : 6,
                method : "DELETE" 
        },
   
       
        ] 
    },
    {
      value:LOCATION_PERMISSION_GROUP,
      label:'مدیریت مکان ها',
      permissions: [
        { 
                key : "lcs",
                value : 20,
                method : "GET" 
        },
        { 
                key : "lc",
                value : 5,
                method : "POST" 
        },
        { 
                key : "lc",
                value : 6,
                method : "PUT" 
        },
        { 
                key : "lc",
                value : 1,
                method : "DELETE" 
        },
     
   
       
        ] 
    },
    {
      value:AREA_PERMISSION_GROUP,
      label:'مدیریت محدوده ها',
      permissions: [
        { 
                key : "arls",
                value : 21,
                method : "GET" 
        },
        { 
                key : "arDt",
                value : 22,
                method : "GET" 
        },
        { 
                key : "ar",
                value : 6,
                method : "POST" 
        },
        { 
                key : "asArDsp",
                value : 4,
                method : "PUT" 
        },
        { 
                key : "ar",
                value : 7,
                method : "PUT" 
        },
        { 
                key : "ar",
                value : 5,
                method : "DELETE" 
        },
     
   
        ] 
    },
    {
      value:USER_PERMISSION_GROUP,
      label:'مدیریت کاربران',
      permissions: [
        { 
                key : "usrs",
                value : 25,
                method : "GET" 
        },
        { 
                key : "usrDt",
                value : 26,
                method : "GET" 
        },
        { 
                key : "usr",
                value : 9,
                method : "POST" 
        },
        { 
                key : "usr",
                value : 10,
                method : "PUT" 
        },
      
        { 
                key : "usr",
                value : 4,
                method : "DELETE" 
        },
        ] 
    },
    
  ];

  
const flattenPermissionList = (allPermissions)=>{
    const f = {};
    for(let i = 0 ; i < allPermissions.length ; i++){
        const p = allPermissions[i].permissions;
        for(let k = 0 ; k < p.length ; k++){
            const item = p[k];
            f[`${item.method}_${item.value}`] = {...item , group : allPermissions[i].value};
        }
    }
    return f;
}

const permissionsFlattened = flattenPermissionList(allPermissions); 

const PanelPermissions = () => {
    const [permissionData, setPermissionData] = useState([allPermissions,[]]);

    const [res, setQuery] = useState({ query: "", result: [] });
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
 ;

    const onSearch = async ({ query }) => {
        if (!query?.trim()) return;
        try {
            const res = await searchUsers(query.trim());
            const result = res.data.docs;
            setQuery({ query, result });
        } catch (e) { }
    }

    const onSelect = (user) => {
        return () => {
            setSelectedUser(user);
            setQuery({ query: "", result: [] });
        };
    };

    useEffect(() => {
        if (selectedUser == null) return;
        getUserById(selectedUser._id).then((res) => {
            const details = res.data.doc;
            setSelectedUserDetails(details);

            const splitted = split(allPermissions , combine(details.permissions , details.deligated_permissions?.permissions) )
            setPermissionData(splitted)
        }).catch((e) => { 
            ErrorToast({ message: e?.response?.data.info || e.message })
        })
    }, [selectedUser])

  
    function split(all , input = {}){
        let not_granted = [...all];
        const granted = [];

        const methods = Object.keys(input);

        for(let x = 0 ; x < methods.length ; x++){
            const m = methods[x];
            const arr = input[m];
            for(let i = 0 ; i < arr.length ; i++){
                const methodValue = arr[i];
                const pItem = permissionsFlattened[`${m}_${methodValue}`];
                if(pItem == null) continue;

                for(let k = 0 ; k < not_granted.length ; k++){
                    const not_granted_item = not_granted[k];
                    if(not_granted_item.value == pItem.group){

                        const alreadyExists = granted.find((g)=>{
                            return g.value == pItem.group
                        });
                        if (!alreadyExists){
                            granted.push(not_granted_item);
                        }
                        not_granted = not_granted.filter((item)=>{return item.value != pItem.group});
                        break;
                    }
                }
                
            }
        }


        return  [not_granted , granted];
    }

    const submitPermissions = () => {

        const newPermissions = {
            GET:[],
            POST:[],
            PUT:[],
            DELETE:[]
        }
        for (const dop of permissionData[1]) {
            dop.permissions?.map(item=>{
            newPermissions[item.method].push(item.value);
            })
        }
      
      
        const body={
            user_id:selectedUserDetails._id,
            permissions : newPermissions
        }
        let total=0
        for (const per in newPermissions) {
            if (newPermissions[per].length===0) {
                total ++
            }
        }
        if(total===4) return ErrorToast({ message: "لطفا حداقل یک اختیار را انتخاب کنید" })
        createDeligation(body).then((res=>{
            SucccessToast({ message: "اختیارات کاربر با موفقیت ثبت شد" })
        })).catch((e) => {
            ErrorToast({ message: e?.response?.data?.info || e.message })
        })
    }
  

    return <div>
        <div>
            <CustomSearchBox
                onSearch={onSearch}
                onSelect={onSelect}
                resultList={res}
                resultsOnly={true}
                renderItem={(item) => item.full_name}
            />
        </div>
        {!selectedUserDetails &&  <label className={'m-4'}>برای تفویض اختیار ، نام یا کد پرسنلی کاربر را جستجو نمایید.</label> }
            
      
        
        {selectedUserDetails &&
            <div className="container">
                <Button className="my-4" size="sm" radius="xl" onClick={submitPermissions}>
                    ثبت مجوز ها
                </Button>
                <label className={'m-2'}>{`${selectedUserDetails.full_name} با کد ملی ${selectedUserDetails.nat_num}`}</label>
        {selectedUserDetails.deligated_permissions && (
                <p>
                تفویض کننده :
                <label className={'m-2'}>{`${selectedUserDetails.deligated_permissions.full_name}`}</label>
                </p>
        )}

                  <TransferList
                    value={permissionData}
                    onChange={setPermissionData}
                    searchPlaceholder="جستجو ..."
                    nothingFound="موردی وجود ندارد"
                    titles={['اختیارات', 'تفویض شده']}
                    listHeight={300}
                    breakpoint="sm"
                    filter={(query, item) =>
                        item.label.toLowerCase().includes(query.toLowerCase().trim())
                        }
                    />
            </div>
        }
    </div>
}

function combine(set1 , set2 = {GET : [] , POST : [] , PUT : [] , DELETE : []}){
   return {
     GET : [...set1.GET , ...set2.GET],
     POST : [...set1.POST , ...set2.POST],
     PUT : [...set1.PUT , ...set2.PUT],
     DELETE : [...set1.DELETE , ...set2.DELETE],
   }
}

export default PanelPermissions;