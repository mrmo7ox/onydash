<script lang="ts">
  import { page } from '$app/stores';
  
  import ofMenuIcon from '$lib/assets/of-menu-icon.png';
  import fanslyIcon from '$lib/assets/fansly_icon.png';
  import mymIcon from '$lib/assets/mym_icon.png';
  import fanvuIcon from '$lib/assets/fanvu_icon.png';
  
  import homeIcon from '$lib/assets/home-icon.svg';
  import ofIcon from '$lib/assets/of-icon.png';
  import newPostIcon from '$lib/assets/new_post.png';
  import notificationsIcon from '$lib/assets/notifications.png';
  import messagesBasicIcon from '$lib/assets/messages_basic_icon.png';
  import vaultIcon from '$lib/assets/vault_icon.png';
  import queueIcon from '$lib/assets/queue_icon.png';
  import collectionsIcon from '$lib/assets/collections_icon.png';
  import statementsIcon from '$lib/assets/statements_icon.png';
  import statisticsIcon from '$lib/assets/statistics_icon.png';
  import bankIcon from '$lib/assets/bank_icon.png';
  import myProfileIcon from '$lib/assets/my_profile_icon.png';
  import ofSettingsIcon from '$lib/assets/of_settings_icon.png';
  import analyticsIcon from '$lib/assets/analytics-icon.svg';
  import creatorIcon from '$lib/assets/creator-icon.svg';
  import personIcon from '$lib/assets/person-icon.svg';
  import fanIcon from '$lib/assets/fan-icon.svg';
  import messageDashboardIcon from '$lib/assets/message-dashboard-icon.svg';
  import messagesProIcon from '$lib/assets/messages-pro-icon.png';
  import messagesProRightIcon from '$lib/assets/messages-pro-right-icon.png';
  import growthIcon from '$lib/assets/growth-icon.svg';
  import smartMessagesIcon from '$lib/assets/smart_messages_icon.png';
  import smartListsIcon from '$lib/assets/smart_lists_icon.png';
  import autoFollowIcon from '$lib/assets/auto_follow_icon.png';
  import scriptsIcon from '$lib/assets/scripts_icon.png';
  import profilePromotionIcon from '$lib/assets/profile_promotion_icon.png';
  import freeTrialLinksIcon from '$lib/assets/free_trial_links_icon.png';
  import trackingLinksIcon from '$lib/assets/tracking_links_icon.png';
  import sensitiveWordsIcon from '$lib/assets/sensitive_words_icon.png';
  import aiCopilotIcon from '$lib/assets/ai_copilot_icon.png';
  import shareIcon from '$lib/assets/share-icon.svg';
  import discoverCreatorsIcon from '$lib/assets/discover_creators_icon.png';
  import requestsIcon from '$lib/assets/requests_icon.png';
  import s4sScheduleIcon from '$lib/assets/s4s_schedule_icon.png';
  import settingsIcon from '$lib/assets/settings-icon.png';
  import customProxyIcon from '$lib/assets/custom_proxy_icon.png';
  import shiftScheduleIcon from '$lib/assets/shift_schedule_icon.png';
  import helpCenterIcon from '$lib/assets/help-center-icon.png';

  let currentPath = $derived($page.url.pathname);

  let isPlatformPickerOpen = $state(false);
  let selectedPlatform = $state('onlyfans');

  let openMenus = $state({
    ofManager: false,
    analytics: false,
    growth: false,
    share: false,
    creators: false,
    employees: false
  });

  // State to hold notification counts for each platform
  let platformCounts = $state({
    onlyfans: 0,
    fansly: 0,
    mym: 0,
    fanvue: 0
  });

  let messagesProCount = $state(0);
  let isEditingMsgCount = $state(false);

  const platforms = [
    { id: 'onlyfans', name: 'OnlyFans', icon: ofMenuIcon, beta: false },
    { id: 'fansly', name: 'Fansly', icon: fanslyIcon, beta: false },
    { id: 'mym', name: 'MYM', icon: mymIcon, beta: false },
    { id: 'fanvue', name: 'Fanvue', icon: fanvuIcon, beta: true }
  ];

  let currentPlatformData = $derived(platforms.find(p => p.id === selectedPlatform) || platforms[0]);

  // --- Menu Item Data ---
  const ofManagerItems = [
    { name: 'New post', icon: newPostIcon, link: '/new-post' },
    { name: 'Notifications', icon: notificationsIcon, link: '/notifications' },
    { name: 'Messages Basic', icon: messagesBasicIcon, link: '/messages-basic' },
    { name: 'Vault', icon: vaultIcon, link: '/vault' },
    { name: 'Queue', icon: queueIcon, link: '/queue' },
    { name: 'Collections', icon: collectionsIcon, link: '/collections' },
    { name: 'Statements', icon: statementsIcon, link: '/of-statements' },
    { name: 'Statistics', icon: statisticsIcon, link: '/of-statistics' },
    { name: 'Bank', icon: bankIcon, link: '/bank' },
    { name: 'My Profile', icon: myProfileIcon, link: '/my-profile' },
    { name: 'OF Settings', icon: ofSettingsIcon, link: '/of-settings' }
  ];

  const analyticsItems = [
    { name: 'Creator reports', icon: creatorIcon, link: '/creator' },
    { name: 'Employee reports', icon: personIcon, link: '/employee-reports' },
    { name: 'Fan reports', icon: fanIcon, link: '/fan-reports' },
    { name: 'Message dashboard', icon: messageDashboardIcon, link: '/message-dashboard' }
  ];

  const growthItems = [
    { name: 'Smart Messages', icon: smartMessagesIcon, link: '/smart-messages' },
    { name: 'Smart lists', icon: smartListsIcon, link: '/smart-lists' },
    { name: 'Auto-follow', icon: autoFollowIcon, link: '/auto-follow' },
    { name: 'Vault Pro', icon: vaultIcon, link: '/vault-pro' },
    { name: 'Scripts', icon: scriptsIcon, link: '/scripts' },
    { name: 'Profile promotion', icon: profilePromotionIcon, link: '/profile-promotion' },
    { name: 'Free trial links', icon: freeTrialLinksIcon, link: '/free-trial-links' },
    { name: 'Tracking links', icon: trackingLinksIcon, link: '/tracking-links' },
    { name: 'Sensitive words', icon: sensitiveWordsIcon, link: '/sensitive-words' },
    { name: 'AI Copilot', icon: aiCopilotIcon, link: '/ai-copilot' }
  ];

  const shareItems = [
    { name: 'Discover Creators', icon: discoverCreatorsIcon, link: '/discover-creators' },
    { name: 'Requests', icon: requestsIcon, link: '/requests' },
    { name: 'S4S Schedule', icon: s4sScheduleIcon, link: '/s4s-schedule' },
    { name: 'S4S Settings', icon: settingsIcon, link: '/s4s-settings' }
  ];

  const creatorsItems = [
    { name: 'Manage Creators', icon: creatorIcon, link: '/manage-creators' },
    { name: 'Custom proxy', icon: customProxyIcon, link: '/custom-proxy' }
  ];

  const employeesItems = [
    { name: 'Manage employees', icon: personIcon, link: '/employees' },
    { name: 'Shift schedule', icon: shiftScheduleIcon, link: '/shift-schedule' }
  ];

  let initialized = false;

  $effect(() => {
    if (typeof window !== 'undefined') {
      if (!initialized) {
        const storedCounts = localStorage.getItem('platformCounts');
        if (storedCounts) try { Object.assign(platformCounts, JSON.parse(storedCounts)); } catch (e) {}
        
        const storedPlatform = localStorage.getItem('selectedPlatform');
        if (storedPlatform) selectedPlatform = storedPlatform;

        const storedMsgPro = localStorage.getItem('messagesProCount');
        if (storedMsgPro) messagesProCount = parseInt(storedMsgPro, 10) || 0;
        
        // Auto-open menu if child route is active
        if (ofManagerItems.some(i => i.link === currentPath)) openMenus.ofManager = true;
        if (analyticsItems.some(i => i.link === currentPath)) openMenus.analytics = true;
        if (growthItems.some(i => i.link === currentPath)) openMenus.growth = true;
        if (shareItems.some(i => i.link === currentPath)) openMenus.share = true;
        if (creatorsItems.some(i => i.link === currentPath)) openMenus.creators = true;
        if (employeesItems.some(i => i.link === currentPath)) openMenus.employees = true;

        initialized = true;
      } else {
        localStorage.setItem('platformCounts', JSON.stringify(platformCounts));
        localStorage.setItem('selectedPlatform', selectedPlatform);
        localStorage.setItem('messagesProCount', messagesProCount.toString());
      }
    }
  });

  function toggleMenu(menu: keyof typeof openMenus) {
    openMenus[menu] = !openMenus[menu];
  }

  function closeDropdowns() {
    isPlatformPickerOpen = false;
  }
</script>

<svelte:document onclick={closeDropdowns} />

<div class="bg-black w-[250px] h-[calc(100vh-48px)] pt-[7px] pr-[7px] pb-[26px] pl-[9px] flex flex-col justify-between items-center gap-y-[35px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] font-['Calibri',sans-serif]">
  <div class="w-full">
    <ul class="w-full flex flex-col m-0 p-0 list-none">
      
      <li class="relative z-10 mb-[30px]">
        <button
          type="button"
          class="relative w-full font-['Inter',sans-serif] text-white pl-[18px] pr-[40px] py-[15px] bg-[#171717]/80 flex items-center text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] after:content-[''] after:absolute after:right-[12px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={(e) => {
            e.stopPropagation();
            isPlatformPickerOpen = !isPlatformPickerOpen;
          }}
        >
          <img src={currentPlatformData.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">
          {currentPlatformData.name}
          <span class="absolute right-[40px] w-[11px] h-[11px] bg-[#fb609f] rounded-full top-1/2 -translate-y-1/2 inline-block"></span>
        </button>

        {#if isPlatformPickerOpen}
          <div class="absolute left-[-9px] top-[100%] min-w-full w-[max(100%,253px)] bg-[#171717] rounded-[8px] p-[10px] z-[2000] shadow-[0_10px_28px_rgba(0,0,0,0.45)] mt-1">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each platforms as platform}
                <li
                  class="flex items-center gap-[10px] py-[6px] pl-[6px] pr-[14px] text-white cursor-pointer text-[16px] leading-[1.2] hover:bg-[#a3583e] hover:rounded-[8px] mb-0"
                  onclick={(e) => { 
                    e.stopPropagation();
                    selectedPlatform = platform.id;
                    isPlatformPickerOpen = false; 
                  }}
                >
                  <span class="w-[23px] h-[24px] shrink-0 inline-flex items-center justify-center transition-opacity duration-200 {selectedPlatform === platform.id ? 'opacity-100' : 'opacity-0'}">
                    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12.3L9.4 15.7L17.5 7.6" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </span>
                  <img class="w-[22px] h-[22px] shrink-0 object-contain rounded-[4px]" src={platform.icon} alt="">
                  <span class="grow shrink basis-0 min-w-0 font-normal font-['Inter']">{platform.name}</span>
                  <span class="inline-flex items-center gap-[8px] shrink-0">
                    {#if platform.beta}
                      <span class="inline-flex items-center justify-center py-[1px] px-[5px] text-[15px] leading-none text-[#b2b2b2] bg-[#666666] rounded-[10px] font-medium mr-[5px]">Beta</span>
                    {/if}
                    <span class="min-w-[20px] h-[20px] px-[7px] rounded-[11px] bg-[#fb609f] text-white text-[12px] font-medium inline-flex items-center justify-center shrink-0">
                      {platformCounts[platform.id]}
                    </span>
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-[5px]">
        <a href="/" class="group flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-colors {currentPath === '/' ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}">
          <img src={homeIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === '/' ? 'opacity-100' : 'opacity-[0.62] group-hover:opacity-100'}" alt=""> Dashboard
        </a>
      </li>

      <li class="mb-[5px]">
        <button
          type="button"
          class="group relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400 {ofManagerItems.some(i => i.link === currentPath) ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}"
          onclick={() => toggleMenu('ofManager')}
        >
          <img src={ofIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {ofManagerItems.some(i => i.link === currentPath) ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> OF Manager
        </button>
        {#if openMenus.ofManager}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each ofManagerItems as item}
                <li>
                  <a href={item.link} class="group flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in {currentPath === item.link ? 'bg-[#262e43] text-white' : 'text-[#9e9e9e] hover:bg-[#262e43] hover:text-white'}">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === item.link ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-[5px]">
        <button
          type="button"
          class="group relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400 {analyticsItems.some(i => i.link === currentPath) ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}"
          onclick={() => toggleMenu('analytics')}
        >
          <img src={analyticsIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {analyticsItems.some(i => i.link === currentPath) ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Analytics
        </button>
        {#if openMenus.analytics}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each analyticsItems as item}
                <li>
                  <a href={item.link} class="group flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in {currentPath === item.link ? 'bg-[#262e43] text-white' : 'text-[#9e9e9e] hover:bg-[#262e43] hover:text-white'}">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === item.link ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-[5px]">
        <a href="/messages-pro" class="group relative flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-colors {currentPath === '/messages-pro' ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}">
          <img src={messagesProIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === '/messages-pro' ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Messages Pro
          
          {#if isEditingMsgCount}
            <input 
              type="number" 
              bind:value={messagesProCount} 
              class="absolute right-[40px] w-[35px] h-[18px] text-center rounded-[10px] bg-[#fb609f] text-white text-[12px] font-normal outline-none border-0 top-[11px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autofocus
              onblur={() => isEditingMsgCount = false}
              onclick={(e) => e.stopPropagation()}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  isEditingMsgCount = false;
                }
              }}
            />
          {:else}
            <span 
              class="absolute right-[42px] px-[5px] min-w-[15px] h-[15px] flex items-center justify-center rounded-full bg-[#fb609f] text-white text-[12px] leading-[1.4] top-[13px] font-normal cursor-pointer hover:scale-110 transition-transform"
              onclick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                isEditingMsgCount = true;
              }}
            >
              {messagesProCount}
            </span>
          {/if}

          <img src={messagesProRightIcon} class="mr-2 absolute w-[26px] h-[26px] right-0 block transition-all duration-200 {currentPath === '/messages-pro' ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">
        </a>
      </li>

      <li class="mb-[5px]">
        <button
          type="button"
          class="group relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400 {growthItems.some(i => i.link === currentPath) ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}"
          onclick={() => toggleMenu('growth')}
        >
          <img src={growthIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {growthItems.some(i => i.link === currentPath) ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Growth
        </button>
        {#if openMenus.growth}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each growthItems as item}
                <li>
                  <a href={item.link} class="group flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in {currentPath === item.link ? 'bg-[#262e43] text-white' : 'text-[#9e9e9e] hover:bg-[#262e43] hover:text-white'}">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === item.link ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-[5px]">
        <button
          type="button"
          class="group relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400 {shareItems.some(i => i.link === currentPath) ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}"
          onclick={() => toggleMenu('share')}
        >
          <img src={shareIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {shareItems.some(i => i.link === currentPath) ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Share for Share
        </button>
        {#if openMenus.share}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each shareItems as item}
                <li>
                  <a href={item.link} class="group flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in {currentPath === item.link ? 'bg-[#262e43] text-white' : 'text-[#9e9e9e] hover:bg-[#262e43] hover:text-white'}">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === item.link ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <hr class="border-[#171717] opacity-100 my-[13px] border-t w-full">

      <li class="mb-[5px]">
        <button
          type="button"
          class="group relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400 {creatorsItems.some(i => i.link === currentPath) ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}"
          onclick={() => toggleMenu('creators')}
        >
          <img src={creatorIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {creatorsItems.some(i => i.link === currentPath) ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Creators
        </button>
        {#if openMenus.creators}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each creatorsItems as item}
                <li>
                  <a href={item.link} class="group flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in {currentPath === item.link ? 'bg-[#262e43] text-white' : 'text-[#9e9e9e] hover:bg-[#262e43] hover:text-white'}">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === item.link ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-0">
        <button
          type="button"
          class="group relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400 {employeesItems.some(i => i.link === currentPath) ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] bg-transparent hover:bg-[#0e0e0e] hover:text-white'}"
          onclick={() => toggleMenu('employees')}
        >
          <img src={personIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {employeesItems.some(i => i.link === currentPath) ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Employees
        </button>
        {#if openMenus.employees}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each employeesItems as item}
                <li>
                  <a href={item.link} class="group flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in {currentPath === item.link ? 'bg-[#262e43] text-white' : 'text-[#9e9e9e] hover:bg-[#262e43] hover:text-white'}">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === item.link ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>
    </ul>
  </div>

  <div class="w-full">
    <hr class="border-[#171717] opacity-100 my-4 border-t w-full">
    <ul class="w-full flex flex-col m-0 p-0 list-none">
      <li class="mb-[5px]">
        <a href="/settings" class="group flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-colors {currentPath === '/settings' ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] hover:bg-[#0e0e0e] hover:text-white'}">
          <img src={settingsIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === '/settings' ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Settings
        </a>
      </li>
      <li class="mb-0">
        <a href="/help-center" class="group flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] rounded-[10px] font-bold no-underline transition-colors {currentPath === '/help-center' ? 'text-white bg-[#0e0e0e]' : 'text-[#9e9e9e] hover:bg-[#0e0e0e] hover:text-white'}">
          <img src={helpCenterIcon} class="w-[19px] h-[19px] object-contain mr-[8px] transition-all duration-200 {currentPath === '/help-center' ? 'brightness-[500%] grayscale' : 'group-hover:brightness-[500%] group-hover:grayscale'}" alt=""> Help center
        </a>
      </li>
    </ul>
    <p class="pl-[12px] mt-[20px] text-[16px] font-bold text-[#9E9E9E] leading-[1.25] mb-0 font-['Calibri',sans-serif]">Version 5.7.3</p>
  </div>
</div>