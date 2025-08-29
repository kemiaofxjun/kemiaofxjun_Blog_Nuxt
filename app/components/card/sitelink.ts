export interface siteTabs {
    name: string
    Items: Item[]
}

export interface Item {
    name: string
    image: string
    link: string
    desc: string
    service: service[]
}

export interface service {
    name: string
    image: string
    link: string
}

export const siteLinkItems: siteTabs[] = [
    {
        name: '',
        Items: [{
            name: '莫言小栈',
            image: 'https://sourceimage.s3.bitiful.net/myxz.avif',
            link: 'https://www.myxz.top',
            desc: "",
            service: [
                { name: 'EdgeOne', image: '', link: ""}
            ],
        }]
    }
]