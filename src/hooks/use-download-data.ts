import { useCallback } from "react";
import { format } from "date-fns/format"
import { db } from "~/libs/db";

function useDownloadData() {
  const downloadOnClick = useCallback(async () => {
    const jsonData = JSON.stringify(await db.exportData());

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:application/json;charset=utf-8,${encodeURIComponent(jsonData)}`
    );

    element.setAttribute("download", `yags-${format(new Date(), "yyyy-MM-dd")}.json`);

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  return downloadOnClick;
}

export {
  useDownloadData
}
