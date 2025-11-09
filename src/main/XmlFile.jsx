import { useEffect, useState } from 'react';
import fetchOrThrow from '../common/util/fetchOrThrow';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Container,
  Snackbar,
  Alert,
  Box,
  Divider,
} from '@mui/material';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from '../settings/components/SettingsMenu';
import useSettingsStyles from '../settings/common/useSettingsStyles';

const XmlEditor = () => {
  const [xmlContent, setXmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { classes } = useSettingsStyles();

  const cardBg = 'rgba(2,12,27,0.5)';
  const borderColor = 'rgba(255,255,255,0.2)';
  const lineNumberColor = 'rgba(255,255,255,0.4)';
  const textColor = '#E6E6E6';

  useEffect(() => {
    const fetchXml = async () => {
      try {
        const response = await fetchOrThrow('/api/xml');
        const text = await response.text();
        setXmlContent(text);
      } catch (err) {
        setMessage({ text: err.message || 'Error fetching XML', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchXml();
  }, []);

  const handleCloseMessage = () => setMessage({ text: '', type: '' });

  const saveXml = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/xml', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: xmlContent,
      });
      const text = await response.text();
      setMessage({ text: text || 'Saved successfully', type: 'success' });
    } catch {
      setMessage({ text: 'Error saving XML', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography sx={{ color: textColor, mt: 10, textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['commandConfiguration', 'settingsTitle']}>
      <Container className={classes.container} maxWidth="md">
        <Card sx={{ mt: 4, background: cardBg, borderRadius: 2, border: `1px solid ${borderColor}` }}>
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: cardBg,
            }}
          >
            <Typography variant="h6" sx={{ color: textColor, fontWeight: 600 }}>
              XML Editor
            </Typography>
            <Button
              variant="contained"
              onClick={saveXml}
              disabled={saving}
              sx={{
                px: 3,
                py: 0.9,
                fontSize: 14,
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(90deg, #E53935 0%, #B71C1C 100%)',
                color: '#fff',
                boxShadow: '0 6px 18px rgba(229,57,53,0.18)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 28px rgba(183,28,28,0.3)',
                },
                '&:disabled': {
                  opacity: 0.6,
                  boxShadow: 'none',
                  transform: 'none',
                },
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Box>

          <Divider sx={{ borderColor }} />

          <CardContent sx={{ p: 0, background: cardBg }}>
            <Box sx={{ display: 'flex', minHeight: 420 }}>
              <Box
                sx={{
                  width: 50,
                  borderRight: `1px solid ${borderColor}`,
                  color: lineNumberColor,
                  fontFamily: 'monospace',
                  fontSize: 12,
                  py: 1.5,
                  px: 1,
                  textAlign: 'center',
                  userSelect: 'none',
                }}
              >
                {xmlContent.split('\n').map((_, i) => (
                  <div key={i} style={{ lineHeight: '20px' }}>
                    {i + 1}
                  </div>
                ))}
              </Box>

              <TextField
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                multiline
                fullWidth
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    px: 2,
                    py: 2,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace',
                    fontSize: 13,
                    color: textColor,
                    whiteSpace: 'pre',
                    overflow: 'auto',
                    lineHeight: '20px',
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={!!message.text}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={handleCloseMessage}
      >
        {message.text && (
          <Alert
            onClose={handleCloseMessage}
            severity={message.type}
            sx={{
              background: cardBg,
              color: textColor,
              border: `1px solid rgba(229,57,53,0.3)`,
            }}
          >
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </PageLayout>
  );
};

export default XmlEditor;
