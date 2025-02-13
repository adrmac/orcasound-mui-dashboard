import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function DetectionLayout() {
    const {itemId} = useParams();
    const [results] = useOutletContext();
    console.log('results id looks like ' + results[0].id + 'and params id looks like ' + itemId)
    const result = results.find(el => el.id === itemId);
    if(!result) {
        return <div>No match for detection id {itemId}</div>
    }
    return (
        <>
        { result && (
            <div>This is the page for detection {itemId} category {result.category}</div>
            ) 
        }
        </>
    )
}