/* 
  Nexus ERP + HRM - ApexTree Organizational Hierarchy Component Logic
*/

function initEmployeeOrgChart() {
  const container = document.getElementById("chartEmployeeOrgTree");
  if (!container || typeof ApexTree === "undefined") return;

  const orgData = {
    id: "ceo",
    data: {
      imageURL:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80",
      name: "Tristan Nguyen",
      title: "Chief Executive Officer",
      subtitle: "Executive Team",
      badge: { text: "CEO", color: "#EEF2FF", textColor: "#1E40AF" },
      accentColor: "#2563EB",
    },
    children: [
      {
        id: "vp_ops",
        data: {
          imageURL:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
          name: "Elena Rostova",
          title: "VP, Retail & Operations",
          subtitle: "Store Operations",
          badge: { text: "VP", color: "#ECFDF5", textColor: "#065F46" },
          accentColor: "#10B981",
        },
        children: [
          {
            id: "mgr_nam",
            data: {
              imageURL:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
              name: "Pham Hoang Nam",
              title: "Flagship Store Manager",
              subtitle: "Outlet #01 Central",
              badge: {
                text: "Outlet 01",
                color: "#F0FDF4",
                textColor: "#166534",
              },
              accentColor: "#10B981",
            },
          },
          {
            id: "mgr_rossi",
            data: {
              imageURL:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
              name: "Marco Rossi",
              title: "Bistro General Manager",
              subtitle: "Outlet #04 Skyline",
              badge: {
                text: "Outlet 04",
                color: "#F0FDF4",
                textColor: "#166534",
              },
              accentColor: "#10B981",
            },
          },
        ],
      },
      {
        id: "dir_culinary",
        data: {
          imageURL:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80",
          name: "David Kim",
          title: "Director, Culinary & R&D",
          subtitle: "Culinary & Beverage",
          badge: { text: "R&D", color: "#FFF7ED", textColor: "#9A3412" },
          accentColor: "#F59E0B",
        },
        children: [
          {
            id: "barista_lead",
            data: {
              imageURL:
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
              name: "Nguyen Van An",
              title: "Master Barista & Quality Lead",
              subtitle: "Beverage R&D",
              badge: {
                text: "Barista",
                color: "#FFF7ED",
                textColor: "#9A3412",
              },
              accentColor: "#F59E0B",
            },
          },
          {
            id: "pastry_lead",
            data: {
              imageURL:
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
              name: "Emily Watson",
              title: "Head Pastry Chef",
              subtitle: "Central Bakery",
              accentColor: "#F59E0B",
            },
          },
        ],
      },
      {
        id: "head_supply",
        data: {
          imageURL:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
          name: "Sophia Chen",
          title: "Head of Supply Chain",
          subtitle: "Logistics & Supply",
          badge: { text: "Logistics", color: "#F0F9FF", textColor: "#075985" },
          accentColor: "#0284C7",
        },
        children: [
          {
            id: "logistics_mgr",
            data: {
              imageURL:
                "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80",
              name: "Michael Chang",
              title: "Logistics Superintendent",
              subtitle: "Central Warehouse",
              accentColor: "#0284C7",
            },
          },
        ],
      },
      {
        id: "chro",
        data: {
          imageURL:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
          name: "Marcus Vance",
          title: "Chief People Officer",
          subtitle: "People & Culture",
          badge: { text: "CPO", color: "#FCEEF3", textColor: "#9D174D" },
          accentColor: "#EC4899",
        },
        children: [
          {
            id: "hr_mgr",
            data: {
              imageURL:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
              name: "Le Thi Mai",
              title: "Head of Talent",
              subtitle: "Recruitment HQ",
              accentColor: "#EC4899",
            },
          },
        ],
      },
    ],
  };

  const renderTree = () => {
    container.innerHTML = "";
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 576;
    const options = {
      contentKey: "data",
      width: "100%",
      height: isSmallMobile ? 380 : isMobile ? 440 : 540,
      nodeWidth: isSmallMobile ? 220 : 260,
      nodeHeight: isSmallMobile ? 72 : 78,
      childrenSpacing: isSmallMobile ? 45 : 70,
      siblingSpacing: isSmallMobile ? 18 : 30,
      direction: "top",
      edgeStyle: "orthogonal",
      edgeWidth: 2,
      edgeColor: "#cbd5e1",
      edgeColorHover: "#2563eb",
      canvasStyle: "background: transparent;",
      enableBorders: false,
      enableZoomPan: true,
      enableToolbar: true,
      enableSearch: true,
      enableBreadcrumb: true,
      enableSelection: "single",
      nodeTemplate: (content) => {
        if (!content) return "";
        const accent = content.accentColor || "#3B82F6";
        const badge = content.badge;
        const badgeHtml = badge
          ? `<span style="background-color: ${badge.color || "#EEF2FF"}; color: ${badge.textColor || accent}; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em; display: inline-block; flex-shrink: 0;">${badge.text}</span>`
          : "";
        const image =
          content.imageURL ||
          content.avatar ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(content.name)}`;

        return `
          <div class="apextree-sleek-card" style="width: 256px; height: 76px; background-color: #ffffff; border: 1px solid #cbd5e1; border-left: 4px solid ${accent}; border-radius: 12px; padding: 8px 10px; display: flex; align-items: center; gap: 10px; box-sizing: border-box; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; position: relative; overflow: hidden;">
            <div style="width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; overflow: hidden; border: 2px solid #ffffff; background-color: #f1f5f9;">
              <img src="${image}" alt="${content.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
            </div>
            <div style="flex-grow: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 2px;">
                <h4 style="font-size: 13px; font-weight: 700; color: #0f172a !important; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; font-family: 'Plus Jakarta Sans', sans-serif;">${content.name}</h4>
                ${badgeHtml}
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #334155 !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.25; font-family: 'Plus Jakarta Sans', sans-serif;">${content.title || content.role || ""}</div>
              <div style="font-size: 10px; font-weight: 500; color: #64748b !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2; font-family: 'Plus Jakarta Sans', sans-serif;">${content.subtitle || content.department || ""}</div>
            </div>
          </div>
        `;
      },
    };

    const tree = new ApexTree(container, options);
    window.apexOrgTreeGraph = tree.render(orgData);
  };

  renderTree();
}

// Expose on window object
window.initEmployeeOrgChart = initEmployeeOrgChart;
