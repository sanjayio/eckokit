"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function WidgetsContent() {
  const organizationSlug = useParams().slug;
  return (
    <div className="mb-4 p-2 flex flex-col space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Widgets Guide</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to use widgets in your workflows.
        </p>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Adding a widget to your website
        </h2>
        <p className="text-muted-foreground my-4">
          <span className="font-bold bg-muted p-1 rounded-md">Step 1</span>{" "}
          Create an agent and copy the agent ID from{" "}
          <Link
            href={`/agents`}
            className="text-primary underline underline-offset-2"
          >
            here
          </Link>
          .
        </p>
        <p className="text-muted-foreground my-4">
          <span className="font-bold bg-muted p-1 rounded-md">Step 2</span> Add
          the following code to your website, replacing{" "}
          <code className="text-sm bg-muted p-1 rounded-md italic">
            your-agent-id
          </code>{" "}
          with the agent ID you copied in the previous step:
        </p>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md overflow-x-scroll">
            <code className="text-sm">
              &lt;eckokit-agent agent-id=&quot;your-agent-id&quot; /&gt;
              <br />
              &lt;script
              src=&quot;https://eckokit.com/dist/eckokit-widget.min.js&quot;
              async type=&quot;text/javascript&quot; &gt;&lt;/script&gt;
            </code>
          </pre>
          <Button
            type="button"
            className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(
                `<eckokit-agent agent-id="your-agent-id" />\n<script src="https://eckokit.com/dist/eckokit-widget.min.js" async type="text/javascript"></script>`
              );
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
      </div>
      <div className="mb-8"></div>
    </div>
  );
}
