export interface siteTabs {
    name: string
    Item: Item[]
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
        name: '镜像站点',
        Item: [
            {
                name: 'EdgeOne镜像',
                image: 'https://sourceimage.s3.bitiful.net/myxz.avif',
                link: 'https://blog-v3.edgeone.mirrors.myxz.top',
                desc: "",
                service: [
                    { 
                        name: 'EdgeOne', 
                        image: '/assets/img/link/service/edgeone.jpg', 
                        link: "https://edgeone.ai/"
                    }
                ],
            },{
                name: "Vercel镜像",
                image: "https://sourceimage.s3.bitiful.net/myxz.avif",
                link: "https://blog-v3.vercel.mirrors.myxz.top",
                desc: "",
                service: [
                    {
                        name: "Vercel",
                        image: "/assets/img/link/service/vercel.png",
                        link: "https://vercel.com"
                    }
                ]
            },{
                name: "Netlify镜像",
                image: "https://sourceimage.s3.bitiful.net/myxz.avif",
                link: "https://blog-v3.netifly.mirrors.myxz.top",
                desc: "",
                service: [
                    {
                        name: "Netlify",
                        image: "/assets/img/link/service/netlify.png",
                        link: "https://Netlify.com"
                    }
                ]
            },
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
                    { 
                        name: 'EdgeOne', 
                        image: '', 
                        link: "" 
                    }
                ],
            }
        ]
    },
]