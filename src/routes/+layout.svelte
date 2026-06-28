
<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import favicon from '$lib/assets/favicon.svg';
	
  	let { children } = $props();
</script>
<svelte:head>
	<link rel="icon" href={favicon} />
	<title>infloww</title>
</svelte:head>
<div class="flex flex-col h-screen w-full bg-black overflow-hidden">
  <Header />
  <div class="flex flex-1 w-full h-full overflow-hidden">
    <Sidebar />
    <main class="flex-1 overflow-y-auto text-white">
      {@render children()}
    </main>
    
  </div>
</div>