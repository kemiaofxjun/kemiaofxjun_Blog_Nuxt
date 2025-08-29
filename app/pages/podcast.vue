<script lang="ts" setup>
import { siteTabs } from '~/siteCard'
import SiteLinkCard from '../components/card/siteLinkCard.vue';
</script>

<template>
<div class="sitelinkHead">
	<h2> 其他站点 </h2>
</div>

<Tab :tabs="siteTabs.name" center>
	<template #tab1>
		<SiteLinkCard />
	</template>
	<template #tab2>
		<SiteLinkCard />
	</template>
	<template>
	</template>
</Tab>
</template>