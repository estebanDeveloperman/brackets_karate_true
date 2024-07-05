import React from "react";
import "./TournamentBracket.css";

const TournamentBracket = ({ teams }) => {
  const createRounds = (teams) => {
    const rounds = [];
    let currentRoundTeams = teams;
    let roundNumber = 1;

    while (currentRoundTeams.length > 1) {
      const nextRoundTeams = [];
      const round = [];

      for (let i = 0; i < currentRoundTeams.length; i += 2) {
        console.log("current", currentRoundTeams);
        const team1 = currentRoundTeams[i];
        const team2 = currentRoundTeams[i + 1];

        if (
          team1.institution === "XYZWBYE" ||
          team2.institution === "XYZWBYE"
        ) {
          const winner = team1.institution === "XYZWBYE" ? team2 : team1;
          const newWinner = {
            ...winner,
            precesor: "XYZWBYE",
          };
          nextRoundTeams.push(newWinner);

          round.push(
            <div
              key={`${roundNumber}-game-${i}`}
              className={
                team1.institution === "XYZWBYE" ||
                team2.institution === "XYZWBYE"
                  ? "visibilityhidden"
                  : null
              }
            >
              <li className="game game-top">
                <span>
                  {team1.name} ({team1.institution})
                </span>
              </li>
              <li className="game game-spacer">&nbsp;</li>
              <li className="game game-bottom">
                <span>
                  {team2.name} ({team2.institution})
                </span>
              </li>
              <li className="spacer">&nbsp;</li>
            </div>
          );
        } else {
          nextRoundTeams.push(team1);
          round.push(
            <React.Fragment key={`${roundNumber}-game-${i}`}>
              {roundNumber === 1 ? (
                <div key={`${team1.name}-vs-${team2.name}`}>
                  <li className="game game-top">
                    <span>
                      {team1.name} (<b>{team1.institution}</b>)
                    </span>
                  </li>
                  <li className="game game-spacer">&nbsp;</li>
                  <li className="game game-bottom">
                    <span>
                      {team2.name} (<b>{team2.institution}</b>)
                    </span>
                  </li>
                </div>
              ) : roundNumber === 2 ? (
                <>
                  <li className="game game-top" key={`${roundNumber}-top-${i}`}>
                    <span>
                      {team1.precesor ? (
                        <>
                          {team1.name} (<b>{team1.institution}</b>)
                        </>
                      ) : null}
                    </span>
                  </li>
                  <li
                    className="game game-spacer"
                    key={`${roundNumber}-spacer-${i}`}
                  >
                    &nbsp;
                  </li>
                  <li
                    className="game game-bottom"
                    key={`${roundNumber}-bottom-${i}`}
                  >
                    <span>
                      {team2.precesor ? (
                        <>
                          {team2.name} (<b>{team2.institution}</b>)
                        </>
                      ) : null}
                    </span>
                  </li>
                </>
              ) : (
                <>
                  <li className="game game-top" key={`${roundNumber}-top-${i}`}>
                    <span></span>
                  </li>
                  <li
                    className="game game-spacer"
                    key={`${roundNumber}-spacer-${i}`}
                  >
                    &nbsp;
                  </li>
                  <li
                    className="game game-bottom"
                    key={`${roundNumber}-bottom-${i}`}
                  >
                    <span></span>
                  </li>
                </>
              )}
              <li className="spacer" key={`spacer-${roundNumber}-${i}`}>
                &nbsp;
              </li>
            </React.Fragment>
          );
        }
      }

      rounds.push(
        <ul
          key={`round-${roundNumber}`}
          className={`round round-${roundNumber}`}
        >
          <li className="spacer">&nbsp;</li>
          {round}
        </ul>
      );

      // Eliminar el atributo 'precesor' de cada objeto en nextRoundTeams
      // for (let i = 0; i < nextRoundTeams.length; i++) {
      //   delete nextRoundTeams[i].precesor;
      // }

      currentRoundTeams = nextRoundTeams;
      roundNumber++;
    }

    // Añadir una línea final para el ganador
    rounds.push(
      <ul key={`round-${roundNumber}`} className={`round round-${roundNumber}`}>
        <li className="spacer">&nbsp;</li>
        <li className="game final-game">
          <div className="final-line">
            <span></span>
          </div>
        </li>
        <li className="spacer">&nbsp;</li>
      </ul>
    );

    return rounds;
  };

  return (
    <div>
      <main id="tournament">{createRounds(teams)}</main>
    </div>
  );
};

export default TournamentBracket;
