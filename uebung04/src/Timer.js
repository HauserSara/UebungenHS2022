import React, {Component} from "react";

var start = false;

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {time: 50};

        this.starttimer = this.starttimer.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.decrease = this.decrease.bind(this);
        this.manager = this.manager.bind(this);
    }

    starttimer() {
        start = true;
        this.setState({time: 50});
        clearInterval(this.interval);
    }

    componentDidMount() {
        if (start === true) {
            this.interval = setInterval(this.decrease, 1000)};
    }

    componentWillUnmount() {
        if (this.state.time === "Fertig") {
            clearInterval(this.interval);
            this.setState({time: 50});
            start = false;
        }
    }

    decrease() {
        this.setState({time: this.state.time - 1});
        if (this.state.time < 1) {
            this.setState({time: "Fertig"});
        }
        if (this.state.time === "Fertig") {
            this.setState({time: "Fertig"});
        }
    }

    manager() {
        this.starttimer();
        this.componentDidMount();
        this.componentWillUnmount();
    }

    render() {
        return (<>
             <div style={{fontFamily: "Verdana", fontSize: "200px", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -90%)"}}>
             {this.state.time}</div> <br/>
             <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, 90%)"}}>
            <button onClick={this.manager} style={{padding: "10px", fontSize: "20px", fontFamily: "Verdana", border: "none", backgroundColor: "white"}}>Start</button></div>
        </>);
    }
}

export default Timer;