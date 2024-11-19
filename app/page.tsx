"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRunAutomation = async (mode: string) => {
    setIsLoading(true); // Show loading spinner/message
    setStatus(null); // Reset the status message (optional)

    try {
      const response = await fetch("http://127.0.0.1:8000/run-automation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ update_mode: mode }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.status); // Update status message
      } else {
        setStatus("Failed to run automation. Check console for details.");
      }
    } catch (error) {
      console.error("Error running automation:", error);
      setStatus("An error occurred. Check console for details.");
    } finally {
      setIsLoading(false); // Hide loading spinner/message
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/logs");
        if (response.ok) {
          const data = await response.json();
          setLogs((prevLogs) => [...prevLogs, ...data.logs]);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-green-500 font-mono">
      <div className="text-center">
        <h1 className="text-4xl mb-6 font-bold animate-pulse">Jungle Scout Automation Dashboard</h1>
        <p className="mb-6 text-lg">
          A sleek automation dashboard that integrates with Google Sheets and Jungle Scout to fetch and analyze data
          dynamically.
        </p>
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            className="px-6 py-2 bg-green-800 hover:bg-green-600 text-black font-bold rounded-lg shadow-lg transition-all"
            onClick={() => handleRunAutomation("all")}
            disabled={isLoading}
          >
            Update All
          </button>
          <button
            className="px-6 py-2 bg-blue-800 hover:bg-blue-600 text-black font-bold rounded-lg shadow-lg transition-all"
            onClick={() => handleRunAutomation("new")}
            disabled={isLoading}
          >
            New Keywords
          </button>
        </div>
      </div>
      {isLoading && <p className="mt-6 text-lg animate-pulse">Running automation... Please wait.</p>}
      {status && <p className="mt-6 text-lg">{status}</p>}
      <div className="mt-6 w-full max-w-3xl bg-gray-900 text-green-400 p-4 rounded-lg shadow-lg overflow-y-auto h-96">
        <h2 className="text-lg font-bold mb-4">Automation Lab</h2>
        <pre className="text-sm whitespace-pre-wrap">{logs.length > 0 ? logs.join("\n") : "No logs available."}</pre>
      </div>
      <footer className="mt-10 text-sm opacity-70">Developed by Saba Mujahid © 2024</footer>
    </main>
  );
}
