import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import VideoCall from "@/pages/video-call";
import Workspace from "@/pages/workspace";
import Tutorials from "@/pages/tutorials";
import Ethics from "@/pages/ethics";
import Legal from "@/pages/legal";
import Support from "@/pages/support";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/video-call" component={VideoCall} />
      <Route path="/workspace" component={Workspace} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/ethics" component={Ethics} />
      <Route path="/legal" component={Legal} />
      <Route path="/support" component={Support} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
