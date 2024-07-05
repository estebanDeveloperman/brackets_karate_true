import React, { useState } from "react";
import "./App.css";
import TournamentBracket from "./TournamentBracket";

const nestedTeams32 = [
  [
    [
      [
        [
          { name: "P1", institution: "UPC" },
          { name: "P2", institution: "USMP" },
        ],
        [
          { name: "P3", institution: "UNW" },
          { name: "P4", institution: "UNMSM" },
        ],
      ],
      [
        [
          { name: "P5", institution: "UNI" },
          { name: "P6", institution: "ULIMA" },
        ],
        [
          { name: "P7", institution: "UP" },
          { name: "P8", institution: "UPN" },
        ],
      ],
    ],
    [
      [
        [
          { name: "P9", institution: "UCSUR" },
          { name: "P10", institution: "UTEC" },
        ],
        [
          { name: "P11", institution: "UNSA" },
          { name: "P12", institution: "UDEP" },
        ],
      ],
      [
        [
          { name: "P13", institution: "USIL" },
          { name: "P14", institution: "UPCH" },
        ],
        [
          { name: "P15", institution: "PUCP" },
          { name: "P16", institution: "UCV" },
        ],
      ],
    ],
  ],
  [
    [
      [
        [
          { name: "P17", institution: "UTP" },
          { name: "P18", institution: "UCH" },
        ],
        [
          { name: "P19", institution: "UNALM" },
          { name: "P20", institution: "UIGV" },
        ],
      ],
      [
        [
          { name: "P21", institution: "UL" },
          { name: "P22", institution: "UTP" },
        ],
        [
          { name: "P23", institution: "UPN" },
          { name: "P24", institution: "UCAL" },
        ],
      ],
    ],
    [
      [
        [
          { name: "P25", institution: "URP" },
          { name: "P26", institution: "UNSAAC" },
        ],
        [
          { name: "P27", institution: "USMP" },
          { name: "P28", institution: "UNFV" },
        ],
      ],
      [
        [
          { name: "P29", institution: "UAC" },
          { name: "P30", institution: "UNC" },
        ],
        [
          { name: "P31", institution: "UNALM" },
          { name: "P32", institution: "UNT" },
        ],
      ],
    ],
  ],
];

const nestedTeams16 = [
  [
    [
      { name: "P1", institution: "UPC" },
      { name: "P2", institution: "USMP" },
    ],
    [
      { name: "P3", institution: "UNW" },
      { name: "P4", institution: "UNMSM" },
    ],
  ],
  [
    [
      { name: "P5", institution: "UNI" },
      { name: "P6", institution: "ULIMA" },
    ],
    [
      { name: "P7", institution: "UP" },
      { name: "P8", institution: "UPN" },
    ],
  ],
  [
    [
      { name: "P9", institution: "UCSUR" },
      { name: "P10", institution: "UTEC" },
    ],
    [
      { name: "P11", institution: "UNSA" },
      { name: "P12", institution: "UDEP" },
    ],
  ],
  [
    [
      { name: "P13", institution: "USIL" },
      { name: "P14", institution: "UPCH" },
    ],
    [
      { name: "P15", institution: "PUCP" },
      { name: "Bye", institution: "X" },
    ],
  ],
];

const nestedTeams8 = [
  [
    [
      { name: "P1", institution: "UPC" },
      { name: "P2", institution: "USMP" },
    ],
    [
      { name: "P3", institution: "UNW" },
      { name: "P4", institution: "UNMSM" },
    ],
  ],
  [
    [
      { name: "P5", institution: "UNI" },
      { name: "P6", institution: "ULIMA" },
    ],
    [
      { name: "P7", institution: "UP" },
      { name: "P8", institution: "UPN" },
    ],
  ],
];

const nestedTeams4 = [
  [
    { name: "P1", institution: "UPC" },
    { name: "P2", institution: "USMP" },
  ],
  [
    { name: "P3", institution: "UNW" },
    { name: "P4", institution: "UNMSM" },
  ],
];

const nestedTeams2 = [
  { name: "P1", institution: "UPC" },
  { name: "P2", institution: "USMP" },
];

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

function App() {
  const [teams, setTeams] = useState(flattenTeams(nestedTeams16));

  return (
    <div>
      <TournamentBracket teams={teams} />
    </div>
  );
}

export default App;
