import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

const ChartTab = ({ totals }) => {
  const { t } = useTranslation();
  const [usersPerMonth, setUsersPerMonth] = useState([]);
  const [loginAttemptsPerDay, setLoginAttemptsPerDay] = useState([]);

  // MOCK: novos usuários por mês
  useEffect(() => {
    const mockUsersPerMonth = [
      { month: "Jan", count: 5 },
      { month: "Feb", count: 12 },
      { month: "Mar", count: 7 },
      { month: "Apr", count: 15 },
      { month: "May", count: 9 },
      { month: "Jun", count: 14 },
    ];
    setUsersPerMonth(mockUsersPerMonth);
  }, []);

  // MOCK: tentativas de login por dia
  useEffect(() => {
    const mockLoginAttempts = [
      { date: "2025-09-16", count: 3 },
      { date: "2025-09-17", count: 5 },
      { date: "2025-09-18", count: 2 },
      { date: "2025-09-19", count: 7 },
      { date: "2025-09-20", count: 4 },
      { date: "2025-09-21", count: 6 },
      { date: "2025-09-22", count: 8 },
    ];
    setLoginAttemptsPerDay(mockLoginAttempts);
  }, []);

  const pieData = [
    { name: t("adminDashboard.totalActive"), value: totals.totalActive },
    { name: t("adminDashboard.totalInactive"), value: totals.totalInactive },
    { name: t("adminDashboard.totalPending"), value: totals.totalPending },
    { name: t("adminDashboard.totalBlocked"), value: totals.totalBlocked },
  ];

  return (
    <div className="charts-section">
      <h3>{t("adminDashboard.charts")}</h3>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Bar Chart - New users per month */}
      <h4>{t("adminDashboard.newUsersPerMonth")}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={usersPerMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>

      {/* Bar Chart - Login attempts per day
      <h4>{t("adminDashboard.loginAttemptsPerDay")}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={loginAttemptsPerDay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#FF8042" />
        </BarChart>
      </ResponsiveContainer> */}
    </div>
  );
};

export default ChartTab;
