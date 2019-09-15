/* 
Adapted from: 
- https://material-ui.com/components/drawers/#persistent-drawer
- https://material-ui.com/components/lists/#nested-list
*/

import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import clsx from "clsx";
import { fade, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InputBase from "@material-ui/core/InputBase";
import Collapse from "@material-ui/core/Collapse";

import SearchIcon from "@material-ui/icons/Search";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PersonIcon from "@material-ui/icons/Person";
import HomeIcon from "@material-ui/icons/Home";
import CommentIcon from "@material-ui/icons/Comment";
import InfoIcon from "@material-ui/icons/Info";
import BarChartIcon from "@material-ui/icons/BarChart";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

export class NavigationBar extends Component {
  state = {
    menuOpen: false,
    threadsDropdownOpen: false,
    user: ""
  };

  setMenuOpen() {
    this.setState({ menuOpen: true });
  }

  setMenuClosed() {
    this.setState({ menuOpen: false });
  }

  setThreadDropDown() {
    this.setState({ threadsDropdownOpen: !this.state.threadsDropdownOpen });
  }

  onSearchUserBarChange = e => {
    this.setState({ user: e.target.value });
  };

  onSearchUserBarSubmit = e => {
    // So it doesn't submit right away.
    e.preventDefault();
    // Only submit if non-empty username.
    if (this.state.user) {
      const user = this.state.user;
      this.setState({ user: "test" });
      console.log(this.state);
      this.props.history.push(`/u/${user}`);
      this.props.getCommentsFromSpecificUser(user);
    }
  };

  render() {
    return (
      <div className={this.props.classes.root} style={{ padding: "20px" }}>
        <CssBaseline />
        <AppBar position="fixed" className={clsx(this.props.classes.appBar)}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.setMenuOpen.bind(this)}
              edge="start"
              className={clsx(
                this.props.classes.menuButton,
                this.state.menuOpen && this.props.classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              <Link to="/" style={linkHeaderStyle}>
                Reddit Outfits
              </Link>
            </Typography>
            <div className={this.props.classes.search}>
              <div className={this.props.classes.searchIcon}>
                <SearchIcon />
              </div>
              {/* TODO: Figure out why search bar is not cleared upon submission */}
              <form
                value={this.state.user}
                onChange={this.onSearchUserBarChange.bind(this)}
                onSubmit={this.onSearchUserBarSubmit.bind(this)}
              >
                <InputBase
                  placeholder="Enter user..."
                  classes={{
                    root: this.props.classes.inputRoot,
                    input: this.props.classes.inputInput
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </form>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          className={this.props.classes.drawer}
          variant="persistent"
          anchor="left"
          open={this.state.menuOpen}
          classes={{
            paper: this.props.classes.drawerPaper
          }}
        >
          <div>
            <IconButton onClick={this.setMenuClosed.bind(this)}>
              <MenuIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem
              button
              key="home"
              component={Link}
              to="/"
              onClick={this.setMenuClosed.bind(this)}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              key="users"
              component={Link}
              to="/users"
              onClick={this.setMenuClosed.bind(this)}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
            <ListItem button onClick={this.setThreadDropDown.bind(this)}>
              <ListItemIcon>
                <CommentIcon />
              </ListItemIcon>
              <ListItemText primary="Threads" />
              {this.state.threadsDropdownOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.threadsDropdownOpen} timeout="auto">
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={this.props.classes.nested}
                  component={Link}
                  to="/r/malefashionadvice"
                  onClick={this.setMenuClosed.bind(this)}
                >
                  <ListItemText primary="MaleFashionAdvice" />
                </ListItem>
                <ListItem
                  button
                  className={this.props.classes.nested}
                  component={Link}
                  to="/r/femalefashionadvice"
                  onClick={this.setMenuClosed.bind(this)}
                >
                  <ListItemText primary="FemaleFashionAdvice" />
                </ListItem>
                <ListItem
                  button
                  className={this.props.classes.nested}
                  component={Link}
                  to="/r/streetwear"
                  onClick={this.setMenuClosed.bind(this)}
                >
                  <ListItemText primary="Streetwear" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem
              button
              key="about"
              component={Link}
              to="/about"
              onClick={this.setMenuClosed.bind(this)}
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem
              button
              key="stats"
              component={Link}
              to="/stats"
              onClick={this.setMenuClosed.bind(this)}
            >
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Stats" />
            </ListItem>
          </List>
          <Divider />
        </Drawer>
        <main
          className={clsx(this.props.classes.content, {
            [this.props.classes.contentShift]: this.state.menuOpen
          })}
        />
      </div>
    );
  }
}

const linkHeaderStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500px"
};

const drawerWidth = 260;

const classes = theme => ({
  root: {
    display: "flex",
    flexGrow: 1
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
});

export default withRouter(withStyles(classes)(NavigationBar));
