<script lang="ts" setup>
import { siteLinkItems } from '~/siteCard'
import SiteLinkCard from '../components/card/siteLinkCard.vue';
</script>

<template>
<div class="sitelinkHead">
	<h2> 站点 </h2>
</div>

<Tab :tabs="['服务', '分站', '推荐']">
	<template #tab1>
		<SiteLinkCard />
	</template>
	<template #tab2>
		<SiteLinkCard />
	</template>
	<template #tab3>
		<SiteLinkCard />
	</template>
</Tab>

</template>