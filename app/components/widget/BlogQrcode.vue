<script setup lang="ts">
const appConfig = useAppConfig()

const TuiJian_QRcode_data = [
    {
        class: 'TuiJian_box1',
        name: '快速打开移动端➤', 
        image: '/assets/img/QRcode/www.myxz.top.png' 
    },
    { 
        class: 'TuiJian_box1',
        name: '下载移动端APP➤', 
        image: '/assets/img/QRcode/www.myxz.top.png' 
    },
]
</script>

<template>
    <div class="Qrcode" id="TuiJian">
        <div id="TuiJian_items">
            <div :class="TuiJian_QRcode_data.class">
                <div class="TuiJian_contect_left">
                    <p>
                        扫一扫
                    </p>
                    <span>
                        {{ TuiJian_QRcode_data.name }}
                    </span>
                </div>
                <div class="TuiJian_contect_right">
                    <div class="TuiJian_contect_image_box">
                        <img :src="TuiJian_QRcode_data.image" alt="Qrcode">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>