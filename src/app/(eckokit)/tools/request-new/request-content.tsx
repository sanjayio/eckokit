"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import React, { useEffect } from "react";

export default function RequestContent() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "eckokit-tool-request" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <div className="mb-4 p-2 flex flex-col space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Request New Tool</h1>
        <p className="text-muted-foreground mt-2">
          Use the form below to request a new tool to be added to EckoKit.
        </p>
      </div>
      <div className="mb-8">
        <Cal
          namespace="eckokit-tool-request"
          calLink="iamsanjay/eckokit-tool-request"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: "month_view" }}
        />
        ;
      </div>
    </div>
  );
}
