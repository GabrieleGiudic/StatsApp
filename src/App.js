import React, { useState, useEffect, useRef } from 'react';

// --- MOCK DATA & HELPERS ---

const firstNames = ["LeBron", "Kevin", "Stephen", "James", "Anthony", "Kawhi", "Giannis", "Luka", "Nikola", "Joel", "Damian", "Jayson", "Devin", "Zion", "Ja"];
const lastNames = ["James", "Durant", "Curry", "Harden", "Davis", "Leonard", "Antetokounmpo", "Dončić", "Jokić", "Embiid", "Lillard", "Tatum", "Booker", "Williamson", "Morant"];

// Generates a roster of 15 unique players, highlighting the first 5
const generateRoster = (teamName) => {
    const roster = [];
    const usedNames = new Set();
    while (roster.length < 15) {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const fullName = `${fName} ${lName}`;
        if (!usedNames.has(fullName)) {
            usedNames.add(fullName);
            roster.push({
                id: `${teamName}-${roster.length + 1}`,
                number: Math.floor(Math.random() * 100),
                name: fName,
                surname: lName,
                isOnCourt: roster.length < 5, // Highlight the first 5 players
                ...createInitialPlayerStats(),
            });
        }
    }
    return roster;
};

const formatStat = (made, attempted) => `${made}-${attempted}`;

const createInitialPlayerStats = () => ({
    min: 0, '2pt_m': 0, '2pt_a': 0, '3pt_m': 0, '3pt_a': 0, ftm: 0, fta: 0,
    oreb: 0, dreb: 0, reb: 0, ast: 0, stl: 0, blk: 0, 
    to: 0, pf: 0, plusMinus: 0, pts: 0,
});


// --- Components ---

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={styles.screen}>
      <h1 style={{...styles.title, color: styles.colors.primary}}>CourtSide AI Logger</h1>
      <p style={{...styles.subtitle, marginBottom: '40px'}}>The future of game analysis is here.</p>
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button style={styles.button} onClick={onLogin}>
        Sign In
      </button>
    </div>
  );
};

const HomeScreen = ({ matches, onSelectMatch, onAddMatch, onCloneMatch, onDeleteMatch }) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [cloneModalVisible, setCloneModalVisible] = useState(false);
  const [matchToClone, setMatchToClone] = useState(null);

  const [newMatchDate, setNewMatchDate] = useState(new Date().toISOString().slice(0, 10));
  const [newTeam1Name, setNewTeam1Name] = useState('');
  const [newTeam2Name, setNewTeam2Name] = useState('');

  const openAddModal = () => {
      setNewMatchDate(new Date().toISOString().slice(0, 10));
      setNewTeam1Name('');
      setNewTeam2Name('');
      setAddModalVisible(true);
  };
  
  const openCloneModal = (match) => {
      setMatchToClone(match);
      setNewMatchDate(new Date().toISOString().slice(0, 10));
      setNewTeam1Name(match.boxScore.teamA.name);
      setNewTeam2Name(match.boxScore.teamB.name);
      setCloneModalVisible(true);
  };

  const handleAdd = () => {
    if (newTeam1Name.trim() && newTeam2Name.trim() && newMatchDate) {
      onAddMatch(newMatchDate, newTeam1Name, newTeam2Name);
      setAddModalVisible(false);
    } else {
        alert("Please fill out all fields.");
    }
  };

  const handleClone = () => {
    if (matchToClone && newMatchDate) {
        onCloneMatch(matchToClone.id, newMatchDate);
        setCloneModalVisible(false);
    }
  };

  const handleDelete = (matchId, matchName) => {
    if (window.confirm(`Are you sure you want to permanently delete the match: "${matchName}"?`)) {
        onDeleteMatch(matchId);
    }
  };


  return (
    <div style={styles.screen}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <h1 style={{...styles.title, marginBottom: 0}}>My Matches</h1>
        <button style={{...styles.button, width: 'auto', padding: '10px 15px'}} onClick={openAddModal}>
            + New Match
        </button>
      </div>
      
      <div style={styles.tabContainer}>
        {matches.map(item => (
          <div key={item.id} style={styles.tab}>
            <div style={{flex: 1, cursor: 'pointer'}} onClick={() => onSelectMatch(item)}>
                <h2 style={styles.tabTitle}>{item.name}</h2>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
                 <button title="Clone Match" style={{...styles.iconButton, backgroundColor: styles.colors.secondary}} onClick={(e) => { e.stopPropagation(); openCloneModal(item); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4zM2 4a1 1 0 0 1 1-1h1v10a2 2 0 0 0 2 2h5a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2H3a1 1 0 0 1-1 1z"/></svg>
                </button>
                <button title="Erase Match" style={{...styles.iconButton, backgroundColor: styles.colors.danger}} onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.name); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                </button>
            </div>
          </div>
        ))}
         {matches.length === 0 && <p style={{width: '100%', textAlign: 'center', marginTop: '40px', color: styles.colors.textSecondary}}>No matches yet. Add one to get started!</p>}
      </div>
     
      {addModalVisible && (
        <div style={styles.modalContainer}>
          <div style={styles.modalView}>
            <h2 style={styles.modalText}>Create New Match</h2>
            <input type="date" style={styles.input} value={newMatchDate} onChange={(e) => setNewMatchDate(e.target.value)} />
            <input style={styles.input} onChange={(e) => setNewTeam1Name(e.target.value)} value={newTeam1Name} placeholder="Home Team Name" />
            <input style={styles.input} onChange={(e) => setNewTeam2Name(e.target.value)} value={newTeam2Name} placeholder="Away Team Name" />
            <button style={styles.button} onClick={handleAdd}>Create Match</button>
            <button style={{...styles.button, ...styles.secondaryButton}} onClick={() => setAddModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}

      {cloneModalVisible && (
        <div style={styles.modalContainer}>
          <div style={styles.modalView}>
            <h2 style={styles.modalText}>Clone Match</h2>
            <p style={{color: styles.colors.textSecondary, marginBottom: '20px', textAlign: 'center'}}>Create a new match using the rosters from "{matchToClone?.name}".</p>
            <label style={styles.inputLabel}>New Match Date</label>
            <input type="date" style={styles.input} value={newMatchDate} onChange={(e) => setNewMatchDate(e.target.value)} />
            <button style={styles.button} onClick={handleClone}>Create Cloned Match</button>
            <button style={{...styles.button, ...styles.secondaryButton}} onClick={() => setCloneModalVisible(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GEMINI API INTEGRATION ---
const GeminiAnalysisModal = ({ show, onClose, boxScore, matchName }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState("");

    // Function to format the box score into a string for the prompt
    const formatBoxScoreForPrompt = () => {
        let promptData = `Match: ${matchName}\n\n`;
        const teams = [boxScore.teamA, boxScore.teamB];
        teams.forEach(team => {
            promptData += `Team: ${team.name}\n`;
            let teamTotals = createInitialPlayerStats();
            team.roster.forEach(p => {
                promptData += `- Player #${p.number} ${p.name} ${p.surname}: ${p.pts} PTS, ${p.reb} REB, ${p.ast} AST\n`;
                Object.keys(teamTotals).forEach(key => typeof teamTotals[key] === 'number' && (teamTotals[key] += p[key]));
            });
            promptData += `Total Score: ${teamTotals.pts}\n\n`;
        });
        return promptData;
    };

    const handleAnalysisRequest = async (analysisType) => {
        setIsLoading(true);
        setAnalysis("");
        const boxScoreData = formatBoxScoreForPrompt();
        let prompt = "";

        switch (analysisType) {
            case 'summary':
                prompt = `Based on the following basketball box score data, please provide a concise, narrative-style game summary. Mention the final score and key team performances.\n\n${boxScoreData}`;
                break;
            case 'teamA':
                prompt = `Analyze the performance of ${boxScore.teamA.name} based on this box score. What were their strengths and weaknesses in this game?\n\n${boxScoreData}`;
                break;
            case 'teamB':
                prompt = `Analyze the performance of ${boxScore.teamB.name} based on this box score. What were their strengths and weaknesses in this game?\n\n${boxScoreData}`;
                break;
            case 'mvp':
                prompt = `Based on the box score, identify the most valuable player (MVP) for each team and briefly explain why, citing their key statistics.\n\n${boxScoreData}`;
                break;
            default:
                setIsLoading(false);
                return;
        }

        try {
            const apiKey = ""; // Keep this empty as per instructions
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const payload = {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                setAnalysis(result.candidates[0].content.parts[0].text);
            } else {
                setAnalysis("Could not get a valid response from the AI.");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setAnalysis("An error occurred while contacting the AI. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!show) return null;

    return (
        <div style={styles.modalContainer}>
            <div style={{...styles.modalView, maxWidth: '600px'}}>
                <h2 style={styles.modalText}>✨ Game Insights with Gemini</h2>
                <div style={styles.geminiActions}>
                    <button style={styles.geminiButton} onClick={() => handleAnalysisRequest('summary')}>Game Summary</button>
                    <button style={styles.geminiButton} onClick={() => handleAnalysisRequest('teamA')}>Analyze {boxScore.teamA.name}</button>
                    <button style={styles.geminiButton} onClick={() => handleAnalysisRequest('teamB')}>Analyze {boxScore.teamB.name}</button>
                    <button style={styles.geminiButton} onClick={() => handleAnalysisRequest('mvp')}>Key Players</button>
                </div>
                <div style={styles.geminiResponseArea}>
                    {isLoading ? <div style={styles.loader}></div> : <p style={{whiteSpace: 'pre-wrap', fontFamily: 'monospace'}}>{analysis}</p>}
                </div>
                <button style={{...styles.button, ...styles.secondaryButton}} onClick={() => { setAnalysis(""); onClose(); }}>Close</button>
            </div>
        </div>
    );
};


const StatAdjuster = ({ value, onAdjust }) => (
    <div style={styles.statAdjuster}>
        <button onClick={() => onAdjust(-1)} style={styles.adjustButton}>-</button>
        <span style={styles.statValue}>{value}</span>
        <button onClick={() => onAdjust(1)} style={styles.adjustButton}>+</button>
    </div>
);


const MatchScreen = ({ match, onBack, onUpdateMatch }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [geminiModalVisible, setGeminiModalVisible] = useState(false);
  const [editableBoxScore, setEditableBoxScore] = useState(JSON.parse(JSON.stringify(match.boxScore)));

  const teamARef = useRef(null);
  const teamBRef = useRef(null);

  useEffect(() => {
    setEditableBoxScore(JSON.parse(JSON.stringify(match.boxScore)));
  }, [match]);

  const handleRosterChange = (team, index, field, value) => {
    const newBoxScore = JSON.parse(JSON.stringify(editableBoxScore));
    newBoxScore[team].roster[index][field] = value;
    setEditableBoxScore(newBoxScore);
  };
  
  const handleStatAdjustment = (teamKey, playerIndex, stat, delta) => {
      setEditableBoxScore(prev => {
          const newBoxScore = JSON.parse(JSON.stringify(prev));
          const player = newBoxScore[teamKey].roster[playerIndex];
          
          if (typeof player[stat] === 'number') {
              player[stat] = Math.max(0, player[stat] + delta); // Prevent negative stats
          }
          // Recalculate derived stats
          player.reb = player.oreb + player.dreb;
          onUpdateMatch(match.id, newBoxScore);
          return newBoxScore;
      });
  };

  const toggleEditMode = () => {
      if (isEditMode) {
          onUpdateMatch(match.id, editableBoxScore);
      }
      setIsEditMode(!isEditMode);
  };

  const calculateTeamTotals = (roster) => {
    const totals = createInitialPlayerStats();
    for (const player of roster) {
        Object.keys(totals).forEach(key => typeof player[key] === 'number' && (totals[key] += player[key]));
    }
    return totals;
  };

  const renderTeamTable = (teamData, teamKey, teamColor) => {
    const tableHead = ['#', 'First Name', 'Surname', 'MIN', '2PT', '3PT', 'FT', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TO', 'PF', '+/-', 'PTS'];
    const teamTotals = calculateTeamTotals(teamData.roster);
    const onCourtHighlightStyle = { backgroundColor: teamColor.replace(')', ', 0.2)').replace('rgb', 'rgba') };
    
    return (
        <div ref={teamKey === 'teamA' ? teamARef : teamBRef} style={{marginBottom: '30px'}}>
            <h3 style={{...styles.teamTableName, borderBottomColor: teamColor, color: teamColor}}>{teamData.name}</h3>
            <div style={{...styles.boxScoreContainer, overflowX: 'auto', width: '100%'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>{tableHead.map((h, i) => <th key={h} style={{...styles.tableHead, ...(i < 3 ? styles.playerInfoHead : {}), ...((i < 3) && styles.stickyCol) }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {teamData.roster.map((player, index) => (
                            <tr key={player.id} style={player.isOnCourt ? {...styles.tableRow, ...onCourtHighlightStyle} : styles.tableRow}>
                                <td style={{...styles.tableCell, ...styles.stickyCol, left: 0, backgroundColor: 'inherit'}}>
                                    {isEditMode ? <input type="text" value={player.number} onChange={e => handleRosterChange(teamKey, index, 'number', e.target.value)} style={styles.editInput} /> : player.number}
                                </td>
                                <td style={{...styles.tableCell, ...styles.stickyCol, left: '50px', textAlign: 'left', backgroundColor: 'inherit'}}>
                                    {isEditMode ? <input type="text" value={player.name} onChange={e => handleRosterChange(teamKey, index, 'name', e.target.value)} style={styles.editInput} /> : player.name}
                                </td>
                                <td style={{...styles.tableCell, ...styles.stickyCol, left: '150px', textAlign: 'left', backgroundColor: 'inherit'}}>
                                    {isEditMode ? <input type="text" value={player.surname} onChange={e => handleRosterChange(teamKey, index, 'surname', e.target.value)} style={styles.editInput} /> : player.surname}
                                </td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.min} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'min', d)} /> : player.min}</td>
                                <td style={styles.tableCell}>{formatStat(player['2pt_m'], player['2pt_a'])}</td>
                                <td style={styles.tableCell}>{formatStat(player['3pt_m'], player['3pt_a'])}</td>
                                <td style={styles.tableCell}>{formatStat(player.ftm, player.fta)}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.oreb} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'oreb', d)} /> : player.oreb}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.dreb} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'dreb', d)} /> : player.dreb}</td>
                                <td style={styles.tableCell}>{player.reb}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.ast} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'ast', d)} /> : player.ast}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.stl} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'stl', d)} /> : player.stl}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.blk} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'blk', d)} /> : player.blk}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.to} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'to', d)} /> : player.to}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.pf} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'pf', d)} /> : player.pf}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.plusMinus} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'plusMinus', d)} /> : player.plusMinus}</td>
                                <td style={styles.tableCell}>{player.pts}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={styles.tableTotalRow}>
                            <td style={{...styles.tableCell, ...styles.stickyCol, left: 0, fontWeight: 'bold'}}></td>
                            <td colSpan="2" style={{...styles.tableCell, ...styles.stickyCol, left: '50px', textAlign: 'left', fontWeight: 'bold'}}>TEAM TOTALS</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.min}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{formatStat(teamTotals['2pt_m'], teamTotals['2pt_a'])}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{formatStat(teamTotals['3pt_m'], teamTotals['3pt_a'])}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{formatStat(teamTotals.ftm, teamTotals.fta)}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.oreb}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.dreb}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.reb}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.ast}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.stl}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.blk}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.to}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.pf}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.plusMinus}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.pts}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
  };
  
  const scrollToTeam = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div style={{...styles.screen, padding: '10px 20px'}}>
      <GeminiAnalysisModal show={geminiModalVisible} onClose={() => setGeminiModalVisible(false)} boxScore={editableBoxScore} matchName={match.name} />
      <button onClick={onBack} style={{...styles.button, alignSelf: 'flex-start', marginBottom: '10px', width: 'auto', padding: '10px 20px'}}> &larr; Back to Matches</button>
      <h1 style={styles.title}>{match.name}</h1>
      
      <div style={{...styles.controlsContainer, justifyContent: 'space-between', borderTop: `1px solid ${styles.colors.border}`, borderBottom: `1px solid ${styles.colors.border}`, padding: '10px 0', marginTop: '10px'}}>
        <div>
            <span style={{marginRight: '10px', alignSelf: 'center', color: styles.colors.textSecondary}}>Jump to:</span>
            <button style={{...styles.button, width: 'auto', padding: '8px 15px', backgroundColor: styles.colors.teamAColor}} onClick={() => scrollToTeam(teamARef)}>{editableBoxScore.teamA.name}</button>
            <button style={{...styles.button, width: 'auto', padding: '8px 15px', backgroundColor: styles.colors.teamBColor}} onClick={() => scrollToTeam(teamBRef)}>{editableBoxScore.teamB.name}</button>
        </div>
        <div>
            <button style={{...styles.button, width: 'auto', padding: '8px 15px', backgroundColor: isEditMode ? styles.colors.primaryLight : styles.colors.secondary}} onClick={toggleEditMode}>{isEditMode ? 'Save Roster' : 'Edit Roster'}</button>
            <button style={{...styles.button, width: 'auto', padding: '8px 15px', backgroundColor: styles.colors.gemini}} onClick={() => setGeminiModalVisible(true)}>✨ Ask Gemini</button>
        </div>
      </div>
      
      <div style={{width: '100%', flex: 1, overflowY: 'auto', paddingTop: '20px'}}>
          {renderTeamTable(editableBoxScore.teamA, 'teamA', styles.colors.teamAColor)}
          {renderTeamTable(editableBoxScore.teamB, 'teamB', styles.colors.teamBColor)}
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login'); // Login, Home, Match
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Load matches from localStorage on initial render
  useEffect(() => {
      try {
        const savedMatches = localStorage.getItem('basketballMatches');
        if (savedMatches) {
            setMatches(JSON.parse(savedMatches));
        }
      } catch (error) {
          console.error("Could not load matches from localStorage", error);
      }
  }, []);

  // Save matches to localStorage whenever they change
  useEffect(() => {
      try {
        localStorage.setItem('basketballMatches', JSON.stringify(matches));
      } catch (error) {
        console.error("Could not save matches to localStorage", error);
      }
  }, [matches]);

  const handleLogin = () => setCurrentScreen('Home');
  
  const handleAddMatch = (date, team1, team2) => {
    const newMatch = { id: Date.now().toString(), name: `${team1} vs ${team2} - ${date}`, boxScore: { teamA: { name: team1, roster: generateRoster(team1) }, teamB: { name: team2, roster: generateRoster(team2) } } };
    setMatches(prev => [...prev, newMatch]);
  };

  const handleCloneMatch = (sourceMatchId, newDate) => {
      const sourceMatch = matches.find(m => m.id === sourceMatchId);
      if (!sourceMatch) return;

      const resetRoster = (roster) => roster.map(player => ({
          ...player,
          ...createInitialPlayerStats() // Reset all stats
      }));

      const newMatch = {
          id: Date.now().toString(),
          name: `${sourceMatch.boxScore.teamA.name} vs ${sourceMatch.boxScore.teamB.name} - ${newDate}`,
          boxScore: {
              teamA: { ...sourceMatch.boxScore.teamA, roster: resetRoster(sourceMatch.boxScore.teamA.roster) },
              teamB: { ...sourceMatch.boxScore.teamB, roster: resetRoster(sourceMatch.boxScore.teamB.roster) }
          }
      };
      setMatches(prev => [...prev, newMatch]);
  };
  
  const handleDeleteMatch = (matchId) => {
      if (selectedMatch?.id === matchId) {
          handleBackToHome();
      }
      setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const handleUpdateMatch = (matchId, updatedBoxScore) => {
      setMatches(prevMatches => {
          const newMatches = prevMatches.map(m => 
              m.id === matchId ? { ...m, boxScore: updatedBoxScore } : m
          );
          if (selectedMatch?.id === matchId) {
              const newSelectedMatch = newMatches.find(m => m.id === matchId);
              if (newSelectedMatch) {
                setSelectedMatch(newSelectedMatch);
              }
          }
          return newMatches;
      });
  };

  const handleSelectMatch = (match) => { 
      setSelectedMatch(match); 
      setCurrentScreen('Match'); 
  };
  
  const handleBackToHome = () => { 
    setCurrentScreen('Home'); 
    setSelectedMatch(null); 
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login': return <LoginScreen onLogin={handleLogin} />;
      case 'Home': return <HomeScreen matches={matches} onSelectMatch={handleSelectMatch} onAddMatch={handleAddMatch} onCloneMatch={handleCloneMatch} onDeleteMatch={handleDeleteMatch} />;
      case 'Match': 
        if (!selectedMatch) return null; 
        return <MatchScreen match={selectedMatch} onBack={handleBackToHome} onUpdateMatch={handleUpdateMatch} />;
      default: return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return <div style={styles.appContainer}>{renderScreen()}</div>;
}

// --- Styles ---
const styles = {
  colors: {
    primary: '#007AFF', primaryLight: '#5856D6', secondary: '#8E8E93',
    background: '#F2F2F7', textPrimary: '#000000', textSecondary: '#3C3C4399',
    border: '#C6C6C8', danger: '#FF3B30', warning: '#FF9500', white: '#ffffff',
    playerInfoBg: '#E5E5EA',
    gemini: '#FF9500', teamAColor: 'rgb(0, 122, 255)', teamBColor: 'rgb(52, 199, 89)'
  },
  appContainer: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", "Arial", sans-serif',
    width: '100%', maxWidth: '900px', margin: '10px auto',
    borderRadius: '16px', overflow: 'hidden', height: '95vh', display: 'flex', flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backgroundColor: '#F2F2F7'
  },
  screen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px',
    backgroundColor: '#F2F2F7', flex: 1, boxSizing: 'border-box', overflow: 'hidden',
  },
  title: {
    fontSize: '28px', fontWeight: '700', color: '#000000', marginBottom: '8px', textAlign: 'center',
  },
  subtitle: {
    fontSize: '17px', fontWeight: '400', color: '#3C3C4399', textAlign: 'center',
  },
  input: {
    marginBottom: '16px', padding: '14px', width: '100%', boxSizing: 'border-box',
    borderRadius: '10px', border: '1px solid #C6C6C8', fontSize: '16px', backgroundColor: '#FFFFFF'
  },
  inputLabel: {
    alignSelf: 'flex-start', marginBottom: '4px', color: '#3C3C4399', fontSize: '14px',
  },
  editInput: {
    width: '100%', border: '1px solid #007AFF', borderRadius: '4px', padding: '4px',
    backgroundColor: 'rgba(0, 122, 255, 0.05)'
  },
  button: {
    backgroundColor: '#007AFF', color: '#ffffff', fontWeight: '600', padding: '14px 20px',
    borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', flexShrink: 0,
    transition: 'background-color 0.2s ease, transform 0.1s ease', margin: '0 5px'
  },
  secondaryButton: {
    backgroundColor: '#E5E5EA', color: '#000000', marginTop: '10px'
  },
  iconButton: {
    backgroundColor: '#E5E5EA', color: '#3C3C43', borderRadius: '50%',
    width: '36px', height: '36px', padding: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  },
  tabContainer: { width: '100%', flex: 1, overflowY: 'auto', marginTop: '20px' },
  tab: {
    marginBottom: '12px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', border: '1px solid #E5E5EA',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  tabTitle: { margin: 0, fontSize: '18px', color: '#000000', fontWeight: '600' },
  modalContainer: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    backgroundColor: '#F2F2F7', borderRadius: '16px', padding: '24px',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)', width: '90%', maxWidth: '400px', boxSizing: 'border-box'
  },
  modalText: {
    marginBottom: '20px', textAlign: 'center', fontSize: '22px', color: '#000000', fontWeight: '600'
  },
  controlsContainer: {
    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px', width: '100%',
  },
  transcriptionBox: {
    width: '100%', padding: '15px', marginTop: '10px', backgroundColor: '#ffffff',
    borderRadius: '12px', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid #E5E5EA'
  },
  transcriptionText: { fontStyle: 'italic', color: '#3C3C43', fontSize: '16px', },
  boxScoreContainer: { width: '100%', flex: 1, },
  teamTableName: {
    fontSize: '22px', paddingBottom: '8px', marginBottom: '12px', fontWeight: '700'
  },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 2px', fontSize: '14px', whiteSpace: 'nowrap', },
  tableHead: {
    backgroundColor: '#E5E5EA', color: '#3C3C43', padding: '12px 8px', position: 'sticky', top: 0, zIndex: 10,
    fontWeight: '600', border: 'none'
  },
  playerInfoHead: { backgroundColor: '#D1D1D6', },
  tableCell: { borderBottom: '1px solid #E5E5EA', padding: '12px 8px', textAlign: 'center', },
  tableRow: { backgroundColor: '#ffffff', transition: 'background-color 0.2s ease', },
  onCourtRow: { backgroundColor: 'inherit' }, // Base style, overridden by dynamic style
  tableTotalRow: { backgroundColor: '#E5E5EA', fontWeight: '700' },
  stickyCol: { position: 'sticky', zIndex: 5, backgroundColor: 'inherit' },
  geminiActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%'},
  geminiButton: {
      backgroundColor: '#FF9500', color: 'white', border: 'none', padding: '12px',
      borderRadius: '10px', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s'
  },
  geminiResponseArea: {
      width: '100%', minHeight: '150px', maxHeight: '40vh', overflowY: 'auto',
      backgroundColor: '#FFFFFF', border: '1px solid #E5E5EA', borderRadius: '12px',
      padding: '15px', marginTop: '20px', boxSizing: 'border-box'
  },
  loader: {
      border: '4px solid #f3f3f3', borderTop: '4px solid #FF9500',
      borderRadius: '50%', width: '30px', height: '30px',
      animation: 'spin 1s linear infinite', margin: '20px auto'
  },
  statAdjuster: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  adjustButton: {
      border: '1px solid #C6C6C8', borderRadius: '50%', width: '24px', height: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#fff', cursor: 'pointer', color: '#3C3C43', fontSize: '16px'
  },
  statValue: { minWidth: '20px', textAlign: 'center', fontWeight: '500' }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  button:hover { filter: brightness(0.9); }
  button:active { transform: scale(0.98); }
  .geminiButton:hover { background-color: #f39c12 !important; }
  .tab:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
  .tableRow:hover { background-color: #E5E5EA; }
  .tableRow:hover .stickyCol { background-color: #E5E5EA !important; }
  tr.onCourtRow:hover { background-color: inherit !important; filter: brightness(0.95); }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);
