import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export default class Homepage extends React.Component {

    constructor(props) {
        super();
        this.state = {
            gotAnswer: false,
            answer: "",
            gotError:false,
            error: "Insert an URL and we'll provide you a shorter link that you can use to redirect to the target website.",
            url:"",
        };
    }

    handleURL = (e) => {
        this.setState({url: e.target.value});
        if (this.state.url.trim() === "") {
            this.setState({
                error: "Insert an URL and we'll provide you a shorter link that you can use to redirect to the target website.",
                gotError: false
            });
        }
    }

    handleSubmit = (e) => {
        const homepage = this
        if (this.state.url.includes(".") && this.state.url.trim().length > 3){
            axios.post('http://localhost:10000/link', {
                url: homepage.state.url,
            }).then(function (response) {
                homepage.setState({ answer: response.data['hash'], gotError: false, gotAnswer: true, error: "" });
                console.log(homepage.state.answer);
            }).catch(function (error) {
                console.log(error);
                homepage.setState({ gotAnswer: false, error: "A network problem occured.", gotError: true });
            })
        } else {
            this.setState({ gotAnswer: false, error: "Insert a valid URL.", gotError: true });
        }
        e.preventDefault()
    }

    render() {
        const gotAnswer = this.state.gotAnswer;
        const gotError = this.state.gotError;
        const Error = this.state.error
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style= {{height:"80vh"}}
            >
                <Grid item style={{ width: "50%" }}>
                    <Paper elevation={10} style={{ textAlign: "center", paddingRight: "20px" }}>
                        <h2 style={{ paddingTop:'7px', background: '-webkit-linear-gradient(#e66465, #9198e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor:'transparent'}}>
                            Tw-url.com
                        </h2>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                error={gotError}
                                id="url"
                                autoFocus
                                label="Shorten this URL!"
                                helperText={Error}
                                variant="outlined"
                                fullWidth
                                style={{margin:'10px'}}
                                onChange={this.handleURL}
                            />
                            <Button variant="contained" color="primary" style={{margin:'10px'}} type='submit'>
                                Let's go!
                            </Button>
                        </form>
                        <br/>
                        {gotAnswer && 
                            <TextField
                            id="answer"
                            label="Shortened URL:"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            style={{ margin: '10px' }} 
                            />
                    
                        }
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
