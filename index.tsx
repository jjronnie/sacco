/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- MOCK DATA ---
const summaryData = {
  totalSavings: 1250000,
  totalMembers: 78,
  activeLoans: 15,
  interestEarned: 85000,
};

const recentActivities = [
  { id: 1, member: 'Jane Doe', type: 'Deposit', amount: 5000, date: '2024-07-28' },
  { id: 2, member: 'John Smith', type: 'Loan', amount: 50000, date: '2024-07-27' },
  { id: 3, member: 'Peter Jones', type: 'Withdrawal', amount: 2000, date: '2024-07-26' },
  { id: 4, member: 'Mary Anne', type: 'Deposit', amount: 10000, date: '2024-07-25' },
  { id: 5, member: 'Chris Green', type: 'Deposit', amount: 7500, date: '2024-07-25' },
];

const barChartData = {
  labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Savings',
      data: [65000, 59000, 80000, 81000, 56000, 95000],
      backgroundColor: '#4F46E5',
      borderRadius: 4,
    },
    {
      label: 'Loans',
      data: [28000, 48000, 40000, 19000, 86000, 27000],
      backgroundColor: '#10B981',
      borderRadius: 4,
    },
  ],
};

const pieChartData = {
    labels: ['Jane Doe', 'John Smith', 'Peter Jones', 'Mary Anne', 'Others'],
    datasets: [
        {
            label: 'Savings Distribution',
            data: [30, 25, 15, 10, 20],
            backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6B7280'],
            borderColor: '#FFFFFF',
            borderWidth: 2,
        }
    ]
}

// --- SVG ICONS ---
const Icon = ({ path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

// --- COMPONENTS ---
const Sidebar = ({ isCollapsed, toggleSidebar, isMobileOpen }) => {
  const navItems = [
    { icon: "M2 13.3334C2 13.3334 3.09333 16.1667 7.25 16.1667C11.4067 16.1667 12.5 13.3334 12.5 13.3334M11.5 2.5C11.5 2.5 12.5933 5.33333 16.75 5.33333C20.9067 5.33333 22 2.5 22 2.5M4.75 21.5C4.75 21.5 6.41667 20.4167 7.25 18.5M19.25 21.5C19.25 21.5 17.5833 20.4167 16.75 18.5", name: 'Dashboard' },
    { icon: "M18 18.5V15.0714C18 14.5204 17.8924 13.9772 17.6853 13.4751C17.4782 12.973 17.1776 12.525 16.799 12.151L13.849 9.201C13.475 8.82243 12.973 8.52183 12.4751 8.31471C11.9772 8.10759 11.4204 8 10.871 8H7.129C6.57962 8 6.02279 8.10759 5.52488 8.31471C5.02697 8.52183 4.52503 8.82243 4.151 9.201L1.201 12.151C0.822432 12.525 0.521831 12.973 0.314711 13.4751C0.107591 13.9772 0 14.5204 0 15.0714V18.5C0 19.3284 0.31607 20.1228 0.87868 20.6855C1.44129 21.2481 2.23586 21.5642 3.064 21.5642H14.936C15.7641 21.5642 16.5587 21.2481 17.1213 20.6855C17.6839 20.1228 18 19.3284 18 18.5Z M6 13H12", name: 'Members' },
    { icon: "M2 8.5L5.5 12L2 15.5M9 8.5L12.5 12L9 15.5M16 2.5H22M16 5.5H19", name: 'Transactions' },
    { icon: "M14 2.5H2V12.5H14V2.5Z M2 15.5H5V18.5H2V15.5Z M7 15.5H10V18.5H7V15.5Z M12 15.5H15V18.5H12V15.5Z", name: 'Loans' },
    { icon: "M12 21.5V11.5M12 11.5L15.5 15M12 11.5L8.5 15M19 18.5L14.5 14.5M5 18.5L9.5 14.5M2 2.5H22V5.5H2V2.5Z", name: 'Reports' },
    { icon: "M22 10.5V13.5M19.389 15.611L18 18M15.611 19.389L18 18M18 18L15.611 15.611M13.5 22H10.5M8.389 19.389L6 18M6 18L8.389 15.611M3.611 15.611L6 18M2 13.5V10.5M4.611 8.389L6 6M6 6L8.389 8.389M8.389 4.611L6 6M10.5 2H13.5M15.611 4.611L18 6M18 6L15.611 8.389M19.389 8.389L18 6M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z", name: 'Settings' },
  ];
  
  const mobileClass = isMobileOpen ? 'open' : '';
  const collapsedClass = isCollapsed ? 'collapsed' : '';
  
  return (
    <aside className={`sidebar ${collapsedClass} ${mobileClass}`}>
      <div className="sidebar-header">
        <span className="logo-icon">💰</span>
        <h2 className="logo-text">Bondemala</h2>
      </div>
      <nav className="nav-menu">
        {navItems.map((item, index) => (
          <a href="#" key={index} className={`nav-item ${index === 0 ? 'active' : ''}`}>
            <span className="nav-icon"><Icon path={item.icon} /></span>
            <span className="nav-text">{item.name}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
          <button className="toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
            <Icon path={isCollapsed ? "M8 5L12 1L16 5M8 19L12 23L16 19" : "M16 5L12 1L8 5M16 19L12 23L8 19"} />
          </button>
      </div>
    </aside>
  );
};

const Header = ({ toggleMobileSidebar }) => (
  <header className="header">
      <button className="mobile-menu-btn" onClick={toggleMobileSidebar} aria-label="Open Menu">
        <Icon path="M3 12h18M3 6h18M3 18h18" />
      </button>
    <h1>Dashboard</h1>
    <div className="user-profile">
      <span>Admin</span>
      <img src="https://i.pravatar.cc/40" alt="Admin user avatar" />
    </div>
  </header>
);

const SummaryCard = ({ title, value, icon, iconClass, formatAsCurrency = false }) => (
    <div className="summary-card">
        <div className={`card-icon ${iconClass}`}>
            <Icon path={icon} />
        </div>
        <div className="card-content">
            <h3>{title}</h3>
            <p className="value">{formatAsCurrency ? `Ksh ${value.toLocaleString()}` : value}</p>
        </div>
    </div>
);

const App = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth > 768) {
              setMobileSidebarOpen(false);
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} isMobileOpen={isMobileSidebarOpen} />
      <main className="main-content">
        <Header toggleMobileSidebar={toggleMobileSidebar}/>
        <div className="dashboard-grid">
            <SummaryCard title="Total Savings" value={summaryData.totalSavings} icon="M2 13.3334C2 13.3334 3.09333 16.1667 7.25 16.1667C11.4067 16.1667 12.5 13.3334 12.5 13.3334M11.5 2.5C11.5 2.5 12.5933 5.33333 16.75 5.33333C20.9067 5.33333 22 2.5 22 2.5M4.75 21.5C4.75 21.5 6.41667 20.4167 7.25 18.5M19.25 21.5C19.25 21.5 17.5833 20.4167 16.75 18.5" iconClass="total-savings" formatAsCurrency />
            <SummaryCard title="Total Members" value={summaryData.totalMembers} icon="M18 18.5V15.0714C18 14.5204 17.8924 13.9772 17.6853 13.4751C17.4782 12.973 17.1776 12.525 16.799 12.151L13.849 9.201C13.475 8.82243 12.973 8.52183 12.4751 8.31471C11.9772 8.10759 11.4204 8 10.871 8H7.129C6.57962 8 6.02279 8.10759 5.52488 8.31471C5.02697 8.52183 4.52503 8.82243 4.151 9.201L1.201 12.151C0.822432 12.525 0.521831 12.973 0.314711 13.4751C0.107591 13.9772 0 14.5204 0 15.0714V18.5C0 19.3284 0.31607 20.1228 0.87868 20.6855C1.44129 21.2481 2.23586 21.5642 3.064 21.5642H14.936C15.7641 21.5642 16.5587 21.2481 17.1213 20.6855C17.6839 20.1228 18 19.3284 18 18.5Z M6 13H12" iconClass="total-members" />
            <SummaryCard title="Active Loans" value={summaryData.activeLoans} icon="M14 2.5H2V12.5H14V2.5Z M2 15.5H5V18.5H2V15.5Z M7 15.5H10V18.5H7V15.5Z M12 15.5H15V18.5H12V15.5Z" iconClass="active-loans" />
            <SummaryCard title="Interest Earned" value={summaryData.interestEarned} icon="M2 8.5L5.5 12L2 15.5M9 8.5L12.5 12L9 15.5M16 2.5H22M16 5.5H19" iconClass="interest-earned" formatAsCurrency />
          
            <div className="chart-container">
                <div className="charts-grid">
                    <div>
                        <h2>Monthly Overview</h2>
                        <Bar options={{ responsive: true, plugins: { legend: { position: 'top' }}}} data={barChartData} />
                    </div>
                    <div>
                        <h2>Savings Distribution</h2>
                         <Pie options={{ responsive: true, plugins: { legend: { position: 'top' }}}} data={pieChartData} />
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Activity</h2>
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Type</th>
                            <th>Amount (Ksh)</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivities.map(activity => (
                            <tr key={activity.id}>
                                <td>{activity.member}</td>
                                <td><span className={`status-badge status-${activity.type.toLowerCase()}`}>{activity.type}</span></td>
                                <td>{activity.amount.toLocaleString()}</td>
                                <td>{activity.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
