"use client";

import { useEffect } from "react";

import Cal, { getCalApi } from "@calcom/embed-react";

export default function CalIFrame() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "eckokit-discovery-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Cal
      namespace="eckokit-discovery-call"
      calLink="iamsanjay/eckokit-discovery-call"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
