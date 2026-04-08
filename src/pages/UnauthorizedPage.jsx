import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-4">
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Unauthorized</h1>
        <p className="text-slate-600 font-semibold">
          Vous n&apos;avez pas accès à cette section.
        </p>
        <div className="flex gap-3">
          <Button asChild className="bg-slate-900 hover:bg-black text-white">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dash/home">Aller au dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
