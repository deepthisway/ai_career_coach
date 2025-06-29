"use client";
import { BarLoader } from "react-spinners";
import React, { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-5">
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}

// suspense is used to handle loading states for components that fetch data from an API
// since the dashboard page is a server component, it can use suspense to handle loading states for child components
// this allows the dashboard to show a loading spinner while the child components are being fetched
