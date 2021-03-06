import React from "react";
import "./UserSelect.css";

const UserSelect = props => (
        <div className="jumbotron bg-transparent text-center p-0">
            <a href="/listing" className="top-button btn-lg m-1 btn btn-primary">List a Rental</a>
            <a href={`item/user/${props.userID}`} className="top-button btn-lg m-1 btn btn-primary">Your Listings</a>
        </div>
)

export default UserSelect;