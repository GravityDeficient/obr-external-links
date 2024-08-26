import CardHeader from "@mui/material/CardHeader";
import Divider from"@mui/material/Divider";
import Typography from"@mui/material/Typography";
import Button from"@mui/material/Button";
import CardContent from"@mui/material/CardContent";
import Card from"@mui/material/Card";
import Box from"@mui/material/Box";
import PolicyIcon from '@mui/icons-material/Policy';

export function RiskAcknowledgment({
  onAcknowledge,
}: {
  onAcknowledge: () => void;
}) {
  return (
    <Card>
      <CardHeader
        title="External Links - Risk Acknowledgment"
        titleTypographyProps={{
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
      />
      <Divider />
      <CardContent>
        <Typography variant="body2">Please be aware that clicking on external links may carry risks. Links may be obfuscated and could potentially lead to harmful content. It is essential to exercise caution and ensure you trust the GM before proceeding. Always inspect URLs carefully before clicking.</Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="outlined" onClick={onAcknowledge}><PolicyIcon sx={{ padding: "6px" }} /> I understand</Button>
        </Box>
      </CardContent>
    </Card>
  );
}