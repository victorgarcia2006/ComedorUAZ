import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand, NavbarContent, Chip } from "@heroui/react";
import { Button, Card, Accordion, Loader } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Image from "next/image";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/lib/firebaseClient";
import { ref, onValue } from "firebase/database";
import { FormData, MenuData } from "./admin";
import { IconPhoto } from "@tabler/icons-react";

function HomePage() {
  const router = useRouter();
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
  const [desayuno, setDesayuno] = useState<FormData>();
  const [comida, setComida] = useState<FormData>();
  const [menu, setMenu] = useState<MenuData | null>(null);

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
  }, []);

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
        <h1 className="font-bold mt-4 text-2xl text-[#252D4D]">{dia}</h1>
        <Card
          withBorder={false}
          shadow="sm"
          radius="md"
          bg="#20388C"
          w="340px"
          h="auto"
          className=""
        >
          <h2 className="font-bold text-2xl text-white mb-2">Desayuno</h2>
          {desayuno !== null ? (
            desayuno !== undefined ? (
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
                      <IconPhoto size={64} color="white" />
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
                          {desayuno?.disponible
                            ? "Disponible"
                            : "No disponible"}
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
                              Carbohidratos:{" "}
                              {desayuno?.nutricional.carbohidratos}
                            </p>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </Card.Section>
                </div>
              </Card>
            ) : (
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )
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
          <h2 className="font-bold text-2xl text-white mb-2">Comida</h2>
          {comida !== null ? (
            comida !== undefined ? (
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
                      <IconPhoto size={64} color="white" />
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
              <div className="flex items-center justify-center">
                <Loader />
              </div>
            )
          ) : (
            <p className="text-white">No hay comida</p>
          )}
        </Card>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h2 className="font-bold my-4  text-xl text-[#252D4D]">Menú semanal</h2>
        {menu !== null ? (
          menu !== undefined ? (
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
          ) : (
            <div className="flex items-center justify-center">
              <Loader />
            </div>
          )
        ) : (
          <p className="text-white">No hay menú</p>
        )}
      </div>
    </main>
  );
}

export default HomePage;
