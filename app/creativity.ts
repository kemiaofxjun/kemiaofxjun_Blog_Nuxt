// 定义最内层创意项的类型接口
interface CreativityItem {
  name: string;       // 技术名称
  color: string;      // 颜色值（十六进制/关键字）
  icon: string;       // 图标 URL 地址
}

// 定义外层分类的类型接口
interface CreativityCategory {
  class_name: string;       // 分类名称
  creativity_list: CreativityItem[];  // 创意项列表
}

// 具体数据（与 YAML 结构完全对应）
const creativityData: CreativityCategory[] = [
  {
    class_name: "开启创造力",
    creativity_list: [
      {
        name: "Vue",
        color: "#b8f0ae",
        icon: "https://cdn.sxiaohe.top/img/banners/vue.webp"
      },
      {
        name: "Java",
        color: "#fff",
        icon: "https://cdn.sxiaohe.top/img/banners/Java.webp"
      },
      {
        name: "Docker",
        color: "#57b6e6",
        icon: "https://cdn.sxiaohe.top/img/banners/docker.webp"
      },
      {
        name: "Webpack",
        color: "#2e3a41",
        icon: "https://cdn.sxiaohe.top/img/banners/webpack.webp"
      },
      {
        name: "Photoshop",
        color: "#4082c3",
        icon: "https://cdn.sxiaohe.top/img/banners/PS.webp"
      },
      {
        name: "Swift",
        color: "#eb6840",
        icon: "https://cdn.sxiaohe.top/img/banners/swift.webp"
      },
      {
        name: "Python",
        color: "#fff",
        icon: "https://cdn.sxiaohe.top/img/banners/python.webp"
      },
      {
        name: "Node",
        color: "#333",
        icon: "https://cdn.sxiaohe.top/img/banners/node-logo.svg"
      },
      {
        name: "Git",
        color: "#df5b40",
        icon: "https://cdn.sxiaohe.top/img/banners/git.webp"
      },
      {
        name: "Css",
        color: "#2c51db",
        icon: "https://cdn.sxiaohe.top/img/banners/css.webp"
      },
      {
        name: "Js",
        color: "#f7cb4f",
        icon: "https://cdn.sxiaohe.top/img/banners/js.webp"
      }
    ]
  }
];