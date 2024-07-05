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
        round.push(
          <React.Fragment key={`${roundNumber}-game-${i}`}>
            {roundNumber === 1 ? (
              <div
                key={`${currentRoundTeams[i].name}-vs-${
                  currentRoundTeams[i + 1].name
                }`}
              >
                <li className="game game-top">
                  <span>
                    {currentRoundTeams[i].name} (
                    {currentRoundTeams[i].institution})
                  </span>
                </li>
                <li className="game game-spacer">&nbsp;</li>
                <li className="game game-bottom">
                  <span>
                    {currentRoundTeams[i + 1].name} (
                    {currentRoundTeams[i + 1].institution})
                  </span>
                </li>
              </div>
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
        nextRoundTeams.push("");
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
      <h1>BRACKET KARATE TOURNAMENT</h1>
      <main id="tournament">{createRounds(teams)}</main>
    </div>
  );
};

export default TournamentBracket;
