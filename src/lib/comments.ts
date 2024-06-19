

export const comments =
    [
        {
            role: 'passenger',
            type: 'good',
            value: ['رفتار محترمانه',
                ' خودروی تمیز و خوش بو',
                'وقت شناس بودن',
                'رانندگی ایمن',
                'رعایت اصول بهداشتی',
                'مسیر یابی حرفه ای',
            ]
        },
        {
            role: 'passenger',
            type: 'bad',
            value: ['عدم رعایت اصول بهداشتی',
                'رفتار نامناسب',
                'مسیریابی نامناسب',
                'رانندگی پر خطر',
                'سرمایش و گرمایش نا مناسب',
            ]
        },
        {
            role: 'driver',
            type: 'good',
            value: ['رفتار محترمانه',
                'رعایت اصول بهداشتی',
                'وقت شناس بودن',
            ]
        },
        {
            role: 'driver',
            type: 'bad',
            value: ['رفتار نامناسب',
                'عدم رعایت اصول بهداشتی',
                'دیر حاضر شدن در مبدا',
            ]
        },
    ]

export const emoji = [
    {
        key: 5,
        value: 'خیلی خوب',
        icon: 'fas fa-grin-alt',
        color: 'green'
    },
    {
        key: 4,
        value: 'خوب',
        icon: 'fas fa-grin',
        color: 'green'
    },
    {
        key: 3,
        value: 'معمولی',
        icon: 'fas fa-frown-open',
        color: 'blue'
    },
    {
        key: 2,
        value: 'بد',
        icon: 'fas fa-frown',
        color: 'red'
    },
    {
        key: 1,
        value: 'خیلی بد',
        icon: 'fas fa-frown-open',
        color: 'red'
    },
]