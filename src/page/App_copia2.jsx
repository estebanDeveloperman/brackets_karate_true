import React, { useState } from "react";
import "./App.css";
import TournamentBracket from "./TournamentBracket";

// Lógica proporcionada para generar el bracket
function generatePossibilities(power) {
  const results = [];
  const maxNumber = Math.pow(2, power);

  for (let i = 0; i < maxNumber; i++) {
    let binary = i.toString(2).padStart(power, "0");
    results.push(binary.split("").map(Number));
  }

  return results;
}

function createBrackets(participants) {
  function buildBracket(level) {
    if (level === 1) {
      return [
        { name: "", institution: "" },
        { name: "", institution: "" },
      ];
    }
    const subBracket1 = buildBracket(level - 1);
    const subBracket2 = buildBracket(level - 1);
    return [subBracket1, subBracket2];
  }

  const depth = Math.log2(participants);
  return buildBracket(depth);
}

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function ordenarPorInstituciones(array) {
  const conteoInstituciones = array.reduce((acc, participante) => {
    acc[participante.institution] = (acc[participante.institution] || 0) + 1;
    return acc;
  }, {});

  const maxInstitucion = Math.max(...Object.values(conteoInstituciones));
  const mitadParticipantes = array.length / 2;

  if (maxInstitucion > mitadParticipantes) {
    return array.sort((a, b) => {
      if (
        conteoInstituciones[a.institution] ===
        conteoInstituciones[b.institution]
      ) {
        return a.institution.localeCompare(b.institution);
      }
      return (
        conteoInstituciones[a.institution] - conteoInstituciones[b.institution]
      );
    });
  } else {
    return array.sort((a, b) => {
      if (
        conteoInstituciones[a.institution] ===
        conteoInstituciones[b.institution]
      ) {
        return a.institution.localeCompare(b.institution);
      }
      return (
        conteoInstituciones[b.institution] - conteoInstituciones[a.institution]
      );
    });
  }
}

function completarParticipantes(participants) {
  const cantidadParticipantes = participants.length;
  const potenciaSuperior = Math.pow(
    2,
    Math.ceil(Math.log2(cantidadParticipantes))
  );

  const participantesCompletados = [...participants];

  while (participantesCompletados.length < potenciaSuperior) {
    participantesCompletados.push({ name: "Bye", institution: "X" });
  }

  return participantesCompletados;
}

function convertirArray(array) {
  if (array.length % 2 !== 0) {
    throw new Error("El array debe tener una longitud múltiplo de 2.");
  }

  let grupo1 = [];
  let grupo2 = [];

  for (let i = 0; i < array.length; i += 2) {
    let pareja = [array[i], array[i + 1]];

    if (Math.random() < 0.5) {
      grupo1.push(pareja[0]);
      grupo2.push(pareja[1]);
    } else {
      grupo1.push(pareja[1]);
      grupo2.push(pareja[0]);
    }
  }

  return [grupo1, grupo2];
}

function setValue(bracket, posibleEleccion, value) {
  let current = bracket;

  for (let i = 0; i < posibleEleccion.length - 1; i++) {
    current = current[posibleEleccion[i]];
  }

  current[posibleEleccion[posibleEleccion.length - 1]] = value;
}

function getValue(bracket, posibleEleccion) {
  let current = bracket;

  for (let i = 0; i < posibleEleccion.length - 1; i++) {
    if (!current || !current[posibleEleccion[i]]) {
      return { name: "", institution: "" };
    }
    current = current[posibleEleccion[i]];
  }

  let lastIndex = posibleEleccion[posibleEleccion.length - 1];
  let result = current
    ? current[lastIndex ? 0 : 1]
    : { name: "", institution: "" };

  return result;
}

function App() {
  const [participantsInput, setParticipantsInput] = useState("");
  const [bracket, setBracket] = useState(null);

  const handleGenerateBracket = () => {
    const participants = participantsInput
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [name, institution] = line.split("\t");
        return { name, institution };
      });

    const participantesMezclados = ordenarPorInstituciones(
      mezclarArray(completarParticipantes([...participants]))
    );

    let lastInstitution = null;
    let lastCapa = null;
    let lastCapa2 = null;
    let lastCapa3 = null;
    let lastPosibilidad = null;
    let arrayFiltrado = [];
    let nivel = 0;
    let cantidadParticipantes = participantesMezclados.length;
    const depth = Math.log2(cantidadParticipantes);
    const arrayPossibilites = generatePossibilities(depth);
    let remainPossibilites = [...arrayPossibilites];
    let remainPossibilites2 = convertirArray([...remainPossibilites]);
    const bracket = createBrackets(cantidadParticipantes);

    function seleccionarValor(params) {
      const parametros = params;
      console.log("remain possibilites", remainPossibilites2);
      console.log("params", params);

      // Filtrar el array según los parámetros
      let filtrado;
      if (remainPossibilites2[nivel].length > 1) {
        filtrado = remainPossibilites2[nivel].filter((subArray) => {
          return parametros.every((parametro, index) => {
            return parametro === null || parametro === subArray[index];
          });
        });
      } else {
        filtrado = remainPossibilites2[nivel];
      }
      console.log("filtrado", filtrado);
      arrayFiltrado = [...filtrado];

      // Seleccionar un valor aleatorio del array filtrado
      if (filtrado.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * filtrado.length);
        console.log("valor filtrado indice", filtrado[indiceAleatorio]);
        return filtrado[indiceAleatorio];
      } else {
        if (depth === 5) {
          // Si no se encuentra ningún valor que cumpla las condiciones y la profundidad es 5, elegir uno al azar de todas las posibilidades restantes
          const todasPosibilidades = remainPossibilites2[nivel];
          const indiceAleatorio = Math.floor(
            Math.random() * todasPosibilidades.length
          );
          console.log(
            "Profundidad 5 - Selección alternativa:",
            todasPosibilidades[indiceAleatorio]
          );
          return todasPosibilidades[indiceAleatorio];
        } else {
          return null; // Si no se encuentra ningún valor que cumpla las condiciones
        }
      }
    }

    function eliminarPosibilidad(posibilidad) {
      remainPossibilites2[nivel] = remainPossibilites2[nivel].filter(
        (subArray) => {
          return !subArray.every((val, index) => val === posibilidad[index]);
        }
      );

      if (remainPossibilites2[nivel].length === 0) {
        nivel = 1;
      }
    }

    function eliminarPosibilidadFiltrado(posibilidad) {
      arrayFiltrado = arrayFiltrado.filter((subArray) => {
        return !subArray.every((val, index) => val === posibilidad[index]);
      });
    }

    let contador2 = 0;
    let contador3 = 0;
    let indicador = 0;

    function verificarOpuesto(participante, index) {
      let posibleEleccion;
      if (participante.institution === lastInstitution) {
        if (depth >= 4 && indicador !== 0) {
          if (indicador === 1) {
            if (lastCapa2 === 0) {
              contador2 = 1;
            } else {
              contador2 = 3;
            }

            if (lastCapa3 === 0) {
              contador3 = 1;
            } else {
              contador3 = 4;
            }
          }

          const contadorValor2 = Math.floor(contador2 / 2) % 2;
          const contadorValor3 = Math.floor(contador3 / 4) % 2;

          if (depth === 4) {
            posibleEleccion = seleccionarValor([
              lastCapa ? 0 : 1,
              contadorValor2,
              ...Array(depth - 2).fill(null),
            ]);
            contador2++;
          } else if (depth >= 5) {
            posibleEleccion = seleccionarValor([
              lastCapa ? 0 : 1,
              contadorValor2,
              contadorValor3,
              ...Array(depth - 3).fill(null),
            ]);
            console.log("could be", lastCapa, contadorValor2, contadorValor3);
            console.log("idea", posibleEleccion);
            contador2++;
            contador3++;
          }
        } else {
          if (participante.institution === lastInstitution) {
            posibleEleccion = seleccionarValor([
              lastCapa ? 0 : 1,
              ...Array(depth - 1).fill(null),
            ]);
          } else {
            posibleEleccion = seleccionarValor(Array(depth).fill(null));
          }
        }
      } else {
        indicador = 0;
        contador2 = 1;
        contador3 = 1;
        posibleEleccion = seleccionarValor(Array(depth).fill(null));
      }
      indicador++;
      if (
        participante.institution ===
        getValue(bracket, posibleEleccion).institution
      ) {
        let opcionPosible;
        const arrayFiltradoFijo = [...arrayFiltrado];
        for (let i = 0; i < arrayFiltradoFijo.length; i++) {
          const indiceAleatorio = Math.floor(
            Math.random() * arrayFiltrado.length
          );
          opcionPosible = arrayFiltrado[indiceAleatorio];
          if (
            i === arrayFiltradoFijo.length - 1 ||
            participante.institution !==
              getValue(bracket, opcionPosible).institution
          ) {
            return opcionPosible;
          } else {
            eliminarPosibilidadFiltrado(opcionPosible);
          }
        }
      } else {
        return posibleEleccion;
      }
    }

    for (let i = 0; i < participantesMezclados.length; i++) {
      let posibilidadElegida = verificarOpuesto(participantesMezclados[i], i);
      setValue(bracket, posibilidadElegida, participantesMezclados[i]);
      lastInstitution = participantesMezclados[i].institution;
      lastCapa = posibilidadElegida[0];
      if (depth >= 4) {
        if (depth === 4) {
          lastCapa2 = posibilidadElegida[1];
        }
        if (depth >= 5) {
          lastCapa2 = posibilidadElegida[1];
          lastCapa3 = posibilidadElegida[2];
        }
      }

      lastPosibilidad = [...posibilidadElegida];
      eliminarPosibilidad(posibilidadElegida);
    }

    setBracket(bracket);
  };

  return (
    <div className="app">
      <h1 className="title">Generador de Brackets para Karate FEDUP</h1>
      <textarea
        className="participants-input"
        value={participantsInput}
        onChange={(e) => setParticipantsInput(e.target.value)}
        rows="20"
        cols="50"
      ></textarea>
      <button className="generate-button" onClick={handleGenerateBracket}>
        Generar Bracket
      </button>
      {bracket && <TournamentBracket teams={flattenTeams(bracket)} />}
    </div>
  );
}

const flattenTeams = (nestedArray) => {
  const result = [];
  const flatten = (arr) => {
    arr.forEach((element) => {
      if (Array.isArray(element)) {
        flatten(element);
      } else {
        result.push(element);
      }
    });
  };
  flatten(nestedArray);
  return result;
};

export default App;
