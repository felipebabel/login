import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import "./ChartTab.css";
import { GET_ACCOUNT_MONTH } from "@api/endpoints";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const ChartTab = ({ totals }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("status");
  const [usersPerMonth, setUsersPerMonth] = useState([]);
  const [loginAttemptsPerDay, setLoginAttemptsPerDay] = useState([]);

  useEffect(() => {
    setLoginAttemptsPerDay([
      { date: "2025-09-16", count: 3 },
      { date: "2025-09-17", count: 5 },
      { date: "2025-09-18", count: 2 },
      { date: "2025-09-19", count: 7 },
      { date: "2025-09-20", count: 4 },
      { date: "2025-09-21", count: 6 },
      { date: "2025-09-22", count: 8 },
    ]);
  }, []);

  useEffect(() => {
    const fetchNewAccounts = async () => {
      try {
        const response = await fetch(GET_ACCOUNT_MONTH);
        const data = await response.json();

        const formatted = data.map(item => ({
          month: `${new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' })}/${item.year}`,
          count: item.totalUsers
        }));

        setUsersPerMonth(formatted);
      } catch (error) {
        console.error("Erro ao buscar novos usuários:", error);
      }
    };

    if (activeTab === "newUsers") {
      fetchNewAccounts();
    }
  }, [activeTab]);

  const pieData = [
    { name: t("adminDashboard.totalActive"), value: totals.totalActive },
    { name: t("adminDashboard.totalInactive"), value: totals.totalInactive },
    { name: t("adminDashboard.totalPending"), value: totals.totalPending },
    { name: t("adminDashboard.totalBlocked"), value: totals.totalBlocked },
  ];

  return (
    <div className="flex h-full">
      <div className="dashboard-sidebar">
        <button
          className={`tab-btn-vertical ${activeTab === "status" ? "active" : ""}`}
          onClick={() => setActiveTab("status")}
        >
          {t("adminDashboard.userStatus")}
        </button>
        <button
          className={`tab-btn-vertical ${activeTab === "newUsers" ? "active" : ""}`}
          onClick={() => setActiveTab("newUsers")}
        >
          {t("adminDashboard.newUsersPerMonth")}
        </button>
        <button
          className={`tab-btn-vertical ${activeTab === "loginAttempts" ? "active" : ""}`}
          onClick={() => setActiveTab("loginAttempts")}
        >
          {t("adminDashboard.loginAttemptsPerDay")}
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "newUsers" && (
          <div className="chart-wrapper">
            <ResponsiveContainer width="80%" height={400}>
              <BarChart data={usersPerMonth} margin={{ top: 20, right: 30, left: 50, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555555" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#ffffff", fontSize: 14 }}
                  label={{
                    value: "Months",
                    position: "insideBottom",
                    offset: 30,
                    style: { fontSize: 16, fontWeight: "bold", fill: "#00C49F" }
                  }}
                />
                <YAxis
                  tick={{ fill: "#ffffff", fontSize: 14 }}
                  label={{
                    value: "New Accounts",
                    angle: -90,
                    position: "insideLeft",
                    offset: 40,
                    style: { fontSize: 16, fontWeight: "bold", fill: "#00C49F" },
                    textAnchor: "middle"
                  }}
                />
                <Tooltip cursor={false} formatter={(value) => [`${value}`, "New account"]} />
                <Bar dataKey="count" fill="#00C49F" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === "loginAttempts" && (
          <div className="chart-wrapper">
            <ResponsiveContainer width="80%" height={400}>
              <BarChart data={loginAttemptsPerDay} margin={{ top: 50, right: 30, left: 40, bottom: 10 }} tooltip={false}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Legend />
                <Bar dataKey="count" fill="#FF8042" cursor={{ fill: "transparent" }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartTab;
