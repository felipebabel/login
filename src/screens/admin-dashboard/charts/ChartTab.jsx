import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import "./ChartTab.css";
import { GET_ACCOUNT_MONTH, GET_TOTAL_ACCOUNT, GET_LOGIN_ATTEMPTS } from "@api/endpoints";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];
import { authService } from "@/components/auth/AuthService";
import LoadingOverlay from '@/components/loading/LoadingOverlay';

const ChartTab = ({ t }) => {
  const [activeTab, setActiveTab] = useState("status");
  const [usersPerMonth, setUsersPerMonth] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginAttemptsData, setLoginAttemptsData] = useState([]);
  const [localTotals, setLocalTotals] = useState({
    totalActive: 0,
    totalInactive: 0,
    totalPending: 0,
    totalBlocked: 0
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div
          style={{
            backgroundColor: "#2e2e33",
            color: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
          }}
        >
          {data.name}: {data.value}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    if (activeTab === "loginAttempts") {
      fetchLoginAttempts();
    }
  }, [activeTab]);

  const fetchLoginAttempts = async () => {
    try {
      setLoading(true);

      const data = await authService.apiClient(GET_LOGIN_ATTEMPTS);
      const response = await data.json();
      const translationKeys = {
        'LOGIN ACCOUNT': 'adminDashboard.loginAccountOk',
        'LOGIN ATTEMPT FAILED': 'adminDashboard.loginAccountFailed'
      };
      const formatted = response.map(item => ({
        name: t(translationKeys[item.action] || item.action),
        value: item.total
      }));
      setLoginAttemptsData(formatted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotals = async () => {
    try {
      setLoading(true);

      const data = await authService.apiClient(GET_TOTAL_ACCOUNT);
      const response = await data.json();
      setLocalTotals({
        totalActive: response.totalActive,
        totalInactive: response.totalInactive,
        totalPending: response.totalPending,
        totalBlocked: response.totalBlocked
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  useEffect(() => {
    const fetchNewAccounts = async () => {
      try {
        setLoading(true);
        const response = await authService.apiClient(GET_ACCOUNT_MONTH);
        const data = await response.json();
        const formatted = data.map(item => {
          const monthName = t(`months.${item.month}`);

          const label = `${monthName}/${item.year}`;
          return {
            month: label,
            count: item.totalUsers
          }
        });
        setUsersPerMonth(formatted);
      } catch (error) {
        console.error("Error searching for new users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "newUsers") {
      fetchNewAccounts();
    }
  }, [activeTab]);

  const pieData = [
    { name: t("adminDashboard.totalActive"), value: localTotals.totalActive },
    { name: t("adminDashboard.totalInactive"), value: localTotals.totalInactive },
    { name: t("adminDashboard.totalPending"), value: localTotals.totalPending },
    { name: t("adminDashboard.totalBlocked"), value: localTotals.totalBlocked },
  ];

  return (
    <div className="flex h-full">
      {loading && <LoadingOverlay />}
      <div className="dashboard-sidebar">
        <button
          className={`tab-btn-vertical ${activeTab === "status" ? "active" : ""}`}
          onClick={() => setActiveTab("status")}
        >
          {t("adminDashboard.totalAccount")}
        </button>
        <button
          className={`tab-btn-vertical ${activeTab === "newUsers" ? "active" : ""}`}
          onClick={() => setActiveTab("newUsers")}
        >
          {t("adminDashboard.newAccountsLast12Mounths")}
        </button>
        <button
          className={`tab-btn-vertical ${activeTab === "loginAttempts" ? "active" : ""}`}
          onClick={() => setActiveTab("loginAttempts")}
        >
          {t("adminDashboard.loginAttempts")}
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "status" && (
          <div className="chart-wrapper-pie">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "newUsers" && (
          <div className="chart-wrapper">
            <ResponsiveContainer width="80%" height={400}>
              <BarChart
                data={usersPerMonth}
                margin={{ top: 20, right: 0, left: 100, bottom: 80 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#ffffff", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}

                  label={{
                    value: t("adminDashboard.months"),
                    position: "bottom",
                    offset: 40,
                    style: { fontSize: 16, fontWeight: "bold", fill: "#ffffff" }
                  }}
                />
                <YAxis
                  tick={{ fill: "#ffffff", fontSize: 14 }}
                  label={{
                    value: t("adminDashboard.newAccounts"),
                    offset: -100,
                    position: "insideLeft",
                    style: { fontSize: 16, fontWeight: "bold", fill: "#ffffff" },
                    textAnchor: "middle"
                  }}
                />
                <Tooltip cursor={false} formatter={(value) => [`${value}`, t("adminDashboard.newAccounts")]} />
                <Bar dataKey="count" fill="#00C49F" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>


          </div>
        )}

        {activeTab === "loginAttempts" && (
          <div className="chart-wrapper-pie">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={loginAttemptsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {loginAttemptsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChartTab;
