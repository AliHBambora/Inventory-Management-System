// import NextLink from 'next/link';
// import { useRouter } from 'next/router';
import PropTypes from "prop-types";
import { Box, Button, ListItem, Tooltip, Typography } from "@mui/material";
import { Route, Link, Routes, useLocation } from "react-router-dom";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import { styled } from "@mui/material/styles";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: "rgb(83, 148, 247)", //theme.palette.text.secondary

  [`& .${treeItemClasses.content}`]: {
    color: "#7b98c7",
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),

    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
      //paddingLeft: theme.spacing(3.5),
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box
        // sx={
        //   open
        //     ? { display: "flex", alignItems: "center", p: 0.5, pr: 0 }
        //     : {marginLeft: "-15px"}
        // }
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />

          <Tooltip title={labelText}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "inherit", flexGrow: 1, fontSize: "16px" }}
            >
              {/* {labelText.length > MAXnamesLength
                ? labelText.substring(0, MAXnamesLength) + "..."
                : labelText} */}
              {labelText}
            </Typography>
          </Tooltip>

          <Typography
            variant="caption"
            color="inherit"
            sx={{ fontSize: "16px" }}
          >
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

export const NavItem = (props) => {
  const { href, icon, title, ...others } = props;
  const location = useLocation();
  // const router = useRouter();
  // const active = href ? (router.pathname === href) : false;
  const active = href ? location.pathname === href : false;

  return (
    <>
      {/* <StyledTreeItem
        nodeId={(props.title).toString()}
        key={(props.title).toString()}
        labelText={(props.title).toString()}
        // labelIcon={props.icon}
        color="#586780"
        bgColor="#afc0db"
      > */}
      <ListItem
        disableGutters
        sx={{
          display: "flex",
          mb: 0.5,
          py: 0,
          px: 2,
        }}
        {...others}
      >
        <Button
          component="a"
          startIcon={icon}
          disableRipple
          href={href}
          onClick={() => {
            if (sessionStorage.getItem("Invoice")!=null) {
              sessionStorage.removeItem("Invoice");
              sessionStorage.removeItem("InvoiceID");
            }
          }}
          sx={{
            backgroundColor: active && "rgba(255,255,255, 0.08)",
            borderRadius: 1,
            color: active ? "secondary.main" : "neutral.300",
            fontWeight: active && "fontWeightBold",
            justifyContent: "flex-start",
            px: 3,
            textAlign: "left",
            textTransform: "none",
            width: "100%",
            "& .MuiButton-startIcon": {
              color: active ? "secondary.main" : "neutral.400",
            },
            "&:hover": {
              backgroundColor: "rgba(255,255,255, 0.08)",
            },
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </Button>
      </ListItem>
      {/* </StyledTreeItem> */}
    </>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
};
