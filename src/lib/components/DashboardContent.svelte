<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type * as HighchartsType from 'highcharts';

  const defaultVals = {
    sub: 4.56,
    tips: 12.34,
    posts: 8.90,
    ref: 3.45,
    msg: 2.10,
    streams: 5.67
  };

  // SSR Safe Check
  const isBrowser = typeof window !== 'undefined';

  let vals = $state(isBrowser ? JSON.parse(localStorage.getItem('vals') || 'null') || defaultVals : defaultVals);
  
  let total = $derived(
    vals.sub + vals.tips + vals.posts + vals.ref + vals.msg + vals.streams
  );

  let chartContainer: HTMLElement;
  let chartInstance: HighchartsType.Chart | null = null;
  let chartReady = $state(false);
  let isEarningsDropdownOpen = $state(false);

  let activePeriod = $state(isBrowser ? localStorage.getItem('activePeriod') || 'This week' : 'This week');
  let earningsType = $state(isBrowser ? localStorage.getItem('earningsType') || 'Gross earnings' : 'Gross earnings');

  let employeeCount = $state(isBrowser ? parseInt(localStorage.getItem('employeeCount') || '1') || 1 : 1);
  let employeeNames = $state<string[]>(isBrowser ? JSON.parse(localStorage.getItem('employeeNames') || 'null') || ['Employee 1'] : ['Employee 1']);

  // STANDARD CACHE OBJECT 
  let baseDistributions: Record<string, number[]> = isBrowser ? JSON.parse(localStorage.getItem('baseDistributions') || 'null') || {} : {};

  $effect(() => { localStorage.setItem('vals', JSON.stringify(vals)); });
  $effect(() => { localStorage.setItem('employeeCount', employeeCount.toString()); });
  $effect(() => { localStorage.setItem('employeeNames', JSON.stringify(employeeNames)); });

  function updateEmployeeNames(count: number) {
    if (employeeNames.length < count) {
      const newNames = [...employeeNames];
      for (let i = newNames.length; i < count; i++) {
        newNames.push(`Employee ${i + 1}`);
      }
      employeeNames = newNames;
    } else if (employeeNames.length > count && count >= 0) {
      employeeNames = employeeNames.slice(0, count);
    }
  }

  function handleCountInput(e: Event) {
    const target = e.currentTarget as HTMLElement;
    const val = parseInt(target.innerText.replace(/[^0-9]/g, ''));
    if (!isNaN(val) && val >= 0) {
      employeeCount = val;
      updateEmployeeNames(val);
    }
  }

  function handleCountBlur(e: Event) {
    const target = e.currentTarget as HTMLElement;
    let val = parseInt(target.innerText.replace(/[^0-9]/g, ''));
    if (isNaN(val) || val < 0) val = 1; 
    employeeCount = val;
    target.innerText = val.toString();
    updateEmployeeNames(val);
  }

  function handleCountKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  }

  function getDatesForPeriod(period: string) {
    const dates: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === 'Today') {
      dates.push(new Date(today));
    } else if (period === 'Yesterday') {
      const d = new Date(today);
      d.setDate(today.getDate() - 1);
      dates.push(d);
    } else if (period === 'This week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        dates.push(d);
      }
    } else if (period === 'This month') {
      const year = today.getFullYear();
      const month = today.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
      }
    }
    return dates;
  }

  function formatCategories(dates: Date[], period: string) {
    return dates.map(d => {
      if (period === 'Today') return 'Today';
      if (period === 'Yesterday') return 'Yesterday';
      const monthName = d.toLocaleString('default', { month: 'short' });
      return `${monthName} ${d.getDate()}`;
    });
  }

  function getOrCreateDistribution(period: string, days: number) {
    if (baseDistributions[period] && baseDistributions[period].length === days) {
      return baseDistributions[period];
    }
    const dist = days === 1 ? [1] : Array.from({ length: days }, () => Math.random() * 10 + 1);
    
    baseDistributions[period] = dist;
    
    if (isBrowser) {
      localStorage.setItem('baseDistributions', JSON.stringify(baseDistributions));
    }
    
    return dist;
  }

  let currentChartData = $derived.by(() => {
    const dates = getDatesForPeriod(activePeriod);
    const dist = getOrCreateDistribution(activePeriod, dates.length);
    const distSum = dist.reduce((a, b) => a + b, 0);

    if (distSum === 0 || total === 0) return dist.map(() => 0);

    const data = dist.map(p => parseFloat((total * (p / distSum)).toFixed(2)));

    if (data.length > 0) {
      const sumWithoutLast = data.slice(0, -1).reduce((a, b) => a + b, 0);
      data[data.length - 1] = parseFloat(Math.max(0, total - sumWithoutLast).toFixed(2));
    }
    return data;
  });

  function setPeriod(period: string) {
    activePeriod = period;
    localStorage.setItem('activePeriod', period);
    
    if (chartInstance) {
      const dates = getDatesForPeriod(period);
      const categories = formatCategories(dates, period);
      chartInstance.xAxis[0].setCategories(categories);
      const title = period === 'This month' 
        ? `Employee sales - ${new Date().toLocaleString('default', { month: 'long' })}` 
        : 'Employee sales';
      chartInstance.setTitle({ text: title });
    }
  }

  function handleInput(event: Event, key: keyof typeof vals) {
    const target = event.currentTarget as HTMLElement;
    const raw = target.innerText.replace(/[^0-9.]/g, '');
    const val = parseFloat(raw);
    vals[key] = isNaN(val) ? 0 : val;
  }

  function handleBlur(event: Event, key: keyof typeof vals) {
    const target = event.currentTarget as HTMLElement;
    target.innerText = vals[key].toFixed(2);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      (event.currentTarget as HTMLElement).blur();
    }
  }

  onMount(async () => {
    try {
      const HighchartsModule = await import('highcharts');
      const Highcharts = HighchartsModule.default || HighchartsModule;

      // Attempt to load the draggable module
      try {
        const DraggablePointsModule = await import('highcharts/modules/draggable-points');
        const DraggablePoints = DraggablePointsModule.default || DraggablePointsModule;
        if (typeof DraggablePoints === 'function') {
          DraggablePoints(Highcharts);
        }
      } catch (e) {
        console.warn('Highcharts draggable-points module not found. Run: npm install highcharts', e);
      }

      await tick();
      await new Promise((r) => setTimeout(r, 100));

      if (!chartContainer) {
        return;
      }

      const dates = getDatesForPeriod(activePeriod);
      const categories = formatCategories(dates, activePeriod);
      const initialTitle = activePeriod === 'This month' 
        ? `Employee sales - ${new Date().toLocaleString('default', { month: 'long' })}` 
        : 'Employee sales';

      chartInstance = Highcharts.chart(chartContainer, {
        chart: {
          type: 'areaspline',
          backgroundColor: 'transparent',
          margin: [60, 40, 60, 40],
          style: { fontFamily: 'Inter, sans-serif' }
        },
        title: {
          text: initialTitle,
          align: 'left',
          x: 10,
          y: 25,
          style: { color: '#ffffff', fontSize: '16px', fontWeight: '500' }
        },
        xAxis: {
          categories: categories,
          labels: { style: { color: '#999999' } },
          tickWidth: 0,
          lineWidth: 0
        },
        yAxis: {
          title: { text: null },
          min: 0,
          gridLineColor: '#444444',
          gridLineDashStyle: 'Dash',
          labels: { style: { color: '#999999' } }
        },
        plotOptions: {
          series: {
            dragDrop: {
              draggableY: true, // Enables vertical dragging
              dragMinY: 0
            },
            point: {
              events: {
                // Real-time synchronization during mouse drag
                drag: function(e) {
                  const point = e.target;
                  const index = point.index;
                  let newVal = e.newValues ? e.newValues.y : point.y;
                  if (newVal < 0) newVal = 0;
                  
                  const currentData = [...currentChartData];
                  currentData[index] = newVal;
                  const newTotal = currentData.reduce((a, b) => a + b, 0);
                  
                  // Update the chart's shape memory instantly
                  baseDistributions[activePeriod] = currentData;
                  
                  // Distribute the new dragged total proportionally to all your inputs
                  if (total > 0 && newTotal > 0) {
                    const ratio = newTotal / total;
                    vals.sub = parseFloat((vals.sub * ratio).toFixed(2));
                    vals.tips = parseFloat((vals.tips * ratio).toFixed(2));
                    vals.posts = parseFloat((vals.posts * ratio).toFixed(2));
                    vals.ref = parseFloat((vals.ref * ratio).toFixed(2));
                    vals.msg = parseFloat((vals.msg * ratio).toFixed(2));
                    
                    const calculatedSum = vals.sub + vals.tips + vals.posts + vals.ref + vals.msg;
                    vals.streams = parseFloat(Math.max(0, newTotal - calculatedSum).toFixed(2));
                  } else if (total === 0 && newTotal > 0) {
                    vals.tips = newTotal;
                  }
                },
                // Final save to local storage when mouse is released
                drop: function() {
                  if (isBrowser) localStorage.setItem('baseDistributions', JSON.stringify(baseDistributions));
                }
              }
            }
          },
          areaspline: {
            cursor: 'ns-resize', // Changes mouse to an Up/Down arrow when hovering over points
            fillColor: 'rgba(52, 103, 255, 0.15)',
            lineColor: '#3467FF',
            lineWidth: 4,
            marker: {
              fillColor: '#FFFFFF',
              lineColor: '#3467FF',
              lineWidth: 2,
              radius: 6,
              symbol: 'circle'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          style: { color: '#F0F0F0' },
          borderWidth: 0,
          pointFormat: 'Sales: <b>${point.y:.2f}</b><br/>'
        },
        series: [{
          type: 'areaspline',
          name: 'Sales',
          data: currentChartData, 
          showInLegend: false
        }],
        credits: { enabled: false }
      });

      chartReady = true;
    } catch (error) {
      console.error('Failed to initialize Highcharts:', error);
    }
  });

  $effect(() => {
    if (chartReady && chartInstance?.series?.[0]) {
      // Safely fallback to an empty array if Highcharts hasn't populated yData yet
      const current = chartInstance.series[0].yData || [];
      
      // Compare to prevent overriding Highcharts while the user is actively dragging
      const changed = currentChartData.some((v, i) => current[i] !== v);
      if (changed) {
        chartInstance.series[0].setData([...currentChartData], true, false, false);
      }
    }
  });
</script>

<div class="w-full min-h-screen bg-[#151515] rounded-tl-2xl p-4 text-white font-sans">
  <div class="flex flex-wrap">
    <div class="w-full">
      <div class="p-4 px-6 rounded-xl bg-[#262626] mb-4">
        <div class="flex flex-wrap items-center justify-between mb-[15px]">
          <h4 class="text-base font-medium flex items-end">
            Creator earnings overview
            <button type="button" class="ml-2.5 mb-px">
              <img src="https://xn--nfloww-vva.com/app/index_files/info-icon.png" alt="" width="15" height="15">
            </button>
            <span class="text-sm text-[#bbbbbb] ml-[15px]">UTC+01:00</span>
            <img src="https://xn--nfloww-vva.com/app/index_files/info-icon.png" alt="" width="15" height="15" class="ml-2">
          </h4>
          <div class="flex items-center">
            <div class="relative mr-4">
              <button 
                type="button" 
                class="bg-[#151515] text-[#bbbbbb] text-sm h-[33px] w-[140px] px-2.5 flex items-center justify-between rounded border border-[#3e3e3e]"
                onclick={() => isEarningsDropdownOpen = !isEarningsDropdownOpen}
              >
                <span>{earningsType}</span>
                <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {#if isEarningsDropdownOpen}
                <ul class="absolute right-0 mt-1 w-[130px] bg-[#151515] border border-[#3e3e3e] rounded shadow-lg z-10 py-1">
                  {#each ['Gross earnings', 'Net earnings'] as type}
                    <li>
                      <button 
                        type="button" 
                        class="block w-[130px] text-left px-3 py-1.5 text-xs text-[#bbbbbb] hover:bg-[#353535] hover:text-white {earningsType === type ? 'bg-[#353535] text-[#2d74ff]' : ''}"
                        onclick={() => { 
                          earningsType = type; 
                          localStorage.setItem('earningsType', type); 
                          isEarningsDropdownOpen = false; 
                        }}
                      >
                        {type}
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
            <ul class="list-none border border-[#444444] p-1 px-2 inline-flex items-center rounded gap-1">
              {#each ['Yesterday', 'Today', 'This week', 'This month'] as period}
                <li>
                  <button 
                    type="button" 
                    class=" text-[11.5px] py-[7px] px-5 pb-[5px] font-semibold rounded-sm {activePeriod === period ? 'bg-[#353535] text-[#2d74ff]' : 'text-[#bbbbbb] hover:text-[#2d74ff]'}"
                    onclick={() => setPeriod(period)}
                  >
                    {period}
                  </button>
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <div class="flex flex-wrap">
          <div class="py-5 px-[35px] border-r border-[#464646] w-1/4 last:border-r-0">
            <div>
              <img src="https://xn--nfloww-vva.com/app/index_files/of-icon.svg" alt="" class="w-11 mb-5">
              <p class="text-xs text-[#1890f1] font-semibold mb-4">Total earnings</p>
              <h5 class="text-[32px] text-[#2d74ff] font-bold">
                <span class="text-2xl align-top leading-[38px] mr-0.5">$</span>
                <span>{total.toFixed(2)}</span>
              </h5>
            </div>
          </div>

          <div class="py-5 px-[35px] border-r border-[#464646] w-1/4 last:border-r-0">
            <div class="flex items-center justify-between mb-[55px] last:mb-0">
              <div class="w-[calc(100%-45px)]">
                <h5 class="text-xl text-white font-bold mb-0.5 flex">
                  <span class="mr-0.5">$</span>
                  <span class="outline-none px-1 rounded min-w-10 inline-block cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" contenteditable="true" role="textbox" tabindex="0"
                    oninput={(e) => handleInput(e, 'sub')}
                    onblur={(e) => handleBlur(e, 'sub')}
                    onkeydown={handleKeydown}>{vals.sub.toFixed(2)}</span>
                </h5>
                <p class="text-[13px] text-[#808080]">Subscriptions</p>
              </div>
              <img src="https://xn--nfloww-vva.com/app/index_files/plus-icon.png" alt="" class="w-[45px] h-[45px] rounded-full">
            </div>
            <div class="flex items-center justify-between mb-[55px] last:mb-0">
              <div class="w-[calc(100%-45px)]">
                <h5 class="text-xl text-white font-bold mb-0.5 flex">
                  <span class="mr-0.5">$</span>
                  <span class="outline-none px-1 rounded min-w-10 inline-block cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" contenteditable="true" role="textbox" tabindex="0"
                    oninput={(e) => handleInput(e, 'tips')}
                    onblur={(e) => handleBlur(e, 'tips')}
                    onkeydown={handleKeydown}>{vals.tips.toFixed(2)}</span>
                </h5>
                <p class="text-[13px] text-[#808080]">Tips</p>
              </div>
              <img src="https://xn--nfloww-vva.com/app/index_files/tips-icon.png" alt="" class="w-[45px] h-[45px] rounded-full">
            </div>
          </div>

          <div class="py-5 px-[35px] border-r border-[#464646] w-1/4 last:border-r-0">
            <div class="flex items-center justify-between mb-[55px] last:mb-0">
              <div class="w-[calc(100%-45px)]">
                <h5 class="text-xl text-white font-bold mb-0.5 flex">
                  <span class="mr-0.5">$</span>
                  <span class="outline-none px-1 rounded min-w-10 inline-block cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" contenteditable="true" role="textbox" tabindex="0"
                    oninput={(e) => handleInput(e, 'posts')}
                    onblur={(e) => handleBlur(e, 'posts')}
                    onkeydown={handleKeydown}>{vals.posts.toFixed(2)}</span>
                </h5>
                <p class="text-[13px] text-[#808080]">Posts</p>
              </div>
              <img src="https://xn--nfloww-vva.com/app/index_files/posts-icon.png" alt="" class="w-[45px] h-[45px] rounded-full">
            </div>
            <div class="flex items-center justify-between mb-[55px] last:mb-0">
              <div class="w-[calc(100%-45px)]">
                <h5 class="text-xl text-white font-bold mb-0.5 flex">
                  <span class="mr-0.5">$</span>
                  <span class="outline-none px-1 rounded min-w-10 inline-block cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" contenteditable="true" role="textbox" tabindex="0"
                    oninput={(e) => handleInput(e, 'ref')}
                    onblur={(e) => handleBlur(e, 'ref')}
                    onkeydown={handleKeydown}>{vals.ref.toFixed(2)}</span>
                </h5>
                <p class="text-[13px] text-[#808080]">Referrals</p>
              </div>
              <img src="https://xn--nfloww-vva.com/app/index_files/referrals-icon.png" alt="" class="w-[45px] h-[45px] rounded-full">
            </div>
          </div>

          <div class="py-5 px-[35px] border-r border-[#464646] w-1/4 last:border-r-0">
            <div class="flex items-center justify-between mb-[55px] last:mb-0">
              <div class="w-[calc(100%-45px)]">
                <h5 class="text-xl text-white font-bold mb-0.5 flex">
                  <span class="mr-0.5">$</span>
                  <span class="outline-none px-1 rounded min-w-10 inline-block cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" contenteditable="true" role="textbox" tabindex="0"
                    oninput={(e) => handleInput(e, 'msg')}
                    onblur={(e) => handleBlur(e, 'msg')}
                    onkeydown={handleKeydown}>{vals.msg.toFixed(2)}</span>
                </h5>
                <p class="text-[13px] text-[#808080]">Messages</p>
              </div>
              <img src="https://xn--nfloww-vva.com/app/index_files/messages-icon.png" alt="" class="w-[45px] h-[45px] rounded-full">
            </div>
            <div class="flex items-center justify-between mb-[55px] last:mb-0">
              <div class="w-[calc(100%-45px)]">
                <h5 class="text-xl text-white font-bold mb-0.5 flex">
                  <span class="mr-0.5">$</span>
                  <span class="outline-none px-1 rounded min-w-10 inline-block cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" contenteditable="true" role="textbox" tabindex="0"
                    oninput={(e) => handleInput(e, 'streams')}
                    onblur={(e) => handleBlur(e, 'streams')}
                    onkeydown={handleKeydown}>{vals.streams.toFixed(2)}</span>
                </h5>
                <p class="text-[13px] text-[#808080]">Streams</p>
              </div>
              <img src="https://xn--nfloww-vva.com/app/index_files/streams-icon.png" alt="" class="w-[45px] h-[45px] rounded-full">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex w-full gap-[15px]">
    <div class="p-4 px-6 rounded-xl bg-[#262626] w-[240px] shrink-0 flex flex-col">
      <div class="flex flex-wrap items-center justify-between mb-[15px]">
        <h4 class="text-base font-medium flex items-end">
          My shifts
          <button type="button" class="ml-2.5 mb-px">
            <img src="https://xn--nfloww-vva.com/app/index_files/info-icon.png" alt="" width="15" height="15">
          </button>
        </h4>
      </div>
      <div class="flex items-center justify-center flex-col py-10 flex-grow">
        <img src="https://xn--nfloww-vva.com/app/index_files/empty-data.png" alt="" class="w-[140px] mb-2.5">
        <p class="text-sm text-[#808080]">No data</p>
      </div>
    </div>

    <div class="flex flex-col grow gap-[15px] min-w-0">
      <div class="p-4 px-6 rounded-xl bg-[#262626] grow">
        <div class="flex flex-wrap items-center justify-between mb-[15px]">
          <h4 class="text-base font-medium flex items-end">
            Current clocked-in employees
            <div class="ml-2.5 mb-px text-white text-sm flex items-center">
              <img src="https://xn--nfloww-vva.com/app/index_files/people-icon.png" alt="" width="15" height="15" class="mr-1">
              <span 
                class="outline-none px-1 rounded cursor-text transition-colors duration-150 ease-in-out hover:bg-white/10 focus:bg-[rgba(45,116,255,0.2)] focus:shadow-[0_0_0_1px_rgba(45,116,255,0.5)]" 
                contenteditable="true" 
                role="textbox"
                tabindex="0"
                oninput={handleCountInput}
                onblur={handleCountBlur}
                onkeydown={handleCountKeydown}
              >{employeeCount}</span>
            </div>
          </h4>
        </div>
        <div class="flex flex-wrap" id="employee-badges-container">
          {#each employeeNames as name, index}
            <span 
              class="inline-block bg-[#151515] text-white py-[3px] px-1.5 my-[3px] mx-[3px] rounded-md text-sm cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#353353] hover:scale-105 outline-none focus:ring-2 focus:ring-[#2d74ff]"
              contenteditable="false"
              role="textbox"
              tabindex="0"
              ondblclick={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.contentEditable = "true";
                target.focus();
                
                const range = document.createRange();
                range.selectNodeContents(target);
                const sel = window.getSelection();
                sel?.removeAllRanges();
                sel?.addRange(range);
              }}
              onblur={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.contentEditable = "false";
                const newName = target.innerText.trim() || `Employee ${index + 1}`;
                employeeNames[index] = newName;
                target.innerText = newName;
              }}
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  e.preventDefault();
                  (e.currentTarget as HTMLElement).blur();
                }
              }}
            >{name}</span>
          {/each}
        </div>
      </div>

      <div class="p-0 rounded-xl bg-[#262626] grow relative min-h-[400px]">
        <div bind:this={chartContainer} id="employee-sales" class="w-full h-[400px] bg-transparent rounded-xl"></div>
      </div>

      <div class="p-4 px-6 rounded-xl bg-[#262626] grow">
        <div class="flex flex-wrap items-center justify-between mb-[15px]">
          <h4 class="text-base font-medium flex items-end">
            Scheduled hours
            <button type="button" class="ml-2.5 mb-px">
              <img src="https://xn--nfloww-vva.com/app/index_files/info-icon.png" alt="" width="15" height="15">
            </button>
          </h4>
        </div>
        <div class="flex items-center justify-center flex-col py-5">
          <img src="https://xn--nfloww-vva.com/app/index_files/empty-data.png" alt="" class="w-[100px] mb-2.5">
          <p class="text-sm text-[#808080]">No data</p>
        </div>
      </div>
    </div>
  </div>
</div>