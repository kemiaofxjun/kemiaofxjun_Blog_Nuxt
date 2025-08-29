export interface siteTabs {
    name: string
    Item: Item[]
}

export interface Item {
    name: string
    image: string
    link: string
    desc: string
    status: '正常'|'失败'|'迟缓'
    service: service[]
}

export interface service {
    name: string
    image: string
    link: string
}

export const siteLinkItems: siteTabs[] = [
    {
        name: '分站',
        Item: [
            {
                name: 'EdgeOne镜像',
                image: 'https://sourceimage.s3.bitiful.net/myxz.avif',
                link: 'https://blog-v3.myxz.top',
                desc: "",
                service: [
                    { name: 'EdgeOne', image: '', link: ""}
                ],
                status: '正常'
            }
        ]
    },
    {
        name: '服务',
        Item: [
            {
                name: '说说',
                image: 'https://sourceimage.s3.bitiful.net/myxz.avif',
                link: 'https://blog-v3.myxz.top',
                desc: "",
                service: [
                    { name: 'EdgeOne', image: '', link: "" }
                ],
                status: "正常"
            }
        ]
    },
]