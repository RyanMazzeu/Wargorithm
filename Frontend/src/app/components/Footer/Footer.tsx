import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const Footer: React.FC = () => {
  const isLandscape = useMediaQuery("(max-width: 600px)");

  return (
    <Box
      component="footer"
      sx={{
        px: 5,
        pb: 0,
        bgcolor: "grey.100",
        width: "100%",
        position: "static",
        left: 0,
        marginBottom: isLandscape ? "64px" : "0px",
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          flexWrap="wrap"
          useFlexGap
          justifyContent={{ xs: "center", sm: "space-between" }}
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            © 2025 Wargorithm
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
          >
            {[
              "Privacidade",
              "Termos & Condições",
              "FAQs",
              "Status",
              "Contato",
            ].map((text) => (
              <Link
                key={text}
                href="#"
                variant="body2"
                underline="hover"
                color="text.secondary"
              >
                {text}
              </Link>
            ))}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Versão 1.0.0
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
