<script>
	import axios from "axios";
	import { afterNavigate, goto } from "$app/navigation";
	import { authStatus } from "$lib/store";
	import Cookies from "js-cookie";
	import { back_api, category_list, siteName } from "$src/lib/const";
	import { page } from "$app/stores";
	import SeoMeta from "$src/lib/components/SeoMeta.svelte";
	import { onMount } from "svelte";

	let seoValue = {};
	export let data;

	$: data, setData();

	function setData() {
		seoValue = data.seoValue;
	}

	onMount(() => {
		const getAuthStatus = Cookies.get("auth_status");
		if (getAuthStatus) {
			$authStatus = "ok";
		}
	});

	afterNavigate(async () => {
		const delArr = Cookies.get("del_list_cookie");
		if (delArr) {
			const deleteArr = delArr?.split(",");
			await axios
				.post(`${back_api}/editor/nosave_del`, { deleteArr })
				.then(() => {
					Cookies.remove("del_list_cookie");
				});
		}
	});

	function goCateMenu() {
		const href = this.href.split("/");
		const lastHref = href[href.length - 1];
		goto(`/menu/${lastHref}`);
	}

	function testTimeFunc() {
		axios
			.get(`${back_api}/test_time`)
			.then((res) => {
				console.log("성공~");
			})
			.catch((err) => {
				console.log("실패~");
			});
	}
</script>

<svelte:head>
	{#if $page.url.pathname == "/"}
		<SeoMeta bind:seoValue />
	{/if}

	<!-- SUIT 폰트 CSS -->
	<link
		href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css"
		rel="stylesheet"
	/>
	<link
		href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
		rel="stylesheet"
	/>
</svelte:head>

<header>
	<div
		class="mt-8 pb-4 text-4xl text-center border-b border-gray-300 title-font relative"
		data-sveltekit-preload-data="tap"
		data-sveltekit-reload
	>
		<a href="/">
			<div class="flex justify-center gap-2 max-w-xs mx-auto">
				<img src="/logo.png" alt="" />
			</div>
		</a>
	</div>
	<div class="border-b border-gray-300 suit-font">
		<nav>
			<ul
				data-sveltekit-preload-data="tap"
				data-sveltekit-reload
				class="flex justify-center gap-8 py-2 text-lg"
			>
				<li class="cursor-pointer">
					<a href="/site"> 분양현장 </a>
				</li>
				<li class="cursor-pointer">
					<a href="/view"> 게시판 </a>
				</li>
				<li class="cursor-pointer">
					<a href="/board"> 커뮤니티 </a>
				</li>
			</ul>
		</nav>
	</div>
</header>

<div class="max_screen mx-auto">
	<slot />
</div>

<div class="border-t">
	<div
		class="max_screen mx-auto my-4 suit-font grid grid-cols-1 md:grid-cols-3 px-3"
	>
		<div class="col-span-2 mt-2 text-center text-sm">
			<span class="inline-block">주소 : 경기도 부천시 경인로 37 / </span>
			<span class="inline-block">사이트명 : {siteName} / </span>
			<span class="inline-block">담당자 : 김승아 </span>
			<!-- <button
				class="bg-blue-500 focus:bg-blue-600 text-white text-xs px-2 py-1 rounded-lg"
				on:click={testTimeFunc}
			>
				체크하기
			</button> -->
		</div>
	</div>
</div>

<style>
	@font-face {
		font-family: "OKDDUNG";
		src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2206-02@1.0/OKDDUNG.woff2")
			format("woff2");
		font-weight: normal;
		font-style: normal;
	}
	@font-face {
		font-family: "KBO-Dia-Gothic_bold";
		src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/KBO-Dia-Gothic_bold.woff")
			format("woff");
		font-weight: 700;
		font-style: normal;
	}

	:global(.kbo-font) {
		font-family: "KBO-Dia-Gothic_bold";
	}

	:global(.title-font) {
		font-family: "OKDDUNG";
	}

	:global(.suit-font) {
		font-family: "SUIT" !important;
	}

	:global(.max_screen) {
		max-width: 868px;
	}

	:global(.max_screen_inner) {
		max-width: 616px;
	}

	:global(.main_img h1) {
		text-align: center;
		font-size: 40px;
		font-weight: bolder;
		position: relative;
	}
</style>
