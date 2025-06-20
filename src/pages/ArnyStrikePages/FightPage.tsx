import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/ArnyStrikePages/FightPage.css";
import { useLocation } from "react-router-dom";

interface Soldier {
  id: string;
  destroyed: boolean;
  points: number;
  isHit: boolean;
}

interface Projectile {
  id: string;
  from: "my" | "enemy";
  targetId: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  progress: number;
}

interface FireEffect {
  id: string;
  x: number;
  y: number;
  type: "my" | "enemy";
}

const FightPage: React.FC = () => {
  const location = useLocation();
  const { bullets: initialBullets, group } = location.state || {};
  const enemyinitialBullets = 6;
  const enemyArmylength = 6;

  const [myArmy, setMyArmy] = useState<Soldier[]>([]);
  const [enemyArmy, setEnemyArmy] = useState<Soldier[]>([]);
  const [myBullets, setMyBullets] = useState(initialBullets || 0);
  const [enemyBullets, setEnemyBullets] = useState(enemyinitialBullets);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleOver, setBattleOver] = useState(false);
  const [winner, setWinner] = useState<"my" | "enemy" | "draw" | null>(null);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [impactFireEffects, setImpactFireEffects] = useState<FireEffect[]>([]);
  const [shotFireEffects, setShotFireEffects] = useState<FireEffect[]>([]);
  const battleContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const initialMyArmy: Soldier[] = [];
    const initialEnemyArmy: Soldier[] = [];

    for (let i = 0; i < group.soldierCount; i++) {
      initialMyArmy.push({
        id: `my-soldier-${i}`,
        destroyed: false,
        points: Math.floor(Math.random() * 50) + 50,
        isHit: false,
      });
    }
    for (let i = 0; i < enemyArmylength; i++) {
      initialEnemyArmy.push({
        id: `enemy-soldier-${i}`,
        destroyed: false,
        points: Math.floor(Math.random() * 50) + 50,
        isHit: false,
      });
    }

    setMyArmy(initialMyArmy);
    setEnemyArmy(initialEnemyArmy);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!battleStarted || projectiles.length === 0) return;

    const animate = () => {
      setProjectiles((prevProjectiles) => {
        const updated = prevProjectiles
          .map((proj) => ({
            ...proj,
            progress: Math.min(proj.progress + 0.05, 1),
          }))
          .filter((proj) => proj.progress < 1);

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [battleStarted, projectiles.length]);

  const handleImpactFireAnimationComplete = useCallback((id: string) => {
    setImpactFireEffects((prev) => prev.filter((fire) => fire.id !== id));
  }, []);

  useEffect(() => {
    if (!battleStarted || battleOver) return;

    const battleInterval = setInterval(() => {
      // Enemy attacks my army
      if (enemyBullets > 0) {
        const activeMySoldiers = myArmy.filter((s) => !s.destroyed);
        const activeEnemySoldiers = enemyArmy.filter((s) => !s.destroyed);

        if (activeMySoldiers.length > 0 && activeEnemySoldiers.length > 0) {
          const targetIndex = Math.floor(
            Math.random() * activeMySoldiers.length
          );
          const attackerIndex = Math.floor(
            Math.random() * activeEnemySoldiers.length
          );

          const targetId = activeMySoldiers[targetIndex].id;
          const attackerId = activeEnemySoldiers[attackerIndex].id;

          const attackerElem = document.querySelector(
            `[data-soldier-id="${attackerId}"] .enimy`
          );
          const targetElem = document.querySelector(
            `[data-soldier-id="${targetId}"] .myarmy`
          );

          if (attackerElem && targetElem) {
            const attackerRect = attackerElem.getBoundingClientRect();
            const targetRect = targetElem.getBoundingClientRect();

            // Show enemy firing effect
            setShotFireEffects((prev) => [
              ...prev,
              {
                id: `shot-fire-${Date.now()}-enemy`,
                x: attackerRect.left + attackerRect.width / 2,
                y: attackerRect.top + attackerRect.height / 2,
                type: "enemy",
              },
            ]);

            // Create projectile
            const projectile: Projectile = {
              id: `proj-${Date.now()}-enemy`,
              from: "enemy",
              targetId,
              startX: attackerRect.left + attackerRect.width / 2,
              startY: attackerRect.top + attackerRect.height / 2,
              endX: targetRect.left + targetRect.width / 2,
              endY: targetRect.top + targetRect.height / 2,
              progress: 0,
            };
            setProjectiles((prev) => [...prev, projectile]);

            setTimeout(() => {
              setMyArmy((prev) =>
                prev.map((s) => (s.id === targetId ? { ...s, isHit: true } : s))
              );

              // Show hit effect
              setImpactFireEffects((prev) => [
                ...prev,
                {
                  id: `impact-fire-${Date.now()}-enemy`,
                  x: targetRect.left + targetRect.width / 2,
                  y: targetRect.top + targetRect.height / 2,
                  type: "enemy",
                },
              ]);

              setTimeout(() => {
                setMyArmy((prev) =>
                  prev.map((s) =>
                    s.id === targetId
                      ? { ...s, destroyed: true, isHit: false }
                      : s
                  )
                );
                setEnemyBullets((prev: any) => Math.max(0, prev - 1));
              }, 300);
            }, 500);
          }
        }
      }

      // My army attacks enemy
      if (myBullets > 0) {
        const activeMySoldiers = myArmy.filter((s) => !s.destroyed);
        const activeEnemySoldiers = enemyArmy.filter((s) => !s.destroyed);

        if (activeEnemySoldiers.length > 0 && activeMySoldiers.length > 0) {
          const targetIndex = Math.floor(
            Math.random() * activeEnemySoldiers.length
          );
          const attackerIndex = Math.floor(
            Math.random() * activeMySoldiers.length
          );

          const targetId = activeEnemySoldiers[targetIndex].id;
          const attackerId = activeMySoldiers[attackerIndex].id;

          const attackerElem = document.querySelector(
            `[data-soldier-id="${attackerId}"] .myarmy`
          );
          const targetElem = document.querySelector(
            `[data-soldier-id="${targetId}"] .enimy`
          );

          if (attackerElem && targetElem) {
            const attackerRect = attackerElem.getBoundingClientRect();
            const targetRect = targetElem.getBoundingClientRect();

            // Show my firing effect
            setShotFireEffects((prev) => [
              ...prev,
              {
                id: `shot-fire-${Date.now()}-my`,
                x: attackerRect.left + attackerRect.width / 2,
                y: attackerRect.top + attackerRect.height / 2,
                type: "my",
              },
            ]);

            // Create projectile
            const projectile: Projectile = {
              id: `proj-${Date.now()}-my`,
              from: "my",
              targetId,
              startX: attackerRect.left + attackerRect.width / 2,
              startY: attackerRect.top + attackerRect.height / 2,
              endX: targetRect.left + targetRect.width / 2,
              endY: targetRect.top + targetRect.height / 2,
              progress: 0,
            };
            setProjectiles((prev) => [...prev, projectile]);

            setTimeout(() => {
              setEnemyArmy((prev) =>
                prev.map((s) => (s.id === targetId ? { ...s, isHit: true } : s))
              );

              // Show hit effect
              setImpactFireEffects((prev) => [
                ...prev,
                {
                  id: `impact-fire-${Date.now()}-my`,
                  x: targetRect.left + targetRect.width / 2,
                  y: targetRect.top + targetRect.height / 2,
                  type: "my",
                },
              ]);

              setTimeout(() => {
                setEnemyArmy((prev) =>
                  prev.map((s) =>
                    s.id === targetId
                      ? { ...s, destroyed: true, isHit: false }
                      : s
                  )
                );
                setMyBullets((prev: any) => Math.max(0, prev - 1));
              }, 300);
            }, 500);
          }
        }
      }
    }, 1000);

    return () => clearInterval(battleInterval);
  }, [battleStarted, battleOver, myBullets, enemyBullets, myArmy, enemyArmy]);

  useEffect(() => {
    if (!battleStarted) return;

    const myActive = myArmy.filter((s) => !s.destroyed).length;
    const enemyActive = enemyArmy.filter((s) => !s.destroyed).length;

    if (
      myActive === 0 ||
      enemyActive === 0 ||
      (myBullets === 0 && enemyBullets === 0)
    ) {
      setBattleOver(true);

      if (myActive > enemyActive) {
        setWinner("my");
      } else if (enemyActive > myActive) {
        setWinner("enemy");
      } else {
        const myPoints = myArmy.reduce(
          (sum, s) => sum + (s.destroyed ? 0 : s.points),
          0
        );
        const enemyPoints = enemyArmy.reduce(
          (sum, s) => sum + (s.destroyed ? 0 : s.points),
          0
        );

        if (myPoints > enemyPoints) {
          setWinner("my");
        } else if (enemyPoints > myPoints) {
          setWinner("enemy");
        } else {
          setWinner("draw");
        }
      }
    }
  }, [myArmy, enemyArmy, myBullets, enemyBullets, battleStarted]);

  const startBattle = () => {
    setBattleStarted(true);
    setBattleOver(false);
    setWinner(null);
    setEnemyBullets(enemyinitialBullets);
    setMyBullets(initialBullets || 0);
    setProjectiles([]);
    setImpactFireEffects([]);
    setShotFireEffects([]);
    setMyArmy(myArmy.map((s) => ({ ...s, destroyed: false, isHit: false })));
    setEnemyArmy(
      enemyArmy.map((s) => ({ ...s, destroyed: false, isHit: false }))
    );
  };

  const resetBattle = () => {
    setBattleStarted(false);
    setBattleOver(false);
    setWinner(null);
    setMyBullets(0);
    setEnemyBullets(0);
    setProjectiles([]);
    setImpactFireEffects([]);
    setShotFireEffects([]);
    setMyArmy((prev) =>
      prev.map((s) => ({ ...s, destroyed: false, isHit: false }))
    );
    setEnemyArmy((prev) =>
      prev.map((s) => ({ ...s, destroyed: false, isHit: false }))
    );
  };

  const generateTriangleFormation = useCallback(
    (soldiers: Soldier[]): number[][] => {
      const formation: number[][] = [];
      let remainingSoldiers = [...soldiers.filter((s) => !s.destroyed)];
      let row = 1;

      while (remainingSoldiers.length > 0) {
        const rowSoldiers = remainingSoldiers.splice(0, row);
        formation.push(Array(rowSoldiers.length).fill(1));
        row++;
      }
      return formation;
    },
    []
  );

  const mirrorFormation = useCallback((formation: number[][]): number[][] => {
    const maxWidth = Math.max(...formation.map((row) => row.length));
    return formation.map((row) => {
      const padLeft = maxWidth - row.length;
      return Array(padLeft).fill(0).concat(row);
    });
  }, []);

  const renderFormation = useCallback(
    (soldiers: Soldier[], type: "my" | "enemy") => {
      const formation = generateTriangleFormation(soldiers);
      const mirroredFormation =
        type === "enemy" ? mirrorFormation(formation) : formation;
      const activeSoldiersCopy = [...soldiers.filter((s) => !s.destroyed)];

      return (
        <div className="triangle-formation">
          {mirroredFormation.map((row, rowIndex) => (
            <div className="triangle-row" key={`${type}-row-${rowIndex}`}>
              {row.map((cell, colIndex) => {
                if (cell === 1 && activeSoldiersCopy.length > 0) {
                  const soldier = activeSoldiersCopy.shift();
                  if (!soldier) return null;

                  // Check if this soldier is firing
                  const isFiring = shotFireEffects.some((fire) => {
                    const soldierElem = document.querySelector(
                      `[data-soldier-id="${soldier.id}"]`
                    );
                    if (!soldierElem) return false;
                    const rect = soldierElem.getBoundingClientRect();
                    const fireX = rect.left + rect.width / 2;
                    const fireY = rect.top + rect.height / 2;
                    return (
                      Math.abs(fire.x - fireX) < 10 &&
                      Math.abs(fire.y - fireY) < 10 &&
                      ((type === "my" && fire.type === "my") ||
                        (type === "enemy" && fire.type === "enemy"))
                    );
                  });

                  // Check if this soldier is being hit
                  const isBeingHit = impactFireEffects.some((fire) => {
                    const soldierElem = document.querySelector(
                      `[data-soldier-id="${soldier.id}"]`
                    );
                    if (!soldierElem) return false;
                    const rect = soldierElem.getBoundingClientRect();
                    const fireX = rect.left + rect.width / 2;
                    const fireY = rect.top + rect.height / 2;
                    return (
                      Math.abs(fire.x - fireX) < 10 &&
                      Math.abs(fire.y - fireY) < 10 &&
                      ((type === "my" && fire.type === "enemy") ||
                        (type === "enemy" && fire.type === "my"))
                    );
                  });

                  return (
                    <div
                      className="soldier-wrapper"
                      key={soldier.id}
                      data-soldier-id={soldier.id}
                    >
                      <div
                        className={`${type === "my" ? "army" : "enemy"} ${
                          soldier.destroyed ? "destroyed-soldier" : ""
                        }`}
                      >
                        <img
                          src={
                            type === "my"
                              ? "/fight-page-my-army.svg"
                              : "/enime.svg"
                          }
                          alt={type === "my" ? "myarmy" : "enemy"}
                          className={`${type === "my" ? "myarmy" : "enimy"} ${
                            soldier.isHit ? "hit-effect" : ""
                          }`}
                          style={{ opacity: soldier.destroyed ? 0 : 1 }}
                        />

                        {/* Bullet animation when firing */}
                        {isFiring && (
                          <div className="bullet-animation-container">
                            <img
                              src={
                                type === "my" ? "/myfire.svg" : "/enimefire.svg"
                              }
                              alt="bullet"
                              className={`bullet ${
                                type === "my" ? "my-bullet" : "enemy-bullet"
                              }`}
                            />
                          </div>
                        )}

                        {/* Hit effect when being hit */}
                        {isBeingHit && (
                          <div className="hit-animation-container">
                            <img
                              src={
                                type === "my" ? "/enimefire.svg" : "/myfire.svg"
                              }
                              alt="hit"
                              className="hit-effect"
                            />
                          </div>
                        )}

                        <img
                          src="/destroyed.svg"
                          alt="destroyed"
                          className="destroyed"
                          style={{ opacity: soldier.destroyed ? 1 : 0 }}
                        />
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    className="soldier-wrapper empty"
                    key={`${type}-empty-${rowIndex}-${colIndex}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      );
    },
    [
      generateTriangleFormation,
      mirrorFormation,
      shotFireEffects,
      impactFireEffects,
      handleImpactFireAnimationComplete,
    ]
  );

  const activeMySoldiers = myArmy.filter((s) => !s.destroyed).length;
  const activeEnemySoldiers = enemyArmy.filter((s) => !s.destroyed).length;
  const totalMyPoints = myArmy.reduce(
    (sum, soldier) => sum + (soldier.destroyed ? 0 : soldier.points),
    0
  );
  const totalEnemyPoints = enemyArmy.reduce(
    (sum, soldier) => sum + (soldier.destroyed ? 0 : soldier.points),
    0
  );

  return (
    <div className="game-content blurred">
      <div className="provided-bullets btn btn-outline-dark">
        My Bullets: {myBullets}
      </div>
      <div className="enemy-bullets btn btn-outline-danger">
        Enemy Bullets: {enemyBullets}
      </div>

      {!battleStarted && (
        <button className="start-battle-btn" onClick={startBattle}>
          Start Battle
        </button>
      )}

      {battleOver && (
        <div className="battle-result">
          <h2>
            {winner === "my"
              ? "You Won!"
              : winner === "enemy"
              ? "Enemy Won!"
              : "It's a Draw!"}
          </h2>
          <button className="reset-battle-btn" onClick={resetBattle}>
            Play Again
          </button>
        </div>
      )}

      <div className="points-display">
        <div className="my-points">My Points: {totalMyPoints}</div>
        <div className="enemy-points">Enemy Points: {totalEnemyPoints}</div>
      </div>
      <div className="team-Alive">
        <div className="myarmy-Alive">{activeMySoldiers}</div>
        <div className="vs">VS</div>
        <div className="enemy-army-Alive">{activeEnemySoldiers}</div>
      </div>

      <div className="battle-container" ref={battleContainerRef}>
        <div className="myArmy-Boundary">{renderFormation(myArmy, "my")}</div>

        {/* Render projectiles and fire effects here */}

        <div className="enemy-comming-Boundary">
          {renderFormation(enemyArmy, "enemy")}
        </div>
      </div>
    </div>
  );
};

export default FightPage;
