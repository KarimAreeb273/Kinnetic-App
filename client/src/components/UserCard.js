import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "semantic-ui-react";

function FighterCard({ id, name, image }) {

    return (
        <Card className="useer-card">
            <h2 id="user-title">{name}</h2>
            {/* <Link to={`/users`}>
            </Link> */}
        </Card>
    );
}

export default FighterCard;