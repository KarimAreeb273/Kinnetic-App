import React, { useState } from 'react';
import Search from './Search';
import UserCard from './UserCard';
import { Card, Checkbox, Container } from "semantic-ui-react";

function Users({ users }) {

    const userCards = users.map(user => {
        return (
            <UserCard 
                key = {user.id} 
                name = {user.username} 
            />
        );
    });


    return (
        <>
        {userCards}
        </>
    );

}

export default Users;