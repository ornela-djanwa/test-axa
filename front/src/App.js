/** App.js */
import React from "react";
import ErrorMessage from "./components/ErrorMessage";

import MultilineChart from "./components/MultilineChart";
import { useState } from 'react';
import "./styles.scss";

const dimensions = {
  width: 1000,
  height: 350,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60
  }
};
const API_URL = "http://localhost:3000/stocks?_limit=20";
const SERVICE_UNAVAILABLE_ERROR_MESSAGE = "Le service est momentanément indisponible";
const DATA_EMPTY_ERROR_MESSAGE = "Aucune donnée disponible";
const CHART_NAME = "Stocks chart";
const CHART_COLOR = "red";
const TIMEOUT = 5000;


export default function App() {
  const [apiError, setApiError] = useState();
  const [apiErrorMessage, setApiErrorMessage] = useState();
  const [chartData, setChartData] = useState({
    name: CHART_NAME,
    color: CHART_COLOR,
    items: []
  });
  const fetchWithTimeout = async () => {
    try {
      const options = { timeout: TIMEOUT };
      let controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      const response = await fetch(API_URL, {
        ...options,
        signal: controller.signal
      });
      const data = await response.json();
      console.log("!response.ok", !response.ok)

      if (!response.ok) {
        setApiError(true);
        setApiErrorMessage(SERVICE_UNAVAILABLE_ERROR_MESSAGE);
        return;
      }
      if (data.length === 0) {
        setApiError(true);
        setApiErrorMessage(DATA_EMPTY_ERROR_MESSAGE);
        return;
      }
      setChartData({
        name: CHART_NAME,
        color: CHART_COLOR,
        items: data
      });
      setApiError(false);
      clearTimeout(timeoutId);

    } catch (error) {
      console.log("error",error.name)
      if (error.name !== "AbortError") {
        setApiError(true);
        setApiErrorMessage(SERVICE_UNAVAILABLE_ERROR_MESSAGE);
      }

    }

  }

  React.useEffect(() => {
    fetchWithTimeout();
  }, [])

  const updateStockData = (value, index) => {
    let stockList = chartData.items
    let foundIndex = stockList.findIndex(data => data.index === index);
    stockList[foundIndex].stocks = value;
    setChartData({
      name: CHART_NAME,
      color: CHART_COLOR,
      items: stockList

    })
  }
  return (
    apiError || chartData.items.length === 0 ?
      (<ErrorMessage message={apiErrorMessage}>

      </ErrorMessage>) :
      <div>

        <MultilineChart
          data={[chartData]}
          dimensions={dimensions}
        />
        <div>{CHART_NAME}</div>

        <div>
          {chartData.items.map((data, index) => {
            return (
              <input type="number" key={data.index} defaultValue={data.stocks} onChange={e => updateStockData(e.target.value, index)}
              ></input>
            )
          })}
        </div>
      </div>
  );
}
