import { Button } from "@/components/ui/button";
import { ConsultationButton } from "./consultation-button";

interface ActionButtonsProps {
  showEstimateButton?: boolean;
  showConsultationButton?: boolean;
  showPDFButton?: boolean;
  onEstimateRequest?: () => void;
  calendlyUrl: string;
}

export function ActionButtons({
  showEstimateButton,
  showConsultationButton,
  showPDFButton,
  onEstimateRequest,
  calendlyUrl,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-3" id="action-buttons">
      {showEstimateButton && (
        <Button
          variant="outline"
          onClick={onEstimateRequest}
          className="flex-1 bg-[#F6A652] text-black rounded-[114px] h-[52px]"
        >
          Get Tailored Estimate
        </Button>
      )}

      {showConsultationButton && (
        <ConsultationButton calendlyUrl={calendlyUrl} />
      )}

      {showPDFButton && (
        <a
          href="/dummy.pdf"
          download="dummy.pdf"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="outline"
            className="flex-1 bg-[#F6A652] text-black rounded-[114px] h-[52px]"
          >
            Download PDF
          </Button>
        </a>
      )}
    </div>
  );
}
