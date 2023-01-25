import React, { Component } from "react";
import { Card } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";

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
    };
  }

  componentDidMount = () => {
    this.doLoadTableRepo();
    this.doLoadUserRepo();
  };

  doLoadTableRepo = () => {
    axios
      .get("https://api.github.com/users/dhaniarief/repos")
      .then((response) => {
        let temp = this.state.tableRepo;
        temp = response.data;
        for (var i = 0; i < temp.length; i++) {
          temp[i].id = i + 1;
        }
        console.log(temp);
        this.setState({ tableRepo: temp });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  doLoadUserRepo = () => {
    axios
      .get("https://api.github.com/users/dhaniarief")
      .then((response) => {
        let temp = this.state.userRepo;
        temp = response.data;
        console.log(response);
        this.setState({ userRepo: temp });
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    return (
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
            {this.state.tableRepo.map((data, i) => {
              return (
                <CardContent key={i}>
                  <Button href={data.html_url}>
                    <Typography>{data.name}</Typography>
                  </Button>
                </CardContent>
              );
            })}
          </Collapse>
        </Card>
      </div>
    );
  }
}
