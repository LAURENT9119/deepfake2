import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SiWhatsapp, SiFacebook, SiInstagram, SiZoom } from "react-icons/si";
import { Info } from "lucide-react";

const platforms = [
  { id: "whatsapp", name: "WhatsApp", icon: SiWhatsapp, color: "text-green-500" },
  { id: "facebook", name: "Facebook", icon: SiFacebook, color: "text-blue-600" },
  { id: "instagram", name: "Instagram", icon: SiInstagram, color: "text-pink-500" },
  { id: "zoom", name: "Zoom", icon: SiZoom, color: "text-blue-500" },
];

export function SocialIntegrations() {
  const { toast } = useToast();
  
  const socialMutation = useMutation({
    mutationFn: async ({ platform }: { platform: string }) => {
      const response = await apiRequest("POST", `/api/social/${platform}`, {
        imageId: 1,
        message: "Test d'intégration depuis la plateforme éducative",
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Intégration simulée",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleIntegration = (platform: string) => {
    socialMutation.mutate({ platform });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Intégrations (Maquette)
        </h2>
        <div className="space-y-3">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`text-xl ${platform.color}`} />
                  <span className="font-medium text-slate-900">{platform.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleIntegration(platform.id)}
                  disabled={socialMutation.isPending}
                  className="text-slate-600 hover:bg-slate-200"
                >
                  {socialMutation.isPending ? "..." : "Simuler"}
                </Button>
              </div>
            );
          })}
        </div>
        
        <Alert className="mt-4 bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-xs text-amber-800">
            Les intégrations sont simulées à des fins de démonstration uniquement.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
