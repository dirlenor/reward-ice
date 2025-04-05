import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Box, 
  Typography, 
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import { supabase } from './lib/supabase.ts';
import iceLogo from './assets/icelogo.png';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, Kanit, sans-serif',
  },
  palette: {
    primary: {
      main: '#62F08D', // Use 10 points button color
    },
    secondary: {
      main: '#A9F3D9', // Search button color
    },
    background: {
      default: '#EEEEEE',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '15px',
          letterSpacing: '0.02em',
          padding: '16px 20px',
          boxShadow: 'none',
          border: 'none',
          '&.search-button': {
            backgroundColor: 'transparent',
            color: '#000000',
            border: '1px solid #000000',
          },
          '&.collect-button': {
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
          },
          '&.clear-button': {
            backgroundColor: '#C7C7C7',
            color: '#000000',
          },
          '&.redeem-button': {
            backgroundColor: '#62F08D',
            color: '#000000',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #AAAAAA',
            boxShadow: 'none',
            transition: 'border-color 0.3s',
            '&:focus-within': {
              border: '2px solid #FF0000',
            },
            '& input': {
              fontSize: '44px',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              padding: '16px 20px',
              textAlign: 'center',
              '&::placeholder': {
                color: '#CCCCCC',
                opacity: 1,
              },
            },
            '& fieldset': {
              border: 'none',
            },
          },
        },
      },
    },
  },
});

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleCheckPoints = async () => {
    if (phoneNumber.length !== 10) {
      setMessage('กรุณากรอกเบอร์มือถือให้ครบ 10 หลัก');
      setShowSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const { data: record, error } = await supabase
        .from('points')
        .select('points')
        .eq('phone_number', phoneNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // ไม่พบข้อมูล
          setPoints(0);
        } else {
          throw error;
        }
      } else if (record) {
        setPoints(record.points);
      }
      setOpenDialog(true);
    } catch (error) {
      console.error('Error:', error);
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoint = async () => {
    if (phoneNumber.length !== 10) {
      setMessage('กรุณากรอกเบอร์มือถือให้ครบ 10 หลัก');
      setShowSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const { data: existingRecord, error: fetchError } = await supabase
        .from('points')
        .select('points')
        .eq('phone_number', phoneNumber)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingRecord) {
        const { error: updateError } = await supabase
          .from('points')
          .update({ 
            points: existingRecord.points + 1,
            updated_at: new Date().toISOString()
          })
          .eq('phone_number', phoneNumber);

        if (updateError) throw updateError;
        setPoints(existingRecord.points + 1);
      } else {
        const { error: insertError } = await supabase
          .from('points')
          .insert([{ 
            phone_number: phoneNumber,
            points: 1
          }]);

        if (insertError) throw insertError;
        setPoints(1);
      }
      setOpenDialog(true);
      setPhoneNumber('');
    } catch (error) {
      console.error('Error:', error);
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemPoints = async () => {
    if (!points || points < 10) {
      setMessage('คุณมีแต้มไม่เพียงพอ');
      setShowSnackbar(true);
      return;
    }
    setLoading(true);
    try {
      const { error: updateError } = await supabase
        .from('points')
        .update({ 
          points: points - 10,
          updated_at: new Date().toISOString()
        })
        .eq('phone_number', phoneNumber);

      if (updateError) throw updateError;
      
      setPoints(points - 10);
      setMessage('แลกแต้มสำเร็จ! กรุณารับน้ำที่เคาน์เตอร์');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error:', error);
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setShowSnackbar(true);
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
          py: 6,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'auto',
          '@media (max-width: 600px)': {
            py: 0,
            minHeight: '100dvh', // dynamic viewport height
          }
        }}
      >
        <Container 
          maxWidth="sm" 
          sx={{ 
            px: 4,
            '@media (max-width: 600px)': {
              px: 3,
              py: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              alignItems: 'center',
              '@media (max-width: 600px)': {
                flex: 1,
                justifyContent: 'space-between'
              }
            }}
          >
            {/* Logo */}
            <Box
              component="img"
              src={iceLogo}
              alt="Logo"
              sx={{
                width: 120,
                height: 120,
                objectFit: 'cover',
                borderRadius: '50%',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                fontSize: '33px',
                letterSpacing: '-0.05em',
                color: '#000000',
                marginTop: '16px'
              }}
            >
              สะสมแต้ม
            </Typography>

            {/* Phone Input Section */}
            <Box sx={{ width: '100%' }}>
              <Typography
                sx={{
                  fontSize: '13px',
                  letterSpacing: '-0.03em',
                  mb: 1,
                  color: '#000000',
                  fontWeight: 500,
                }}
              >
                ใส่เบอร์มือถือลูกค้า
              </Typography>
              <TextField
                fullWidth
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled={loading}
                inputProps={{
                  maxLength: 10,
                  pattern: '[0-9]*',
                  style: {
                    fontSize: '32px',
                    padding: '12px 16px',
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    border: '1px solid #AAAAAA',
                    transition: 'border-color 0.3s',
                    '&:focus-within': {
                      border: '2px solid #FF0000',
                    }
                  }
                }}
              />
            </Box>

            {/* Buttons */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Button
                fullWidth
                className="search-button"
                onClick={handleCheckPoints}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'ค้นหา'}
              </Button>

              <Button
                fullWidth
                className="collect-button"
                onClick={handleAddPoint}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'เพิ่มแต้ม'}
              </Button>

              <Button
                fullWidth
                className="clear-button"
                onClick={() => setPhoneNumber('')}
                disabled={loading}
                startIcon={<DeleteIcon sx={{ fontSize: 24 }} />}
              >
                ล้างข้อมูล
              </Button>
            </Box>

            {/* Footer */}
            <Typography
              sx={{
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: '#000000',
                mt: 4,
                opacity: 0.5,
              }}
            >
              Design by sixcat
            </Typography>
          </Box>
        </Container>

        {/* Dialog แสดงแต้มสะสม */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle sx={{ textAlign: 'center' }}>แต้มสะสมของคุณ</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" sx={{ color: '#FF0000', mb: 2 }}>
                {points} แต้ม
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {points && points >= 10 
                  ? 'คุณสามารถแลกรับน้ำฟรี 1 แก้วได้แล้ว!' 
                  : `อีก ${10 - (points || 0)} แต้ม จะได้รับน้ำฟรี 1 แก้ว`}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            {points && points >= 10 && (
              <Button
                variant="contained"
                onClick={handleRedeemPoints}
                disabled={loading}
                startIcon={<LocalCafeIcon />}
                sx={{ 
                  backgroundColor: '#FF0000',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#CC0000'
                  }
                }}
              >
                แลกน้ำฟรี 1 แก้ว
              </Button>
            )}
            <Button onClick={() => setOpenDialog(false)} sx={{ color: '#000000' }}>ปิด</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar แสดงข้อความ */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowSnackbar(false)} 
            severity={message.includes('สำเร็จ') ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App; 