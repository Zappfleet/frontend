export const convertCarNameCode = (name_code:any) => {
  switch (name_code) {
    case 0:
      return "پراید";
    case 1:
      return "405پژو";
    case 2:
      return "پژو206";
    case 3:
      return "پژو پارس";
    case 4:
      return "تیبا";
  }
};
export const convertCarPlaque = (plaque:any) => {
  return `${plaque.t} / ${plaque.s} ${plaque.l} ${plaque.f}`;
};
export const carNameCodeList = 
   [
    {
      value: "0",
      label: "پراید",
    },
    {
      value: "1",
      label: "405پژو",
    },
    {
      value: "2",
      label: "206پژو",
    },
    {
      value: "3",
      label: "پژو پارس",
    },
    {
      value: "4",
      label: "تیبا",
    },
  ];

 export const carColorCodeList = [
  {
    label:'مشکی',
    value:"0"
  }, {
    label:'سفید',
    value:"1"
  },{
    label:'نوک مدادی',
    value:"2"
  },  {
    label:'بژ',
    value:"3"
  }, {
    label:'نقره ای',
    value:"4"
  }, 
];

export const carGroup = 
   [
    {
      value: "0",
      label: "خودرو سازمان",
    },
    {
      value: "1",
      label: "تاکسی",
    },
    // {
    //   value: "2",
    //   label: "اسنپ",
    // },
    
  ];

  export const IRISA_GROUP=0


  export const getCarGroupName = (group:any) => {
    switch (group) {
      case 0:
        return "ایریسا";
      case 1:
        return "تاکسی";
      case 2:
        return "اسنپ";
        default :
        return "نامشخص"
    }
  };
  /* const carNameCode = {
  0: "پراید",
  1: "405پژو",
  2: "پژو206",
  3: "پژو پارس",
  4: "تیبا",
}; */

