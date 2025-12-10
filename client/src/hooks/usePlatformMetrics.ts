import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL as baseURL } from "../config";


export default function usePlatformMetrics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMetrics() {
    try {
      const res = await axios.get(baseURL + "/platform-metrics");
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    }
  }

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000000); // auto-refresh every 1000s
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
}
