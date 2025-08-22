export interface footerDeal {
    left: left[];
    miniLogo: miniLogo[];
}

export interface left {
    icon: string;
    name: string;
    link: string;
}

export interface miniLogo {
    icon: string;
    name: string;
}

export const dealData: footerDeal[] =  [{
    left: [
        { icon: 'ph:envelope-simple-bold', name: '邮箱', link: 'mailto:3227988255@qq.com', }
    ],
    miniLogo: [
        { name:'莫言小栈', icon: 'https://blog.myxz.top/img/avatar.avif'}
    ],
}]