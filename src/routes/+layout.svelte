<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
  
  	let { children } = $props();
</script>

<div class="flex flex-col h-screen w-full bg-black overflow-hidden">
  
  <Header />

  <div class="flex flex-1 w-full h-full overflow-hidden">
    
    <Sidebar />
    
    <main class="flex-1 overflow-y-auto p-4 text-white">
      {@render children()}
    </main>
    
  </div>
</div>