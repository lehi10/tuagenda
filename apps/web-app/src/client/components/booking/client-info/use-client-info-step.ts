"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/client/i18n";
import { useAuth } from "@/client/contexts";
import { useTrpc } from "@/client/lib/trpc";

export interface ClientInfoData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  createAccount: boolean;
  userId?: string;
}

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  createAccount: boolean;
}

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  createAccount: false,
};

export function useClientInfoStep(onContinue: (data: ClientInfoData) => void) {
  const { t } = useTranslation();
  const {
    user,
    loading: authLoading,
    signUp,
    signIn,
    signInWithGoogle,
    refreshUser,
  } = useAuth();
  const createGuestMutation = useTrpc.user.createGuest.useMutation();
  const createUserMutation = useTrpc.user.create.useMutation();

  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTabState] = useState<"guest" | "login">("guest");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
        createAccount: false,
      });
    }
  }, [user]);

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setActiveTab = (tab: "guest" | "login") => {
    setActiveTabState(tab);
    setError(null);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (user) {
        onContinue({
          firstName: user.firstName,
          lastName: user.lastName || "",
          phone: user.phone || "",
          email: user.email,
          createAccount: false,
          userId: user.id,
        });
        return;
      }

      if (activeTab === "login") {
        if (!formData.email || !formData.password) {
          setError(
            t.auth.errors.invalidCredentials || "Ingresa email y contraseña"
          );
          return;
        }
        await signIn({ email: formData.email, password: formData.password });
        return;
      }

      if (formData.createAccount) {
        if (formData.password !== formData.confirmPassword) {
          setError(t.auth.errors.passwordsDoNotMatch);
          return;
        }
        if (formData.password.length < 6) {
          setError(t.auth.errors.passwordTooShort);
          return;
        }
        const firebaseUser = await signUp({
          email: formData.email,
          password: formData.password,
          displayName: `${formData.firstName} ${formData.lastName}`,
        });
        await createUserMutation.mutateAsync({
          id: firebaseUser.uid,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || null,
        });
        await refreshUser();
        return;
      }

      const result = await createGuestMutation.mutateAsync({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
      });

      onContinue({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        createAccount: false,
        userId: result.user.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t.auth.errors.signUpFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider !== "Google") {
      setError(`${provider} login not implemented yet`);
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t.auth.errors.signInFailed || "Error al iniciar con Google"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    authLoading,
    formData,
    updateField,
    isSubmitting,
    error,
    activeTab,
    setActiveTab,
    submitForm,
    handleFormSubmit,
    handleSocialLogin,
  };
}
