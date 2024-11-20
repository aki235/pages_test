import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  InputBase,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const WordPredictionQuiz = () => {
  const [text, setText] = useState('');
  const [words, setWords] = useState([]);
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(3);
  const [userInput, setUserInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [quizMode, setQuizMode] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const splitIntoSentences = (text) => {
    const sentenceRegex = /[^.!?]+[.!?]+/g;
    return text.match(sentenceRegex) || [text];
  };

  const handleTextSubmit = () => {
    const wordArray = text.trim().split(/\s+/);
    setWords(wordArray);
    
    const sentencesArray = splitIntoSentences(text);
    const wordsBySentence = sentencesArray.map(sentence => 
      sentence.trim().split(/\s+/)
    );
    setSentences(wordsBySentence);
    
    setAnswers(new Array(wordArray.length).fill(null));
    setGameStarted(true);
  };

  const normalizeWord = (word) => {
    return word.toLowerCase().trim().replace(/[.,!?]$/, '');
  };

  const handleAnswer = () => {
    const correctWord = normalizeWord(words[currentIndex]);
    const userWord = normalizeWord(userInput);
    const isCorrect = userWord === correctWord;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = isCorrect;
    setAnswers(newAnswers);
    
    setCurrentIndex(currentIndex + 1);
    if (currentIndex < words.length - 1) {
      setUserInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  const getWordHint = (word) => {
    if (!word) return '';
    const effectiveWord = normalizeWord(word);
    const firstLetter = word[0];
    return `${firstLetter}${'_'.repeat(effectiveWord.length - 1)}`;
  };

  const WordChip = ({ word, isInitial, isCorrect = null }) => {
    let backgroundColor = '#f5f5f5';
    let textColor = 'inherit';

    if (isInitial) {
      backgroundColor = '#f5f5f5';
    } else if (isCorrect === true) {
      backgroundColor = '#4caf50';
      textColor = 'white';
    } else if (isCorrect === false) {
      backgroundColor = '#f44336';
      textColor = 'white';
    }

    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: '16px',
          backgroundColor,
          color: textColor,
          margin: '2px',
          height: '32px',
          fontSize: '1rem',
        }}
      >
        {word}
      </Box>
    );
  };

  const SettingsModal = () => (
    <Dialog 
      open={settingsOpen} 
      onClose={() => setSettingsOpen(false)}
      PaperProps={{
        sx: { minWidth: '300px' }
      }}
    >
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Quiz Mode</Typography>
          <RadioGroup
            value={quizMode}
            onChange={(e) => setQuizMode(Number(e.target.value))}
          >
            <FormControlLabel 
              value={1} 
              control={<Radio />} 
              label="Default"
            />
            <FormControlLabel 
              value={2} 
              control={<Radio />} 
              label="Show Full Text"
            />
          </RadioGroup>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const FullTextDisplay = () => {
    const currentSentenceIndex = getCurrentSentenceIndex();

    const fullText = sentences.map((sentence, index) => {
      const text = sentence.join(' ');
      if (index === currentSentenceIndex) {
        return (
          <span 
            key={index}
            style={{
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              borderRadius: '4px',
              padding: '2px 4px',
            }}
          >
            {text}
          </span>
        );
      }
      return <span key={index}>{text} </span>;
    });

    return (
      <Card
        variant="outlined"
        sx={{ 
          height: '100%',
          width: '100%',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            sx={{
              lineHeight: 1.8,
              '& > span': {
                transition: 'background-color 0.3s',
              }
            }}
          >
            {fullText}
          </Typography>
        </Box>
      </Card>
    );
  };

  const getCurrentSentenceIndex = () => {
    let wordCount = 0;
    for (let i = 0; i < sentences.length; i++) {
      wordCount += sentences[i].length;
      if (wordCount > currentIndex) {
        return i;
      }
    }
    return sentences.length - 1;
  };

  const DisplaySentences = () => {
    const currentSentenceIndex = getCurrentSentenceIndex();
      
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sentences.slice(0, currentSentenceIndex + 1).map((sentence, sentenceIndex) => {
          let sentenceStartIndex = sentences.slice(0, sentenceIndex).reduce(
            (sum, s) => sum + s.length, 0
          );
          
          return (
            <Card 
              key={sentenceIndex} 
              variant="outlined"
              sx={{ 
                p: 2,
                bgcolor: 'background.paper',
                boxShadow: 1
              }}
            >
              <Box
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  alignItems: 'center'
                }}
              >
                {sentence.map((word, wordIndex) => {
                  const globalWordIndex = sentenceStartIndex + wordIndex;
                  
                  if (globalWordIndex < 3) {
                    return (
                      <WordChip 
                        key={wordIndex} 
                        word={word} 
                        isInitial={true} 
                      />
                    );
                  } else if (globalWordIndex < currentIndex) {
                    return (
                      <WordChip 
                        key={wordIndex} 
                        word={word} 
                        isCorrect={answers[globalWordIndex]} 
                      />
                    );
                  }
                  return null;
                })}
                
                {sentenceIndex === currentSentenceIndex && 
                 sentenceStartIndex + sentence.length > currentIndex && 
                 currentIndex < words.length && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 1,
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <InputBase
                      placeholder={getWordHint(words[currentIndex])}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      sx={{
                        flex: 1,
                        maxWidth: '300px',
                        height: '38px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '16px',
                        padding: '0 16px',
                        fontSize: '1rem',
                        '&.Mui-focused': {
                          backgroundColor: '#f0f0f0',
                        }
                      }}
                      autoFocus
                    />
                    <Button 
                      variant="contained"
                      onClick={handleAnswer}
                      disabled={!userInput.trim()}
                      size="small"
                      sx={{ 
                        height: '38px',
                        minWidth: 'auto',
                        borderRadius: '16px',
                        padding: '0 16px',
                      }}
                    >
                      Check
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    );
  };

  const isQuizCompleted = currentIndex >= words.length;

  return (
    <Box sx={{ 
      width: '90%', 
      maxWidth: '1200px',
      margin: 'auto',
      height: 'calc(100vh - 40px)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4,
        flexShrink: 0
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#1976d2'
          }}
        >
          BERT-English
        </Typography>
      </Box>

      {/* デバッグ用 */}
      {/* <Box 
        sx={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          fontFamily: 'monospace',
          zIndex: 1000
        }}
      >
        currentIndex: {currentIndex}<br />
        words.length: {words.length}<br />
        mode: {quizMode}
      </Box> */}

      {gameStarted && (
        <IconButton 
          onClick={() => setSettingsOpen(true)}
          sx={{ 
            position: 'fixed',
            left: 20,
            bottom: 20,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': {
              bgcolor: 'background.paper',
            },
            zIndex: 1000,
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}

      <SettingsModal />
      
      {!gameStarted ? (
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                multiline
                rows={8}
                placeholder="Enter the text you want to practice..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '1.1rem',
                    lineHeight: '1.5'
                  }
                }}
              />
              <Button 
                variant="contained"
                onClick={handleTextSubmit}
                disabled={text.trim().split(/\s+/).length < 4}
                fullWidth
                size="large"
              >
                Start Quiz
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
<Box sx={{ 
  display: 'flex', 
  gap: 3, 
  flex: 1,
  minHeight: 0
}}>
  <Box sx={{ 
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',  // 左側もスクロール可能に
    pr: 2
  }}>
    <DisplaySentences />
    {isQuizCompleted && (
      <Card sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', mt: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          Quiz completed! 🎉
        </Typography>
      </Card>
    )}
  </Box>
  {quizMode === 2 && (
    <Box sx={{ 
      flex: 1,
      minHeight: 0,
      height: '100%',
    }}>
      <FullTextDisplay />
    </Box>
  )}
</Box>
      )}
    </Box>
  );
};

export default WordPredictionQuiz;