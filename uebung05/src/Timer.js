import React, {Component} from "react";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

var time = ""

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {count: "", msg: "", render: true};
        this.interval = null;
    
        // Event-Handler registrieren:
        this.set_timer = this.set_timer.bind(this);
        this.update = this.update.bind(this);
        this.start_timer = this.start_timer.bind(this);
    }

    set_timer(event) {
        time = event.target.value;
        this.setState({count: time});
    }

    update() {
        this.setState({count: this.state.count - 1});
        if (this.state.count <= 1) {
            this.setState({count: ""});
            this.setState({msg: "FERTIG"})
            clearInterval(this.interval);
            this.interval = null;
            this.setState({render: true});
        }
    }

    start_timer() {
        this.setState({count: time});
        this.setState({msg: ""});
        this.setState({render: false});

        if (this.interval != null) {
            clearInterval(this.interval);
        }

        this.interval = setInterval(this.update, 1000);
    }


    render() {
        return (
        <>
            {this.state.render &&
            <Grid container style={{margin: 20}}>
                <TextField value={time} onChange={this.set_timer} label="Zeit" type="number"/>
            </Grid>
            }
            <p style={{fontFamily:"roboto", marginLeft:33}}>{this.state.count}{this.state.msg}</p>
            <Button variant="contained" onClick={this.start_timer} style={{marginLeft: 20}}>Start</Button>
        </>)
    }
}

export default Timer;

