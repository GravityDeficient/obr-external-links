import React from "react";

import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Switch from '@mui/material/Switch';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export function LinkHeader({
  subtitle,
  action,
  openInModal,
  setOpenInModal,
  sortOrder,
  toggleSortOrder,
  }: {
    subtitle?: string;
    action?: React.ReactNode;
    openInModal?: boolean;
    setOpenInModal?: React.Dispatch<React.SetStateAction<boolean>>;
    sortOrder?: "asc" | "desc" | "none";
    toggleSortOrder?: () => void;
  }) {

  return (
    <>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.125rem",
                fontWeight: "bold",
                lineHeight: "32px",
                color: "text.primary",
              }}
              >
                External Links
              </Typography>
            {toggleSortOrder && (
              <Button
                variant="outlined"
                size="small"
                onClick={toggleSortOrder}
                sx={{
                  textTransform: "none",
                  fontSize: "12px",
                  padding: "2px 6px",
                  minWidth: "auto",
                }}
              >
                {sortOrder === "none" ? "↕" : sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            )}
          </Box>
        }
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
