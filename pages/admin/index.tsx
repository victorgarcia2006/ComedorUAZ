import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, Chip } from "@heroui/react";
import {
  Button,
  Card,
  Accordion,
  FileInput,
  Divider,
  FileButton,
  ActionIcon,
} from "@mantine/core";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { Modal, TextInput, NumberInput, Select, Checkbox } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconPhoto, IconPlus } from "@tabler/icons-react";

interface FormData {
  nombre: string;
  descripcion: string;
  platoFuerte: string;
  complemento: string[];
  bebida: string;
  postre: string;
  tipo: string;
  precio: number;
  /* imagen: string; */
  demanda: string;
  nutricional: {
    calorias: number;
    proteinas: number;
    lipidos: number;
    carbohidratos: number;
  };
  disponible: boolean;
}

const schema = yup.object({
  nombre: yup
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es obligatorio"),

  descripcion: yup
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .required("La descripción es obligatoria"),

  platoFuerte: yup
    .string()
    .min(2, "El plato fuerte debe tener al menos 2 caracteres")
    .required("El plato fuerte es obligatorio"),

  complemento1: yup.string().required("El complemento no puede estar vacío"),

  complemento2: yup.string().required("El complemento no puede estar vacío"),

  bebida: yup
    .string()
    .min(2, "La bebida debe tener al menos 2 caracteres")
    .required("La bebida es obligatoria"),

  postre: yup
    .string()
    .min(2, "El postre debe tener al menos 2 caracteres")
    .required("El postre es obligatorio"),

  tipo: yup
    .string()
    .oneOf(["Desayuno", "Comida", "Cena"], "Tipo no válido")
    .required("El tipo es obligatorio"),

  precio: yup
    .number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor a 0")
    .required("El precio es obligatorio"),

  imagen: yup
    .string()
    .url("Debe ser una URL válida")
    .required("La imagen es obligatoria"),

  demanda: yup
    .string()
    .oneOf(["alta", "media", "baja"], "Demanda no válida")
    .required("La demanda es obligatoria"),

  nutricional: yup.object({
    calorias: yup
      .number()
      .typeError("Debe ser un número")
      .positive("Debe ser mayor a 0")
      .required("Las calorías son obligatorias"),

    proteinas: yup
      .number()
      .typeError("Debe ser un número")
      .min(0, "No puede ser negativo")
      .required("Las proteínas son obligatorias"),

    lipidos: yup
      .number()
      .typeError("Debe ser un número")
      .min(0, "No puede ser negativo")
      .required("Los lípidos son obligatorios"),

    carbohidratos: yup
      .number()
      .typeError("Debe ser un número")
      .min(0, "No puede ser negativo")
      .required("Los carbohidratos son obligatorios"),
  }),

  disponible: yup.boolean().required("Debes indicar si está disponible"),
});

function HomeAdmin() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState<File | null>(null);
  const comidas = [
    {
      nombre: "Chilaquiles",
      descripcion:
        "Clásicos chilaquiles rojos con queso y crema, acompañados de arroz y una ensalada fresca.",
      platoFuerte: "Chilaquiles Rojos",
      complemento: ["Arroz", "Ensalada"],
      bebida: "Agua",
      postre: "Pastel de Manzana",
      tipo: "Desayuno",
      precio: 10,
      imagen:
        "https://cdn.pixabay.com/photo/2020/08/24/03/35/chilaquiles-5512587_1280.jpg",
      demanda: "alta",
      nutricional: {
        calorias: 520,
        proteinas: 18,
        lipidos: 22,
        carbohidratos: 62,
      },
      disponible: true,
    },
    {
      nombre: "Pechuguita Fit",
      descripcion:
        "Pechuga asada con puré de papa y ensalada, acompañada de agua y yogur.",
      platoFuerte: "Pechuga Asada",
      complemento: ["Puré de Papa", "Ensalada"],
      bebida: "Agua",
      postre: "Yogur",
      tipo: "Comida",
      precio: 18,
      imagen:
        "https://cdn.pixabay.com/photo/2017/04/09/12/49/chicken-breast-filet-2215709_1280.jpg",
      demanda: "media",
      nutricional: {
        calorias: 430,
        proteinas: 38,
        lipidos: 9,
        carbohidratos: 52,
      },
      disponible: false,
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      platoFuerte: "",
      complemento1: "", // Start with one empty complemento field
      complemento2: "", // Start with one empty complemento field
      bebida: "",
      postre: "",
      tipo: "Desayuno",
      precio: 0,
      imagen: "",
      demanda: "alta",
      nutricional: {
        calorias: 0,
        proteinas: 0,
        lipidos: 0,
        carbohidratos: 0,
      },
      disponible: false,
    },
  });

  const comidaPorTipo = comidas.reduce((acc, comida) => {
    if (!acc[comida.tipo]) {
      acc[comida.tipo] = [];
    }
    acc[comida.tipo].push(comida);
    return acc;
  }, {} as Record<string, any[]>);

  useEffect(() => {
    console.log(comidaPorTipo);
  }, [comidaPorTipo]);

  return (
    <main className="bg-white h-full">
      <Head>
        <title>Comedor UAZ</title>
      </Head>
      <Navbar
        classNames={{
          base: ["bg-[#FFF8E5]"],
        }}
      >
        <NavbarContent>
          <NavbarBrand>
            <Image
              src="/saus.jpeg"
              alt="Logo"
              width={52}
              height={52}
              className="rounded-full"
            />
            <div className="flex flex-col justify-center items-start ml-2">
              <p className="text-xl font-bold text-[#252D4D]">Comedor UAZ</p>
              <p className="text-[#252D4D]">UAZ Siglo XXI</p>
            </div>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
      <div className="flex items-center justify-start flex-col h-full gap-4">
        <h1 className="font-bold mt-4 text-2xl text-[#252D4D]">Miercoles</h1>
        <div className="flex justify-end w-full mr-4">
          <Button color="#20388C" variant="outline" onClick={open}>
            Agregar Platillo
          </Button>
        </div>
        {Object.entries(comidaPorTipo).map(([tipo, comidas]) => (
          <Card
            withBorder={false}
            shadow="sm"
            radius="md"
            bg="#20388C"
            key={tipo}
            w="340px"
            h="auto"
            className=""
          >
            <h2 className="font-bold text-2xl text-white mb-2">{tipo}</h2>
            {comidas.map((comida) => (
              <Card
                withBorder={false}
                radius="md"
                bg="white"
                key={comida.nombre}
                className="min-h-[360px] h-auto grow"
              >
                <div className="flex flex-col items-center justify-between w-full p-2 gap-2">
                  <Card.Section>
                    <img
                      src={comida.imagen}
                      alt={comida.nombre}
                      className="rounded-md object-cover h-48 w-64"
                    />
                  </Card.Section>
                  <Card.Section>
                    <div className="flex flex-col items-start w-full">
                      <div className="flex justify-between w-full items-center">
                        <p className="font-bold text-xl text-[#252D4D]">
                          {comida.nombre}
                        </p>
                        <Chip
                          radius="md"
                          size="md"
                          className="mt-2"
                          classNames={{
                            base: [
                              comida.disponible
                                ? "bg-[#588C20]"
                                : "bg-[#8C203B]",
                              "text-white",
                              "font-bold",
                            ],
                          }}
                        >
                          {comida.disponible ? "Disponible" : "No disponible"}
                        </Chip>
                      </div>
                      <p className="text-gray-700">{comida.descripcion}</p>
                    </div>
                  </Card.Section>
                  <Card.Section>
                    <div className="w-full flex items-center justify-between">
                      <Accordion defaultValue="Información nutrimental">
                        <Accordion.Item value="Información nutrimental">
                          <Accordion.Control>
                            <p className="font-semibold text-gray-700">
                              Información nutrimental
                            </p>
                          </Accordion.Control>
                          <Accordion.Panel>
                            <p>Calorías: {comida.nutricional.calorias}</p>
                            <p>Proteínas: {comida.nutricional.proteinas}</p>
                            <p>Lípidos: {comida.nutricional.lipidos}</p>
                            <p>
                              Carbohidratos: {comida.nutricional.carbohidratos}
                            </p>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </Card.Section>
                </div>
              </Card>
            ))}
          </Card>
        ))}
      </div>
      <Modal opened={opened} onClose={close} title="Agregar platillo" centered>
        <form /* onSubmit={} */ className="flex flex-col gap-2">
          {/* {file ? (
            <div className="flex items-center justify-center">
              <img
                src={URL.createObjectURL(file)}
                alt="Foto de platillo"
                className="rounded-2xl"
              />
            </div>
          ) : (
            <div className="flex bg-gray-300 rounded-2xl h-32 w-full items-center justify-center">
              <IconPhoto size={64} color="white" />
            </div>
          )}
          <FileButton accept="image/*" onChange={(e) => setFile(e)}>
            {(props) => (
              <Button {...props} color="#20388C" variant="light">
                Seleccionar archivo
              </Button>
            )}
          </FileButton> */}
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Nombre"
                label="Nombre"
                error={errors.nombre?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Descripción"
                label="Descripción"
                error={errors.descripcion?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="platoFuerte"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Plato fuerte"
                label="Plato fuerte"
                error={errors.platoFuerte?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="complemento1"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Complemento 1"
                label="Complemento 1"
                error={errors.complemento1?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="complemento2"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Complemento 2"
                label="Complemento 2"
                error={errors.complemento2?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="bebida"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Bebida"
                label="Bebida"
                error={errors.bebida?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="postre"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Postre"
                label="Postre"
                error={errors.postre?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Tipo"
                label="Tipo"
                error={errors.tipo?.message}
                {...field}
                data={["Desayuno", "Comida"]}
              />
            )}
          />
          <Controller
            name="precio"
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="Precio"
                label="Precio"
                error={errors.precio?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="demanda"
            control={control}
            render={({ field }) => (
              <Select
                placeholder="Demanda"
                label="Demanda"
                error={errors.demanda?.message}
                {...field}
                data={["Baja", "Media", "Alta"]}
              />
            )}
          />
          <Controller
            name="disponible"
            control={control}
            render={({ field }) => (
              <Checkbox
                label="Disponible"
                {...field}
                value={String(field.value)}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                }}
              />
            )}
          />
          <h3 className="mt-2">Información nutricional</h3>
          <Divider />
          <Controller
            name={"nutricional.calorias"}
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="Calorias"
                label="Calorias"
                error={errors.nutricional?.calorias?.message}
                {...field}
              />
            )}
          />
          <Controller
            name={"nutricional.proteinas"}
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="Proteinas"
                label="Proteinas"
                error={errors.nutricional?.proteinas?.message}
                {...field}
              />
            )}
          />
          <Controller
            name={"nutricional.lipidos"}
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="Lipidos"
                label="Lipidos"
                error={errors.nutricional?.lipidos?.message}
                {...field}
              />
            )}
          />
          <Controller
            name={"nutricional.carbohidratos"}
            control={control}
            render={({ field }) => (
              <NumberInput
                placeholder="Carbohidratos"
                label="Carbohidratos"
                error={errors.nutricional?.carbohidratos?.message}
                {...field}
              />
            )}
          />
          <Button color="#20388C" type="submit">
            Guardar
          </Button>
        </form>
      </Modal>
    </main>
  );
}

export default HomeAdmin;
