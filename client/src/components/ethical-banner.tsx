import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function EthicalBanner() {
  return (
    <div className="bg-warning text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-2">
          <TriangleAlert className="h-5 w-5" />
          <span className="font-medium">AVERTISSEMENT:</span>
          <span className="text-sm">
            Cette plateforme est destinée à des fins éducatives uniquement. L'utilisation malveillante est interdite.
          </span>
        </div>
      </div>
    </div>
  );
}
