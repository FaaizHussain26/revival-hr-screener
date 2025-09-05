import type React from "react";

import { InlineWidget } from "react-calendly";

interface CalendlyInlineProps {
  url: string;
  height?: number;
}

const CalendlyInline: React.FC<CalendlyInlineProps> = ({
  url,
  height = 700,
}) => {
  return (
    <div className="calendly-inline-widget">
      <InlineWidget
        url={url}
        styles={{
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default CalendlyInline;
