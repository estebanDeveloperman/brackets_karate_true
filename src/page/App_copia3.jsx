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

function shuffleGroups(participants) {
  const shuffledParticipants = shuffle(participants.slice());
  const grouped = groupByInstitution(shuffledParticipants);
  const groupArray = Object.values(grouped);
  const shuffledGroups = shuffle(groupArray);
  return shuffledGroups.flat();
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

function generateSequence(depth) {
  let initialArray = Array.from({ length: depth }, () =>
    Math.floor(Math.random() * 2)
  );
  let sequences = [initialArray.slice()];

  function toggleBit(arr, pos) {
    arr[pos] = arr[pos] === 0 ? 1 : 0;
  }

  let totalSequences = Math.pow(2, depth);

  for (let i = 1; i < totalSequences; i++) {
    let newSequence = sequences[i - 1].slice();

    for (let j = 0; j < depth; j++) {
      if (i % Math.pow(2, j) === 0) {
        toggleBit(newSequence, j);
      }
    }

    sequences.push(newSequence);
  }

  return sequences;
}

function setValue(bracket, posibleEleccion, value) {
  let current = bracket;

  for (let i = 0; i < posibleEleccion.length - 1; i++) {
    current = current[posibleEleccion[i]];
  }

  current[posibleEleccion[posibleEleccion.length - 1]] = value;
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

    const participantsMezclados = shuffleGroups(
      completarParticipantes(participants)
    );
    const cantidadParticipantes = participantsMezclados.length;
    const depth = Math.log2(cantidadParticipantes);
    const bracket = createBrackets(cantidadParticipantes);
    const sequences = generateSequence(depth);

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
