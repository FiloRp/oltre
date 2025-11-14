// src/app/(admin)/analytics/_components/DashboardCharts.tsx.tsx
"use client";

import { Card, Title, BarChart, LineChart } from "@tremor/react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  bookingsChartData: any[];
  popularTripsChartData: any[];
  revenueChartData: any[];
}

export function DashboardCharts() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        if (!response.ok) throw new Error('Errore nel caricamento dei dati');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <p>Caricamento dati...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Nessun dato disponibile.</p>;

  return (
    <div className="space-y-6">
      <Card>
        <Title>Andamento Prenotazioni</Title>
        <LineChart
          className="mt-6"
          data={data.bookingsChartData}
          index="date"
          categories={["Numero di Prenotazioni"]}
          colors={["blue"]}
          yAxisWidth={40}
        />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Title>Viaggi più Popolari (Top 5)</Title>
          <BarChart
            className="mt-6"
            data={data.popularTripsChartData}
            index="name"
            categories={["Numero di Prenotazioni"]}
            colors={["cyan"]}
            yAxisWidth={48}
          />
        </Card>
        <Card>
          <Title>Fatturato Mensile (€)</Title>
          <BarChart
            className="mt-6"
            data={data.revenueChartData}
            index="date"
            categories={["Fatturato"]}
            colors={["indigo"]}
            yAxisWidth={48}
          />
        </Card>
      </div>
    </div>
  );
}