import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

class HashRedirect extends React.Component {

    constructor(props) {
        super();
        this.state = {
            url: "",
            hash: props.match.params.hash,
            gotError: false,
        };
    }


    getRedirect = (hash) => {
        const obj = this
        axios.get("http://localhost:10000/link/" + hash).then(function (response) {
            obj.setState({
                url: response.data["url"],
                gotError: false,
            });
            window.location.href = obj.state.url;
        }).catch(function (err) {
            console.log(err)
            obj.setState({
                gotError: true,
            })
        })
    }

    componentDidMount() {
        this.getRedirect(this.state.hash);
    }

    render() {
        return (
            <Grid container 
                style={{height:"100vh", backgroundColor:"white"}}
                direction="row"
                justify="center"
                alignItems="center"
            >   {!this.state.gotError &&
                    <CircularProgress />
            }
                {this.state.gotError &&
                    <h1>
                        HTTP404 <br/>
                        It looks like the page you requested does not exist (<a href="http://localhost:3000/">yet</a>) ! 
                    </h1>
                }
                
            </Grid>
        )
    }
}

export default withRouter(HashRedirect);