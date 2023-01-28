import React, { Component } from "react";
import axios from "axios";
import "./App.css";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  IconButton,
  Collapse,
  TextField,
  Modal,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { headers } from "./Global/Global";
import SearchIcon from "@mui/icons-material/Search";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableRepo: [],
      userRepo: {},
      expanded: false,
      keyword: "",
      open: false,
    };
  }

  componentDidMount = () => {
    this.loadData();
  };

  loadData = async () => {
    try {
      const [tableRepoResponse, userRepoResponse] = await Promise.all([
        axios.get("https://api.github.com/users/dhaniarief/repos", {
          headers: headers,
        }),
        axios.get("https://api.github.com/users/dhaniarief", {
          headers: headers,
        }),
      ]);

      let tempTableRepo = tableRepoResponse.data;
      for (let i = 0; i < tempTableRepo.length; i++) {
        tempTableRepo[i].id = i + 1;
      }

      this.setState({
        tableRepo: tempTableRepo,
        userRepo: userRepoResponse.data,
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  handleChange = (event) => {
    this.setState({ keyword: event.target.value });
  };

  handleSearch = async () => {
    try {
      const [tableRepoResponse, userRepoResponse] = await Promise.all([
        this.fetchTableRepo(),
        this.fetchUserRepo(),
      ]);

      this.setState({
        tableRepo: tableRepoResponse,
        userRepo: userRepoResponse,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        open: true,
        keyword: "",
      });
    }
  };

  fetchTableRepo = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${this.state.keyword}/repos`,
        {
          headers: headers,
        }
      );
      let temp = response.data;
      for (let i = 0; i < temp.length; i++) {
        temp[i].id = i + 1;
      }
      return temp;
    } catch (error) {
      throw error;
    }
  };

  fetchUserRepo = async () => {
    try {
      const response = await axios.get(
        `https://api.github.com/users/${this.state.keyword}`,
        {
          headers: headers,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  renderModal = () => {
    return (
      <Modal
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Not Found
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Please Search Another Username
          </Typography>
        </Box>
      </Modal>
    );
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <TextField
            style={{ backgroundColor: "aquamarine" }}
            hiddenLabel
            placeholder="Search"
            id="filled-hidden-label-small"
            defaultValue="Small"
            variant="filled"
            size="small"
            value={this.state.keyword}
            onChange={this.handleChange}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                this.handleSearch();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSearch}
            style={{ marginLeft: 8 }}
          >
            {<SearchIcon />}
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card
            sx={{ width: 300 }}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              backgroundColor: "aquamarine",
            }}
          >
            <CardMedia
              sx={{ height: 300 }}
              image={this.state.userRepo.avatar_url}
              style={{ borderRadius: "50%" }}
            />
            <CardContent style={{ display: "flex", justifyContent: "center" }}>
              <Button href={this.state.userRepo.html_url}>
                <Typography>{this.state.userRepo.login}</Typography>
              </Button>
            </CardContent>
            {this.state.tableRepo.length > 0 ? (
              <div>
                <CardActions>
                  <Typography style={{ marginLeft: 4 }}>
                    See {this.state.userRepo.login} repo
                  </Typography>
                  <ExpandMore
                    expand={this.state.expanded}
                    onClick={this.handleExpandClick}
                    aria-expanded={this.state.expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                  <div>
                    {this.state.tableRepo.map((data, i) => {
                      return (
                        <CardContent key={data.id}>
                          <Button href={data.html_url}>
                            <Typography>{data.name}</Typography>
                          </Button>
                        </CardContent>
                      );
                    })}
                  </div>
                </Collapse>
              </div>
            ) : (
              <CardActions disableSpacing>
                <Typography>
                  {this.state.userRepo.login} have no repo
                </Typography>
              </CardActions>
            )}
          </Card>
        </div>
        {this.renderModal()}
      </div>
    );
  }
}
