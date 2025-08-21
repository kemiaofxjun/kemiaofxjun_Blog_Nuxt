<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
<footer class="z-footer">
	<nav class="footer-nav">
		<div id="footer_deal" v-for="deal in appConfig.footer.deal" :key="deal.name">
			<div v-for="left in deal.left" :key="left.icon">
				<a class="deal_link" target="_blank" rel="noopener" :href="left.link" :title="left.name">
					<i :class="left.icon"></i>
				</a>
			</div>
			<div v-for="miniLogo in deal.miniLogo" :key="miniLogo.title">
				<div class="nolazyload footer_mini_logo" id="footer_mini_logo" :title="miniLogo.name" onclick="sco.toTop()">
					<img :src="miniLogo.icon" :alt="miniLogo.name">
				</div>
			</div>
			<div v-for="right in deal.right" :key="right.icon">
				<a class="deal_link" target="_blank" rel="noopener" :href="right.link" :title="right.name">
					<i :class="right.icon"></i>
				</a>
			</div>
		</div>
		<div v-for="(group, groupIndex) in appConfig.footer.nav" :key="groupIndex" class="footer-nav-group">
			<h3 v-if="group.title">
				{{ group.title }}
			</h3>
			<menu>
				<li v-for="(item, itemIndex) in group.items" :key="itemIndex">
					<ZRawLink :to="item.url">
						<Icon :name="item.icon" />
						<span class="nav-text">{{ item.text }}</span>
					</ZRawLink>
				</li>
			</menu>
		</div>
	</nav>
	<p v-html="appConfig.footer.copyright" />
	<p v-html="appConfig.footer.message" />
</footer>
</template>

<style lang="scss" scoped>
.z-footer {
	margin: 3rem 1rem;
	font-size: 0.9em;
	color: var(--c-text-2);

	.footer-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 5vw clamp(2rem, 5%, 5vw);
		padding-block: 3rem;

		h3 {
			margin: 0.5em;
			font: inherit;
		}

		a {
			display: flex;
			align-items: center;
			gap: 0.3em;
			width: fit-content;
			padding: 0.3em 0.5em;
			border-radius: 0.5em;
			font-size: 0.9em;
			transition: background-color 0.2s, color 0.1s;

			&:hover {
				background-color: var(--c-bg-soft);
				color: var(--c-text);
			}
		}
	}

	p {
		margin: 0.5em;
	}
}
#footer #footer_deal {
    justify-content: center;
    display: flex;
    padding-top: 2rem;
    align-items: center;

	#footer #footer_deal .deal_link {
		display: flex;
		color: var(--efu-card-bg);
		width: 32px;
		height: 32px;
		justify-content: center;
		align-items: center;
		margin: 1rem 27px;
		border-radius: 3rem;
		background: var(--efu-fontcolor);
		transition: 0.3s;
		#footer #footer_deal i {
			font-size: 0.8rem;
			line-height: 0.9rem;
			height: 0.9rem;
		}
	}

	#footer #footer_deal .footer_mini_logo {
		width: 50px;
		height: 50px;
		cursor: pointer;
		user-select: none;
		margin: 0px 1rem;
		transition: 0.5s cubic-bezier(0, 0, 0, 1.29);
		border-radius: 50px;
		overflow: hidden;
	}
}
</style>
