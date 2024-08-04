import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
  Button
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { Link } from "react-router-dom";
import logo from "../../assets/circles.png";
import useStyles from "./styles";
import { signOut } from "aws-amplify/auth";
//import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Navbar = ({ totalItems }) => {
  const classes = useStyles();
  return (
    <div>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            className={classes.title}
            color="inherit"
          >
            <img
              src={logo}
              alt="Book Store App"
              height="50px"
              className={classes.image}
            />
            <div>BOOKSHORE</div>
          </Typography>

          <div className={classes.grow} />
          <div className={classes.button}>
          <Button variant="contained" onClick={signOut}>Sign Out</Button>
            <IconButton
              component={Link}
              to="/cart"
              aria-label="Show cart items"
              color="inherit"
            >
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
