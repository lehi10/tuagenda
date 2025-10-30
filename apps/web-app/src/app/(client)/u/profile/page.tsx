"use client";

import { useAuth } from "@/contexts";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ClientProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Perfil del Cliente
            </h1>
            <p className="text-muted-foreground">
              Bienvenido a tu área de cliente
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        {user && (
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Información Personal</h2>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nombre
                    </p>
                    <p className="text-base">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-base">{user.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tipo de Usuario
                  </p>
                  <p className="text-base capitalize">{user.type}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
