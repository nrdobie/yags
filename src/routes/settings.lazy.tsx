import {
  faDownload,
  faTriangleExclamation,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createLazyFileRoute, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { useDownloadData } from "~/hooks/use-download-data";
import { db } from "~/libs/db";

export const Route = createLazyFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const download = useDownloadData();

  const router = useRouter();
  const reset = useCallback(async () => {
    await db.reset();
    await router.invalidate();
  }, [router]);

  return (
    <div className="max-w-prose mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Settings</h1>

      <Alert>
        <FontAwesomeIcon icon={faUpload} />
        <AlertTitle>Export Data</AlertTitle>
        <AlertDescription>
          <p>
            Download all existing data in JSON format and transfer it to another
            device.
          </p>
          <Button $variant="secondary" className="mt-4" onClick={download}>
            Download
          </Button>
        </AlertDescription>
      </Alert>

      <Alert>
        <FontAwesomeIcon icon={faDownload} />
        <AlertTitle>Import Data</AlertTitle>
        <AlertDescription>
          <p>Import data from another device.</p>
          <Button $variant="secondary" className="mt-4">
            Import
          </Button>
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <AlertTitle>Reset Application</AlertTitle>
        <AlertDescription>
          <p>
            Removes all existing data and resets application back to initial
            state. This action cannot be undone.
          </p>
          <Button $variant="destructive" className="mt-4" onClick={reset}>
            Reset Application
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
