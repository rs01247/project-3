import React, { Component } from "react";
import Chat from "../Chat"
import MainNav from "../MainPage/Navbar";
import "./Item.css";
import axios from "../../helpers/authenticated.axios";
import Map from "./Map.js";
import Geocode from "react-geocode";


Geocode.setApiKey("AIzaSyA0-hwLFqBPHf5yphF-d0fymZKTv2vWNkU");

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            userData: [],
            id: this.props.match.params.id,
            location: this.props.match.params.location,
            lat: this.props.match.params.lat,
            lng: this.props.match.params.lng
        }
    }

    componentDidMount() {
        this.displayItem();
        // this.displayUser();
    }

    displayItem() {
        console.log(this.state.id);
        axios.get(`/api/item/${this.state.id}`)
            .then((res) => {
                this.setState({ data: res.data})
                this.displayUser();
                this.convertZip();
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    displayUser() {
        axios.get(`/api/user/${this.state.data.UserId}`)
            .then((res) => {
                this.setState({ userData: res.data })
                console.log(this.state.userData)
            })
            .catch((err) => {
                console.error(err);
            })
    }

    convertZip() {
        axios.get(`/api/user/${this.state.data.UserId}`)
            .then((res) => {
                this.setState({ location: res.data.location })
                console.log(this.state.location);
        Geocode.fromAddress(this.state.location).then(
            response => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log(lat, lng);
              this.setState({lat: lat});
              this.setState({lng: lng});
              console.log("lat: " + this.state.lat);
              console.log("lng: " + this.state.lng)
            },
            error => {
              console.error(error);
            }
          );
        })
        .catch((err) => {
            console.error(err);
        })
    }
    


    render() {
        console.log(this.state.data)
        return (
            <div>
                <MainNav />
                <div className="main container mt-4">
                    <div className="jumbotron bg-white shadow-lg">
                        <div className="row mb-3">
                            <h2 id="item-name">{this.state.data.itemName}</h2>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <div className="item-div row">
                                    <img className="item-img" src={this.state.data.image} />
                                </div>
                            </div>
                            <div className="col-4 p-1">
                                <div className="item-div row">
                                    <h3>Listed by {this.state.userData.userName}</h3>
                                    <h5>{this.state.userData.createdAt}</h5>
                                </div>
                                <div className="item-div row">
                                    <p style={{ fontSize: "1rem" }}>{`Available to Rent in ${this.state.data.location}`}</p>
                                </div>
                                <div className="item-div row">
                                    <p>{this.state.data.description}</p>
                                </div>
                            </div>
                            <div className="col-4 border border-secondary">
                                <Map lat = {this.state.lat} lng = {this.state.lng}/>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <Chat
                                key={this.state.id}
                                id={this.state.userData.id} />
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Item