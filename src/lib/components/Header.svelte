<script lang="ts">
  import hambugerIcon from '$lib/assets/hambuger-icon.png';
  import topGlobeIcon from '$lib/assets/top-globe-icon.png';
  import topInfoIcon from '$lib/assets/top-info-icon.png';
  import referralIcon from '$lib/assets/referral-icon.png';
  import trumpIcon from '$lib/assets/trump-icon.png';
  import alarmIcon from '$lib/assets/alarm-icon.png';
  import minIcon from '$lib/assets/min-icon.png';
  import maxIcon from '$lib/assets/max-icon.png';
  import closeIcon from '$lib/assets/close-icon.png';

  let sfwEnabled = $state(false);
  
  let isStatusOpen = $state(false);
  let isUserMenuOpen = $state(false);

  let selectedStatusLabel = $state('Operational');
  let selectedStatusColor = $state('#58A744');

  function closeDropdowns() {
    isStatusOpen = false;
    isUserMenuOpen = false;
  }
</script>

<svelte:document onclick={closeDropdowns} />

<div class="w-full flex items-center justify-between pt-[10px] pr-[14px] pb-[10px] pl-[14px] font-['Calibri',sans-serif]">
  <div class="flex items-center pl-[6px] pr-[8px]">
    <button type="button" class="bg-transparent border-0 p-0 outline-none cursor-pointer flex items-center justify-center">
      <img src={hambugerIcon} alt="" class="w-[19px] h-[19px] object-contain" />
    </button>
  </div>
  
  <div class="flex items-center justify-end w-full gap-[8px]">
    
    <div class="relative">
      <button 
        type="button"
        class="inline-flex items-center bg-[#171717] rounded-[8px] py-[6px] px-[7px] text-white cursor-pointer border-0 text-[16px] whitespace-nowrap outline-none"
        onclick={(e) => { 
          e.stopPropagation(); 
          isStatusOpen = !isStatusOpen; 
          isUserMenuOpen = false; 
        }}
      >
        <span class="w-[12px] h-[12px] rounded-full mr-[10px]" style="background-color: {selectedStatusColor}"></span>
        {selectedStatusLabel}
      </button>
      
      {#if isStatusOpen}
        <ul class="absolute top-[calc(100%+2px)] left-0 z-[1000] min-w-max bg-[#262626] rounded-[5px] m-0 py-[5px] px-0 list-none text-left border border-black/15 shadow-[0_0.5rem_1rem_rgba(0,0,0,0.15)]">
          {#each [
            { label: 'Operational', color: '#58A744' },
            { label: 'Partials Outage', color: '#F88056' },
            { label: 'Proxy service', color: '#58A744' },
            { label: 'Messages and notifications', color: '#58A744' },
            { label: 'Growth tools', color: '#58A744' },
            { label: 'Creator and employee management', color: '#58A744' },
            { label: 'Billing and balances', color: '#58A744' },
            { label: 'Share for share', color: '#58A744' },
            { label: 'Affiliate manager', color: '#58A744' },
            { label: 'Infloww.com', color: '#58A744' },
            { label: 'Reports', color: '#58A744' }
          ] as item}
            <li>
              <a 
                href="#" 
                class="block text-[13.6px] leading-[38px] text-[#C4D1C7] px-[12px] tracking-[0.5px] bg-[#262626] hover:bg-[#38393C] active:bg-[#38393C] no-underline whitespace-nowrap font-normal"
                onclick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectedStatusLabel = item.label;
                  selectedStatusColor = item.color;
                  isStatusOpen = false;
                }}
              >
                <span class="w-[12px] h-[12px] rounded-full mr-[10px] inline-block align-middle" style="background-color: {item.color}"></span>
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    <p class="inline-flex items-center bg-[#171717] rounded-[8px] py-[8px] px-[13px] text-[19px] font-semibold leading-[1.25] text-white m-0">
      <button type="button" class="mr-1 bg-transparent border-0 p-0 inline-block cursor-pointer outline-none">
        <img src={topGlobeIcon} alt="" class="mx-[1px]  w-[19px] h-[19px] align-middle" />
      </button>
      <span class="mx-[5px]">
        UTC+01:00
      </span>
      <button type="button" class=" bg-transparent border-0 p-0 inline-block cursor-pointer outline-none">
        <img src={topInfoIcon} alt="" class="w-[19px] h-[19px] align-middle" />
      </button>
    </p>

    <a href="#" class="inline-flex items-center gap-[8px] bg-[#171717] rounded-[8px] p-[8px] no-underline">
      <img src={referralIcon} class="w-[19px] h-[19px] object-contain align-middle" alt="" />
      <span class="text-[16px] font-semibold leading-[17px] pt-[1px] text-white whitespace-nowrap font-['Inter',sans-serif]">Referrals</span>
    </a>

    <a href="./leaderboard.html" class="inline-flex items-center gap-[8px] bg-[#171717] rounded-[8px] p-[8px] no-underline">
      <img src={trumpIcon} class="w-[20px] h-[20px] object-contain align-middle" alt="" />
      <span class="text-[16px] font-semibold leading-[17px] pt-[1px] text-white whitespace-nowrap font-['Inter',sans-serif]">Leaderboard</span>
    </a>
    <div class="flex items-center gap-2  mr-[8px]">
      <label class="inline-flex flex-col items-center bg-black text-white rounded-[20px] py-[4px] px-[2px] font-sans text-[16px] cursor-pointer">
        <span class="text-[#616161] text-[14px] font-semibold">SFW</span>
        <div class="relative w-[26px] h-[17px] rounded-[20px] transition-colors duration-300 {sfwEnabled ? 'bg-[#F88056]' : 'bg-[#171717]'}">
          <input type="checkbox" class="hidden" bind:checked={sfwEnabled} />
          <div class="absolute h-[10px] w-[10px] bg-white rounded-full transition-all duration-300 top-[3.5px] {sfwEnabled ? 'left-[13px]' : 'left-[3px]'}"></div>
        </div>
      </label>

      <a href="#" class="flex items-center justify-center bg-[#171717] py-[8px] px-[12px] rounded-[8px] transition-all duration-[400ms] ease-in relative mr-[11px] hover:text-[#9e9e9e] no-underline">
        <img src={alarmIcon} alt="" class="w-[19px] h-[19px] object-contain align-middle" />
      </a>

      <div class="relative mr-[18px]">
        <button 
          type="button"
          class="flex items-center justify-center bg-transparent border-0 p-0 outline-none cursor-pointer"
          onclick={(e) => { 
            e.stopPropagation(); 
            isUserMenuOpen = !isUserMenuOpen; 
            isStatusOpen = false; 
          }}
        >
          <span class="flex items-center justify-center w-[28px] h-[28px] border border-white bg-[#f1f2f4] text-[#00aff1] text-[16px] font-semibold leading-none rounded-full">Ag</span>
        </button>
        
        {#if isUserMenuOpen}
          <ul class="absolute top-[calc(100%+2px)] left-[-70px] z-[1000] min-w-[100px] bg-[#f5f5f5] p-0 rounded-[5px] border-0 overflow-hidden list-none text-left m-0">
            <li><a href="#" class="block text-[13.6px] leading-[38px] text-[#C4D1C7] px-[12px] tracking-[0.5px] bg-[#262626] hover:bg-[#38393C] no-underline whitespace-nowrap">Add Account</a></li>
            <li><a href="#" class="block text-[13.6px] leading-[38px] text-[#C4D1C7] px-[12px] tracking-[0.5px] bg-[#262626] hover:bg-[#38393C] no-underline whitespace-nowrap">Logout</a></li>
          </ul>
        {/if}
      </div>
    </div>
    <div class="flex items-center gap-[6px]  mr-[6px]">
      <a href="#" class="flex items-center justify-center bg-transparent py-[8px] px-[12px] rounded-[8px] transition-all duration-[400ms] ease-in relative hover:text-[#9e9e9e] no-underline">
        <img src={minIcon} alt="" class="w-[19px] h-[19px] object-contain align-middle" />
      </a>
      <a href="#" class="flex items-center justify-center bg-transparent py-[8px] px-[12px] rounded-[8px] transition-all duration-[400ms] ease-in relative hover:text-[#9e9e9e] no-underline">
        <img src={maxIcon} alt="" class="w-[19px] h-[19px] object-contain align-middle" />
      </a>
      <a href="#" class="flex items-center justify-center bg-transparent py-[8px] px-[12px] rounded-[8px] transition-all duration-[400ms] ease-in relative hover:text-[#9e9e9e] no-underline">
        <img src={closeIcon} alt="" class="w-[19px] h-[19px] object-contain align-middle" />
      </a>
    </div>
  </div>
</div>