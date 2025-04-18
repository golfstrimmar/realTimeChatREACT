import React from "react";
import "./Loading.scss";

const Loading = () => {
  return (
    <div id="loader-box" class="closeout loading">
      <div id="loader-complete-circle"></div>
      <div id="loader-wrapper">
        <svg class="loader">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#8ad3ff"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
        <svg class="loader loader-2">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#ce9178"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
        <svg class="loader loader-3">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#b869a0"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
        <svg class="loader loader-4">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#5d8a4e"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
        <svg class="loader loader-5">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="black"
            stroke-width="6"
            stroke-linecap="round"
          ></circle>
        </svg>
        <svg class="loader loader-6">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#4387cf"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
        <svg class="loader loader-7">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="b86cb4"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
        <svg class="loader loader-8">
          <circle
            cx="75"
            cy="75"
            r="60"
            fill="transparent"
            stroke="#d4d797"
            stroke-width="6"
            stroke-linecap="round"
            stroke-dasharray="385"
            stroke-dashoffset="385"
          ></circle>
        </svg>
      </div>
    </div>
  );
};

export default Loading;
