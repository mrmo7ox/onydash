<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type * as HighchartsType from 'highcharts';
  import ofActiveIcon from '$lib/assets/of-active-icon.png';

  const isBrowser = typeof window !== 'undefined';

  // --- STATE ---
  let activeTab = $state(isBrowser ? localStorage.getItem('creator_tab') || 'overview' : 'overview');
  let isNetEarnings = $state(isBrowser ? localStorage.getItem('creator_net') === 'true' : false);

  const defaultVals = {
    Subscriptions: 55.60, Tips: 111.00, Posts: 44.40, Messages: 911.00, Referrals: 11.10, Streams: 0.00
  };

  let vals = $state(isBrowser ? JSON.parse(localStorage.getItem('creator_vals2') || 'null') || defaultVals : defaultVals);
  let total = $derived(vals.Subscriptions + vals.Tips + vals.Posts + vals.Messages + vals.Referrals + vals.Streams);
  let stats = $state(isBrowser ? JSON.parse(localStorage.getItem('creator_stats') || 'null') || { creators: 0, refunded: 0.00 } : { creators: 0, refunded: 0.00 });
  let openMenu = $state<string | null>(null);
  
  function toggleMenu(menu: string) { openMenu = openMenu === menu ? null : menu; }

  // --- DATE PICKER LOGIC ---
  const TODAY = new Date(2026, 5, 28); 
  TODAY.setHours(0,0,0,0);
  let startDate = $state<Date | null>(new Date(2026, 5, 21));
  let endDate = $state<Date | null>(new Date(2026, 5, 27));
  let hoverDate = $state<Date | null>(null);
  let viewDate = $state(new Date(2026, 5, 1));
  let activePreset = $state('Last 7 days');

  const formatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const shortFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  
  let formattedStart = $derived(startDate ? formatter.format(startDate) : 'Start Date');
  let formattedEnd = $derived(endDate ? formatter.format(endDate) : 'End Date');

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let presets = $derived.by(() => {
    const p = ['Custom', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days', '2026'];
    for (let i = 5; i >= 0; i--) p.push(monthNames[i]);
    return p;
  });

  function selectPreset(preset: string) {
    activePreset = preset;
    const end = new Date(TODAY);
    let start = new Date(TODAY);

    if (preset === 'Yesterday') { start.setDate(end.getDate() - 1); end.setDate(end.getDate() - 1); }
    else if (preset === 'Last 7 days') start.setDate(end.getDate() - 6);
    else if (preset === 'Last 30 days') start.setDate(end.getDate() - 29);
    else if (preset === 'Last 90 days') start.setDate(end.getDate() - 89);
    else if (preset === 'Last 365 days') start.setDate(end.getDate() - 364);
    else if (preset === '2026') { start = new Date(2026, 0, 1); end.setDate(new Date(2026, 11, 31).getDate()); }
    else if (monthNames.includes(preset)) {
      const mIdx = monthNames.indexOf(preset);
      start = new Date(2026, mIdx, 1);
      end.setTime(new Date(2026, mIdx + 1, 0).getTime());
    } else return;

    startDate = start;
    endDate = end;
    viewDate = new Date(start.getFullYear(), start.getMonth(), 1);
  }

  function getDaysForMonth(year: number, month: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    let days = [];
    
    for (let i = firstDay - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, daysInPrevMonth - i), currentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ date: new Date(year, month, i), currentMonth: true });
    
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    return days;
  }

  function selectDate(d: Date) {
    if (d > TODAY) return;
    activePreset = 'Custom';

    if (!startDate || (startDate && endDate)) {
      startDate = d; endDate = null;
      hoverDate = null;
    } else if (startDate && !endDate) {
      if (d < startDate) { endDate = startDate; startDate = d; } 
      else { endDate = d; }
      hoverDate = null;
    }
  }

  function navigateCalendar(months: number) {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + months, 1);
  }

  function getDayClasses(d: Date, isCurrentMonth: boolean) {
    let classes = "flex items-center justify-center w-full h-8 text-[13px] relative z-10 cursor-pointer transition-colors ";
    const time = d.getTime();
    const sTime = startDate?.getTime();
    const eTime = endDate?.getTime();
    const hTime = hoverDate?.getTime();
    const tTime = TODAY.getTime();

    if (time > tTime) return classes + "text-[#555] cursor-default";
    if (!isCurrentMonth) classes += "text-[#555] ";
    else classes += "text-[#d4d4d4] ";

    if (time === tTime && time !== sTime && time !== eTime) classes += "border border-[#fff] rounded-md ";

    const isStart = sTime === time;
    const isEnd = eTime === time;
    const isHoverTempEnd = !eTime && hTime === time && sTime;
    const inRange = sTime && eTime && time > sTime && time < eTime;
    const inTempRange = sTime && !eTime && hTime && ((time > sTime && time < hTime) || (time < sTime && time > hTime));

    if (isStart && !eTime && !hTime) {
      classes += "bg-[#f38157] text-white rounded-md font-medium ";
    } else if (isStart && (eTime || hTime)) {
      classes += (time > (eTime || hTime) ? "bg-[#f38157] text-white rounded-r-md font-medium " : "bg-[#f38157] text-white rounded-l-md font-medium ");
    } else if (isEnd || isHoverTempEnd) {
      classes += (time < (sTime || 0) ? "bg-[#f38157] text-white rounded-l-md font-medium " : "bg-[#f38157] text-white rounded-r-md font-medium ");
    } else if (inRange || inTempRange) {
      classes += "bg-[#422a22] text-[#d4d4d4] font-medium ";
    } else {
      classes += "hover:bg-[#2a2a2a] rounded-md ";
    }
    return classes;
  }

  // --- DYNAMIC CHART GRANULARITY & SYNC ---
  let trendsGranularity = $state('Day');
  let channelGranularity = $state('Day');

  let activeChannels = $state(['Subscriptions', 'Tips', 'Posts', 'Messages', 'Referrals', 'Streams']);
  let activePerfChannel = $state('All');

  // For the Performance tab earnings chart
  const perfChannelColors: Record<string, string> = {
    'Subscriptions': '#3467FF', 'Tips': '#2AD4AC', 'Posts': '#FF6868',
    'Messages': '#FFA553', 'Referrals': '#34C2FF', 'Streams': '#CA34FF'
  };

  function toggleChannel(ch: string) {
    if (activeChannels.includes(ch)) activeChannels = activeChannels.filter(c => c !== ch);
    else activeChannels = [...activeChannels, ch];
  }

  function generateCategories(granularity: string) {
    if (granularity === 'Hour') return Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    if (granularity === 'Week') return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    if (granularity === 'Month') return shortMonthNames;
    if (!startDate || !endDate) return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    
    let cats = [];
    let curr = new Date(Math.min(startDate.getTime(), endDate.getTime()));
    const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));
    
    while(curr <= end) {
      cats.push(shortFormatter.format(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return cats;
  }

  function getDaysCount(granularity: string) {
    if (granularity === 'Hour') return 24;
    if (granularity === 'Week') return 4;
    if (granularity === 'Month') return 12;
    if (!startDate || !endDate) return 7;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  }

  let chartDaysCount = $derived(getDaysCount(trendsGranularity));
  let chartCategories = $derived(generateCategories(trendsGranularity));
  let channelDaysCount = $derived(getDaysCount(channelGranularity));
  let channelCategories = $derived(generateCategories(channelGranularity));

  let baseDistributions: Record<string, number[]> = isBrowser ? JSON.parse(localStorage.getItem('creator_dists') || 'null') || {} : {};

  function getDist(key: string, days: number) {
    const fullKey = `${key}_${days}`;
    if (baseDistributions[fullKey] && baseDistributions[fullKey].length === days) return baseDistributions[fullKey];
    
    const dist = Array.from({ length: days }, () => Math.random() * 10 + 1);
    baseDistributions[fullKey] = dist;
    return dist;
  }

  let trendsData = $derived.by(() => {
    const dist = getDist('trends', chartDaysCount);
    const distSum = dist.reduce((a, b) => a + b, 0);
    if (distSum === 0 || total === 0) return dist.map(() => 0);
    
    const data = dist.map(p => parseFloat((total * (p / distSum)).toFixed(2)));
    if (data.length > 0) {
      const sumWithoutLast = data.slice(0, -1).reduce((a, b) => a + b, 0);
      data[data.length - 1] = parseFloat(Math.max(0, total - sumWithoutLast).toFixed(2));
    }
    return data;
  });

  let perfEarningsData = $derived.by(() => {
    // Determine which total to use based on the active channel pill
    const activeTotal = activePerfChannel === 'All' ? total : vals[activePerfChannel as keyof typeof vals];
    const dist = getDist(`perf_${activePerfChannel}`, chartDaysCount); // Reuse chartDaysCount for simplicity
    const distSum = dist.reduce((a, b) => a + b, 0);
    
    if (distSum === 0 || activeTotal === 0) return dist.map(() => 0);
    
    const data = dist.map(p => parseFloat((activeTotal * (p / distSum)).toFixed(2)));
    if (data.length > 0) {
      const sumWithoutLast = data.slice(0, -1).reduce((a, b) => a + b, 0);
      data[data.length - 1] = parseFloat(Math.max(0, activeTotal - sumWithoutLast).toFixed(2));
    }
    return data;
  });

  let channelSeriesData = $derived.by(() => {
    const channels = [
      { name: 'Subscriptions', color: '#359AD1', val: vals.Subscriptions },
      { name: 'Tips', color: '#5CA64C', val: vals.Tips },
      { name: 'Posts', color: '#D46B43', val: vals.Posts },
      { name: 'Messages', color: '#AB70D0', val: vals.Messages },
      { name: 'Referrals', color: '#D1628C', val: vals.Referrals },
      { name: 'Streams', color: '#DAA717', val: vals.Streams }
    ];
    return channels.map(ch => {
      const dist = getDist(`ch_${ch.name}`, channelDaysCount);
      const distSum = dist.reduce((a, b) => a + b, 0);
      
      if (distSum === 0 || ch.val === 0) return { name: ch.name, color: ch.color, data: dist.map(() => 0) };
      
      const data = dist.map(p => parseFloat((ch.val * (p / distSum)).toFixed(2)));
      const sumWithoutLast = data.slice(0, -1).reduce((a, b) => a + b, 0);
      data[data.length - 1] = parseFloat(Math.max(0, ch.val - sumWithoutLast).toFixed(2));
      
      return { name: ch.name, color: ch.color, data };
    });
  });

  // --- CHART CONTAINERS ---
  let overviewTrendsContainer: HTMLElement;
  let overviewBreakdownContainer: HTMLElement;
  let overviewChannelContainer: HTMLElement;
  let perfEarningsContainer: HTMLElement;
  let perfDonutContainer: HTMLElement;
  let perfHeatmapContainer: HTMLElement;
  let perfChargebacksContainer: HTMLElement;
  let perfSparklineContainers: HTMLElement[] = [];
  
  let trendsChart: HighchartsType.Chart | null = null;
  let breakdownChart: HighchartsType.Chart | null = null;
  let channelChart: HighchartsType.Chart | null = null;
  let perfEarningsChart: HighchartsType.Chart | null = null;
  let perfDonutChart: HighchartsType.Chart | null = null;
  let perfSparklineCharts: HighchartsType.Chart[] = [];
  
  let chartReady = $state(false);
  let isDragging = false; // --- DRAG FIX FLAG ---

  // Performance Breakdown Legend config
  const perfBreakdownConfig = [
    { k: 'Subscriptions', c: '#3467FF', n: 'Subscriptions' },
    { k: 'Tips', c: '#2AD4AC', n: 'Tips' },
    { k: 'Posts', c: '#FF6868', n: 'Posts' },
    { k: 'Messages', c: '#FFA553', n: 'Messages' },
    { k: 'Referrals', c: '#34C2FF', n: 'Referrals' },
    { k: 'Streams', c: '#CA34FF', n: 'Streams' }
  ];

  let overviewBreakdownData = $derived([
    ['Subscriptions', vals.Subscriptions], ['Tips', vals.Tips], ['Posts', vals.Posts],
    ['Messages', vals.Messages], ['Referrals', vals.Referrals], ['Streams', vals.Streams]
  ]);

  let perfBreakdownData = $derived([
    { name: 'Subscriptions', y: vals.Subscriptions, color: '#3467FF' },
    { name: 'Tips', y: vals.Tips, color: '#2AD4AC' },
    { name: 'Posts', y: vals.Posts, color: '#FF6868' },
    { name: 'Messages', y: vals.Messages, color: '#FFA553' },
    { name: 'Referrals', y: vals.Referrals, color: '#34C2FF' },
    { name: 'Streams', y: vals.Streams, color: '#CA34FF' }
  ]);

  $effect(() => {
    if (isBrowser) {
      localStorage.setItem('creator_tab', activeTab);
      localStorage.setItem('creator_net', isNetEarnings.toString());
      localStorage.setItem('creator_vals2', JSON.stringify(vals));
      localStorage.setItem('creator_stats', JSON.stringify(stats));
      localStorage.setItem('creator_dists', JSON.stringify(baseDistributions));
    }
  });

  function handleInput(e: Event, key: keyof typeof vals | 'refunded' | 'creators') {
    const val = parseFloat((e.currentTarget as HTMLElement).innerText.replace(/[^0-9.]/g, ''));
    if (key in vals) vals[key as keyof typeof vals] = isNaN(val) ? 0 : val;
    else stats[key as 'refunded' | 'creators'] = isNaN(val) ? 0 : val;
  }

  function handleBlur(e: Event, key: keyof typeof vals | 'refunded' | 'creators') {
    const target = e.currentTarget as HTMLElement;
    if (key === 'creators') target.innerText = stats.creators.toString();
    else if (key in vals) target.innerText = vals[key as keyof typeof vals].toFixed(2);
    else target.innerText = stats.refunded.toFixed(2);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === 'Escape') {
      event.preventDefault();
      (event.currentTarget as HTMLElement).blur();
    }
  }

  function resetAll() {
    vals = JSON.parse(JSON.stringify(defaultVals));
    stats = { creators: 0, refunded: 0.00 };
    isNetEarnings = false;
  }

  onMount(async () => {
    try {
      const HighchartsModule = await import('highcharts');
      const Highcharts = HighchartsModule.default || HighchartsModule;
      try {
        const DraggableModule = await import('highcharts/modules/draggable-points');
        const HeatmapModule = await import('highcharts/modules/heatmap');
        (DraggableModule.default || DraggableModule)(Highcharts);
        (HeatmapModule.default || HeatmapModule)(Highcharts);
      } catch(e) {}

      await tick();
      await new Promise(r => setTimeout(r, 100));

      // --- OVERVIEW CHARTS ---
      if (overviewTrendsContainer) {
        trendsChart = Highcharts.chart(overviewTrendsContainer, {
          chart: { type: 'column', backgroundColor: 'transparent', margin: [20, 10, 30, 40] },
          title: { text: null },
          xAxis: { categories: chartCategories, labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' } }, tickWidth: 0, lineWidth: 0 },
          yAxis: { title: { text: null }, gridLineColor: '#242424', labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' }, format: '${value}' } },
          plotOptions: {
            series: {
              dragDrop: { draggableY: true, dragMinY: 0 },
              point: {
                events: {
                  // --- ADD DRAG START FIX ---
                  dragStart: function() {
                    isDragging = true;
                  },
                  drag: function(e: any) {
                    let newVal = Math.max(0, e.newValues ? e.newValues.y : e.target.y);
                    const currentData = [...trendsData];
                    currentData[e.target.index] = newVal;
                    const newTotal = currentData.reduce((a, b) => a + b, 0);
                    
                    baseDistributions[`trends_${chartDaysCount}`] = currentData;
                    
                    if (total > 0 && newTotal > 0) {
                      const ratio = newTotal / total;
                      vals.Subscriptions = parseFloat((vals.Subscriptions * ratio).toFixed(2));
                      vals.Tips = parseFloat((vals.Tips * ratio).toFixed(2));
                      vals.Posts = parseFloat((vals.Posts * ratio).toFixed(2));
                      vals.Messages = parseFloat((vals.Messages * ratio).toFixed(2));
                      vals.Referrals = parseFloat((vals.Referrals * ratio).toFixed(2));
                      vals.Streams = parseFloat(Math.max(0, newTotal - (vals.Subscriptions + vals.Tips + vals.Posts + vals.Messages + vals.Referrals)).toFixed(2));
                    }
                  },
                  // --- ADD DROP FIX ---
                  drop: function() {
                    isDragging = false;
                  }
                }
              }
            },
            column: { color: '#c4623e', borderRadius: 8, cursor: 'ns-resize', pointPadding: 0.1, groupPadding: 0.1 }
          },
          tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' }, borderWidth: 0, pointFormat: '<b>${point.y:.2f}</b>' },
          series: [{ type: 'column', name: 'Earnings', data: trendsData, showInLegend: false }],
          credits: { enabled: false }
        });
      }

      if (overviewChannelContainer) {
        channelChart = Highcharts.chart(overviewChannelContainer, {
          chart: { type: 'spline', backgroundColor: 'transparent', margin: [20, 10, 30, 40] },
          title: { text: null },
          xAxis: { categories: channelCategories, labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' } }, tickWidth: 0, lineWidth: 0 },
          yAxis: { title: { text: null }, gridLineColor: '#242424', labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' }, format: '${value}' } },
          plotOptions: { spline: { lineWidth: 2, marker: { enabled: false } } },
          tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' }, borderWidth: 0, shared: true, valuePrefix: '$' },
          series: channelSeriesData.map(s => ({ ...s, visible: activeChannels.includes(s.name) })) as any,
          credits: { enabled: false }
        });
      }

      if (overviewBreakdownContainer) {
        breakdownChart = Highcharts.chart(overviewBreakdownContainer, {
          chart: { type: 'pie', backgroundColor: 'transparent', margin: [0,0,0,0] },
          title: { text: null },
          plotOptions: { pie: { innerSize: '75%', dataLabels: { enabled: false }, borderWidth: 0, colors: ['#359AD1', '#5CA64C', '#D46B43', '#AB70D0', '#D1628C', '#DAA717'] } },
          series: [{ type: 'pie', name: 'Earnings', data: overviewBreakdownData }],
          credits: { enabled: false },
          tooltip: { pointFormat: '<b>${point.y:.2f}</b>' }
        });
      }

      // --- PERFORMANCE CHARTS ---
      if (perfEarningsContainer) {
        perfEarningsChart = Highcharts.chart(perfEarningsContainer, {
          chart: { type: 'column', backgroundColor: 'transparent', margin: [20, 10, 30, 40] },
          title: { text: null },
          xAxis: { categories: chartCategories, labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' } }, tickWidth: 0, lineWidth: 0 },
          yAxis: { title: { text: null }, gridLineColor: '#242424', labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' }, format: '${value}' } },
          plotOptions: { column: { color: '#3467FF', borderRadius: 2, pointPadding: 0.1, groupPadding: 0.1 } },
          tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', style: { color: '#fff' }, borderWidth: 0, pointFormat: '<b>${point.y:.2f}</b>' },
          series: [{ type: 'column', name: 'Earnings', data: perfEarningsData, showInLegend: false }],
          credits: { enabled: false }
        });
      }

      if (perfDonutContainer) {
        perfDonutChart = Highcharts.chart(perfDonutContainer, {
          chart: { type: 'pie', backgroundColor: 'transparent', margin: [0,0,0,0] },
          title: { text: null },
          plotOptions: { pie: { innerSize: '80%', dataLabels: { enabled: false }, borderWidth: 2, borderColor: '#151515' } },
          series: [{ type: 'pie', name: 'Earnings', data: perfBreakdownData }],
          credits: { enabled: false },
          tooltip: { pointFormat: '<b>${point.y:.2f}</b>' }
        });
      }

      // Init Sparklines
      perfSparklineContainers.forEach((container, i) => {
        if (!container) return;
        const conf = perfBreakdownConfig[i];
        const sparkData = getDist(`perf_spark_${conf.k}`, 7);
        const chart = Highcharts.chart(container, {
          chart: { type: 'spline', backgroundColor: 'transparent', margin: [0, 0, 0, 0], width: 158, height: 30 },
          title: { text: null },
          xAxis: { visible: false },
          yAxis: { visible: false, min: 0 },
          plotOptions: { spline: { lineWidth: 1.5, color: conf.c, marker: { enabled: false } } },
          series: [{ type: 'spline', data: sparkData, showInLegend: false }],
          tooltip: { enabled: false },
          credits: { enabled: false }
        });
        perfSparklineCharts.push(chart);
      });

      if (perfHeatmapContainer) {
         Highcharts.chart(perfHeatmapContainer, {
            chart: { type: 'heatmap', backgroundColor: 'transparent', margin: [20, 0, 30, 40] },
            title: { text: null },
            xAxis: { categories: ['12 AM', '2 AM', '4 AM', '6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM'], labels: { style: { color: '#8a8a8a', fontSize: '10px' } }, lineWidth: 0, tickWidth: 0 },
            yAxis: { categories: ['Jun 27', 'Jun 26', 'Jun 25', 'Jun 24', 'Jun 23', 'Jun 22', 'Jun 21'], labels: { style: { color: '#8a8a8a', fontSize: '10px' } }, title: null, reversed: true },
            colorAxis: { min: 0, minColor: '#151515', maxColor: '#3467FF' },
            series: [{ type: 'heatmap', name: 'Heatmap', data: [[1,6,1], [6,6,1], [8,6,1]], borderWidth: 2, borderColor: '#151515', borderRadius: 4, showInLegend: false }],
            credits: { enabled: false },
            tooltip: { enabled: false }
         });
      }

      if (perfChargebacksContainer) {
        Highcharts.chart(perfChargebacksContainer, {
          chart: { type: 'column', backgroundColor: 'transparent', margin: [20, 10, 30, 40] },
          title: { text: null },
          xAxis: { categories: chartCategories, labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' } }, tickWidth: 0, lineWidth: 0 },
          yAxis: { title: { text: null }, gridLineColor: '#242424', labels: { style: { color: '#8a8a8a', fontFamily: 'Inter' } } },
          plotOptions: { column: { color: '#FF6868', borderRadius: 2, pointPadding: 0.1, groupPadding: 0.1 } },
          series: [{ type: 'column', name: 'Chargebacks', data: chartCategories.map(()=>0), showInLegend: false }],
          credits: { enabled: false }
        });
      }

      chartReady = true;
    } catch (e) {
      console.error(e);
    }
  });

  $effect(() => {
    if (chartReady) {
      // Overview Updates
      if (trendsChart?.series?.[0]) {
        trendsChart.xAxis[0].setCategories(chartCategories, false);
        const current = trendsChart.series[0].yData || [];
        
        // --- APPLY DATA ONLY IF NOT DRAGGING ---
        if (!isDragging && (trendsData.some((v, i) => current[i] !== v) || trendsData.length !== current.length)) {
          trendsChart.series[0].setData([...trendsData], true, false, false);
        }
      }
      
      if (channelChart) {
        channelChart.xAxis[0].setCategories(channelCategories, false);
        channelSeriesData.forEach((series, i) => {
          if (channelChart!.series[i]) {
            channelChart!.series[i].setData([...series.data], false);
            channelChart!.series[i].setVisible(activeChannels.includes(series.name), false);
          }
        });
        channelChart.redraw(false);
      }
      
      if (breakdownChart?.series?.[0]) breakdownChart.series[0].setData([...overviewBreakdownData], true, false, false);

      // Performance Updates
      if (perfEarningsChart?.series?.[0]) {
        perfEarningsChart.xAxis[0].setCategories(chartCategories, false);
        perfEarningsChart.series[0].update({ color: activePerfChannel === 'All' ? '#3467FF' : perfChannelColors[activePerfChannel] }, false);
        perfEarningsChart.series[0].setData([...perfEarningsData], true, false, false);
      }
      
      if (perfDonutChart?.series?.[0]) perfDonutChart.series[0].setData([...perfBreakdownData], true, false, false);
      
      // Simple pseudo-random update for sparklines just to look active
      perfSparklineCharts.forEach((chart, i) => {
        const conf = perfBreakdownConfig[i];
        const val = vals[conf.k as keyof typeof vals];
        if (val > 0) {
           const dist = getDist(`perf_spark_rt_${conf.k}_${val}`, 7); // Force new dist if value changes
           chart.series[0].setData(dist, true, false, false);
        } else {
           chart.series[0].setData([0,0,0,0,0,0,0], true, false, false);
        }
      });
    }
  });

  function calcPct(val: number) { return total === 0 ? '0.00' : ((val / total) * 100).toFixed(2); }
</script>

<svelte:document onclick={() => openMenu = null} />

<div class="creator-content w-full h-full bg-[#0E0E0E] rounded-3xl text-whitefont-['Roboto'] overflow-y-auto">
  
  <div class="sticky top-0 bg-[#0b0b0b] z-[100] p-6">
    
    <div class="flex items-center gap-[10px] mb-[20px]">
      <h1 class="text-[24px] font-bold font-['Inter'] text-white tracking-tight leading-none">Creator reports</h1>
      <span class="text-[#8a8a8a] text-[14px] font-medium tracking-wide">UTC+02:00</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
    </div>

    <div class="flex items-center gap-1 mb-[17px]">
      <div class="px-[12px] py-[6px] text-[14px] rounded-[6px] transition-colors cursor-pointer select-none {activeTab === 'overview' ? 'bg-[#262626] text-white font-semibold' : 'text-[#8a8a8a] hover:text-[#c9c9c9] font-semibold'}" onclick={() => activeTab = 'overview'}>Overview</div>
      <div class="px-[12px] py-[6px] text-[14px] rounded-[6px] transition-colors cursor-pointer select-none {activeTab === 'performance' ? 'bg-[#262626] text-white font-semibold' : 'text-[#8a8a8a] hover:text-[#c9c9c9] font-semibold'}" onclick={() => activeTab = 'performance'}>Creator performance</div>
    </div>

    <div class="flex flex-wrap items-center gap-[12px] relative">
      <div class="relative">
        <div class="flex items-center h-[34px] bg-[#232323] rounded-lg px-[12px] gap-[15px] cursor-pointer select-none border border-transparent hover:bg-[#2a2a2a]" onclick={(e) => { e.stopPropagation(); toggleMenu('date'); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span class="text-[14px] text-[#e8e8e8] font-medium whitespace-nowrap">{formattedStart}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <span class="text-[14px] text-[#e8e8e8] font-medium whitespace-nowrap">{formattedEnd}</span>
          <svg class="ml-1 transition-transform {openMenu === 'date' ? 'rotate-180' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        {#if openMenu === 'date'}
          <div class="absolute top-[40px] left-0 bg-[#161616] border border-[#242424] rounded-xl flex shadow-2xl z-[150] w-max overflow-hidden select-none font-['Inter']" onclick={(e) => e.stopPropagation()} onmouseleave={() => hoverDate = null}>
            <div class="w-[150px] bg-[#161616] border-r border-[#242424] flex flex-col py-2 h-[340px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
              {#each presets as preset}
                <button class="text-left px-4 py-2.5 mx-1.5 rounded-md text-[13.5px] transition-colors {activePreset === preset ? 'bg-[#2a2a2a] text-white font-medium' : 'text-[#d4d4d4] hover:bg-[#202020]'}" onclick={() => selectPreset(preset)}>{preset}</button>
              {/each}
            </div>
            <div class="p-5 flex gap-8">
              {#each [0, 1] as offset}
                {@const mDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1)}
                {@const mYear = mDate.getFullYear()}
                {@const mMonth = mDate.getMonth()}
                <div class="w-[230px] flex flex-col">
                  <div class="flex justify-between items-center mb-4">
                    {#if offset === 0}
                       <div class="flex gap-1.5">
                        <button class="w-7 h-7 bg-[#262626] hover:bg-[#333] rounded flex items-center justify-center text-[#9a9a9a]" onclick={() => navigateCalendar(-12)}>&laquo;</button>
                        <button class="w-7 h-7 bg-[#262626] hover:bg-[#333] rounded flex items-center justify-center text-[#9a9a9a]" onclick={() => navigateCalendar(-1)}>&lsaquo;</button>
                       </div>
                    {:else}<div class="w-[62px]"></div>{/if}
                    <div class="text-[14px] font-semibold text-white">{shortMonthNames[mMonth]} {mYear}</div>
                    {#if offset === 1}
                      <div class="flex gap-1.5">
                        <button class="w-7 h-7 bg-[#262626] hover:bg-[#333] rounded flex items-center justify-center text-[#9a9a9a]" onclick={() => navigateCalendar(1)}>&rsaquo;</button>
                        <button class="w-7 h-7 bg-[#262626] hover:bg-[#333] rounded flex items-center justify-center text-[#9a9a9a]" onclick={() => navigateCalendar(12)}>&raquo;</button>
                      </div>
                   {:else}<div class="w-[62px]"></div>{/if}
                  </div>
                  <div class="grid grid-cols-7 mb-2 text-center text-[12px] text-[#8a8a8a]"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
                  <div class="grid grid-cols-7 gap-y-1 justify-items-center">
                    {#each getDaysForMonth(mYear, mMonth) as {date, currentMonth}}
                      <div class={getDayClasses(date, currentMonth)} onclick={() => selectDate(date)} onmouseenter={() => hoverDate = date}>
                        {date.getDate()}
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="relative">
        <div class="flex items-center h-[34px] w-[140px] bg-[#232323] rounded-lg px-[12px] gap-[8px] cursor-pointer select-none hover:bg-[#2a2a2a]" onclick={(e) => { e.stopPropagation(); toggleMenu('tag'); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          <span class="text-[13.5px] text-[#8a8a8a] font-normal grow">Creator tag</span>
          <svg class="transition-transform {openMenu === 'tag' ? 'rotate-180' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        {#if openMenu === 'tag'}
          <div class="absolute top-[40px] left-0 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg p-2 min-w-[200px] shadow-2xl text-[14px] text-[#9a9a9a] text-center py-4" onclick={(e) => e.stopPropagation()}>No tags yet</div>
        {/if}
      </div>

      {#if activeTab === 'performance'}
      <div class="relative">
        <div class="flex items-center h-[34px] bg-[#232323] rounded-lg px-[12px] gap-[8px] cursor-pointer select-none hover:bg-[#2a2a2a]" onclick={(e) => { e.stopPropagation(); toggleMenu('shownBy'); }}>
          <span class="text-[14px] font-medium text-white">Shown by day</span>
          <svg class="ml-1 transition-transform {openMenu === 'shownBy' ? 'rotate-180' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        {#if openMenu === 'shownBy'}
          <div class="absolute top-[40px] left-0 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg p-1.5 min-w-[178px] shadow-2xl flex flex-col gap-0.5" onclick={(e) => e.stopPropagation()}>
            <button class="text-left px-3 py-1.5 hover:bg-[#2a2a2a] text-[#c9c9c9] text-[14px] rounded-md transition-colors">Shown by hour</button>
            <button class="text-left px-3 py-1.5 bg-[#2a2a2a] text-white text-[14px] rounded-md font-medium">Shown by day</button>
            <button class="text-left px-3 py-1.5 hover:bg-[#2a2a2a] text-[#c9c9c9] text-[14px] rounded-md transition-colors">Shown by week</button>
            <button class="text-left px-3 py-1.5 hover:bg-[#2a2a2a] text-[#c9c9c9] text-[14px] rounded-md transition-colors">Shown by month</button>
          </div>
        {/if}
      </div>
      {/if}

      <div class="relative">
        <div class="flex items-center h-[34px] w-[140px] bg-[#232323] rounded-lg ml-2 px-[12px] gap-[8px] cursor-pointer select-none hover:bg-[#2a2a2a]" onclick={(e) => { e.stopPropagation(); toggleMenu('creator'); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"></rect><circle cx="12" cy="10" r="3"></circle><path d="M6.5 20c.8-3 3-4.2 5.5-4.2s4.7 1.2 5.5 4.2"></path></svg>
          <span class="text-[13.5px] text-[#8a8a8a] font-normal grow">Creator</span>
          <svg class="transition-transform {openMenu === 'creator' ? 'rotate-180' : ''}" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        {#if openMenu === 'creator'}
          <div class="absolute top-[40px] left-0 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg p-2 min-w-[200px] shadow-2xl text-[14px] text-[#9a9a9a] text-center py-4" onclick={(e) => e.stopPropagation()}>No creators yet</div>
        {/if}
      </div>

      <div class="flex items-center gap-[14px] ml-[10px]">
        <span class="text-[14.5px] font-medium text-[#e8e8e8]">Show net earnings</span>
        <div class="w-[45px] h-[24px] rounded-full flex items-center p-0.5 cursor-pointer transition-colors relative {isNetEarnings ? 'bg-[#f38157]' : 'bg-[#3d3d3d]'}" onclick={() => isNetEarnings = !isNetEarnings}>
          <div class="w-[16px] h-[16px] bg-white rounded-full shadow-sm transform transition-transform duration-200 {isNetEarnings ? 'translate-x-[16px]' : 'translate-x-0'}"></div>
        </div>
        <span class="ml-[4px] text-[14px] font-medium text-[#f38157] hover:text-[#fc9a76] cursor-pointer select-none transition-colors" onclick={resetAll}>Reset</span>
      </div>

    </div>
  </div>

  <div style="display: {activeTab === 'overview' ? 'block' : 'none'}">
    <div class="px-6 flex flex-col gap-[2px] ">
      
      <div class="flex items-center  mb-3">
        <h2 class="text-[16px] font-semibold font-['Inter']">Earnings summary</h2>
      </div>
      <div class="bg-[#151515] rounded-xl py-[20px] grid grid-cols-4 gap-y-6">
        <div class="pl-[22px] gap-">
          <div class="flex items-center gap-[7px] text-[14px] font-medium text-white mb-2"><img src={ofActiveIcon} alt="" class="w-[18px]">Total earnings</div>
          <div class="text-[32px] font-['Suisse_Intl_Mono'] leading-none mb-1.5 mt-[9px]">$<span>{total.toFixed(2)}</span></div>
          <div class="text-[15px] font-medium text-[#5CA84A] flex items-center gap-[3px] mt-[6px] font-['Suisse_Intl']"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="3" y1="21" x2="21" y2="3"></line><polyline points="9 3 21 3 21 15"></polyline></svg>100.00%</div>
        </div>
        {#each [
          { key: 'Subscriptions', icon: '<polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>' },
          { key: 'Posts', icon: '<path d="M15 2.5H6.5A2.5 2.5 0 0 0 4 5v14a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 19V7.5z"></path><polyline points="15 2.5 15 7.5 20 7.5"></polyline>' },
          { key: 'Messages', icon: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"></path>' },
          { key: 'empty' },
          { key: 'Tips', icon: '<circle cx="12" cy="12" r="10"></circle><path d="M14.5 9.2c-.4-.8-1.4-1.4-2.5-1.4-1.4 0-2.5.9-2.5 2.1s1.1 1.8 2.5 2.1c1.4.3 2.5.9 2.5 2.1s-1.1 2.1-2.5 2.1c-1.1 0-2.1-.6-2.5-1.4"></path>' },
          { key: 'Referrals', icon: '<circle cx="9" cy="8" r="3.5"></circle><path d="M3 20c.7-3.2 3-5 6-5 1.2 0 2.3.3 3.2.8"></path><path d="M14 17.5c2-.5 4-2.5 4.5-4.5"></path><polyline points="16 10.5 18.7 12.8 21 10"></polyline>' },
          { key: 'Streams', icon: '<rect x="2" y="6" width="13" height="12" rx="2.5"></rect><path d="M15 10.5l6-3.5v10l-6-3.5"></path>' }
        ] as tile}
          {#if tile.key === 'empty'} <div></div> {:else}
            <div class="pl-[18px] mt-[-2px]">
              <div class="flex items-center gap-[5px] text-[13px] font-medium text-white mb-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">{@html tile.icon}</svg>{tile.key}</div>
              <div class="text-[32px] font-['Suisse_Intl_Mono'] leading-none mb-1.5 mt-[8px]">$<span contenteditable="true" class="outline-none focus:text-[#2d74ff] focus:ring-2 focus:ring-[#dbfc54]/20 rounded px-[2px]" oninput={(e) => handleInput(e, tile.key as keyof typeof vals)} onblur={(e) => handleBlur(e, tile.key as keyof typeof vals)} onkeydown={handleKeydown}>{vals[tile.key as keyof typeof vals].toFixed(2)}</span></div>
              <div class="text-[15px] font-medium flex items-center gap-[3px] mt-[6px] font-['Suisse_Intl'] {vals[tile.key as keyof typeof vals] > 0 ? 'text-[#5CA84A]' : 'text-[#e8e8e8]'}">
                {#if vals[tile.key as keyof typeof vals] > 0}<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="3" y1="21" x2="21" y2="3"></line><polyline points="9 3 21 3 21 15"></polyline></svg>100.00%{:else}0.00%{/if}
              </div>
            </div>
          {/if}
        {/each}
      </div>

      <div class="bg-[#151515] rounded-xl p-[17px] mt-[11px] border border-[#242424]">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-[13px] font-medium text-white font-['Inter'] flex items-center gap-1.5">Earnings trends <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></h3>
          <div class="flex gap-[5px]">
            {#each ['Hour','Day','Week','Month'] as g}
              <button 
                class="text-[13px] font-semibold px-[10px] py-[5px] rounded-[7px] transition-colors {trendsGranularity === g ? 'bg-[#2a2a2a] text-white' : 'text-[#8a8a8a] hover:text-[#c9c9c9]'}"
                onclick={() => trendsGranularity = g}
              >{g}</button>
            {/each}
          </div>
        </div>
        <div bind:this={overviewTrendsContainer} class="h-[235px] w-full mt-2"></div>
      </div>
      
      <div class="grid grid-cols-[1fr_320px] gap-3 mt-[11px] items-stretch">
        
        <div class="bg-[#151515] rounded-xl p-[17px] flex flex-col justify-between border border-[#242424]">
           <div class="flex items-center gap-[7px]">
             <h3 class="text-[13px] font-medium text-white font-['Inter']">Earnings by channel</h3>
             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
           </div>
           <div class="flex items-center justify-between mt-[9px]">
              <div class="relative">
                <button class="bg-[#232323] text-[#e8e8e8] text-[12.5px] font-medium flex items-center gap-[7px] px-[11px] h-[30px] rounded-lg border border-transparent hover:bg-[#2a2a2a]" onclick={(e) => { e.stopPropagation(); toggleMenu('channels'); }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c9c9c9" stroke-width="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  Channels
                  <svg class="transition-transform {openMenu === 'channels' ? 'rotate-180' : ''}" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                {#if openMenu === 'channels'}
                  <div class="absolute top-[36px] left-0 bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg p-1.5 min-w-[160px] shadow-2xl z-[150] flex flex-col" onclick={(e) => e.stopPropagation()}>
                    {#each ['Subscriptions', 'Tips', 'Posts', 'Messages', 'Referrals', 'Streams'] as ch}
                      <label class="flex items-center gap-2.5 px-2.5 py-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer transition-colors text-[14px] text-[#e8e8e8]">
                        <div class="w-4 h-4 rounded-sm border-[1.5px] flex items-center justify-center transition-colors {activeChannels.includes(ch) ? 'bg-[#f38157] border-[#f38157]' : 'border-[#666] bg-transparent'}">
                          {#if activeChannels.includes(ch)}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="mt-[1px]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          {/if}
                        </div>
                        <input type="checkbox" class="hidden" checked={activeChannels.includes(ch)} onchange={() => toggleChannel(ch)}>
                        {ch}
                      </label>
                    {/each}
                  </div>
                {/if}
              </div>

              <div class="flex gap-[5px]">
                {#each ['Hour','Day','Week','Month'] as g}
                  <button 
                    class="text-[13px] font-semibold px-[10px] py-[5px] rounded-[7px] transition-colors {channelGranularity === g ? 'bg-[#2a2a2a] text-white' : 'text-[#8a8a8a] hover:text-[#c9c9c9]'}"
                    onclick={() => channelGranularity = g}
                  >{g}</button>
                {/each}
              </div>
           </div>
           <div bind:this={overviewChannelContainer} class="h-[227px] w-full mt-4"></div>
        </div>
        
        <div class="bg-[#151515] rounded-xl p-[17px] border border-[#242424]">
          <h3 class="text-[13px] font-medium text-white font-['Inter'] mb-[6px]">Earnings breakdown</h3>
          <div bind:this={overviewBreakdownContainer} class="w-[124px] h-[124px] mx-auto mb-5 mt-3"></div>
          <div class="flex flex-col gap-[7px] mt-2">
            {#each [{k:'Subscriptions',c:'#359AD1',n:'Subscription'},{k:'Tips',c:'#5CA64C',n:'Tips'},{k:'Posts',c:'#D46B43',n:'Posts'},{k:'Messages',c:'#AB70D0',n:'Messages'},{k:'Referrals',c:'#D1628C',n:'Referrals'},{k:'Streams',c:'#DAA717',n:'Streams'}] as leg}
              <div class="flex items-center h-[19px]">
                <span class="w-[7px] h-[7px] rounded-full shrink-0 mr-[9px]" style="background:{leg.c}"></span>
                <span class="grow text-[#c9c9c9] text-[14px]">{leg.n}</span>
                <span class="text-[11px] font-medium text-white mr-[14px] w-[54px] text-right font-['Suisse_Intl']">{calcPct(vals[leg.k as keyof typeof vals])}%</span>
                <span class="text-[11px] text-white w-[56px] text-right font-['Suisse_Intl_Mono']">${vals[leg.k as keyof typeof vals].toFixed(2)}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center mt-[24px]">
        <h2 class="text-[16px] font-semibold font-['Inter']">Creator statistics</h2>
        <button class="bg-[#1f1f1f] border border-[#2c2c2c] rounded-lg px-[11px] py-[6px] text-[12.5px] hover:bg-[#262626] flex items-center gap-[7px] transition-colors"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e8e8e8" stroke-width="1.9"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 8 12 3 17 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>Export</button>
      </div>

      <div class="bg-[#000] rounded-xl p-[14px] mt-[11px] flex items-start gap-[12px] border border-[#1a1a1a]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" class="mt-[2px] shrink-0"><path d="M21 4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4l3 4 3-4h4a2 2 0 0 0 2-2z"></path><circle cx="12" cy="6.6" r="1.4" fill="#141414"></circle><rect x="10.9" y="9.3" width="2.2" height="6.2" rx="1.1" fill="#141414"></rect></svg>
        <ul class="text-[12.5px] text-[#b9b9b9] leading-[1.8] list-disc pl-4 marker:text-[#555]">
          <li class="pl-1">Percentage change is calculated based on the change in value in the selected time frame against the same time frame immediately before it.</li>
          <li class="pl-1">Data marked with <span class="bg-[#2e2e2e] text-[#9a9a9a] text-[10px] font-medium px-[6px] py-[1.5px] rounded-md mx-1 align-baseline">UTC+00:00</span> is available in UTC+00:00 only, due to OnlyFans limitations</li>
        </ul>
      </div>
      
      <div class="grid grid-cols-4 gap-[12px] mt-[11px]">
        <div class="bg-[#151515] rounded-[12px] px-[17px] pt-[15px] pb-[18px] border border-[#242424]">
          <div class="text-[13px] font-medium text-white flex items-center gap-[7px]"><span>Creators</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
          <div class="text-[32px] font-medium font-['Suisse_Intl_Mono'] mt-[24px] leading-[1.1]"><span contenteditable="true" class="outline-none focus:text-[#2d74ff] rounded" oninput={(e) => handleInput(e, 'creators')} onblur={(e) => handleBlur(e, 'creators')} onkeydown={handleKeydown}>{stats.creators}</span></div>
        </div>
        <div class="bg-[#151515] rounded-[12px] px-[17px] pt-[15px] pb-[18px] border border-[#242424]">
          <div class="text-[13px] font-medium text-white flex items-center gap-[7px]"><span>Message earnings</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
          <div class="text-[32px] font-medium font-['Suisse_Intl_Mono'] mt-[24px] leading-[1.1]">${vals.Messages.toFixed(2)}</div>
        </div>
        <div class="bg-[#151515] rounded-[12px] px-[17px] pt-[15px] pb-[18px] border border-[#242424]">
          <div class="text-[13px] font-medium text-white flex items-center gap-[7px]"><span>Total earnings</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
          <div class="text-[32px] font-medium font-['Suisse_Intl_Mono'] mt-[24px] leading-[1.1]">${total.toFixed(2)}</div>
        </div>
        <div class="bg-[#151515] rounded-[12px] px-[17px] pt-[15px] pb-[18px] border border-[#242424]">
          <div class="text-[13px] font-medium text-white flex items-center gap-[7px]"><span>Refunded</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>
          <div class="text-[32px] font-medium font-['Suisse_Intl_Mono'] mt-[24px] leading-[1.1]">$<span contenteditable="true" class="outline-none focus:text-[#2d74ff] rounded" oninput={(e) => handleInput(e, 'refunded')} onblur={(e) => handleBlur(e, 'refunded')} onkeydown={handleKeydown}>{stats.refunded.toFixed(2)}</span></div>
        </div>
      </div>

      <div class="mt-[20px] mb-[9px] flex justify-end text-[12.5px] text-[#e8e8e8] font-normal cursor-pointer items-center gap-[7px]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><line x1="4" y1="8" x2="20" y2="8"></line><line x1="4" y1="16" x2="20" y2="16"></line><circle cx="9" cy="8" r="2" fill="#171717"></circle><circle cx="15" cy="16" r="2" fill="#171717"></circle></svg>Custom metrics</div>
      <div class="overflow-x-auto pb-[6px] scrollbar-thin scrollbar-thumb-[#3d3d3d] scrollbar-track-transparent">
        <table class="w-full border-collapse min-w-full">
          <thead>
            <tr class="border-b border-[#242424]">
               {#each ['Creator', 'Total subscription earnings', 'Tips', 'Message', 'Engagement earnings ratio', 'Total earnings', 'Contribution %', 'OF ranking', 'Fans with renew on', 'Profile visitors', 'New subscribers', 'Subscriber renewals', 'New subscriber conversion', 'Active fans', 'Number of spenders', 'Avg spend per spender', 'Avg earnings per fan', 'Reply time', 'Fans chatted', 'Messages sent', 'PPVs sent'] as th, i}
                 <th class="bg-[#151515] text-[#b9b9b9] text-[12.5px] font-medium text-left px-[13px] py-[10px] whitespace-nowrap cursor-pointer hover:bg-[#2a2522] {i === 0 ? 'sticky left-0 z-10 border-r border-[#242424]' : ''} {i === 5 ? 'bg-[#262626]' : ''}">
                    <div class="flex items-center gap-[6px] w-full">
                       {th}
                       {#if th.includes('UTC')} <span class="bg-[#2e2e2e] text-[#9a9a9a] text-[10px] font-medium px-[6px] py-[1.5px] rounded-md mx-1">UTC+00:00</span> {/if}
                       {#if [1,4,5,6,7,8,9,10,11,12,13].includes(i)} <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6a6a6a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> {/if}
                       <div class="flex flex-col gap-0 ml-auto pl-[12px]">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="{i === 5 ? '#fff' : '#6a6a6a'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mb-[-3px]"><polyline points="18 15 12 9 6 15"></polyline></svg>
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6a6a6a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                       </div>
                    </div>
                 </th>
               {/each}
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="21" class="text-center py-6 text-[#666] text-sm">No creator data available</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div style="display: {activeTab === 'performance' ? 'block' : 'none'}">
    <div class="flex gap-[12px] mt-[11px] h-[calc(100vh-160px)]">
      
      <aside class="w-[280px] bg-[#151515] rounded-xl flex flex-col overflow-hidden shrink-0 border border-[#242424]">
        <div class="p-3 border-b border-[#242424] flex items-center gap-2">
           <div class="relative flex-grow">
             <input type="text" placeholder="Search" class="w-full bg-[#232323] text-sm text-white rounded-lg pl-8 pr-3 py-1.5 outline-none focus:ring-1 focus:ring-[#2d74ff]">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-2.5 top-2"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>
           </div>
           <button class="p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></button>
        </div>
        <div class="p-3 bg-[#2a2a2a] flex justify-between items-center cursor-pointer text-[14px] font-medium border-b border-[#242424]">
           <span>All creators</span>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="flex-grow overflow-y-auto p-4 text-center text-[#666] text-sm">No creators found</div>
      </aside>

      <div class="flex-grow overflow-y-auto pr-2 pb-10 flex flex-col gap-[22px] scrollbar-thin">
        
        <div class="bg-[#151515] rounded-[12px] p-[17px] border border-[#242424]">
           <div class="flex justify-between items-center mb-4">
             <div class="flex items-center gap-[7px]">
               <h3 class="text-[13px] font-medium font-['Inter']">Earnings</h3>
               <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
             </div>
             <div class="flex gap-[5px] bg-[#1a1a1a] rounded-[8px] border border-[#242424] p-[3px]">
                {#each ['All','Subscriptions','Tips','Posts','Messages','Referrals','Streams'] as ch}
                  <button 
                    class="px-[12px] py-[4px] text-[12px] font-semibold rounded-[6px] transition-colors {activePerfChannel === ch ? 'bg-[#3a3a3a] text-white' : 'text-[#8a8a8a] hover:text-[#c9c9c9]'}"
                    onclick={() => activePerfChannel = ch}
                  >{ch}</button>
                {/each}
             </div>
           </div>
           <div bind:this={perfEarningsContainer} class="h-[200px] w-full"></div>
        </div>

        <div>
          <div class="flex items-center gap-[7px] mb-3">
             <h2 class="text-[16px] font-semibold font-['Inter']">Earnings breakdown</h2>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div class="grid grid-cols-2 gap-[12px]">
             
             <div class="bg-[#151515] rounded-[12px] p-[17px] border border-[#242424] flex items-center gap-6">
                <div bind:this={perfDonutContainer} class="w-[146px] h-[146px] shrink-0"></div>
                <div class="flex flex-col gap-[10px] w-full mt-2">
                  {#each perfBreakdownConfig as leg}
                     <div class="flex flex-col">
                      <div class="text-[12px] text-[#8a8a8a] mb-1">{leg.n}</div>
                      <div class="flex items-center">
                        <span class="w-2 h-2 rounded-full mr-2" style="background:{leg.c}"></span>
                        <span class="text-[15px] font-bold text-white font-['Suisse_Intl_Mono'] min-w-[65px]">${vals[leg.k as keyof typeof vals].toFixed(1)}</span>
                        <span class="text-[11px] text-[#8a8a8a] font-medium">{calcPct(vals[leg.k as keyof typeof vals])}%</span>
                      </div>
                     </div>
                  {/each}
                </div>
             </div>

             <div class="bg-[#151515] rounded-[12px] p-[17px] border border-[#242424] flex flex-col justify-between">
                {#each perfBreakdownConfig as leg, i}
                   <div class="flex items-center justify-between mb-3 last:mb-0">
                    <div class="flex flex-col w-[120px]">
                      <div class="flex items-center gap-2 text-[15px] font-bold text-white font-['Suisse_Intl_Mono']">
                        ${vals[leg.k as keyof typeof vals].toFixed(1)}
                        <span class="bg-[#2AD4AC]/10 text-[#2AD4AC] text-[10px] px-1 py-0.5 rounded flex items-center font-['Inter']">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="mr-0.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="9 7 17 7 17 15"></polyline></svg>
                          0.00%
                        </span>
                      </div>
                      <div class="text-[12px] text-[#8a8a8a]">{leg.n}</div>
                    </div>
                     <div bind:this={perfSparklineContainers[i]} class="w-[158px] h-[30px]"></div>
                  </div>
                {/each}
             </div>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-[7px] mb-3">
             <h2 class="text-[16px] font-semibold font-['Inter']">Earnings heatmap</h2>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div class="bg-[#151515] rounded-[12px] pt-[17px] border border-[#242424] relative">
             <div bind:this={perfHeatmapContainer} class="h-[223px] w-full"></div>
             <div class="absolute bottom-[10px] right-[20px] flex items-center gap-[10px]">
                <span class="text-[12px] text-[#9a9a9a] font-['Suisse_Intl']">0</span>
                <div class="w-[120px] h-[8px] rounded-[4px] bg-gradient-to-r from-[#151515] to-[#3467FF] border border-[#242424]"></div>
                <span class="text-[12px] text-[#e8e8e8] font-['Suisse_Intl']">3</span>
             </div>
          </div>
         </div>

        <div>
          <div class="flex items-center gap-[7px] mb-3">
             <h2 class="text-[16px] font-semibold font-['Inter']">Chargebacks</h2>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </div>
          <div class="bg-[#151515] rounded-[12px] p-[17px] border border-[#242424] relative">
             <div bind:this={perfChargebacksContainer} class="h-[194px] w-full"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<style>
  [contenteditable="true"]:empty:before { content: "0.00"; color: #666; }
</style>