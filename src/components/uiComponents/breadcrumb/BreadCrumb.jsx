import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/theme/useTheme";

const BreadCrumb = ({ linkText }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  function handleClick(link) {
    navigate(link.href);
  }

  return (
    <Stack spacing={1} sx={{ mb: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="medium" />}
        aria-label="breadcrumb"
        className="inline "
        style={{ color: theme.primaryColor }}
      >
        {linkText.map((item, index) => {
          return !item.href ? (
            <Typography
              className="text-[#372E2E] font-semibold"
              key={index}
              sx={{
                color: "#372E2E",
                fontWeight: 600, // Make it bold
                fontSize: "0.9rem", // Optional: increase font size
              }}
              style={{ color: theme.primaryColor }}
            >
              {item.text}
            </Typography>
          ) : (
            <Link
              underline="hover"
              color="#372E2E"
              fontWeight={500}
              /* href={item.href} */
              onClick={() => handleClick(item)}
              key={index}
              className="text-[#372E2E] font-bold hover:underline cursor-pointer"
              style={{ color: theme.primaryColor }}
              sx={{
                fontWeight: 600, // Make it bold
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {item.text}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadCrumb;
