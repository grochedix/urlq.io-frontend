import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Assignment from '@material-ui/icons/Assignment';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';
import Divider from '@material-ui/core/Divider'
import axios from 'axios';

export default class Homepage extends React.Component {

    constructor(props) {
        super();
        this.state = {
            gotAnswer: false,
            answer: "",
            gotError:false,
            error: "Insert an URL and we'll provide you a shorter link, as well as a QR code that you can use to redirect to the target website.",
            url:"",
            lastLink:"",
            gotLastLink:false,
            qrcode:null,
        };
    }

    handleURL = (e) => {
        this.setState({url: e.target.value, gotAnswer:false});
        if (this.state.url.trim() === "") {
            this.setState({
                error: "Insert an URL and we'll provide you a shorter link, as well as a QR code that you can use to redirect to the target website.",
                gotError: false
            });
        }
    }

    handleSubmit = (e) => {
        const homepage = this
        if (this.state.url.includes(".") && this.state.url.trim().length > 3){
            axios.post('http://35.180.41.225:10000/link/', {
                url: homepage.state.url,
            }).then(function (response) {
                homepage.setState({
                    qrcode: null, answer: "https://urlq.io/" + response.data['hash'],
                    lastLink: "https://urlq.io/" + response.data['hash'],
                    gotError: false, error: "Insert an URL and we'll provide you a shorter link, as well as a QR code that you can use to redirect to the target website." });
                localStorage.setItem('lastLink', "https://urlq.io/" + response.data['hash']);
                axios
                    .get(
                        'http://35.180.41.225:10000/image/' + response.data['hash'],
                        { responseType: 'arraybuffer' },
                ).then(response2 => {
                    const base64 = btoa(
                        new Uint8Array(response2.data).reduce(
                            (data, byte) => data + String.fromCharCode(byte),
                            '',
                        ),
                    );
                    homepage.setState({ qrcode: "data:image/png;base64," + base64, gotAnswer: true, });
                });
            }).catch(function (error) {
                console.log(error);
                homepage.setState({ gotAnswer: false, error: "A network problem occured.", gotError: true });
            })
        } else {
            this.setState({ gotAnswer: false, error: "Insert a valid URL.", gotError: true });
        }
        e.preventDefault()
    }

    handleClipboard = (e) => {
        var tempInput = document.createElement("input");
        tempInput.value = this.state.answer;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
    }

    debugBase64 = (e) => {
        var win = window.open();
        win.document.write('<img src="' + this.state.qrcode + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px;" allowfullscreen></img>');
    }

    componentWillMount() {
        if (!this.state.gotLastLink) {
            this.setState({lastLink:localStorage.getItem('lastLink')}, () =>
            {if (this.state.lastLink !== "") {
                this.setState({ gotLastLink: true });
            }})
        }
    }

    

    render() {
        const gotAnswer = this.state.gotAnswer;
        const answer = this.state.answer;
        const url = this.state.url;
        const gotError = this.state.gotError;
        const Error = this.state.error;
        return (
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
                style= {{height:"100vh"}}
            >
                <Grid item style={{ width: "70%" }}>
                    <Paper elevation={10} style={{ textAlign: "center", paddingRight: "20px", borderRadius:"20px" }}>
                        <h2 style={{ paddingTop: '10px', background: '-webkit-linear-gradient(#080808, #9198e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor:'transparent'}}>
                            <u> urlq.io : URLs shortener & QR codes generator</u>
                        </h2>
                        
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                error={gotError}
                                id="url"
                                autoFocus
                                label="Shorten this URL!"
                                helperText={Error}
                                defaultValue={url}
                                variant="outlined"
                                fullWidth
                                style={{margin:'10px'}}
                                onChange={this.handleURL}
                            />
                            <Button variant="contained" color="primary" style={{margin:'10px'}} type='submit' size="large">
                                Let's go!
                            </Button>
                        </form>
                        <br/>
                    
                        <Collapse in={gotAnswer}>
                            <Grid container 
                                direction="row"
                                justify="center"
                                alignItems="center"
                                style={{paddingBottom:"10px"}}>
                                <Grid item xs={12} sm={5}>
                                    <TextField
                                    id="answer"
                                    label="Shortened URL:"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    style={{ margin: '10px', marginLeft: '25px' }} 
                                    value={answer}
                                    helperText={"From " + url.length + " characters to " + answer.length + " characters."}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button
                                        variant="contained"
                                        aria-label="Copy to Clipboard"
                                        onClick={this.handleClipboard}
                                        color="primary"
                                        size="small"
                                        startIcon={<Assignment />}
                                    >
                                        Link To Clipboard
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <figure>
                                    <a href='#' onClick={this.debugBase64}>
                                        <img src={this.state.qrcode} alt="QR Code" style={{maxWidth:'60%'}}/>
                                    </a>
                                    <Grow in={gotAnswer} {...(gotAnswer ? { timeout: 1400 } : {})}>
                                            <figcaption>You can save this QR code as an image!</figcaption>
                                    </Grow>
                                    </figure>
                                </Grid>
                            </Grid>
                        </Collapse>
                        <Divider />
                            <Grow in={this.state.gotLastLink} {...({timeout:2000})}>
                            <h4 style={{ paddingBottom: '2%', color: '#3f51b5' }}>  
                                Last shortened link :  <a href={this.state.lastLink} target='_blank' rel="noreferrer">{this.state.lastLink} </a>
                            </h4>
                         </Grow>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
