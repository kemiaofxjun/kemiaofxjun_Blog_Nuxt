// 定义外层分类的类型接口
export interface CreativityData {
  class_name: string;       // 分类名称
  subtitle: string;
  creativity_list: CreativityItem[];  // 创意项列表
}

// 定义最内层创意项的类型接口
export interface CreativityItem {
  name: string;       // 技术名称
  color: string;      // 颜色值（十六进制/关键字）
  icon: string;       // 图标 URL 地址
}

// 具体数据（与 YAML 结构完全对应）
export const creativityData: CreativityData[] = [
  {
    class_name: "开启创造力",
    subtitle: '技能',
    creativity_list: [
      {
        name: "Java",
        color: "#fff",
        icon: "https://bu.dusays.com/2021/01/15/3015783c55c50.png"
      },
      {
        name: "Docker",
        color: "#57b6e6",
        icon: "https://bu.dusays.com/2021/01/15/3098eabc4fad5.png"
      },
      {
        name: "Photoshop",
        color: "#4082c3",
        icon: "https://bu.dusays.com/2021/01/15/264705e09d189.png"
      },
      {
        name: "Node",
        color: "#333",
        icon: "https://bu.dusays.com/2021/01/15/b54430e7a6fe8.png"
      },
      {
        name: "Webpack",
        color: "#2e3a41",
        icon: "https://bu.dusays.com/2021/01/15/5ab4cd50d5d35.png"
      },
      {
        name: "Pinia",
        color: "#fff",
        icon: "https://bu.dusays.com/2021/01/15/8f632bfd90059.png"
      },
      {
        name: "Python",
        color: "#fff",
        icon: "https://bu.dusays.com/2021/01/15/b37f959f4f221.png"
      },
      {
        name: "Vite",
        color: "#937df7",
        icon: "https://bu.dusays.com/2021/01/15/d99cca731ae25.png"
      },
      {
        name: "Flutter",
        color: "#4499e4",
        icon: "https://bu.dusays.com/2021/01/15/a6e1e9e3b6735.png"
      },
      {
        name: "Vue",
        color: "#b8f0ae",
        icon: "https://bu.dusays.com/2021/01/15/185712ef6a931.png"
      },
      {
        name: "React",
        color: "#222",
        icon: "https://bu.dusays.com/2021/01/15/24979ac342d0a.png"
      },
      {
        name: "CSS3",
        color: "#2c51db",
        icon: "https://bu.dusays.com/2021/01/15/fe90b52e443dc.png"
      },
      {
        name: "JS",
        color: "#f7cb4f",
        icon: "https://bu.dusays.com/2021/01/15/5644ac2b9c63d.png"
      },
      {
        name: "HTML",
        color: "#e9572b",
        icon: "https://bu.dusays.com/2021/01/15/aaaf518aec9c1.png"
      },
      {
        name: "Git",
        color: "#df5b40",
        icon: "https://bu.dusays.com/2021/01/15/8530f48b07ad0.png"
      },
      {
        name: "Apifox",
        color: "#e65164",
        icon: "https://bu.dusays.com/2021/01/15/d24ffd2267904.png"
      }
    ],
  },
];