import React, { useState } from "react";
import "./App.css";
import TournamentBracket from "./TournamentBracket";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function groupByInstitution(participants) {
  return participants.reduce((groups, participant) => {
    const institution = participant.institution;
    if (!groups[institution]) {
      groups[institution] = [];
    }
    groups[institution].push(participant);
    return groups;
  }, {});
}

function completarParticipantes(participants) {
  const cantidadParticipantes = participants.length;
  const potenciaSuperior = Math.pow(
    2,
    Math.ceil(Math.log2(cantidadParticipantes))
  );
  const participantesCompletados = [...participants];

  while (participantesCompletados.length < potenciaSuperior) {
    participantesCompletados.push({ name: "Bye", institution: "XYZWBYE" });
  }

  return participantesCompletados;
}

function createBrackets(participants) {
  function buildBracket(level) {
    if (level === 1) {
      return ["", ""];
    }
    const subBracket1 = buildBracket(level - 1);
    const subBracket2 = buildBracket(level - 1);
    return [subBracket1, subBracket2];
  }

  const depth = Math.log2(participants);
  return buildBracket(depth);
}

function generatePossibilities(power) {
  const results = [];
  const maxNumber = Math.pow(2, power);

  for (let i = 0; i < maxNumber; i++) {
    let binary = i.toString(2).padStart(power, "0");
    results.push(binary.split("").map(Number));
  }

  return results;
}

function setValue(bracket, posibleEleccion, value) {
  let current = bracket;

  for (let i = 0; i < posibleEleccion.length - 1; i++) {
    current = current[posibleEleccion[i]];
  }

  current[posibleEleccion[posibleEleccion.length - 1]] = value;
}

function getContraryValue(value) {
  return value === 0 ? 1 : 0;
}

function generateSequence(participants) {
  const depth = Math.ceil(Math.log2(participants.length));
  let globalPossibilities = generatePossibilities(depth);
  const sequence = [];
  let currentInstitution = participants[0].institution;
  let institutionStartIndex = 0;

  for (let i = 0; i < participants.length; i++) {
    const participant = participants[i];
    if (participant.institution !== currentInstitution) {
      currentInstitution = participant.institution;
      institutionStartIndex = i;
    }

    let conditions = Array(depth).fill(null);
    for (let j = 0; j < depth; j++) {
      const index = i - institutionStartIndex - Math.pow(2, j);
      if (index >= 0 && sequence[index + institutionStartIndex]) {
        conditions[j] = getContraryValue(
          sequence[index + institutionStartIndex][j]
        );
      }
    }

    const remainingForInstitution = globalPossibilities.filter((p) => {
      return !sequence.includes(p);
    });

    if (remainingForInstitution.length === 1) {
      conditions = Array(depth).fill(null);
    }
    const selectedCombination = getRandomCombination(
      conditions,
      remainingForInstitution
    );
    sequence.push(selectedCombination);

    globalPossibilities = globalPossibilities.filter((p) => {
      return !sequence.includes(p);
    });
  }

  return sequence;
}

function getRandomCombination(conditions, possibilities) {
  let filteredPossibilities = possibilities.filter((possibility) => {
    return conditions.every((condition, index) => {
      return condition === null || condition === possibility[index];
    });
  });

  while (filteredPossibilities.length === 0) {
    for (let i = conditions.length - 1; i >= 0; i--) {
      if (conditions[i] !== null) {
        conditions[i] = null;
        break;
      }
    }

    filteredPossibilities = possibilities.filter((possibility) => {
      return conditions.every((condition, index) => {
        return condition === null || condition === possibility[index];
      });
    });
  }

  const randomIndex = Math.floor(Math.random() * filteredPossibilities.length);
  return filteredPossibilities[randomIndex];
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

    const participantsMezclados = ordenarPorInstituciones(
      completarParticipantes(participants)
    );
    const cantidadParticipantes = participantsMezclados.length;
    const bracket = createBrackets(cantidadParticipantes);
    const sequences = generateSequence(participantsMezclados);

    for (let i = 0; i < participantsMezclados.length; i++) {
      let posicionElegida = sequences[i];
      setValue(bracket, posicionElegida, participantsMezclados[i]);
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
