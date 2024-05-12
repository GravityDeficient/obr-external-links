import React from "react";

import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Switch from '@mui/material/Switch';

export function LinkHeader({
  subtitle,
  action,
  openInModal,
  setOpenInModal,
  }: {
    subtitle?: string;
    action?: React.ReactNode;
    openInModal?: boolean;
    setOpenInModal?: React.Dispatch<React.SetStateAction<boolean>>;
  }) {

  return (
    <>
      <CardHeader
        title="External Links"
        action={
          <>
            {action}
            <Typography 
              variant="caption"
              gutterBottom
              sx={{
                display: "block",
                color: "text.secondary"
              }}
            >
              Modal
            </Typography>
            <Switch
              size="small"
              checked={openInModal}
              onChange={() => setOpenInModal && setOpenInModal(!openInModal)}
              sx={{marginRight: "16px"}}
            />
          </>
        }
        titleTypographyProps={{
          sx: {
            fontSize: "1.125rem",
            fontWeight: "bold",
            lineHeight: "32px",
            color: "text.primary",
          },
        }}
      />
      <Divider variant="middle" />
      {subtitle && (
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: "inline-block",
            color: "text.secondary",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </>
  );
}
