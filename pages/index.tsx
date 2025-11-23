import React, { useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, Chip } from "@heroui/react";
import { Button, Card, Accordion } from "@mantine/core";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";

function HomePage() {
  const router = useRouter();
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
    } /* 
    {
      nombre: "Huevito Ranchero",
      descripcion: "Huevos rancheros con frijoles y totopos, acompañados de café y gelatina.",
      platoFuerte: "Huevos Rancheros",
      complemento: ["Frijoles", "Totopos"],
      bebida: "Café",
      postre: "Gelatina",
      tipo: "Desayuno",
      precio: 12,
      imagen: "https://cdn.pixabay.com/photo/2014/09/22/14/49/breakfast-456351_1280.jpg",
      demanda: 'media',
      nutricional: {
        calorias: 460,
        proteinas: 20,
        lipidos: 17,
        carbohidratos: 48
      },
      disponible: true,
    }, */,
    /* {
      nombre: "Tortitas de Atún",
      descripcion: "Tortitas de atún con salsa verde, acompañadas de arroz y verduritas.",
      platoFuerte: "Tortitas de Atún con Salsa Verde",
      complemento: ["Arroz", "Verduritas"],
      bebida: "Agua de Limón",
      postre: "Plátano",
      tipo: "Comida",
      precio: 15,
      imagen: "https://cdn.pixabay.com/photo/2023/03/06/08/42/tuna-7832995_1280.jpg",
      demanda: 'media',
      nutricional: {
        calorias: 480,
        proteinas: 32,
        lipidos: 14,
        carbohidratos: 55
      },
      disponible: true,
    }, */
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
    /* {
      nombre: "Tacos Dorados",
      descripcion: "Tacos dorados de pollo con lechuga y crema, acompañados de agua de horchata y flan.",
      platoFuerte: "Tacos Dorados de Pollo",
      complemento: ["Arroz", "Lechuga y Crema"],
      bebida: "Agua de Horchata",
      postre: "Flan",
      tipo: "Comida",
      precio: 14,
      imagen: "https://cdn.pixabay.com/photo/2023/06/20/10/05/tacos-8076612_1280.jpg",
      demanda: 'baja',
      disponible: true,
      nutricional: {
        calorias: 610,
        proteinas: 24,
        lipidos: 28,
        carbohidratos: 70
      }
    }, */
  ];

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
        <NavbarContent justify="end">
          <Button
            onClick={() => router.push("/login")}
            variant="light"
            color="#20388c"
            className="bg-[#20388c]"
          >
            Entrar
          </Button>
        </NavbarContent>
      </Navbar>
      <div className="flex items-center justify-start flex-col h-full gap-4">
        <h1 className="font-bold mt-4 text-2xl text-[#252D4D]">Miercoles</h1>
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
    </main>
  );
}

export default HomePage;
