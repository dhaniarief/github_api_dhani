import React, { Component } from "react";
import axios from "axios";
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
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import { headers } from "./Global/Global";

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

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableRepo: [],
      userRepo: {},
      expanded: false,
      keyword: "",
    };
  }

  componentDidMount = () => {
    this.loadData();
  };

  loadData = async () => {
    try {
      const [tableRepoResponse, userRepoResponse] = await Promise.all([
        axios.get("https://api.github.com/users/lisarief100200/repos", {
          headers: headers,
        }),
        axios.get("https://api.github.com/users/lisarief100200", {
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
      console.error(error);
      alert(`Anda Salah Memasukkan UserName`);
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

  render() {
    return (
      <div>
        <FormControl>
          <TextField
            label="Search"
            variant="outlined"
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
          >
            Search
          </Button>
        </FormControl>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Card sx={{ width: 300 }}>
            <CardMedia
              sx={{ height: 300 }}
              image={this.state.userRepo.avatar_url}
            />
            <CardContent>
              <Button href={this.state.userRepo.html_url}>
                <Typography>{this.state.userRepo.login}</Typography>
              </Button>
            </CardContent>
            {this.state.tableRepo.length > 0 ? (
              <div>
                <CardActions disableSpacing>
                  <Typography>See {this.state.userRepo.login} repo</Typography>
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
      </div>
    );
  }
}
