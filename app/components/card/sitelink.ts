export interface siteTabs {
    name: string
    siteItems: siteItem[]
}

export interface siteItem {
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
        siteItems: [{
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