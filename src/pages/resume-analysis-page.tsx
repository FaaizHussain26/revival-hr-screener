import { AnalysisResults } from "@/components/resume-analyzer/analysis-results";
import { useLocation } from "react-router";

export default function ResumeAnalysisPage() {
  const { state } = useLocation();

  if (!state) {
    return <p className="p-6">No analysis data found.</p>;
  }

  console.log("Analysis Data:", state);

  return (
    <div className="p-6">
      <AnalysisResults data={state.data} />
    </div>
  );
}
