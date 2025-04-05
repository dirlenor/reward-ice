"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const LocalCafe_1 = __importDefault(require("@mui/icons-material/LocalCafe"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const supabase_1 = require("./lib/supabase");
const theme = (0, material_1.createTheme)({
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
    const [phoneNumber, setPhoneNumber] = (0, react_1.useState)('');
    const [points, setPoints] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [openDialog, setOpenDialog] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)('');
    const [showSnackbar, setShowSnackbar] = (0, react_1.useState)(false);
    const handlePhoneNumberChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= 10) {
            setPhoneNumber(value);
        }
    };
    const handleCheckPoints = () => __awaiter(this, void 0, void 0, function* () {
        if (phoneNumber.length !== 10) {
            setMessage('กรุณากรอกเบอร์มือถือให้ครบ 10 หลัก');
            setShowSnackbar(true);
            return;
        }
        setLoading(true);
        try {
            const { data: record, error } = yield supabase_1.supabase
                .from('points')
                .select('points')
                .eq('phone_number', phoneNumber)
                .single();
            if (error) {
                if (error.code === 'PGRST116') { // ไม่พบข้อมูล
                    setPoints(0);
                }
                else {
                    throw error;
                }
            }
            else if (record) {
                setPoints(record.points);
            }
            setOpenDialog(true);
        }
        catch (error) {
            console.error('Error:', error);
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            setShowSnackbar(true);
        }
        finally {
            setLoading(false);
        }
    });
    const handleAddPoint = () => __awaiter(this, void 0, void 0, function* () {
        if (phoneNumber.length !== 10) {
            setMessage('กรุณากรอกเบอร์มือถือให้ครบ 10 หลัก');
            setShowSnackbar(true);
            return;
        }
        setLoading(true);
        try {
            const { data: existingRecord, error: fetchError } = yield supabase_1.supabase
                .from('points')
                .select('points')
                .eq('phone_number', phoneNumber)
                .single();
            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }
            if (existingRecord) {
                const { error: updateError } = yield supabase_1.supabase
                    .from('points')
                    .update({
                    points: existingRecord.points + 1,
                    updated_at: new Date().toISOString()
                })
                    .eq('phone_number', phoneNumber);
                if (updateError)
                    throw updateError;
                setPoints(existingRecord.points + 1);
            }
            else {
                const { error: insertError } = yield supabase_1.supabase
                    .from('points')
                    .insert([{
                        phone_number: phoneNumber,
                        points: 1
                    }]);
                if (insertError)
                    throw insertError;
                setPoints(1);
            }
            setOpenDialog(true);
            setPhoneNumber('');
        }
        catch (error) {
            console.error('Error:', error);
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            setShowSnackbar(true);
        }
        finally {
            setLoading(false);
        }
    });
    const handleRedeemPoints = () => __awaiter(this, void 0, void 0, function* () {
        if (!points || points < 10) {
            setMessage('คุณมีแต้มไม่เพียงพอ');
            setShowSnackbar(true);
            return;
        }
        setLoading(true);
        try {
            const { error: updateError } = yield supabase_1.supabase
                .from('points')
                .update({
                points: points - 10,
                updated_at: new Date().toISOString()
            })
                .eq('phone_number', phoneNumber);
            if (updateError)
                throw updateError;
            setPoints(points - 10);
            setMessage('แลกแต้มสำเร็จ! กรุณารับน้ำที่เคาน์เตอร์');
            setOpenDialog(false);
        }
        catch (error) {
            console.error('Error:', error);
            setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }
        finally {
            setShowSnackbar(true);
            setLoading(false);
        }
    });
    return (<material_1.ThemeProvider theme={theme}>
      <material_1.CssBaseline />
      <material_1.Box sx={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: theme.palette.background.default,
            py: 6,
        }}>
        <material_1.Container maxWidth="sm" sx={{ px: 4 }}>
          <material_1.Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
        }}>
            {/* Logo */}
            <material_1.Box component="img" src="/images/icelogo.png" alt="Logo" sx={{
            width: 150,
            height: 150,
            objectFit: 'cover',
            borderRadius: '50%',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
        }}/>

            {/* Title */}
            <material_1.Typography variant="h4" sx={{
            fontWeight: 700,
            fontSize: '33px',
            letterSpacing: '-0.05em',
            color: '#000000',
        }}>
              สะสมแต้ม
            </material_1.Typography>

            {/* Phone Input Section */}
            <material_1.Box sx={{ width: '100%' }}>
              <material_1.Typography sx={{
            fontSize: '13px',
            letterSpacing: '-0.03em',
            mb: 1,
            color: '#000000',
            fontWeight: 500,
        }}>
                ใส่เบอร์มือถือลูกค้า
              </material_1.Typography>
              <material_1.TextField fullWidth value={phoneNumber} onChange={handlePhoneNumberChange} disabled={loading} inputProps={{
            maxLength: 10,
            pattern: '[0-9]*',
        }} sx={{
            '& .MuiOutlinedInput-root': {
                border: '1px solid #AAAAAA',
                transition: 'border-color 0.3s',
                '&:focus-within': {
                    border: '2px solid #FF0000',
                }
            }
        }}/>
            </material_1.Box>

            {/* Buttons */}
            <material_1.Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <material_1.Button fullWidth className="search-button" onClick={handleCheckPoints} disabled={loading}>
                {loading ? <material_1.CircularProgress size={24}/> : 'ค้นหา'}
              </material_1.Button>

              <material_1.Button fullWidth className="collect-button" onClick={handleAddPoint} disabled={loading}>
                {loading ? <material_1.CircularProgress size={24}/> : 'เพิ่มแต้ม'}
              </material_1.Button>

              <material_1.Button fullWidth className="clear-button" onClick={() => setPhoneNumber('')} disabled={loading} startIcon={<Delete_1.default sx={{ fontSize: 24 }}/>}>
                ล้างข้อมูล
              </material_1.Button>
            </material_1.Box>

            {/* Footer */}
            <material_1.Typography sx={{
            fontSize: '10px',
            letterSpacing: '0.06em',
            color: '#000000',
            mt: 4,
            opacity: 0.5,
        }}>
              Design by sixcat
            </material_1.Typography>
          </material_1.Box>
        </material_1.Container>

        {/* Dialog แสดงแต้มสะสม */}
        <material_1.Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <material_1.DialogTitle sx={{ textAlign: 'center' }}>แต้มสะสมของคุณ</material_1.DialogTitle>
          <material_1.DialogContent>
            <material_1.Box sx={{ textAlign: 'center', py: 2 }}>
              <material_1.Typography variant="h4" sx={{ color: '#FF0000', mb: 2 }}>
                {points} แต้ม
              </material_1.Typography>
              <material_1.Typography variant="body2" sx={{ color: '#666' }}>
                {points && points >= 10
            ? 'คุณสามารถแลกรับน้ำฟรี 1 แก้วได้แล้ว!'
            : `อีก ${10 - (points || 0)} แต้ม จะได้รับน้ำฟรี 1 แก้ว`}
              </material_1.Typography>
            </material_1.Box>
          </material_1.DialogContent>
          <material_1.DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            {points && points >= 10 && (<material_1.Button variant="contained" onClick={handleRedeemPoints} disabled={loading} startIcon={<LocalCafe_1.default />} sx={{
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: '#CC0000'
                }
            }}>
                แลกน้ำฟรี 1 แก้ว
              </material_1.Button>)}
            <material_1.Button onClick={() => setOpenDialog(false)} sx={{ color: '#000000' }}>ปิด</material_1.Button>
          </material_1.DialogActions>
        </material_1.Dialog>

        {/* Snackbar แสดงข้อความ */}
        <material_1.Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <material_1.Alert onClose={() => setShowSnackbar(false)} severity={message.includes('สำเร็จ') ? 'success' : 'error'} sx={{ width: '100%' }}>
            {message}
          </material_1.Alert>
        </material_1.Snackbar>
      </material_1.Box>
    </material_1.ThemeProvider>);
}
exports.default = App;
