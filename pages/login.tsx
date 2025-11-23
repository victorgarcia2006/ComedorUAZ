import React from "react";
import { Card, TextInput, PasswordInput, Button } from "@mantine/core";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

interface FormData {
  email: string;
  contrasena: string;
}

const schema = yup.object({
  email: yup
    .string()
    .email("Este campo tiene que ser un email")
    .required("Este campo no tiene que estar vacío"),
  contrasena: yup
    .string()
    .min(6, "La contraseña debe de contener al menos 6 caracteres")
    .required("La contraseña es requerida"),
});

function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      contrasena: ''
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      console.log(data.email);
      console.log(data.contrasena);
      const response = await signInWithEmailAndPassword(auth, data.email, data.contrasena);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-2xl font-bold">Login</h1>
      <Card withBorder={false} shadow="sm" radius="md" bg="#FFF8E5" w={340}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="text-[#252D4D] gap-4 flex flex-col"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
                <TextInput
                  type="text"
                  placeholder="Email"
                  label="Email"
                  error={errors.email?.message}
                  {...field}
                />
            )}
          />
          <Controller
            name="contrasena"
            control={control}
            render={({ field }) => (
                <PasswordInput
                  type="password"
                  placeholder="Contraseña"
                  label="Contraseña"
                  error={errors.contrasena?.message}
                  {...field}
                />
            )}
          />
          <Button type="submit" color="#20388C">
            Ingresar
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default LoginPage;
