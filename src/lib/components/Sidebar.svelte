<script lang="ts">
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

  function toggleMenu(menu: keyof typeof openMenus) {
    openMenus[menu] = !openMenus[menu];
  }
</script>

<div class="bg-black w-[250px] h-[calc(100vh-48px)] pt-[7px] pr-[7px] pb-[26px] pl-[9px] flex flex-col justify-between items-center gap-y-[35px] overflow-y-auto [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#666] [&::-webkit-scrollbar-thumb]:rounded-[10px] font-['Calibri',sans-serif]">
  <div class="w-full">
    <ul class="w-full flex flex-col m-0 p-0 list-none">
      <li class="relative z-10 mb-[30px]">
        <button
          type="button"
          class="relative w-full font-['Inter',sans-serif] text-white pl-[18px] py-[15px] bg-[#171717]/80 flex items-center text-[16px] leading-[22px] border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e]"
          onclick={() => isPlatformPickerOpen = !isPlatformPickerOpen}
        >
          <img src={ofMenuIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">
          Onlyfans
          <span class="absolute right-[40px] w-[11px] h-[11px] bg-[#fb609f] rounded-full top-1/2 -translate-y-1/2"></span>
        </button>

        {#if isPlatformPickerOpen}
          <div class="absolute left-[-9px] top-[100%] min-w-full w-[max(100%,253px)] bg-[#171717] rounded-[8px] p-[10px] z-[2000] shadow-[0_10px_28px_rgba(0,0,0,0.45)] mt-1">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { id: 'onlyfans', name: 'OnlyFans', icon: ofMenuIcon, count: 0 },
                { id: 'fansly', name: 'Fansly', icon: fanslyIcon, count: 0 },
                { id: 'mym', name: 'MYM', icon: mymIcon, count: 0 },
                { id: 'fanvue', name: 'Fanvue', icon: fanvuIcon, count: 0, beta: true }
              ] as platform}
                <li
                  class="flex items-center gap-[10px] py-[6px] pl-[6px] pr-[14px] text-white cursor-pointer text-[16px] leading-[1.2] hover:bg-[#a3583e] hover:rounded-[8px] {selectedPlatform === platform.id ? '' : ''}"
                  onclick={() => { selectedPlatform = platform.id; isPlatformPickerOpen = false; }}
                >
                  <span class="w-[23px] h-[24px] shrink-0 inline-flex items-center justify-center transition-opacity {selectedPlatform === platform.id ? 'opacity-100' : 'opacity-0'}">
                    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 12.3L9.4 15.7L17.5 7.6" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </span>
                  <img class="shrink-0 object-contain rounded-[4px] w-[19px] h-[19px]" src={platform.icon} alt="">
                  <span class="grow shrink min-w-0 font-normal font-['Inter']">{platform.name}</span>
                  <span class="inline-flex items-center gap-[8px] shrink-0">
                    {#if platform.beta}
                      <span class="inline-flex items-center justify-center py-[1px] px-[5px] text-[15px] leading-none text-[#b2b2b2] bg-[#666666] rounded-[10px] font-medium mr-[5px]">Beta</span>
                    {/if}
                    <span class="min-w-[20px] h-[20px] px-[7px] rounded-[11px] bg-[#fb609f] text-white text-[12px] font-medium inline-flex items-center justify-center shrink-0">{platform.count}</span>
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-[5px]">
        <a href="https://xn--nfloww-vva.com/app/index.html" class="flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-white bg-[#0e0e0e] rounded-[10px] font-bold no-underline">
          <img src={homeIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Dashboard
        </a>
      </li>

      <li class="mb-[5px]">
        <button
          type="button"
          class="relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] bg-transparent border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] hover:text-white transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={() => toggleMenu('ofManager')}
        >
          <img src={ofIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> OF Manager
        </button>
        {#if openMenus.ofManager}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { name: 'New post', icon: newPostIcon, link: '#' },
                { name: 'Notifications', icon: notificationsIcon, link: '#' },
                { name: 'Messages Basic', icon: messagesBasicIcon, link: '#' },
                { name: 'Vault', icon: vaultIcon, link: '#' },
                { name: 'Queue', icon: queueIcon, link: '#' },
                { name: 'Collections', icon: collectionsIcon, link: '#' },
                { name: 'Statements', icon: statementsIcon, link: 'https://xn--nfloww-vva.com/app/of-statements.html' },
                { name: 'Statistics', icon: statisticsIcon, link: 'https://xn--nfloww-vva.com/app/of-statistics.html' },
                { name: 'Bank', icon: bankIcon, link: '#' },
                { name: 'My Profile', icon: myProfileIcon, link: '#' },
                { name: 'OF Settings', icon: ofSettingsIcon, link: '#' }
              ] as item}
                <li>
                  <a href={item.link} class="flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in hover:bg-[#262e43] hover:text-white">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">{item.name}
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
          class="relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] bg-transparent border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] hover:text-white transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={() => toggleMenu('analytics')}
        >
          <img src={analyticsIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Analytics
        </button>
        {#if openMenus.analytics}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { name: 'Creator reports', icon: creatorIcon, link: 'https://xn--nfloww-vva.com/app/creator.html' },
                { name: 'Employee reports', icon: personIcon, link: 'https://xn--nfloww-vva.com/app/employee-reports.html' },
                { name: 'Fan reports', icon: fanIcon, link: 'https://xn--nfloww-vva.com/app/fan-reports.html' },
                { name: 'Message dashboard', icon: messageDashboardIcon, link: '#' }
              ] as item}
                <li>
                  <a href={item.link} class="flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in hover:bg-[#262e43] hover:text-white">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <li class="mb-[5px]">
        <a href="#" class="relative flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline hover:bg-[#0e0e0e] hover:text-white transition-colors">
          <img src={messagesProIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Messages Pro
          <span class="absolute right-[42px] w-[15px] h-[15px] text-center rounded-full bg-[#fb609f] text-white text-[12px] leading-[1.4] top-[13px] font-normal">0</span>
          <img src={messagesProRightIcon} class="absolute w-[26px] h-[26px] right-0 block" alt="">
        </a>
      </li>

      <li class="mb-[5px]">
        <button
          type="button"
          class="relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] bg-transparent border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] hover:text-white transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={() => toggleMenu('growth')}
        >
          <img src={growthIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Growth
        </button>
        {#if openMenus.growth}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { name: 'Smart Messages', icon: smartMessagesIcon, link: '#' },
                { name: 'Smart lists', icon: smartListsIcon, link: '#' },
                { name: 'Auto-follow', icon: autoFollowIcon, link: '#' },
                { name: 'Vault Pro', icon: vaultIcon, link: '#' },
                { name: 'Scripts', icon: scriptsIcon, link: '#' },
                { name: 'Profile promotion', icon: profilePromotionIcon, link: '#' },
                { name: 'Free trial links', icon: freeTrialLinksIcon, link: '#' },
                { name: 'Tracking links', icon: trackingLinksIcon, link: '#' },
                { name: 'Sensitive words', icon: sensitiveWordsIcon, link: '#' },
                { name: 'AI Copilot', icon: aiCopilotIcon, link: '#' }
              ] as item}
                <li>
                  <a href={item.link} class="flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in hover:bg-[#262e43] hover:text-white">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">{item.name}
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
          class="relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] bg-transparent border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] hover:text-white transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={() => toggleMenu('share')}
        >
          <img src={shareIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Share for Share
        </button>
        {#if openMenus.share}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { name: 'Discover Creators', icon: discoverCreatorsIcon, link: '#' },
                { name: 'Requests', icon: requestsIcon, link: '#' },
                { name: 'S4S Schedule', icon: s4sScheduleIcon, link: '#' },
                { name: 'S4S Settings', icon: settingsIcon, link: '#' }
              ] as item}
                <li>
                  <a href={item.link} class="flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in hover:bg-[#262e43] hover:text-white">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">{item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </li>

      <hr class="border-[#171717] opacity-100 my-4 border-t w-full">

      <li class="mb-[5px]">
        <button
          type="button"
          class="relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] bg-transparent border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] hover:text-white transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={() => toggleMenu('creators')}
        >
          <img src={creatorIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Creators
        </button>
        {#if openMenus.creators}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { name: 'Manage Creators', icon: creatorIcon, link: 'https://xn--nfloww-vva.com/app/manage-creators.html' },
                { name: 'Custom proxy', icon: customProxyIcon, link: '#' }
              ] as item}
                <li>
                  <a href={item.link} class="flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in hover:bg-[#262e43] hover:text-white">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">{item.name}
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
          class="relative w-full flex items-center py-[10px] pl-[12px] pr-[24px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] bg-transparent border-0 rounded-[10px] font-bold cursor-pointer hover:bg-[#0e0e0e] hover:text-white transition-colors after:content-[''] after:absolute after:right-[8px] after:top-1/2 after:-translate-y-1/2 after:w-[1.2em] after:h-[1.2em] after:bg-current after:[mask:url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%201024%201024%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M487.456%20613.6l24.128%2024.128%20193.12-193.12-24.128-24.128-168.992%20168.992-168.192-168.192-24.128%2024.128%2096.416%2096.416z%22/%3E%3C/svg%3E')_center/contain_no-repeat] after:text-[#d6d9df] after:transition-all after:duration-400"
          onclick={() => toggleMenu('employees')}
        >
          <img src={personIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Employees
        </button>
        {#if openMenus.employees}
          <div class="mt-[5px]">
            <ul class="m-0 p-0 list-none flex flex-col">
              {#each [
                { name: 'Manage employees', icon: personIcon, link: 'https://xn--nfloww-vva.com/app/employees.html' },
                { name: 'Shift schedule', icon: shiftScheduleIcon, link: '#' }
              ] as item}
                <li>
                  <a href={item.link} class="flex items-center w-full py-[10px] pl-[25px] pr-[10px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline transition-all duration-400 ease-in hover:bg-[#262e43] hover:text-white">
                    <img src={item.icon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt="">{item.name}
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
        <a href="#" class="flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline hover:bg-[#0e0e0e] hover:text-white transition-colors">
          <img src={settingsIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Settings
        </a>
      </li>
      <li class="mb-0">
        <a href="#" class="flex items-center w-full py-[10px] px-[12px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[#9e9e9e] rounded-[10px] font-bold no-underline hover:bg-[#0e0e0e] hover:text-white transition-colors">
          <img src={helpCenterIcon} class="w-[19px] h-[19px] object-contain mr-[8px]" alt=""> Help center
        </a>
      </li>
    </ul>
    <p class="pl-[12px] mt-[20px] text-[16px] font-bold text-[#9E9E9E] leading-[1.25] mb-0 font-['Calibri',sans-serif]">Version 5.7.3</p>
  </div>
</div>