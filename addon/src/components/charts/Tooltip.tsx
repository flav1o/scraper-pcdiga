import React from "react";
import { ChartDataItem } from "./SimpleLines";
import { TooltipProps } from "recharts";

export const ChartTooltipContent = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (!active) return null;

  const data = payload?.[0]?.payload as ChartDataItem;
  const formattedDate = new Date(data.createdAt).toLocaleDateString();

  return (
    <div className="p-3 bg-slate-950 border-slate-800 border rounded-lg shadow-lg max-w-xs min-w-[50vw] z-50">
      <div className="mb-2 pb-2 border-b border-slate-800">
        <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">
          Price Details
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-slate-300 text-sm pr-1">Original Price</p>
          <p className="text-slate-100 font-medium">
            €{data.originalPrice?.toFixed(2)}
          </p>
        </div>

        {data?.discountPrice && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-slate-300 text-sm pr-1">Discount Price</p>
              <p className="text-green-500 font-medium">
                €{data.discountPrice?.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-slate-300 text-sm">Savings</p>
              <div className="flex items-center space-x-2">
                <span className="text-green-500 font-medium">
                  €{(data.originalPrice - data?.discountPrice)?.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center">
        <svg
          className="w-4 h-4 text-slate-400 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <p className="text-xs text-slate-400">{formattedDate}</p>
      </div>
    </div>
  );
};
