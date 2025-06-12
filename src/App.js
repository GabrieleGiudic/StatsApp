import React, { useState, useEffect, useRef } from 'react';

// --- MOCK DATA & HELPERS ---

const generateRoster = (teamName) => {
    const roster = [];
    for (let i = 0; i < 15; i++) {
        roster.push({
            id: `${teamName}-${i + 1}`,
            number: Math.floor(Math.random() * 100),
            name: `Player ${i + 1}`,
            surname: `Surname ${i + 1}`,
            isOnCourt: i < 5, // Highlight the first 5 players
            ...createInitialPlayerStats(),
        });
    }
    return roster;
};

const formatStat = (made, attempted) => `${made}-${attempted}`;

const createInitialPlayerStats = () => ({
    min: 0, '2pt_m': 0, '2pt_a': 0, '3pt_m': 0, '3pt_a': 0, 'ft_m': 0, 'ft_a': 0,
    oreb: 0, dreb: 0, ast: 0, stl: 0, blk: 0, 
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


  return (
    <div style={styles.screen}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <h1 style={{...styles.title, marginBottom: 0}}>Games</h1>
        <button style={{...styles.button, width: 'auto', padding: '10px 15px'}} onClick={openAddModal}>
            + New Match
        </button>
      </div>
      
      <div style={styles.tabContainer}>
        {matches.map((item, index) => (
          <div key={item.id} style={styles.tab}>
            <div style={{flex: 1, cursor: 'pointer'}} onClick={() => onSelectMatch(item)}>
                <h2 style={styles.tabTitle}>{`Game ${index + 1}: ${item.name}`}</h2>
            </div>
            <div style={{display: 'flex', gap: '10px'}}>
                 <button title="Clone Match" style={{...styles.iconButton, backgroundColor: styles.colors.secondary}} onClick={(e) => { e.stopPropagation(); openCloneModal(item); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM7 4a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4zM2 4a1 1 0 0 1 1-1h1v10a2 2 0 0 0 2 2h5a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2H3a1 1 0 0 1-1 1z"/></svg>
                </button>
                <button title="Erase Match" style={{...styles.iconButton, backgroundColor: styles.colors.danger}} onClick={(e) => { e.stopPropagation(); onDeleteMatch(item.id); }}>
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
                promptData += `- Player #${p.number} ${p.name} ${p.surname}: ${p.pts} PTS, ${p.oreb + p.dreb} REB, ${p.ast} AST\n`;
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

  const handleRosterChange = (team, playerIndex, field, value) => {
    const newBoxScore = JSON.parse(JSON.stringify(editableBoxScore));
    newBoxScore[team].roster[playerIndex][field] = value;
    setEditableBoxScore(newBoxScore);
  };
  
  const handleStatAdjustment = (teamKey, playerIndex, stat, delta) => {
    // This function now correctly handles all stat adjustments
    setEditableBoxScore(prev => {
        const newBoxScore = JSON.parse(JSON.stringify(prev));
        const player = newBoxScore[teamKey].roster[playerIndex];

        // Specific logic for shot makes/attempts vs simple stats
        const makeAttemptRegex = /^(2pt|3pt|ft)_(m|a)$/;
        const statMatch = stat.match(makeAttemptRegex);

        if (statMatch) { // It's a shot make or attempt
            const shotType = statMatch[1];
            const fieldType = statMatch[2]; // 'm' or 'a'
            const makeKey = `${shotType}_m`;
            const attemptKey = `${shotType}_a`;
            
            if (fieldType === 'm') {
                const newMakes = player[makeKey] + delta;
                if (newMakes >= 0 && (delta > 0 || newMakes < player[attemptKey])) {
                    player[makeKey] = newMakes;
                    if (delta > 0) player[attemptKey]++; // Add an attempt when a make is added
                }
            } else { // fieldType === 'a'
                 const newAttempts = player[attemptKey] + delta;
                 if (newAttempts >= player[makeKey]) {
                     player[attemptKey] = newAttempts;
                 }
            }
        } else { // It's a simple stat
            if (typeof player[stat] === 'number') {
                const newValue = player[stat] + delta;
                player[stat] = Math.max(0, newValue);
            }
        }

        // Recalculate total points
        player.pts = (player['2pt_m'] * 2) + (player['3pt_m'] * 3) + player.ft_m;
        
        onUpdateMatch(match.id, newBoxScore);
        return newBoxScore;
    });
  };
  
  const handlePlayerActivationToggle = (teamKey, playerIndex) => {
    const newBoxScore = JSON.parse(JSON.stringify(editableBoxScore));
    const roster = newBoxScore[teamKey].roster;
    const player = roster[playerIndex];
    const currentlyOnCourt = roster.filter(p => p.isOnCourt).length;

    if (!player.isOnCourt && currentlyOnCourt >= 5) {
        alert("You can only have 5 players on the court.");
        return;
    }

    // Toggle status
    player.isOnCourt = !player.isOnCourt;

    // Re-sort the roster to move active players to the top
    roster.sort((a, b) => b.isOnCourt - a.isOnCourt);

    onUpdateMatch(match.id, newBoxScore);
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
  
   const handleExportCSV = () => {
        const headers = ['#', 'First Name', 'Surname', 'MIN', '2PT M', '2PT A', '3PT M', '3PT A', 'FT M', 'FT A', 'OREB', 'DREB', 'AST', 'STL', 'BLK', 'TO', 'PF', '+/-', 'PTS'];
        let csvContent = headers.join(",") + "\n";
        
        const teams = [editableBoxScore.teamA, editableBoxScore.teamB];

        teams.forEach(team => {
            csvContent += `"${team.name}"\n`; // Team Name Header
            team.roster.forEach(player => {
                const row = [
                    player.number, player.name, player.surname, player.min,
                    player['2pt_m'], player['2pt_a'],
                    player['3pt_m'], player['3pt_a'],
                    player.ft_m, player.ft_a,
                    player.oreb, player.dreb, player.ast, player.stl, player.blk,
                    player.to, player.pf, player.plusMinus, player.pts
                ];
                csvContent += row.map(val => `"${val}"`).join(",") + "\n";
            });

            const totals = calculateTeamTotals(team.roster);
            const totalsRow = [
                'TOTALS', '', '', totals.min, totals['2pt_m'], totals['2pt_a'],
                totals['3pt_m'], totals['3pt_a'], totals.ft_m, totals.ft_a,
                totals.oreb, totals.dreb, totals.ast, totals.stl, totals.blk,
                totals.to, totals.pf, totals.plusMinus, totals.pts
            ];
            csvContent += totalsRow.map(val => `"${val}"`).join(",") + "\n\n";
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${match.name.replace(/\s/g, '_')}_boxscore.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

  const renderTeamTable = (teamData, teamKey, teamColor) => {
    const tableHead = ['#', 'First Name', 'Surname', 'MIN', '2PT', '3PT', 'FT', 'OREB', 'DREB', 'AST', 'STL', 'BLK', 'TO', 'PF', '+/-', 'PTS'];
    const teamTotals = calculateTeamTotals(teamData.roster);
    const onCourtHighlightStyle = { backgroundColor: teamColor.replace(')', ', 0.2)').replace('rgb', 'rgba') };
    
    return (
        <div ref={teamKey === 'teamA' ? teamARef : teamBRef} style={{marginBottom: '30px'}}>
            <h3 style={{...styles.teamTableName, borderBottomColor: teamColor, color: teamColor}}>{teamData.name}</h3>
            <div style={{...styles.boxScoreContainer, overflowX: 'auto', width: '100%'}}>
                <table style={styles.table}>
                    <thead>
                        <tr>{tableHead.map((h, i) => <th key={h} style={{...styles.tableHead, ...(i > 0 && i < 3 ? styles.playerInfoHead : {}), ...(i === 0 && styles.stickyCol) }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                        {teamData.roster.map((player, index) => (
                            <tr key={player.id} className={player.isOnCourt ? "on-court-row" : "table-row"} style={player.isOnCourt ? onCourtHighlightStyle : {}}>
                                <td 
                                    className="sticky-col"
                                    style={{...styles.tableCell, ...styles.stickyCol, backgroundColor: 'inherit', cursor: isEditMode ? 'default' : 'pointer'}}
                                    onClick={() => !isEditMode && handlePlayerActivationToggle(teamKey, index)}
                                >
                                    {isEditMode ? <input type="text" value={player.number} onChange={e => handleRosterChange(teamKey, index, 'number', e.target.value)} style={styles.editInput} /> : player.number}
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'left'}}>
                                    {isEditMode ? <input type="text" value={player.name} onChange={e => handleRosterChange(teamKey, index, 'name', e.target.value)} style={styles.editInput} /> : player.name}
                                </td>
                                <td style={{...styles.tableCell, textAlign: 'left'}}>
                                    {isEditMode ? <input type="text" value={player.surname} onChange={e => handleRosterChange(teamKey, index, 'surname', e.target.value)} style={styles.editInput} /> : player.surname}
                                </td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.min} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'min', d)} /> : player.min}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player['2pt_m']} onAdjust={(d) => handleStatAdjustment(teamKey, index, '2pt_m', d)} /> : player['2pt_m']} - {!isEditMode ? <StatAdjuster value={player['2pt_a']} onAdjust={(d) => handleStatAdjustment(teamKey, index, '2pt_a', d)} /> : player['2pt_a']}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player['3pt_m']} onAdjust={(d) => handleStatAdjustment(teamKey, index, '3pt_m', d)} /> : player['3pt_m']} - {!isEditMode ? <StatAdjuster value={player['3pt_a']} onAdjust={(d) => handleStatAdjustment(teamKey, index, '3pt_a', d)} /> : player['3pt_a']}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.ft_m} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'ft_m', d)} /> : player.ft_m} - {!isEditMode ? <StatAdjuster value={player.ft_a} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'ft_a', d)} /> : player.ft_a}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.oreb} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'oreb', d)} /> : player.oreb}</td>
                                <td style={styles.tableCell}>{!isEditMode ? <StatAdjuster value={player.dreb} onAdjust={(d) => handleStatAdjustment(teamKey, index, 'dreb', d)} /> : player.dreb}</td>
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
                            <td className="sticky-col" style={{...styles.tableCell, ...styles.stickyCol, fontWeight: 'bold'}}></td>
                            <td colSpan="2" style={{...styles.tableCell, fontWeight: 'bold', textAlign: 'left'}}>TEAM TOTALS</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.min}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{formatStat(teamTotals['2pt_m'], teamTotals['2pt_a'])}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{formatStat(teamTotals['3pt_m'], teamTotals['3pt_a'])}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{formatStat(teamTotals.ft_m, teamTotals.ft_a)}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.oreb}</td>
                            <td style={{...styles.tableCell, fontWeight: 'bold'}}>{teamTotals.dreb}</td>
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
      <button onClick={onBack} style={{...styles.button, alignSelf: 'flex-start', marginBottom: '10px', width: 'auto', padding: '10px 20px'}}> &larr; Back to Games</button>
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
            <button style={{...styles.button, width: 'auto', padding: '8px 15px', backgroundColor: styles.colors.secondary}} onClick={handleExportCSV}>Export CSV</button>
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
      setMatches(prev => {
          const newMatches = prev.filter(m => m.id !== matchId);
          if (selectedMatch?.id === matchId) {
             setCurrentScreen("Home");
             setSelectedMatch(null);
          }
          return newMatches;
      });
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
  stickyCol: { position: 'sticky', left: 0, zIndex: 5 },
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
  .table-row:hover { background-color: #E5E5EA; }
  .table-row:hover .sticky-col { background-color: #E5E5EA !important; }
  .on-court-row:hover { background-color: inherit !important; filter: brightness(0.95); }
  .on-court-row:hover .sticky-col { background-color: inherit !important; filter: brightness(0.95); }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);
