/* 
  Nexus ERP + HRM - ApexCharts Analytics & Visualizations Logic
*/

/* 1. Monthly Sales & Workforce Overview Chart */
function renderMonthlyWorkforceOverviewChart() {
  const container = document.querySelector("#chartMonthlyOverview");
  if (!container || typeof ApexCharts === "undefined") return;

  const options = {
    series: [
      {
        name: "Sales Revenue ($K)",
        data: [300, 320, 420, 520, 470, 650, 620, 820, 940, 1150, 880, 950],
      },
    ],
    chart: {
      type: "bar",
      height: 260,
      width: "100%",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "65%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        distributed: true,
      },
    },
    colors: [
      "#93C5FD",
      "#E9D5FF",
      "#A7F3D0",
      "#FDE68A",
      "#FBCFE8",
      "#A5F3FC",
      "#FED7AA",
      "#C7D2FE",
      "#D9F99D",
      "#DDD6FE",
      "#FECDD3",
      "#99F6E4",
    ],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.35,
        gradientToColors: [
          "#3B82F6",
          "#8B5CF6",
          "#10B981",
          "#F59E0B",
          "#EC4899",
          "#06B6D4",
          "#F97316",
          "#6366F1",
          "#84CC16",
          "#9333EA",
          "#F43F5E",
          "#0D9488",
        ],
        inverseColors: false,
        opacityFrom: 0.95,
        opacityTo: 0.85,
        stops: [0, 100],
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#94A3B8", fontSize: "11px", fontWeight: 500 },
      },
    },
    yaxis: {
      min: 0,
      max: 1400,
      tickAmount: 4,
      labels: {
        formatter: (val) =>
          val >= 1000 ? `$${(val / 1000).toFixed(1)}M` : `$${val}K`,
        style: { colors: "#94A3B8", fontSize: "11px" },
      },
    },
    grid: {
      borderColor: "#CBD5E1",
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: -10,
        top: 0,
        bottom: 0,
      },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val) => `$${val},000 Revenue` },
    },
  };

  const chart = new ApexCharts(container, options);
  chart.render();
}

/* 2. Department Categories Donut Chart */
function renderDepartmentCategoriesDonutChart() {
  const container = document.querySelector("#chartDepartmentCategories");
  if (!container || typeof ApexCharts === "undefined") return;

  const options = {
    series: [32, 22, 16, 10, 8, 7, 5],
    chart: {
      type: "donut",
      height: 200,
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    labels: [
      "Baristas & Service",
      "Kitchen & Culinary",
      "Store Managers",
      "Delivery & Dispatch",
      "Warehouse & Supply",
      "Marketing & Care",
      "HQ & Ops",
    ],
    colors: [
      "#60A5FA",
      "#C084FC",
      "#34D399",
      "#FBBF24",
      "#F472B6",
      "#38BDF8",
      "#A78BFA",
    ],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 3, colors: ["#FFFFFF"] },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Employees",
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748B",
              formatter: () => "1,248",
            },
            value: {
              fontSize: "18px",
              fontWeight: 800,
              color: "#0F172A",
              offsetY: 2,
            },
          },
        },
      },
    },
  };

  const chart = new ApexCharts(container, options);
  chart.render();
}

// Expose on window object
window.renderMonthlyWorkforceOverviewChart = renderMonthlyWorkforceOverviewChart;
window.renderDepartmentCategoriesDonutChart = renderDepartmentCategoriesDonutChart;
