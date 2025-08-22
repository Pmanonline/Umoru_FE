// import React, { useState, useRef, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import AdminSidebar from "./AdminSidebar";
// import Adminheader from "./Adminheader";

// export default function AdminLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkIfMobile = () => {
//       const mobile = window.innerWidth < 1024;
//       setIsMobile(mobile);
//       if (!mobile) {
//         setIsSidebarOpen(false);
//       }
//     };

//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);
//     return () => window.removeEventListener("resize", checkIfMobile);
//   }, []);

//   const handleMenuClick = () => {
//     if (isMobile) {
//       setIsSidebarOpen(!isSidebarOpen);
//     } else {
//       setIsSidebarCollapsed(!isSidebarCollapsed);
//     }
//   };

//   const handleSidebarClose = () => {
//     setIsSidebarOpen(false);
//   };

//   const handleToggleCollapse = () => {
//     setIsSidebarCollapsed(!isSidebarCollapsed);
//   };

//   return (
//     <div className="bg-gray-50 dark:bg-gray-950 min-h-screen flex">
//       {/* Sidebar */}
//       <AdminSidebar
//         isOpen={isSidebarOpen}
//         onClose={handleSidebarClose}
//         isCollapsed={isSidebarCollapsed && !isMobile}
//         onToggleCollapse={handleToggleCollapse}
//       />

//       {/* Main Content */}
//       <div className="flex flex-col flex-1">
//         {/* Header */}
//         <Adminheader
//           onMenuClick={handleMenuClick}
//           isCollapsed={isSidebarCollapsed && !isMobile}
//           onToggleCollapse={handleToggleCollapse}
//         />

//         {/* Main Content Area */}
//         <main className="flex-1 p-6">
//           <div className="max-w-6xl mx-auto">
//             <div className="overflow-y-auto h-[calc(100vh-18rem)]">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Adminheader from "./Adminheader";
const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${backendURL}/api/getPosts?limit=50`);
        const data = await res.json();
        if (res.ok) setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts for sidebar", err);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 h-screen flex overflow-hidden">
      {/* Sidebar (fixed height, scrolls independently if needed) */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        isCollapsed={isSidebarCollapsed && !isMobile}
        onToggleCollapse={handleToggleCollapse}
        posts={posts}
      />

      {/* Main layout */}
      <div className="flex flex-col flex-1 h-screen overflow-x-auto">
        {/* Header (fixed at top, doesn’t scroll) */}
        <div className="shrink-0">
          <Adminheader
            onMenuClick={handleMenuClick}
            isCollapsed={isSidebarCollapsed && !isMobile}
            onToggleCollapse={handleToggleCollapse}
          />
        </div>

        {/* Content area (scrolls independently) */}
        <main className="flex-1 overflow-y-auto overflow-x-auto md:p-6">
          <div className="max-w-6xl mx-auto min-h-full overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
