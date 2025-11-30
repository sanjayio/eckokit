import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "eckokit-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
        },
        HTMLElement
      >;
    }
  }
}
