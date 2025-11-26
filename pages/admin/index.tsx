import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Chip,
  addToast,
} from "@heroui/react";
import { Button, Card, Accordion, Divider, ActionIcon, FileButton } from "@mantine/core";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { Modal, TextInput, NumberInput, Select, Checkbox } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useDisclosure } from "@mantine/hooks";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IconEdit, IconPhoto, IconPlus } from "@tabler/icons-react";
import { useFirebaseForm } from "@/lib/useForm";
import { db, storage } from "@/lib/firebaseClient";
import { ref, onValue } from "firebase/database";
import { uploadBytes, getDownloadURL, ref as refS } from "firebase/storage";

export interface FormData {
  nombre: string;
  descripcion: string;
  imagen?: string;
  platoFuerte: string;
  complemento1: string;
  complemento2: string;
  bebida: string;
  postre: string;
  tipo: "Desayuno" | "Comida" | "Cena";
  precio: number;
  demanda: "Alta" | "Media" | "Baja";
  nutricional: {
    calorias: number;
    proteinas: number;
    lipidos: number;
    carbohidratos: number;
  };
  disponible: boolean;
}

export interface MenuData {
  Lunes: {
    Desayuno: FormData;
    Comida: FormData;
  };
  Martes: {
    Desayuno: FormData;
    Comida: FormData;
  };
  Miercoles: {
    Desayuno: FormData;
    Comida: FormData;
  };
  Jueves: {
    Desayuno: FormData;
    Comida: FormData;
  };
  Viernes: {
    Desayuno: FormData;
    Comida: FormData;
  };
  Sabado: {
    Desayuno: FormData;
    Comida: FormData;
  };
  Domingo: {
    Desayuno: FormData;
    Comida: FormData;
  };
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
    .required("El precio es obligatorio"),

  demanda: yup
    .string()
    .oneOf(["Alta", "Media", "Baja"], "Demanda no válida")
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
  const [opened2, { open: open2, close: close2 }] = useDisclosure(false);
  const [file, setFile] = useState<File | null>(null);
  const [desayuno, setDesayuno] = useState<FormData>();
  const [comida, setComida] = useState<FormData>();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [miPlatillo, setMiPlatillo] = useState<FormData>();
  const date = new Date();
  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const [dia, setDia] = useState(dias[date.getDay()]);
  const [tipo, setTipo] = useState("Desayuno");
  const [endPoint, setEndPoint] = useState(`platillos/${dia}/Desayuno`);
  const [endPointEdit, setEndPointEdit] = useState(`platillos/${dia}/Desayuno`);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
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
      precio: 20,
      demanda: "Alta",
      nutricional: {
        calorias: 0,
        proteinas: 0,
        lipidos: 0,
        carbohidratos: 0,
      },
      disponible: false,
    },
  });

  const {
    control: control2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm<FormData>({
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
      precio: 20,
      demanda: "Alta",
      nutricional: {
        calorias: 0,
        proteinas: 0,
        lipidos: 0,
        carbohidratos: 0,
      },
      disponible: false,
    },
  });

  const { submitForm, loading } = useFirebaseForm(endPoint);

  React.useEffect(() => {
    setEndPoint(`platillos/${dia}/${tipo || "Desayuno"}`);
  }, [tipo, dia]);

  const openModalEdit = async (dia: string, tipo: string) => {
    try {
      setEndPointEdit(`platillos/${dia}/${tipo}`);
      setTipo(tipo);
      const platilloRef = ref(db, `platillos/${dia}/${tipo}`);
      onValue(
        platilloRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Actualizar los valores del formulario dentro del callback de onValue
            setValue2("nombre", data.nombre || "");
            setValue2("bebida", data.bebida || "");
            setValue2("postre", data.postre || "");
            setValue2("platoFuerte", data.platoFuerte || "");
            setValue2("complemento1", data.complemento1 || "");
            setValue2("complemento2", data.complemento2 || "");
            setValue2("descripcion", data.descripcion || "");
            setValue2("tipo", data.tipo || "Desayuno");
            setValue2("precio", data.precio || 20);
            setValue2("demanda", data.demanda || "Alta");
            setValue2("nutricional.calorias", data.nutricional?.calorias || 0);
            setValue2(
              "nutricional.proteinas",
              data.nutricional?.proteinas || 0
            );
            setValue2("nutricional.lipidos", data.nutricional?.lipidos || 0);
            setValue2(
              "nutricional.carbohidratos",
              data.nutricional?.carbohidratos || 0
            );
            setValue2("disponible", data.disponible || false);

            // Abrir el modal después de establecer los valores
            open2();
          }
        },
        { onlyOnce: true }
      ); // Usar onlyOnce: true para que el listener se elimine después de la primera actualización
    } catch (e) {
      console.error("Error al cargar el platillo:", e);
      addToast({
        title: "Error",
        description: "No se pudo cargar la información del platillo",
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Update price based on meal type
      const newPrice = data.tipo === "Desayuno" ? 20 : 25;
      data.precio = newPrice;

      // Update endpoint with current dia and selected tipo
      const newEndpoint = `platillos/${dia}/${data.tipo}`;
      setEndPoint(newEndpoint);

      const res = await submitForm(data);
      if (res.ok) {
        addToast({
          title: "Exito",
          description: "Platillo agregado exitosamente",
        });
        handleClose();
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo agregar el platillo",
      });
    }
  };

  const onSubmit2 = async (data: FormData) => {
    try {
      if (file) {
        const storageRef = refS(storage, `platillos/${dia}/${data.tipo}/${file.name}`);
        // Subimos el archivo
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        data.imagen = downloadURL;
      }
      // Update price based on meal type
      const newPrice = data.tipo === "Desayuno" ? 20 : 25;
      data.precio = newPrice;

      // Update endpoint with current dia and selected tipo
      const newEndpoint = `platillos/${dia}/${data.tipo}`;
      setEndPoint(newEndpoint);

      const res = await submitForm(data);
      if (res.ok) {
        addToast({
          title: "Exito",
          description: "Platillo editado exitosamente",
        });
        handleClose2();
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo agregar el platillo",
      });
    }
  };

  const handleClose = () => {
    reset();
    close();
  };

  const handleClose2 = () => {
    setFile(null);
    reset2();
    close2();
  };

  useEffect(() => {
    const itemsDesayuno = ref(db, `platillos/${dias[date.getDay()]}/Desayuno`);
    onValue(itemsDesayuno, (snapshot) => {
      const data = snapshot.val();
      setDesayuno(data);
    });
    console.log("Desayuno", desayuno);

    const itemsComida = ref(db, `platillos/${dias[date.getDay()]}/Comida`);
    onValue(itemsComida, (snapshot) => {
      const data = snapshot.val();
      setComida(data);
    });

    const itemsMenu = ref(db, `platillos/`);
    onValue(itemsMenu, (snapshot) => {
      const data = snapshot.val();
      setMenu(data);
    });

    console.log("Comida", comida);
    console.log("Tipo", tipo);
    console.log("EndPoint", endPoint);
    console.log("Errors", errors);
  }, [errors, tipo, endPoint]);

  /* useEffect(() => {
    openModalEdit(dia, tipo);
  }, [open2]); */

  const slides = Object.entries(menu || {}).map(
    ([dia, { Desayuno, Comida }]) => {
      return (
        <Carousel.Slide key={dia}>
          <Card
            withBorder={false}
            shadow="sm"
            radius="md"
            bg="#20388C"
            h="auto"
            className="flex items-center justify-center w-full"
          >
            <p className="font-bold text-xl text-white mb-2">{dia}</p>
            <Card
              withBorder={false}
              radius="md"
              bg="white"
              className="min-h-[360px] h-auto grow w-full"
            >
              <Card.Section>
                <div className="flex bg-gray-300 rounded-lg h-32 w-full items-center justify-center">
                  {Desayuno?.imagen ? (
                    <img
                      src={Desayuno?.imagen}
                      alt="Foto de platillo"
                      width={280}
                      height={32}
                      className="rounded-2xl"
                    />
                  ) : (
                    <IconPhoto size={64} color="white" />
                  )}
                </div>
              </Card.Section>
              <Card.Section className="flex flex-col p-2">
                <p className="font-bold text-xl ">Desayuno</p>
                <p className="text-sm text-gray-500">
                  {Desayuno ? Desayuno.nombre : "No hay desayuno disponible"}
                </p>
              </Card.Section>
              <Card.Section>
                <div className="flex bg-gray-300 rounded-lg h-32 w-full items-center justify-center">
                  {Comida?.imagen ? (
                    <img
                      src={Comida?.imagen}
                      alt="Foto de platillo"
                      width={280}
                      height={32}
                      className="rounded-2xl"
                    />
                  ) : (
                    <IconPhoto size={64} color="white" />
                  )}
                </div>
              </Card.Section>
              <Card.Section className="flex flex-col p-2">
                <p className="font-bold text-xl ">Comida</p>
                <p className="text-sm text-gray-500">
                  {Comida ? Comida.nombre : "No hay comida disponible"}
                </p>
              </Card.Section>
            </Card>
          </Card>
        </Carousel.Slide>
      );
    }
  );

  return (
    <main className="bg-white h-full min-h-screen">
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
        <h1 className="font-bold mt-4 text-2xl text-[#252D4D]">
          {dias[date.getDay()]}
        </h1>
        <div className="flex justify-end w-full mr-4">
          <Button color="#20388C" variant="outline" onClick={open}>
            Agregar Platillo
          </Button>
        </div>
        <Card
          withBorder={false}
          shadow="sm"
          radius="md"
          bg="#20388C"
          w="340px"
          h="auto"
          className=""
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl text-white mb-2">Desayuno</h2>
            <ActionIcon
              color="#208C30"
              onClick={() => {
                openModalEdit(dia, "Desayuno");
              }}
            >
              <IconEdit />
            </ActionIcon>
          </div>
          {desayuno !== null ? (
            <Card
              withBorder={false}
              radius="md"
              bg="white"
              className="min-h-[360px] h-auto grow"
            >
              <div className="flex flex-col items-center justify-between w-full p-2 gap-2">
                <Card.Section>
                  {desayuno?.imagen ? (
                    <img
                      src={desayuno?.imagen}
                      alt="Foto de platillo"
                      width={280}
                      height={32}
                      className="rounded-2xl"
                    />
                  ) : (
                    <div className="flex bg-gray-300 rounded-2xl h-32 w-[280px] items-center justify-center">
                      <IconPhoto size={64} color="white" />
                    </div>
                  )}
                </Card.Section>
                <Card.Section>
                  <div className="flex flex-col items-start w-full">
                    <div className="flex justify-between w-full items-center">
                      <p className="font-bold text-xl text-[#252D4D]">
                        {desayuno?.nombre}
                      </p>
                      <Chip
                        radius="md"
                        size="md"
                        className="mt-2"
                        classNames={{
                          base: [
                            desayuno?.disponible
                              ? "bg-[#588C20]"
                              : "bg-[#8C203B]",
                            "text-white",
                            "font-bold",
                          ],
                        }}
                      >
                        {desayuno?.disponible ? "Disponible" : "No disponible"}
                      </Chip>
                    </div>
                    <p className="text-gray-700">{desayuno?.descripcion}</p>
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
                          <p>Calorías: {desayuno?.nutricional.calorias}</p>
                          <p>Proteínas: {desayuno?.nutricional.proteinas}</p>
                          <p>Lípidos: {desayuno?.nutricional.lipidos}</p>
                          <p>
                            Carbohidratos: {desayuno?.nutricional.carbohidratos}
                          </p>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Card.Section>
              </div>
            </Card>
          ) : (
            <p className="text-white">No hay desayuno</p>
          )}
        </Card>

        <Card
          withBorder={false}
          shadow="sm"
          radius="md"
          bg="#20388C"
          w="340px"
          h="auto"
          className=""
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-2xl text-white mb-2">Comida</h2>
            <ActionIcon
              color="#208C30"
              onClick={() => {
                openModalEdit(dia, "Comida");
              }}
            >
              <IconEdit />
            </ActionIcon>
          </div>
          {comida !== null ? (
            <Card
              withBorder={false}
              radius="md"
              bg="white"
              className="min-h-[360px] h-auto grow"
            >
              <div className="flex flex-col items-center justify-between w-full p-2 gap-2">
                <Card.Section>
                  {comida?.imagen ? (
                    <img
                      src={comida?.imagen}
                      alt="Foto de platillo"
                      width={280}
                      height={32}
                      className="rounded-2xl"
                    />
                  ) : (
                    <div className="flex bg-gray-300 rounded-2xl h-32 w-[280px] items-center justify-center">
                      <IconPhoto size={64} color="white" />
                    </div>
                  )}
                </Card.Section>
                <Card.Section>
                  <div className="flex flex-col items-start w-full">
                    <div className="flex justify-between w-full items-center">
                      <p className="font-bold text-xl text-[#252D4D]">
                        {comida?.nombre}
                      </p>
                      <Chip
                        radius="md"
                        size="md"
                        className="mt-2"
                        classNames={{
                          base: [
                            comida?.disponible
                              ? "bg-[#588C20]"
                              : "bg-[#8C203B]",
                            "text-white",
                            "font-bold",
                          ],
                        }}
                      >
                        {comida?.disponible ? "Disponible" : "No disponible"}
                      </Chip>
                    </div>
                    <p className="text-gray-700">{comida?.descripcion}</p>
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
                          <p>Calorías: {comida?.nutricional.calorias}</p>
                          <p>Proteínas: {comida?.nutricional.proteinas}</p>
                          <p>Lípidos: {comida?.nutricional.lipidos}</p>
                          <p>
                            Carbohidratos: {comida?.nutricional.carbohidratos}
                          </p>
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Card.Section>
              </div>
            </Card>
          ) : (
            <p className="text-white">No hay comida</p>
          )}
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="font-bold my-4  text-xl text-[#252D4D]">Menú semanal</h2>
        <Carousel
          slideSize={{ base: "70%", md: "50%", lg: "33%" }}
          slideGap="md"
          w={"100%"}
          height={"auto"}
          emblaOptions={{
            loop: true,
            align: "center",
            slidesToScroll: 1,
          }}
        >
          {slides}
        </Carousel>
      </div>
      <Modal opened={opened} onClose={close} title="Agregar platillo" centered>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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
                onChange={(value) => setTipo(value as string)}
              />
            )}
          />
          <Select
            placeholder="Día"
            label="Día"
            data={dias}
            onChange={(value) => setDia(value as string)}
          />
          {/* <Controller
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
          /> */}
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
          <Button color="#20388C" type="submit" loading={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </Modal>
      <Modal opened={opened2} onClose={handleClose2} title="Editar Platillo">
        <form
          onSubmit={handleSubmit2(onSubmit2)}
          className="flex flex-col gap-2"
        >
          {file ? (
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
          </FileButton>
          <Controller
            name="nombre"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Nombre"
                label="Nombre"
                error={errors2.nombre?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="descripcion"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Descripción"
                label="Descripción"
                error={errors2.descripcion?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="platoFuerte"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Plato fuerte"
                label="Plato fuerte"
                error={errors2.platoFuerte?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="complemento1"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Complemento 1"
                label="Complemento 1"
                error={errors2.complemento1?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="complemento2"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Complemento 2"
                label="Complemento 2"
                error={errors2.complemento2?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="bebida"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Bebida"
                label="Bebida"
                error={errors2.bebida?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="postre"
            control={control2}
            render={({ field }) => (
              <TextInput
                placeholder="Postre"
                label="Postre"
                error={errors2.postre?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="tipo"
            control={control2}
            render={({ field }) => (
              <Select
                placeholder="Tipo"
                label="Tipo"
                error={errors2.tipo?.message}
                {...field}
                data={["Desayuno", "Comida"]}
                onChange={(value) => setTipo(value as string)}
              />
            )}
          />
          <Select
            placeholder="Día"
            label="Día"
            data={dias}
            onChange={(value) => setDia(value as string)}
          />
          {/* <Controller
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
          /> */}
          <Controller
            name="demanda"
            control={control2}
            render={({ field }) => (
              <Select
                placeholder="Demanda"
                label="Demanda"
                error={errors2.demanda?.message}
                {...field}
                data={["Baja", "Media", "Alta"]}
              />
            )}
          />
          <Controller
            name="disponible"
            control={control2}
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
            control={control2}
            render={({ field }) => (
              <NumberInput
                placeholder="Calorias"
                label="Calorias"
                error={errors2.nutricional?.calorias?.message}
                {...field}
              />
            )}
          />
          <Controller
            name={"nutricional.proteinas"}
            control={control2}
            render={({ field }) => (
              <NumberInput
                placeholder="Proteinas"
                label="Proteinas"
                error={errors2.nutricional?.proteinas?.message}
                {...field}
              />
            )}
          />
          <Controller
            name={"nutricional.lipidos"}
            control={control2}
            render={({ field }) => (
              <NumberInput
                placeholder="Lipidos"
                label="Lipidos"
                error={errors2.nutricional?.lipidos?.message}
                {...field}
              />
            )}
          />
          <Controller
            name={"nutricional.carbohidratos"}
            control={control2}
            render={({ field }) => (
              <NumberInput
                placeholder="Carbohidratos"
                label="Carbohidratos"
                error={errors2.nutricional?.carbohidratos?.message}
                {...field}
              />
            )}
          />
          <Button color="#20388C" type="submit" loading={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </Modal>
    </main>
  );
}

export default HomeAdmin;
